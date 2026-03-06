import { type Request } from "express";
import { Injectable } from "@nestjs/common";

import { AuthService } from "@/modules/auth/auth.service";
import { PrismaService } from "@/modules/prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      ...this.authService.userView,
    });

    return {
      message: "User Fetched Successfully.",
      data: user,
    };
  }

  async updateUserProfile(dto: UserProfileDto, req: Request) {
    const userId = req.user!.id;

    await this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });

    return {
      message: "Profile Updated Successfully.",
    };
  }
}
