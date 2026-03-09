import type z from "zod";
import type { businessProfileSchema } from "./schema";
import { type BusinessProfile } from "../lib/prisma";

declare global {
  type BusinessProfileType = z.input<typeof businessProfileSchema>;
  type BusinessProfileDto = z.output<typeof businessProfileSchema>;

  interface BusinessProfileResponse extends Sanitize<BusinessProfile> {
    logo?: MediaResponse;
  }
}

export {};
