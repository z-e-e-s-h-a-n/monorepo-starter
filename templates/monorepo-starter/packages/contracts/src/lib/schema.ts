import { z, ZodType } from "zod";
import { SortOrderEnum, BaseSortByEnum } from "./enums";

/* ======================================================
     SHARED UTILS — SCHEMA
  ===================================================== */

export const idSchema = z.ulid().nonempty("Invalid Id");

export const emailSchema = z.email("Invalid email address");
export const phoneSchema = z
  .string()
  .regex(/^\+[1-9]\d{9,14}$/, "Invalid phone number");

export const identifierSchema = z.union([emailSchema, phoneSchema], {
  error: () => ({
    message: "Identifier must be a valid email or phone number",
  }),
});

export const nameSchema = z.string().min(3);
export const passwordSchema = z.string().min(8);
export const numberSchema = z.coerce.number<number>().int().min(1);

export const isoDateSchema = z.iso
  .datetime({ message: "Invalid Date" })
  .transform((value) => new Date(value));

export const priceSchema = z.union([
  numberSchema,
  z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
]);

export const imagesSchema = z
  .array(idSchema)
  .transform((i) => i.map((i) => ({ id: i })));

/* ======================================================
     SHARED QUERY — SCHEMA
  ===================================================== */

export const baseQuerySchema = <
  TSortBy extends ZodType,
  TSearchBy extends ZodType,
>(
  sortByEnum: TSortBy,
  searchByEnum: TSearchBy,
) => {
  const sortByWithCreatedAt = z.literal(BaseSortByEnum.options).or(sortByEnum);

  return z.object({
    page: numberSchema.default(1),
    limit: numberSchema.default(10),

    sortBy: sortByWithCreatedAt.default("createdAt"),
    sortOrder: SortOrderEnum.default("desc"),

    search: z.string().optional(),
    searchBy: searchByEnum.optional(),
  });
};
