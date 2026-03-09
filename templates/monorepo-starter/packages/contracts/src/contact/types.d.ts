import type z from "zod";
import type {
  createContactMessageSchema,
  updateContactMessageSchema,
  contactMessageQuerySchema,
} from "./schema";
import { type ContactMessage } from "../lib/prisma";

declare global {
  type CreateContactMessageType = z.input<typeof createContactMessageSchema>;
  type CreateContactMessageDto = z.output<typeof createContactMessageSchema>;

  type UpdateContactMessageType = z.input<typeof updateContactMessageSchema>;
  type UpdateContactMessageDto = z.output<typeof updateContactMessageSchema>;

  type ContactMessageQueryType = z.input<typeof contactMessageQuerySchema>;
  type ContactMessageQueryDto = z.output<typeof contactMessageQuerySchema>;

  interface ContactMessageResponse extends Sanitize<ContactMessage> {
    repliedBy?: BaseUserResponse;
  }

  interface ContactMessageQueryResponse extends BaseQueryResponse {
    messages: ContactMessageResponse[];
  }
}

export {};
