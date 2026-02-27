import { createClient } from "@/lib/supabase/server";

export async function getAdminLeads() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*, vehicles(title, slug)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
