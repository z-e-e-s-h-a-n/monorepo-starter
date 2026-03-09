import z from "zod";
import {
  baseQuerySchema,
  emailSchema,
  isoDateSchema,
  nameSchema,
  phoneSchema,
} from "../lib/schema";
import {
  ContactMessageSearchByEnum,
  ContactMessageSortByEnum,
  ContactMessageStatusEnum,
} from "../lib/enums";

export const createContactMessageSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema.optional(),
  email: emailSchema,
  phone: phoneSchema,
  subject: z.string().optional(),
  message: z.string(),
  source: z.string().optional(),
});

export const updateContactMessageSchema = z.object({
  replyNotes: z.string().optional(),
  status: ContactMessageStatusEnum,
  repliedAt: isoDateSchema,
});

export const contactMessageQuerySchema = baseQuerySchema(
  ContactMessageSortByEnum,
  ContactMessageSearchByEnum,
).extend({
  status: ContactMessageStatusEnum.optional(),
});
