import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/db/types";

export type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];

const fallbackSettings: SiteSettings = {
  id: 1,
  business_name: "OMB AUTO SALES",
  phone: "(254) 393-5554",
  address: "710 W Veterans Memorial Blvd, Killeen, TX 76541",
  hours_text: "Mon-Sat 9:00 AM - 7:00 PM",
  hero_headline: "Luxury, performance, and trust in every mile.",
  hero_subheadline: "Discover a curated inventory of premium vehicles at OMB AUTO SALES.",
  hero_bg_url:
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
  updated_at: new Date().toISOString()
};

export async function getPublicSiteSettings() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  return data ?? fallbackSettings;
}

export async function getAdminSiteSettings() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  return data ?? fallbackSettings;
}
