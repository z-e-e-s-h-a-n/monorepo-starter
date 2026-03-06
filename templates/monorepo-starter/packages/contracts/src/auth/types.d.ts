import type z from "zod";
import * as schema from "./schema";
import type { Session } from "../lib/prisma";

declare global {
  /* ======================================================
     AUTH — INPUT TYPES
  ===================================================== */

  type SignInType = z.input<typeof schema.signInSchema>;

  type SignUpType = z.input<typeof schema.signUpSchema>;

  type RequestOtpType = z.input<typeof schema.requestOtpSchema>;

  type ValidateOtpType = z.input<typeof schema.validateOtpSchema>;

  type ResetPasswordType = z.input<typeof schema.resetPasswordSchema>;

  type UpdateMfaType = z.input<typeof schema.updateMfaSchema>;

  type UpdateIdentifierType = z.input<typeof schema.updateIdentifierSchema>;

  /* ======================================================
     AUTH — OUTPUT TYPES
  ===================================================== */

  type SignInDto = z.output<typeof schema.signInSchema>;

  type SignUpDto = z.output<typeof schema.signUpSchema>;

  type RequestOtpDto = z.output<typeof schema.requestOtpSchema>;

  type ValidateOtpDto = z.output<typeof schema.validateOtpSchema>;

  type ResetPasswordDto = z.output<typeof schema.resetPasswordSchema>;

  type UpdateMfaDto = z.output<typeof schema.updateMfaSchema>;

  type UpdateIdentifierDto = z.output<typeof schema.updateIdentifierSchema>;

  /* ======================================================
     AUTH — RESPONSES
  ===================================================== */

  interface SignInResponse {
    id: string;
    role: UserRole;
  }

  interface ValidateOtpResponse {
    secret?: string;
  }

  type SessionResponse = Pick<
    Session,
    | "id"
    | "ip"
    | "isp"
    | "location"
    | "timezone"
    | "deviceType"
    | "deviceInfo"
    | "status"
    | "isTrusted"
    | "lastSeenAt"
    | "createdAt"
    | "expiresAt"
    | "revokedAt"
  >;
}

export {};
