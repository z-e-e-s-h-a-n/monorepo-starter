import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import ms, { type StringValue } from "ms";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const slugify = (str: string, slug?: string) => {
  const base = slug && slug.trim().length > 0 ? slug : str;

  return base
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export const parseExpiry = (exp: StringValue, future = false): number => {
  const val = ms(exp);
  if (future) return Date.now() + val;
  return val;
};

export const expiryDate = (exp: StringValue, future = false): Date => {
  const val = parseExpiry(exp, future);
  return new Date(val);
};
