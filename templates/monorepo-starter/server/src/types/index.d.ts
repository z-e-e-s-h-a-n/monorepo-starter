import { OrderStatus, OtpPurpose } from "@generated/prisma";

declare global {
  type IdentifierKey = "email" | "phone";

  type NotificationPurpose = "signin" | "signup" | OtpPurpose;

  type TemplateReturn = {
    subject: string;
    html: string;
    text: string;
  };

  export const CACHE_KEYS = {
    CLIENT_URL: "clientUrl",
  } as const;

  export type CacheKeys = (typeof CACHE_KEYS)[keyof typeof CACHE_KEYS];
}
