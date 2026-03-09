import type z from "zod";
import type {
  newsletterSubscriberSchema,
  newsletterUnSubscriberSchema,
  newsletterSubscriberQuerySchema,
} from "./schema";
import { type NewsletterSubscriber } from "../lib/prisma";

declare global {
  type NewsletterSubscriberType = z.input<typeof newsletterSubscriberSchema>;
  type NewsletterSubscriberDto = z.output<typeof newsletterSubscriberSchema>;

  type NewsletterUnSubscriberType = z.input<
    typeof newsletterUnSubscriberSchema
  >;
  type NewsletterUnSubscriberDto = z.output<
    typeof newsletterUnSubscriberSchema
  >;

  type NewsletterSubscriberQueryType = z.input<
    typeof newsletterSubscriberQuerySchema
  >;
  type NewsletterSubscriberQueryDto = z.output<
    typeof newsletterSubscriberQuerySchema
  >;

  type NewsletterSubscriberResponse = Sanitize<NewsletterSubscriber>;

  interface NewsletterSubscriberQueryResponse extends BaseQueryResponse {
    users: NewsletterSubscriberResponse[];
  }
}

export {};
