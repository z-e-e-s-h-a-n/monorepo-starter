import {
  signInSchema,
  signUpSchema,
  requestOtpSchema,
  validateOtpSchema,
  resetPasswordSchema,
  changeIdentifierSchema,
} from "./auth.schema";
import { createZodDto } from "nestjs-zod";

export class SignInDto extends createZodDto(signInSchema) {}

export class SignUpDto extends createZodDto(signUpSchema) {}

export class RequestOtpDto extends createZodDto(requestOtpSchema) {}

export class ValidateOtpDto extends createZodDto(validateOtpSchema) {}

export class ResetPasswordDto extends createZodDto(resetPasswordSchema) {}

export class ChangeIdentifierDto extends createZodDto(changeIdentifierSchema) {}
