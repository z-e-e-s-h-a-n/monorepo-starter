import z from "zod";
import type { userProfileSchema } from "./schema";
import { type Media, type User } from "../lib/prisma";

declare global {
  /* ======================================================
     USER — INPUT TYPES
  ===================================================== */
  type UserProfileType = z.input<typeof userProfileSchema>;

  /* ======================================================
  USER — OUTPUT TYPES
  ===================================================== */
  type UserProfileDto = z.output<typeof userProfileSchema>;

  /* ======================================================
     USER — RESPONSES
  ===================================================== */

  type BaseUserResponse = Sanitize<
    Pick<
      User,
      "id" | "email" | "phone" | "firstName" | "lastName" | "displayName"
    >
  >;

  type SafeUser = StrictOmit<User, "password"> & {
    image?: Media | null;
  };

  type UserResponse = StrictOmit<Sanitize<User>, "password"> & {
    image?: MediaResponse;
  };
}

export {};
