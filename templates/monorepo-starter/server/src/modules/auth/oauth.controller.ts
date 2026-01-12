import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Public } from "@decorators/public.decorator";
import type { Request, Response } from "express";
import { TokenService } from "@modules/token/token.service";
import { PrismaService } from "@modules/prisma/prisma.service";
import { FacebookAuthGuard, GoogleAuthGuard } from "@guards/oauth.guard";

@Controller("oauth")
export class OAuthController {
  constructor(
    private readonly tokenService: TokenService,
    private readonly prisma: PrismaService
  ) {}

  @Public()
  @Get("google")
  @UseGuards(GoogleAuthGuard)
  googleLogin() {}

  @Public()
  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const clientUrl = this.extractClientUrl(req);
    const user = req.user!;
    console.log("user", user);

    await this.tokenService.createAuthSession(req, res, user);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return res.redirect(clientUrl);
  }

  @Public()
  @Get("facebook")
  @UseGuards(FacebookAuthGuard)
  facebookLogin() {}

  @Public()
  @Get("facebook/callback")
  @UseGuards(AuthGuard("facebook"))
  async facebookCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const clientUrl = this.extractClientUrl(req);
    const user = req.user!;
    await this.tokenService.createAuthSession(req, res, user);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return res.redirect(clientUrl);
  }

  private extractClientUrl(req: Request): string {
    const state = req.query.state as string;
    return Buffer.from(state, "base64").toString("utf-8");
  }
}
