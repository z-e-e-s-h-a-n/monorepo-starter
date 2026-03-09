import { z } from "zod";
import * as enums from "./enums";
import React from "react";
import { Prisma } from "../lib/prisma";

/* ======================================================
   GLOBAL DECLARATIONS
====================================================== */

declare global {
  /* --------------------
     Shared - Utilities
  -------------------- */

  type Nullable<T> = T | null;
  type DecimalInstance = InstanceType<typeof Prisma.Decimal>;
  type StrictOmit<T, K extends keyof T> = Omit<T, K>;
  type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
  type ArrayItem<T> = T extends any[] ? T[number] : never;

  type Primitive =
    | string
    | number
    | boolean
    | bigint
    | symbol
    | undefined
    | null;

  type Sanitize<T> = T extends DecimalInstance
    ? number
    : T extends Date
      ? string
      : T extends null
        ? undefined
        : T extends Primitive
          ? T
          : T extends Array<infer U>
            ? Array<Sanitize<U>>
            : {
                [K in keyof T]: Sanitize<T[K]>;
              };

  /* --------------------
     Apps Shared - Types
  -------------------- */

  interface SegmentParams {
    [key: string]: string;
  }

  type TSearchParams = Record<string, string | string[] | undefined>;

  interface AppPageProps<
    TParams extends SegmentParams = SegmentParams,
    TSParams extends TSearchParams = TSearchParams,
  > {
    params: Promise<TParams>;
    searchParams: Promise<TSParams>;
  }

  interface AppLayoutProps {
    children?: React.ReactNode;
  }

  type FormSectionType = "add" | "update";
  type AuthFormType = "sign-up" | "sign-in" | "reset-password" | "set-password";

  interface BaseCUFormProps {
    entityId?: string;
    formType: FormSectionType;
  }

  /* --------------------
     Shared - TYPES
  -------------------- */

  type SortOrderType = z.infer<typeof enums.SortOrderEnum>;
  type ChartRangeType = z.infer<typeof enums.ChartRangeEnum>;

  type OAuthProvider = "google" | "facebook" | "apple";
  type AuthActions = "verifyIdentifier" | "verifyMfa" | "setPassword";
  type MfaMethod = z.infer<typeof enums.MfaMethodEnum>;

  type OtpPurpose = z.infer<typeof enums.OtpPurposeEnum>;
  type OtpType = z.infer<typeof enums.OtpTypeEnum>;
  type SessionStatus = z.infer<typeof enums.SessionStatusEnum>;

  type NotificationPurpose = z.infer<typeof enums.NotificationPurposeEnum>;
  type MessagingChannel = z.infer<typeof enums.MessagingChannelEnum>;
  type NotificationChannel = z.infer<typeof enums.NotificationChannelEnum>;
  type NotificationPriority = z.infer<typeof enums.NotificationPriorityEnum>;
  type NotificationStatus = z.infer<typeof enums.NotificationStatusEnum>;

  /* --------------------
     SHARED QUERY - TYPES
  -------------------- */

  type BaseSortByType = z.infer<typeof enums.BaseSortByEnum>;

  interface BaseQueryType {
    page?: number;
    limit?: number;
    search?: string;
    sortOrder?: SortOrderType;
    sortBy?: string;
    searchBy?: string;
  }

  /* --------------------
     SHARED RESPONSE - TYPES
  -------------------- */

  interface HealthCheckResponse {
    message: string;
    status: string;
    uptime: string;
    timestamp: string;
  }

  interface BaseResponse {
    id: string;
  }

  interface BaseQueryResponse {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }

  /* --------------------
     USER - TYPES
  -------------------- */

  type UserRole = z.infer<typeof enums.UserRoleEnum>;
  type UserStatus = z.infer<typeof enums.UserStatusEnum>;
  type UserSearchByType = z.infer<typeof enums.UserSearchByEnum>;
  type UserSortByType = z.infer<typeof enums.UserSortByEnum>;

  /* --------------------
     MEDIA - TYPES
  -------------------- */

  type MediaType = z.infer<typeof enums.MediaTypeEnum>;
  type MediaVisibility = z.infer<typeof enums.MediaVisibilityEnum>;
}

export {};
