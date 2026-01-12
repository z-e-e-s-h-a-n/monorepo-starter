import { z } from "zod";

/* =========================
   COMMON / GLOBAL ENUMS
========================= */

export const SortDirEnum = z.enum(["asc", "desc"]);

export const UserRoleEnum = z.enum(["admin", "customer"]);

export const UserSearchByEnum = z.enum(["id", "email", "phone", "displayName"]);

export const UserSortByEnum = z.enum(["createdAt", "lastLoginAt", "email"]);

export const OtpPurposeEnum = z.enum([
  "setPassword",
  "resetPassword",
  "verifyIdentifier",
  "changeIdentifier",
  "enableMfa",
  "disableMfa",
  "verifyMfa",
]);

export const OtpTypeEnum = z.enum(["otp", "token"]);

/* =========================
   BASE REUSABLE ENUMS
========================= */

export const BaseSortByEnum = ["createdAt"] as const;
