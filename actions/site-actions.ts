"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ensureAdmin, getOptionalText, normalizeErrorMessage, rethrowIfRedirectError } from "@/actions/_helpers";

export async function updateSiteSettingsAction(formData: FormData) {
  try {
    const { supabase } = await ensureAdmin();

    const payload = {
      business_name: getOptionalText(formData, "business_name"),
      phone: getOptionalText(formData, "phone"),
      address: getOptionalText(formData, "address"),
      hours_text: getOptionalText(formData, "hours_text"),
      hero_headline: getOptionalText(formData, "hero_headline"),
      hero_subheadline: getOptionalText(formData, "hero_subheadline"),
      hero_bg_url: getOptionalText(formData, "hero_bg_url")
    };

    const { error } = await supabase.from("site_settings").upsert({ id: 1, ...payload }, { onConflict: "id" });
    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");
    revalidatePath("/admin/site");

    redirect("/admin/site?message=Site%20settings%20saved");
  } catch (error) {
    rethrowIfRedirectError(error);
    redirect(`/admin/site?message=${encodeURIComponent(normalizeErrorMessage(error, "Failed to save site settings."))}`);
  }
}
