import z from "zod";
import { UserRoleEnum, UserSearchByEnum, UserSortByEnum } from "../lib/enums";
import { baseQuerySchema } from "../lib/schema";

export const userQuerySchema = baseQuerySchema(
  UserSortByEnum.default("createdAt"),
  UserSearchByEnum
).extend({
  role: UserRoleEnum.optional(),
  isEmailVerified: z.boolean().optional(),
  isPhoneVerified: z.boolean().optional(),
  deleted: z.boolean().optional(),
});
