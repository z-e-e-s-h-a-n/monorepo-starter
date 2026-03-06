import type z from "zod";
import { CUUserSchema, userQuerySchema } from "./schema";

declare global {
  /* ======================================================
     ADMIN — INPUT TYPES
  ===================================================== */
  type CUUserType = z.input<typeof CUUserSchema>;
  type UserQueryType = z.input<typeof userQuerySchema>;

  /* ======================================================
     ADMIN — OUTPUT TYPES
  ===================================================== */

  type CUUserDto = z.output<typeof CUUserSchema>;
  type UserQueryDto = z.output<typeof userQuerySchema>;

  /* ======================================================
     ADMIN —  RESPONSES
  ===================================================== */

  interface UserQueryResponse extends BaseQueryResponse {
    users: UserResponse[];
  }
}

export {};
