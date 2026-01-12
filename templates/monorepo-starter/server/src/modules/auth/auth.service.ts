import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import type { Request, Response } from "express";
import argon2 from "argon2";
import { PrismaService } from "@modules/prisma/prisma.service";
import {
  ChangeIdentifierDto,
  RequestOtpDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
  ValidateOtpDto,
} from "@workspace/contracts/auth";
import { TokenService } from "@modules/token/token.service";
import { Prisma } from "@generated/prisma";
import { OtpService } from "./otp.service";
import { NotificationService } from "@modules/notification/notification.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly otpService: OtpService,
    private readonly notifyService: NotificationService
  ) {}

  async signUp(dto: SignUpDto) {
    if (!dto.password) {
      throw new BadRequestException("Password should not be empty.");
    }

    const { key } = await this.createUser(dto, "customer");

    return {
      message: `User created successfully. Please verify your ${key}.`,
    };
  }

  async signIn(dto: SignInDto, req: Request, res: Response) {
    const { user, key, value, meta } = await this.findUserFail404(
      dto.identifier
    );

    if (!meta.password) {
      await this.otpService.sendOtp({
        userId: user.id,
        purpose: "setPassword",
        identifier: value,
        type: "token",
        metadata: { user },
      });

      throw new UnauthorizedException(
        "Password not set. Please set your password to continue."
      );
    }

    if (!dto.password) {
      throw new BadRequestException("Password should not be empty.");
    }

    const isPasswordValid = await this.verifyPassword(
      dto.password,
      meta.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    await this.checkVerificationStatus(user, key, value, "unverified");

    if (meta?.isMfaEnabled) {
      await this.otpService.sendOtp({
        userId: user.id,
        identifier: value,
        purpose: "verifyMfa",
        metadata: { user },
      });
      return {
        message: "MFA code sent. Please verify to complete login.",
        action: "verifyMfa",
      };
    }

    await this.tokenService.createAuthSession(req, res, {
      id: user.id,
      roles: user.roles,
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    await this.notifyService.sendNotification({
      userId: user.id,
      purpose: "signin",
      to: value,
      metadata: { user },
    });

    return {
      message: "Signed in successfully",
      data: { id: user.id, roles: user.roles },
    };
  }

  async signOut(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    const tokenId = req.cookies.tokenId;

    if (refreshToken && tokenId) {
      await this.prisma.refreshToken.updateMany({
        where: { id: tokenId, token: refreshToken },
        data: { blacklisted: true },
      });
    }

    this.tokenService.clearAuthCookies(res);

    return { message: "Signed out successfully" };
  }

  async requestOtp(dto: RequestOtpDto) {
    const { user, key, value, meta } = await this.findUserFail404(
      dto.identifier
    );

    switch (dto.purpose) {
      case "verifyIdentifier": {
        await this.checkVerificationStatus(user, key, value, "verified");

        await this.otpService.sendOtp({
          userId: user.id,
          identifier: value,
          purpose: dto.purpose,
          metadata: { user },
        });

        return { message: "Verification OTP sent." };
      }

      case "setPassword":
      case "resetPassword": {
        if (dto.purpose === "setPassword" && meta.password) {
          throw new BadRequestException(
            "Password already set. Use resetPassword."
          );
        }

        await this.otpService.sendOtp({
          userId: user.id,
          identifier: value,
          purpose: dto.purpose,
          metadata: { user },
        });

        return { message: `${dto.purpose} OTP sent.` };
      }

      case "changeIdentifier": {
        await this.otpService.sendOtp({
          userId: user.id,
          identifier: value,
          purpose: dto.purpose,
          metadata: { user },
        });

        return { message: `Change ${key} OTP sent.` };
      }

      case "enableMfa": {
        if (meta?.isMfaEnabled) {
          throw new BadRequestException("MFA is already enabled.");
        }

        await this.otpService.sendOtp({
          userId: user.id,
          identifier: value,
          purpose: dto.purpose,
          metadata: { user },
        });

        return { message: "enableMfa OTP sent." };
      }

      case "disableMfa": {
        if (!meta?.isMfaEnabled) {
          throw new BadRequestException("MFA is already disabled.");
        }

        await this.otpService.sendOtp({
          userId: user.id,
          identifier: value,
          purpose: dto.purpose,
          metadata: { user },
        });

        return { message: "disableMfa OTP sent." };
      }

      case "verifyMfa": {
        await this.otpService.sendOtp({
          userId: user.id,
          identifier: value,
          purpose: dto.purpose,
          metadata: { user },
        });

        return { message: "verifyMfa OTP sent." };
      }

      default:
        throw new BadRequestException(`Invalid purpose: ${dto.purpose}`);
    }
  }

  async validateOtp(dto: ValidateOtpDto, req: Request, res: Response) {
    const { key, value, user } = await this.findUserFail404(dto.identifier);

    await this.otpService.verifyOtp({
      userId: user.id,
      purpose: dto.purpose,
      secret: dto.secret,
      type: dto.type,
    });

    switch (dto.purpose) {
      case "verifyIdentifier": {
        await this.prisma.user.update({
          where: { id: user.id },
          data:
            key === "email"
              ? { isEmailVerified: true }
              : { isPhoneVerified: true },
        });

        return { message: `${key} verified successfully.` };
      }

      case "setPassword":
      case "resetPassword": {
        const otp = await this.otpService.sendOtp({
          userId: user.id,
          identifier: value,
          purpose: dto.purpose,
          type: "token",
          notify: false,
          metadata: { user },
        });

        return {
          message: "OTP validated successfully.",
          data: { secret: otp.secret },
        };
      }

      case "changeIdentifier": {
        const otp = await this.otpService.sendOtp({
          userId: user.id,
          identifier: value,
          purpose: dto.purpose,
          type: "token",
          notify: false,
          metadata: { user },
        });

        return {
          message: "OTP validated successfully.",
          data: { secret: otp.secret },
        };
      }

      case "enableMfa": {
        const otp = await this.otpService.sendOtp({
          userId: user.id,
          identifier: value,
          purpose: dto.purpose,
          type: "token",
          notify: false,
          metadata: { user },
        });

        return {
          message: "OTP verified. Setup MFA details.",
          data: { secret: otp.secret },
        };
      }

      case "disableMfa": {
        await this.prisma.securitySetting.update({
          where: { userId: user.id },
          data: { isMfaEnabled: false },
        });

        await this.notifyService.sendNotification({
          userId: user.id,
          to: dto.identifier,
          purpose: dto.purpose,
          metadata: { user },
        });

        return { message: "disableMfa successfully." };
      }

      case "verifyMfa": {
        await this.tokenService.createAuthSession(req, res, {
          id: user.id,
          roles: user.roles,
        });

        await this.prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          message: "MFA verified. Signed in successfully.",
          data: { id: user.id, roles: user.roles },
        };
      }

      default:
        throw new BadRequestException(`Invalid purpose: ${dto.purpose}`);
    }
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { user } = await this.findUserFail404(dto.identifier);

    const isTokenValid = await this.otpService.verifyOtp({
      userId: user.id,
      purpose: dto.purpose,
      secret: dto.secret,
      type: "token",
    });

    if (!isTokenValid) {
      throw new BadRequestException("Invalid Token");
    }

    const hashedPassword = await this.hashPassword(dto.newPassword);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await this.notifyService.sendNotification({
      userId: user.id,
      to: dto.identifier,
      purpose: dto.purpose,
      metadata: { user },
    });

    return {
      message: `Password ${dto.purpose.split("Password")} successfully`,
    };
  }

  async changeIdentifierReq(dto: ChangeIdentifierDto) {
    const { user, value } = await this.findUserFail404(dto.identifier);

    const { key: newKey, value: newValue } = await this.findUserFail200(
      dto.newIdentifier
    );

    const isTokenValid = await this.otpService.verifyOtp({
      userId: user.id,
      purpose: dto.purpose,
      secret: dto.secret,
      type: "token",
    });

    if (!isTokenValid) {
      throw new BadRequestException("Invalid Token");
    }

    await this.otpService.sendOtp({
      userId: user.id,
      identifier: newValue,
      purpose: dto.purpose,
      type: "token",
      metadata: { user, identifier: value, newIdentifier: newValue },
    });

    return {
      message: `Link sent to new ${newKey}. Please verify to complete the change.`,
    };
  }

  async changeIdentifier(dto: ChangeIdentifierDto) {
    const { user, key } = await this.findUserFail404(dto.identifier);

    await this.otpService.verifyOtp({
      userId: user.id,
      purpose: dto.purpose,
      secret: dto.secret,
      type: "token",
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        [key]: dto.newIdentifier,
        ...(key === "email"
          ? { isEmailVerified: false }
          : { isPhoneVerified: false }),
      },
    });

    await this.prisma.refreshToken.updateMany({
      where: { userId: user.id },
      data: { blacklisted: true },
    });

    await this.notifyService.sendNotification({
      userId: user.id,
      to: dto.newIdentifier,
      purpose: dto.purpose,
      metadata: {
        user,
        identifier: dto.identifier,
        newIdentifier: dto.newIdentifier,
      },
    });

    return { message: `${key} changed successfully.` };
  }

  async getUser(req: Request) {
    const userId = req.user!.id;
    const { user } = await this.findUserFail404(userId, { id: userId });

    return {
      message: "User Data Fetched Successfully.",
      data: user,
    };
  }

  async createUser(dto: SignUpDto, role: UserRole) {
    const { key, value } = await this.findUserFail200(dto.identifier);

    const hashedPassword = dto.password
      ? await this.hashPassword(dto.password)
      : undefined;

    const newUser = await this.prisma.user.create({
      data: {
        [key]: value,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        displayName: `${dto.firstName} ${dto.lastName}`.trim(),
        roles: {
          create: [{ role }],
        },
      },
      select: this.userSelect,
    });

    const userRoles = newUser.roles.map((r) => r.role);
    const user = { ...newUser, roles: userRoles };

    await this.notifyService.sendNotification({
      userId: user.id,
      purpose: "signup",
      to: value,
      metadata: { user },
    });

    await this.otpService.sendOtp({
      userId: user.id,
      identifier: value,
      purpose: "verifyIdentifier",
      metadata: { user },
    });

    return { user, key };
  }

  // TODO POST /auth/mfa/setup
  // TODO POST /auth/revoke-sessions
  // TODO GET /auth/sessions

  private async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  private async verifyPassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return argon2.verify(hash, password);
  }

  private async findUserFail404(i: string, q?: Prisma.UserWhereUniqueInput) {
    let { key, value, query } = this.parseIdentifier(i);
    if (q) query = q;

    const user = await this.prisma.user.findUnique({
      where: query,
      select: {
        ...this.userSelect,
        password: true,
        securitySetting: { select: { isMfaEnabled: true } },
      },
    });
    if (!user) throw new NotFoundException("User not found");
    const { password, roles, securitySetting, ...data } = user;
    const userRoles = roles.map((r) => r.role);
    return {
      key,
      value,
      user: { ...data, roles: userRoles } satisfies UserResponse,
      meta: { password, isMfaEnabled: securitySetting?.isMfaEnabled },
    };
  }

  private findUserFail200 = async (
    i: string,
    q?: Prisma.UserWhereUniqueInput
  ) => {
    let { key, value, query } = this.parseIdentifier(i);
    if (q) query = q;
    const user = await this.prisma.user.findUnique({
      where: query,
    });

    if (user) {
      throw new BadRequestException(`${key} already in use.`);
    }

    return { key, value };
  };

  private async checkVerificationStatus(
    user: UserResponse,
    key: IdentifierKey,
    value: string,
    check: "verified" | "unverified"
  ) {
    const isVerified =
      key === "email" ? user.isEmailVerified : user.isPhoneVerified;

    if (check === "verified" && isVerified) {
      throw new BadRequestException(`${key} is already verified.`);
    }

    if (check === "unverified" && !isVerified) {
      await this.otpService.sendOtp({
        userId: user.id,
        identifier: value,
        purpose: "verifyIdentifier",
        metadata: { user },
      });

      throw new UnauthorizedException({
        message: `${key} not verified`,
        action: "verifyIdentifier",
      });
    }
  }

  private parseIdentifier(i: string) {
    const isEmail = i.includes("@");
    const key: IdentifierKey = isEmail ? "email" : "phone";
    const value = isEmail ? i.toLowerCase() : i;
    const query = key === "email" ? { email: value } : { phone: value };

    return { key, value, query: query as Prisma.UserWhereUniqueInput };
  }

  userSelect: Prisma.UserSelect = {
    id: true,
    firstName: true,
    lastName: true,
    displayName: true,
    imageUrl: true,
    email: true,
    phone: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    lastLoginAt: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    roles: { select: { role: true } },
  };
}
