import { Injectable, type ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GoogleAuthGuard extends AuthGuard("google") {
  getAuthenticateOptions(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const clientUrl = req.query.clientUrl;

    if (!clientUrl) {
      throw new Error("clientUrl is required");
    }

    return {
      state: Buffer.from(clientUrl).toString("base64"),
    };
  }
}

@Injectable()
export class FacebookAuthGuard extends AuthGuard("facebook") {
  getAuthenticateOptions(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const clientUrl = req.query.clientUrl;

    if (!clientUrl) {
      throw new Error("clientUrl is required for Facebook OAuth");
    }

    return {
      state: Buffer.from(clientUrl).toString("base64"),
    };
  }
}
