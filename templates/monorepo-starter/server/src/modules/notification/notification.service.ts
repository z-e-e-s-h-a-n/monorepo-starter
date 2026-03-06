import { Injectable } from "@nestjs/common";
import { resolveEmailTemplate } from "@workspace/templates";
import { appName } from "@workspace/shared/constants";
import { NOTIFICATION_POLICY_MAP } from "@/constants/index";

import { PushService } from "./push.service";
import { EmailService } from "./email.service";
import { MessagingService } from "./messaging.service";

import { InjectLogger } from "@/decorators/logger.decorator";
import { EnvService } from "@/modules/env/env.service";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { LoggerService } from "@/modules/logger/logger.service";

interface SendNotificationProps {
  to: string;
  purpose: NotificationPurpose;
  meta: EmailTemplateProps;
}

@Injectable()
export class NotificationService {
  @InjectLogger()
  private readonly logger!: LoggerService;

  constructor(
    private readonly prisma: PrismaService,
    private readonly env: EnvService,
    private readonly emailService: EmailService,
    private readonly messagingService: MessagingService,
    private readonly pushService: PushService,
  ) {}

  async sendNotification({ purpose, to, meta }: SendNotificationProps) {
    const { html, subject, message } = await resolveEmailTemplate(
      purpose,
      meta,
    );

    const { priority, push } = NOTIFICATION_POLICY_MAP[purpose];
    const channels = this.determineChannels(
      to,
      meta.user,
      priority,
      push,
      !!meta.otp,
    );

    try {
      const notification = await this.prisma.notification.create({
        data: {
          userId: meta.user.id,
          recipient: to,
          purpose,
          channels,
          priority,
          subject,
          message,
          meta: meta as any,
        },
      });

      let allSuccess = true;
      let anySuccess = false;

      for (const channel of channels) {
        try {
          switch (channel) {
            case "email":
              await this.sendEmail(to, subject, html);
              break;
            case "sms":
              await this.sendMessage("sms", to, message);
              break;
            case "whatsapp":
              await this.sendMessage("whatsapp", to, message);
              break;
            case "push":
              await this.sendPush(meta.user, subject, message);
              break;
          }
          anySuccess = true;
        } catch (error) {
          allSuccess = false;
          this.logger.error("Notification send Failed", {
            to,
            channel,
            error,
          });
        }
      }

      const status: NotificationStatus = allSuccess
        ? "sent"
        : anySuccess
          ? "partial"
          : "failed";

      await this.prisma.notification.update({
        where: { id: notification.id },
        data: { status },
      });
    } catch (error) {
      this.logger.error(`❌ Notification send Failed`, {
        to,
        channels,
        error,
      });
      throw error;
    }
  }

  private async sendEmail(to: string, subject: string, html: string) {
    const from = `${appName.default} <${this.env.get("SMTP_USER")}>`;
    await this.emailService.sendMail({ from, to, subject, html });
  }

  private async sendMessage(type: MessagingChannel, to: string, text: string) {
    if (type === "sms") {
      await this.messagingService.sendSms(to, text);
    } else {
      await this.messagingService.sendWhatsapp(to, text);
    }
  }

  private async sendPush(user: SafeUser, subject: string, message: string) {
    await this.pushService.sendPush(user, subject, message);
  }

  private determineChannels(
    identifier: string,
    user: SafeUser,
    priority: NotificationPriority,
    allowPush: boolean,
    isOtp: boolean,
  ): NotificationChannel[] {
    const channels: NotificationChannel[] = [];

    if (isOtp) {
      const isEmail = identifier.includes("@");
      return [isEmail ? "email" : user.fallbackChannel];
    }

    if (allowPush && user.pushNotifications) {
      channels.push("push");
    }

    const hasEmail = user.email && user.isEmailVerified;
    const hasPhone = user.phone && user.isPhoneVerified;

    if (hasEmail) {
      channels.push("email");
    }

    if (priority === "important" && hasPhone) {
      channels.push(user.fallbackChannel);
    }

    return channels;
  }
}
