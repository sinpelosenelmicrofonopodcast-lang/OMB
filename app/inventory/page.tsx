import { SectionTitle } from "@/components/layout/section-title";
import { VehicleCard } from "@/components/vehicle-card";
import { Reveal } from "@/components/ui/reveal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getInventory, getVehicleMakes, type InventoryFilters } from "@/lib/db/vehicles";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseNumber(value: string | undefined) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export default async function InventoryPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const filters: InventoryFilters = {
    search: first(resolvedSearchParams.search),
    make: first(resolvedSearchParams.make),
    year: parseNumber(first(resolvedSearchParams.year)),
    minPrice: parseNumber(first(resolvedSearchParams.minPrice)),
    maxPrice: parseNumber(first(resolvedSearchParams.maxPrice)),
    sort: (first(resolvedSearchParams.sort) as InventoryFilters["sort"]) ?? "newest",
    status: (first(resolvedSearchParams.status) as InventoryFilters["status"]) ?? "all"
  };

  const [inventoryResult, makes] = await Promise.all([getInventory(filters), getVehicleMakes()]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <SectionTitle
        eyebrow="Inventory"
        title="Luxury Inventory"
        description="Search and filter current inventory by make, year, price range, and availability."
      />

      <form className="panel mb-8 grid gap-4 md:grid-cols-6" method="get" action="/inventory">
        <div className="md:col-span-2">
          <label htmlFor="search" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
            Search
          </label>
          <Input id="search" name="search" placeholder="Mercedes, BMW, GLE..." defaultValue={filters.search} />
        </div>

        <div>
          <label htmlFor="make" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
            Make
          </label>
          <Select id="make" name="make" defaultValue={filters.make ?? ""}>
            <option value="">All</option>
            {makes.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label htmlFor="year" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
            Year
          </label>
          <Input id="year" name="year" type="number" defaultValue={filters.year} placeholder="2022" />
        </div>

        <div>
          <label htmlFor="minPrice" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
            Min Price
          </label>
          <Input id="minPrice" name="minPrice" type="number" defaultValue={filters.minPrice} placeholder="30000" />
        </div>

        <div>
          <label htmlFor="maxPrice" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
            Max Price
          </label>
          <Input id="maxPrice" name="maxPrice" type="number" defaultValue={filters.maxPrice} placeholder="120000" />
        </div>

        <div>
          <label htmlFor="status" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
            Status
          </label>
          <Select id="status" name="status" defaultValue={filters.status ?? "all"}>
            <option value="all">All</option>
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
          </Select>
        </div>

        <div>
          <label htmlFor="sort" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
            Sort
          </label>
          <Select id="sort" name="sort" defaultValue={filters.sort ?? "newest"}>
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </Select>
        </div>

        <div className="flex items-end">
          <button className="w-full rounded-2xl bg-gradient-to-r from-gold to-[#ff9a47] px-4 py-2 text-sm font-semibold text-matteBlack hover:from-cyan hover:to-gold">
            Apply Filters
          </button>
        </div>
      </form>

      <p className="mb-6 text-sm text-softWhite/60">{inventoryResult.count} vehicles found</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {inventoryResult.vehicles.map((vehicle, index) => (
          <Reveal key={vehicle.id} delayMs={index * 70}>
            <VehicleCard vehicle={vehicle} />
          </Reveal>
        ))}
      </div>

      {inventoryResult.vehicles.length === 0 ? (
        <div className="panel text-center">
          <p className="text-softWhite/70">No vehicles matched your filters. Adjust criteria and try again.</p>
        </div>
      ) : null}
    </section>
  );
}
