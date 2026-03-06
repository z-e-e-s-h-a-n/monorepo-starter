import { Controller, Put, Param, Post, Body, Get } from "@nestjs/common";
import { RegisterPushTokenDto } from "@workspace/contracts/notification";

import { User } from "@/decorators/user.decorator";
import { PrismaService } from "@/modules/prisma/prisma.service";

@Controller("notifications")
export class NotificationController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getAllNotification(@User("id") userId: string) {
    const notifications = this.prisma.notification.findMany({
      where: { userId },
    });

    return {
      message: "Notifications Fetched Successfully.",
      data: notifications,
    };
  }

  @Put("/:id")
  async markAsRead(@Param("id") id: string) {
    await this.prisma.notification.update({
      where: { id },
      data: { readAt: new Date() },
    });

    return { message: "Notification read successfully." };
  }

  @Post("push/register")
  async registerPushToken(
    @Body() dto: RegisterPushTokenDto,
    @User("sessionId") sessionId: string,
  ) {
    await this.prisma.session.update({
      where: { id: sessionId },
      data: { pushToken: dto.token, pushProvider: dto.provider },
    });
    return { message: "Push Token registered to session" };
  }
}
