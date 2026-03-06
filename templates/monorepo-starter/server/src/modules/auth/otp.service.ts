import crypto from "crypto";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { futureDate } from "@workspace/shared/utils";

import { InjectLogger } from "@/decorators/logger.decorator";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { EnvService } from "@/modules/env/env.service";
import { LoggerService } from "@/modules/logger/logger.service";
import { CacheService } from "@/modules/cache/cache.service";
import { NotificationService } from "@/modules/notification/notification.service";

interface SendOtpPayload {
  identifier: string;
  purpose: OtpPurpose;
  type?: OtpType;
  notify?: boolean;
  meta: EmailTemplateProps;
}

interface verifyOtpPayload {
  userId: string;
  secret: string;
  purpose: OtpPurpose;
  type?: OtpType;
}

@Injectable()
export class OtpService {
  @InjectLogger()
  private readonly logger!: LoggerService;

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifyService: NotificationService,
    private readonly env: EnvService,
    private readonly cache: CacheService,
  ) {}

  async sendOtp({
    identifier,
    purpose,
    type = "numericCode",
    notify = true,
    meta,
  }: SendOtpPayload) {
    let otp = await this.prisma.otp.findFirst({
      where: {
        userId: meta.user.id,
        purpose,
        type,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!otp) {
      otp = await this.prisma.otp.create({
        data: {
          userId: meta.user.id,
          purpose,
          type,
          secret: this.generateSecret(type),
          expiresAt: futureDate(this.env.get("OTP_EXP")),
          meta: meta as any,
        },
      });
    }

    if (!notify) return otp;

    const clientUrl = (await this.cache.get("clientUrl")) as string;

    await this.notifyService.sendNotification({
      purpose,
      to: identifier,
      meta: { otp, identifier, ...meta, clientUrl },
    });

    return otp;
  }

  async verifyOtp({
    userId,
    secret,
    purpose,
    type = "numericCode",
  }: verifyOtpPayload) {
    const otp = await this.prisma.otp.findFirst({
      where: {
        userId,
        secret,
        purpose,
        type,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!otp) {
      this.logger.warn(`Invalid OTP`, {
        userId,
        purpose,
        context: OtpService.name,
      });
      throw new UnauthorizedException("Invalid OTP");
    }

    await this.prisma.otp.update({
      where: { id: otp.id },
      data: { usedAt: new Date() },
    });

    return otp;
  }

  private generateSecret(type: OtpType, prefix = "") {
    switch (type) {
      case "secureToken":
        return `${prefix}${crypto.randomBytes(32).toString("hex")}`;
      case "numericCode":
        return crypto.randomInt(100000, 999999).toString();
      default:
        throw new Error(`Unsupported type: ${type}`);
    }
  }
}
