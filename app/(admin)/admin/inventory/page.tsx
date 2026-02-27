import Link from "next/link";
import {
  deleteVehicleAction,
  markVehicleSoldAction,
  toggleVehicleFeaturedAction,
  toggleVehiclePublishedAction
} from "@/actions/vehicle-actions";
import { getInventory } from "@/lib/db/vehicles";
import { formatCurrency } from "@/lib/utils";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function AdminInventoryPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const message = first(resolvedSearchParams.message);
  const search = first(resolvedSearchParams.search);
  const inventory = await getInventory({ includeUnpublished: true, sort: "newest", search });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-4xl text-softWhite">Inventory Manager</h1>
          <p className="text-sm text-softWhite/65">{inventory.count} vehicles</p>
        </div>
        <Link href="/admin/inventory/new" className="rounded-xl bg-gold px-4 py-2 text-sm font-semibold text-matteBlack">
          Add Vehicle
        </Link>
      </div>

      {message ? (
        <p className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-2 text-sm text-gold/90">{message}</p>
      ) : null}

      <form className="panel flex flex-wrap items-end gap-3" method="get" action="/admin/inventory">
        <div>
          <label htmlFor="search" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
            Search
          </label>
          <input
            id="search"
            name="search"
            defaultValue={search ?? ""}
            placeholder="Search title, make, model"
            className="rounded-xl border border-white/15 bg-charcoal px-3 py-2 text-sm text-softWhite outline-none focus:border-cyan/60"
          />
        </div>
        <button className="rounded-xl border border-white/20 px-4 py-2 text-sm text-softWhite hover:border-gold/60 hover:text-gold">
          Filter
        </button>
      </form>

      <div className="panel overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="text-softWhite/60">
            <tr className="border-b border-white/10">
              <th className="py-2">Title</th>
              <th className="py-2">Price</th>
              <th className="py-2">Status</th>
              <th className="py-2">Featured</th>
              <th className="py-2">Published</th>
              <th className="py-2">Updated</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="border-b border-white/5 align-top text-softWhite/85">
                <td className="py-3">
                  <Link href={`/admin/inventory/${vehicle.id}/edit`} className="font-medium hover:text-gold">
                    {vehicle.title}
                  </Link>
                  <p className="text-xs text-softWhite/45">/{vehicle.slug}</p>
                </td>
                <td className="py-3">{formatCurrency(vehicle.price)}</td>
                <td className="py-3 capitalize">{vehicle.status}</td>
                <td className="py-3">{vehicle.featured ? "Yes" : "No"}</td>
                <td className="py-3">{vehicle.published ? "Yes" : "No"}</td>
                <td className="py-3">{new Date(vehicle.updated_at).toLocaleDateString()}</td>
                <td className="py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/inventory/${vehicle.id}/edit`}
                      className="rounded-lg border border-white/20 px-2.5 py-1 text-xs hover:border-gold/50 hover:text-gold"
                    >
                      Edit
                    </Link>

                    <form action={markVehicleSoldAction}>
                      <input type="hidden" name="id" value={vehicle.id} />
                      <button className="rounded-lg border border-white/20 px-2.5 py-1 text-xs hover:border-gold/50 hover:text-gold">
                        Mark Sold
                      </button>
                    </form>

                    <form action={toggleVehicleFeaturedAction}>
                      <input type="hidden" name="id" value={vehicle.id} />
                      <input type="hidden" name="next_featured" value={String(!vehicle.featured)} />
                      <button className="rounded-lg border border-white/20 px-2.5 py-1 text-xs hover:border-gold/50 hover:text-gold">
                        {vehicle.featured ? "Unfeature" : "Feature"}
                      </button>
                    </form>

                    <form action={toggleVehiclePublishedAction}>
                      <input type="hidden" name="id" value={vehicle.id} />
                      <input type="hidden" name="next_published" value={String(!vehicle.published)} />
                      <button className="rounded-lg border border-white/20 px-2.5 py-1 text-xs hover:border-gold/50 hover:text-gold">
                        {vehicle.published ? "Unpublish" : "Publish"}
                      </button>
                    </form>

                    <form action={deleteVehicleAction}>
                      <input type="hidden" name="id" value={vehicle.id} />
                      <input type="hidden" name="slug" value={vehicle.slug} />
                      <button className="rounded-lg border border-red-500/40 px-2.5 py-1 text-xs text-red-300 hover:bg-red-500/10">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {inventory.vehicles.length === 0 ? (
          <p className="py-4 text-sm text-softWhite/60">No vehicles found.</p>
        ) : null}
      </div>
    </div>
  );
}
