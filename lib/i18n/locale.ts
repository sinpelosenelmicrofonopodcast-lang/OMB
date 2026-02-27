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

export function toIntlLocale(locale: Locale) {
  return locale === "es" ? "es-US" : "en-US";
}
