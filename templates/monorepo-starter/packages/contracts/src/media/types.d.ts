import type z from "zod";
import type {
  mediaCreateSchema,
  mediaQuerySchema,
  mediaUpdateSchema,
} from "./schema";
import { type Media } from "../lib/prisma";

declare global {
  /* ======================================================
     MEDIA — INPUT TYPES
  ===================================================== */
  type MediaUpdateType = z.input<typeof mediaUpdateSchema>;
  type MediaQueryType = z.input<typeof mediaQuerySchema>;

  /* ======================================================
  MEDIA — OUTPUT TYPES
  ===================================================== */
  type MediaCreateDto = z.output<typeof mediaCreateSchema>;
  type MediaUpdateDto = z.output<typeof mediaUpdateSchema>;
  type MediaQueryDto = z.output<typeof mediaQuerySchema>;

  /* ======================================================
     MEDIA — RESPONSES
  ===================================================== */

  interface MediaResponse extends Sanitize<Media> {
    uploadedBy: BaseUserResponse;
  }

  interface MediaQueryResponse extends BaseQueryResponse {
    medias: MediaResponse[];
  }
}

export {};
