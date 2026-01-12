import { z } from "zod";
import { OtpPurposeEnum, OtpTypeEnum } from "../lib/enums";

const identifier = z.string().min(11);
const password = z.string().min(8);
const name = z.string().min(3);

export const signInSchema = z.object({
  identifier,
  password: password.optional(),
});

export const signUpSchema = signInSchema.extend({
  firstName: name,
  lastName: name.optional(),
  confirmPassword: password.optional(),
});

export const requestOtpSchema = z.object({
  identifier,
  purpose: OtpPurposeEnum,
});

export const validateOtpSchema = requestOtpSchema.extend({
  secret: z.string().min(6),
  type: OtpTypeEnum.optional(),
});

export const resetPasswordSchema = validateOtpSchema.extend({
  newPassword: password,
});

export const changeIdentifierSchema = validateOtpSchema.extend({
  newIdentifier: identifier,
});
