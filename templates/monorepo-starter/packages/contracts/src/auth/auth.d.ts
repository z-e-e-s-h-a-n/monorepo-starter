import type z from "zod";
import * as authSchema from "../auth/auth.schema";

declare global {
  /* ======================================================
     AUTH — TYPES
  ===================================================== */

  type SignInType = z.infer<typeof authSchema.signInSchema>;

  type SignUpType = z.infer<typeof authSchema.signUpSchema>;

  type RequestOtpType = z.infer<typeof authSchema.requestOtpSchema>;

  type ValidateOtpType = z.infer<typeof authSchema.validateOtpSchema>;

  type ResetPasswordType = z.infer<typeof authSchema.resetPasswordSchema>;

  type ChangeIdentifierType = z.infer<typeof authSchema.changeIdentifierSchema>;

  /* ======================================================
     AUTH — RESPONSES
  ===================================================== */

  interface BaseUserResponse {
    id: string;
    displayName: string;
    email?: Nullable<string>;
    phone?: Nullable<string>;
  }

  interface UserResponse extends BaseResponse, BaseUserResponse {
    firstName: string;
    lastName?: Nullable<string>;
    imageUrl?: Nullable<string>;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    lastLoginAt: Nullable<Date>;
    roles: UserRole[];
  }

  interface SignInResponse {
    id: string;
    roles: UserRole[];
  }

  interface ValidateOtpResponse {
    secret?: string;
  }
}

export {};
