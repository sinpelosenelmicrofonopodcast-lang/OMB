import { cookies } from "next/headers";

export const LOCALE_COOKIE_NAME = "omb_locale";
export const LOCALES = ["en", "es"] as const;
export const DEFAULT_LOCALE = "en" as const;

export type Locale = (typeof LOCALES)[number];

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "es";
}

export function parseLocale(value: string | null | undefined): Locale {
  if (isLocale(value)) return value;
  return DEFAULT_LOCALE;
}

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return parseLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value);
}

export function toIntlLocale(locale: Locale) {
  return locale === "es" ? "es-US" : "en-US";
}
