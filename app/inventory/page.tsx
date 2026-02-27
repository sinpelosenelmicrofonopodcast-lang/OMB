import { SectionTitle } from "@/components/layout/section-title";
import { VehicleCard } from "@/components/vehicle-card";
import { Reveal } from "@/components/ui/reveal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getInventory, getVehicleMakes, type InventoryFilters } from "@/lib/db/vehicles";
import { getLocale } from "@/lib/i18n/server-locale";
import { getDictionary, translateStatus } from "@/lib/i18n/messages";

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
  const locale = await getLocale();
  const t = getDictionary(locale);
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
        eyebrow={t.inventory.eyebrow}
        title={t.inventory.title}
        description={t.inventory.description}
      />

      <form className="panel mb-8 grid gap-4 md:grid-cols-6" method="get" action="/inventory">
        <div className="md:col-span-2">
          <label htmlFor="search" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
            {t.common.search}
          </label>
          <Input id="search" name="search" placeholder={t.inventory.searchPlaceholder} defaultValue={filters.search} />
        </div>

        <div>
          <label htmlFor="make" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
            {t.inventory.make}
          </label>
          <Select id="make" name="make" defaultValue={filters.make ?? ""}>
            <option value="">{t.common.all}</option>
            {makes.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label htmlFor="year" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
            {t.common.year}
          </label>
          <Input id="year" name="year" type="number" defaultValue={filters.year} placeholder="2022" />
        </div>

        <div>
          <label htmlFor="minPrice" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
            {t.inventory.minPrice}
          </label>
          <Input id="minPrice" name="minPrice" type="number" defaultValue={filters.minPrice} placeholder="30000" />
        </div>

        <div>
          <label htmlFor="maxPrice" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
            {t.inventory.maxPrice}
          </label>
          <Input id="maxPrice" name="maxPrice" type="number" defaultValue={filters.maxPrice} placeholder="120000" />
        </div>

        <div>
          <label htmlFor="status" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
            {t.common.status}
          </label>
          <Select id="status" name="status" defaultValue={filters.status ?? "all"}>
            <option value="all">{t.common.all}</option>
            <option value="available">{translateStatus("available", locale)}</option>
            <option value="pending">{translateStatus("pending", locale)}</option>
            <option value="sold">{translateStatus("sold", locale)}</option>
          </Select>
        </div>

        <div>
          <label htmlFor="sort" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
            {t.common.sort}
          </label>
          <Select id="sort" name="sort" defaultValue={filters.sort ?? "newest"}>
            <option value="newest">{t.inventory.newest}</option>
            <option value="price_asc">{t.inventory.priceLowToHigh}</option>
            <option value="price_desc">{t.inventory.priceHighToLow}</option>
          </Select>
        </div>

        <div className="flex items-end">
          <button className="w-full rounded-2xl bg-gradient-to-r from-gold to-[#ff9a47] px-4 py-2 text-sm font-semibold text-matteBlack hover:from-cyan hover:to-gold">
            {t.common.applyFilters}
          </button>
        </div>
      </form>

      <p className="mb-6 text-sm text-softWhite/60">
        {inventoryResult.count} {t.inventory.foundSuffix}
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {inventoryResult.vehicles.map((vehicle, index) => (
          <Reveal key={vehicle.id} delayMs={index * 70}>
            <VehicleCard vehicle={vehicle} locale={locale} />
          </Reveal>
        ))}
      </div>

      {inventoryResult.vehicles.length === 0 ? (
        <div className="panel text-center">
          <p className="text-softWhite/70">{t.inventory.noMatches}</p>
        </div>
      ) : null}
    </section>
  );
}
