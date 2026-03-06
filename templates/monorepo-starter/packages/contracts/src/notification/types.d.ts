import type z from "zod";
import { registerPushTokenSchema } from "./schema";
import type { Notification } from "../lib/prisma";

declare global {
  /* ======================================================
  NOTIFICATION — INPUT TYPES
  ===================================================== */
  type RegisterPushTokenType = z.input<typeof registerPushTokenSchema>;

  /* ======================================================
  NOTIFICATION — OUTPUT TYPES
  ===================================================== */
  type RegisterPushTokenDto = z.output<typeof registerPushTokenSchema>;

  /* ======================================================
     NOTIFICATION — RESPONSES
  ===================================================== */
  type NotificationResponse = Sanitize<Notification>;
}

export {};
