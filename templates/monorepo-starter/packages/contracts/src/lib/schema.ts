import { z, ZodType } from "zod";
import { SortDirEnum } from "./enums";

export const idSchema = z.string().min(1, "Invalid Id");

export const numberSchema = z.coerce.number<number>().int().min(1);

export const isoDateSchema = z.iso
  .datetime({ message: "Invalid Date" })
  .transform((value) => new Date(value));

export const priceSchema = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format");

export const baseQuerySchema = <
  TSortBy extends ZodType,
  TSearchBy extends ZodType,
>(
  sortByEnum: TSortBy,
  searchByEnum: TSearchBy
) =>
  z.object({
    page: numberSchema.default(1),
    limit: numberSchema.default(10),

    sortBy: sortByEnum,
    sortDir: SortDirEnum.default("desc"),

    search: z.string().optional(),
    searchBy: searchByEnum.optional(),
  });
