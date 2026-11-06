"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  ensureAdmin,
  getOptionalText,
  getText,
  normalizeErrorMessage,
  rethrowIfRedirectError
} from "@/actions/_helpers";

export async function createLeadAction(formData: FormData) {
  try {
    const supabase = await createClient();
    const name = getText(formData, "name");
    const email = getText(formData, "email");
    const phone = getOptionalText(formData, "phone");
    const message = getOptionalText(formData, "message");
    const vehicleTitle = getOptionalText(formData, "vehicle_title");
    // HGM Sheet row IDs are not Supabase vehicle foreign keys.
    const combined = [vehicleTitle ? 'Vehicle inquiry: ' + vehicleTitle : null, message].filter(Boolean).join("\n\n") || null;
    if (!name || !email) redirect("/contact?message=Name%20and%20email%20are%20required");
    const { error } = await supabase.from("leads").insert({
      name, email, phone, message: combined, vehicle_id: null, source: "website"
    });
    if (error) throw error;
    revalidatePath("/admin/leads");
    redirect("/contact?submitted=1");
  } catch (error) {
    rethrowIfRedirectError(error);
    redirect('/contact?message=' + encodeURIComponent(normalizeErrorMessage(error, "Unable to submit inquiry.")));
  }
}

export async function deleteLeadAction(formData: FormData) {
  const id = getText(formData, "id");
  const { supabase } = await ensureAdmin();
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/leads");
  redirect("/admin/leads?message=Lead%20deleted");
}
