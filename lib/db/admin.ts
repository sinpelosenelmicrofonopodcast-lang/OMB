import { createClient } from "@/lib/supabase/server";
import { getInventory } from "@/lib/db/vehicles";

export async function getAdminDashboardStats() {
  const supabase = await createClient();
  const [inventory, recentLeads] = await Promise.all([
    getInventory({ includeUnpublished: true }),
    supabase.from("leads").select("id", { count: "exact", head: true })
      .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
  ]);
  if (recentLeads.error) throw recentLeads.error;
  return {
    totalVehicles: inventory.vehicles.length,
    availableVehicles: inventory.vehicles.filter(v => v.status === "available").length,
    soldVehicles: inventory.vehicles.filter(v => v.status === "sold").length,
    recentLeads: recentLeads.count ?? 0
  };
}
