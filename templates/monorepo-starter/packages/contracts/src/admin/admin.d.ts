import type z from "zod";
import { userQuerySchema } from "./admin.schema";

declare global {
  type UserQueryType = z.infer<typeof userQuerySchema>;

  interface UserQueryResponse extends BaseQueryResponse {
    users: UserResponse[];
  }
}

export {};
