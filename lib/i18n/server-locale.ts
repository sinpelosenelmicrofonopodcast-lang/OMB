import { cookies } from "next/headers";
import type { Locale } from "@/lib/i18n/locale";
import { LOCALE_COOKIE_NAME, parseLocale } from "@/lib/i18n/locale";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return parseLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value);
}
