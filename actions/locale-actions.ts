"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { LOCALE_COOKIE_NAME, parseLocale } from "@/lib/i18n/locale";

export async function setLocaleAction(formData: FormData) {
  const nextLocale = parseLocale(formData.get("locale")?.toString());

  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE_NAME, nextLocale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365
  });

  const requestHeaders = await headers();
  const referer = requestHeaders.get("referer") ?? "/";
  redirect(referer);
}
