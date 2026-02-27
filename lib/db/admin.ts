import { createClient } from "@/lib/supabase/server";

export async function getAdminDashboardStats() {
  const supabase = await createClient();

  const [totalVehicles, availableVehicles, soldVehicles, recentLeads] = await Promise.all([
    supabase.from("vehicles").select("id", { count: "exact", head: true }),
    supabase.from("vehicles").select("id", { count: "exact", head: true }).eq("status", "available"),
    supabase.from("vehicles").select("id", { count: "exact", head: true }).eq("status", "sold"),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
  ]);

  if (totalVehicles.error) throw totalVehicles.error;
  if (availableVehicles.error) throw availableVehicles.error;
  if (soldVehicles.error) throw soldVehicles.error;
  if (recentLeads.error) throw recentLeads.error;

  return {
    totalVehicles: totalVehicles.count ?? 0,
    availableVehicles: availableVehicles.count ?? 0,
    soldVehicles: soldVehicles.count ?? 0,
    recentLeads: recentLeads.count ?? 0
  };
}
