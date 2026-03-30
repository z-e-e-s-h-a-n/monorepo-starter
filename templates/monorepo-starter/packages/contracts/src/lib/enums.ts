import { z } from "zod";
import * as $Enums from "@workspace/db/enums";

export const BaseSortByEnum = z.enum(["createdAt"]);
export const SortOrderEnum = z.enum(["asc", "desc"]);
export const ChartRangeEnum = z.enum(["7d", "30d", "90d"]);
export const ThemeModeEnum = z.enum($Enums.ThemeMode);

export const UserRoleEnum = z.enum($Enums.UserRole);
export const UserStatusEnum = z.enum($Enums.UserStatus);
export const SafeUserRoleEnum = z.enum(
  Object.values($Enums.UserRole).filter((role) => role !== "admin"),
);

export const OtpTypeEnum = z.enum($Enums.OtpType);
export const OtpPurposeEnum = z.enum($Enums.OtpPurpose);
export const MfaMethodEnum = z.enum($Enums.MfaMethod);
export const SessionStatusEnum = z.enum($Enums.SessionStatus);
export const AuditActionEnum = z.enum($Enums.AuditAction);

export const PushProviderEnum = z.enum($Enums.PushProvider);
export const NotificationChannelEnum = z.enum($Enums.NotificationChannel);
export const NotificationPurposeEnum = z.enum($Enums.NotificationPurpose);
export const NotificationStatusEnum = z.enum($Enums.NotificationStatus);

export const MediaTypeEnum = z.enum($Enums.MediaType);
export const MediaVisibilityEnum = z.enum($Enums.MediaVisibility);

export const UserSearchByEnum = z.enum(["id", "email", "phone", "displayName"]);
export const UserSortByEnum = z.enum([
  "displayName",
  "email",
  "phone",
  "role",
  "status",
  "lastLoginAt",
]);

export const MediaSearchByEnum = z.enum(["id", "name"]);
export const MediaSortByEnum = z.enum(["size", "name", "type"]);

export const AuditLogSearchByEnum = z.enum([
  "userId",
  "entityType",
  "entityId",
]);
export const AuditLogSortByEnum = z.enum(["createdAt", "entityType"]);
