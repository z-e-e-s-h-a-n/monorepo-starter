import { z, ZodType } from "zod";
import * as schema from "./schema";
import * as enums from "./enums";

/* ======================================================
   GLOBAL DECLARATIONS
====================================================== */

declare global {
  /* --------------------
     Common / Shared
  -------------------- */

  type Nullable<T> = T | null;
  type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

  type sortDirType = ZodInfer<enums.SortDirEnum>;

  type AuthActions = "verifyIdentifier" | "verifyMfa" | "setPassword";
  type OAuthProvider = "google" | "facebook" | "apple";

  type UserRole = z.infer<typeof enums.UserRoleEnum>;
  type UserSearchByType = z.infer<typeof enums.UserSearchByEnum>;
  type UserSortByType = z.infer<typeof enums.UserSortByEnum>;

  type OtpPurpose = z.infer<typeof enums.OtpPurposeEnum>;
  type OtpType = z.infer<typeof enums.OtpTypeEnum>;

  interface BaseQueryType<T> {
    page?: number;
    limit?: number;
    sortBy?: T["sortBy"];
    sortDir?: sortDirType;
    search?: string;
    searchBy?: T["searchBy"];
  }

  interface BaseResponse {
    id: string;
    createdAt: Nullable<Date>;
    updatedAt: Nullable<Date>;
    deletedAt?: Nullable<Date>;
  }

  interface BaseQueryResponse {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }

  interface HealthCheckResponse {
    message: string;
    status: string;
    uptime: string;
    timestamp: string;
  }
}

export {};
