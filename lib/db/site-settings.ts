import { createClient } from "@/lib/supabase/server";
import { cache } from "react";
import type { Database } from "@/lib/db/types";
import type { Locale } from "@/lib/i18n/locale";

export type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];

function fallbackSettings(locale: Locale): SiteSettings {
  return {
    id: 1,
    business_name: "OMB AUTO SALES",
    phone: "(254) 393-5554",
    address: "710 W Veterans Memorial Blvd, Killeen, TX 76541",
    hours_text: locale === "es" ? "Lun-Sáb 9:00 AM - 7:00 PM" : "Mon-Sat 9:00 AM - 7:00 PM",
    hero_headline:
      locale === "es"
        ? "Lujo, rendimiento y confianza en cada milla."
        : "Luxury, performance, and trust in every mile.",
    hero_subheadline:
      locale === "es"
        ? "Descubre un inventario seleccionado de vehículos premium en OMB AUTO SALES."
        : "Discover a curated inventory of premium vehicles at OMB AUTO SALES.",
    hero_bg_url:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
    updated_at: new Date().toISOString()
  };
}

const getPublicSiteSettingsCached = cache(async (locale: Locale) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (!data) return fallbackSettings(locale);

  if (locale === "es") {
    const next = { ...data };

    if (next.hero_headline === "Luxury, performance, and trust in every mile.") {
      next.hero_headline = "Lujo, rendimiento y confianza en cada milla.";
    }
    if (next.hero_subheadline === "Discover a curated inventory of premium vehicles at OMB AUTO SALES.") {
      next.hero_subheadline = "Descubre un inventario seleccionado de vehículos premium en OMB AUTO SALES.";
    }
    if (next.hours_text === "Mon-Sat 9:00 AM - 7:00 PM") {
      next.hours_text = "Lun-Sáb 9:00 AM - 7:00 PM";
    }

    return next;
  }

  return data;
});

export async function getPublicSiteSettings(locale: Locale = "en") {
  return getPublicSiteSettingsCached(locale);
}

const getAdminSiteSettingsCached = cache(async (locale: Locale) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  return data ?? fallbackSettings(locale);
});

export async function getAdminSiteSettings(locale: Locale = "en") {
  return getAdminSiteSettingsCached(locale);
}
