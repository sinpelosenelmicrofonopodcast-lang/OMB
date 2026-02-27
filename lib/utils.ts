import { clsx, type ClassValue } from "clsx";
import type { Locale } from "@/lib/i18n/locale";
import { toIntlLocale } from "@/lib/i18n/locale";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(value: number | null | undefined, locale: Locale = "en") {
  if (value == null) return locale === "es" ? "Llamar para precio" : "Call for Price";
  return new Intl.NumberFormat(toIntlLocale(locale), {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatMileage(value: number | null | undefined, locale: Locale = "en") {
  if (value == null) return locale === "es" ? "N/D" : "N/A";
  return `${new Intl.NumberFormat(toIntlLocale(locale)).format(value)} ${locale === "es" ? "millas" : "mi"}`;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function parseLineList(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function safeJsonParse<T>(value: string, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
