import Link from "next/link";
import { StatsGrid } from "@/components/admin/stats-grid";
import { getAdminDashboardStats } from "@/lib/db/admin";
import { getInventory } from "@/lib/db/vehicles";
import { formatCurrency } from "@/lib/utils";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const [stats, inventoryResult] = await Promise.all([
    getAdminDashboardStats(),
    getInventory({ includeUnpublished: true, sort: "newest" })
  ]);

  const latestVehicles = inventoryResult.vehicles.slice(0, 5);
  const message = first(resolvedSearchParams.message);

  return (
    <div className="space-y-6">
      {message ? (
        <p className="rounded-2xl border border-gold/30 bg-gold/10 px-4 py-2 text-sm text-gold/90">{message}</p>
      ) : null}

      <StatsGrid {...stats} />

      <div className="panel">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-3xl text-softWhite">Recent Inventory Updates</h2>
          <Link href="/admin/inventory" className="text-sm text-gold hover:underline">
            Manage Inventory
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-softWhite/60">
              <tr className="border-b border-white/10">
                <th className="py-2">Title</th>
                <th className="py-2">Price</th>
                <th className="py-2">Status</th>
                <th className="py-2">Updated</th>
              </tr>
            </thead>
            <tbody>
              {latestVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="border-b border-white/5 text-softWhite/85">
                  <td className="py-3">
                    <Link href={`/admin/inventory/${vehicle.id}/edit`} className="hover:text-gold">
                      {vehicle.title}
                    </Link>
                  </td>
                  <td className="py-3">{formatCurrency(vehicle.price)}</td>
                  <td className="py-3 capitalize">{vehicle.status}</td>
                  <td className="py-3">{new Date(vehicle.updated_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {latestVehicles.length === 0 ? (
            <p className="py-4 text-sm text-softWhite/60">No vehicles yet. Add your first listing.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
