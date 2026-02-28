import { notFound } from "next/navigation";
import { VehicleForm } from "@/components/admin/vehicle-form";
import { updateVehicleAction } from "@/actions/vehicle-actions";
import { verifyVehicleVinAction } from "@/actions/vin-actions";
import { getVehicleById } from "@/lib/db/vehicles";
import { getLocale } from "@/lib/i18n/server-locale";
import { getDictionary } from "@/lib/i18n/messages";
import { buildCarfaxUrl } from "@/lib/vin";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function EditVehiclePage({ params, searchParams }: PageProps) {
  const [{ id }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const locale = await getLocale();
  const t = getDictionary(locale);
  const vehicle = await getVehicleById(id);
  if (!vehicle) notFound();

  const message = first(resolvedSearchParams.message);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-end gap-2">
        <form action={verifyVehicleVinAction}>
          <input type="hidden" name="id" value={vehicle.id} />
          <input type="hidden" name="vin" value={vehicle.vin ?? ""} />
          <input type="hidden" name="return_to" value={`/admin/inventory/${vehicle.id}/edit`} />
          <button
            disabled={!vehicle.vin}
            className="rounded-lg border border-cyan/45 px-3 py-1.5 text-xs font-medium text-cyan hover:border-cyan hover:bg-cyan/10 disabled:cursor-not-allowed disabled:border-white/15 disabled:text-softWhite/40"
          >
            {t.admin.inventory.verifyVin}
          </button>
        </form>

        {vehicle.vin ? (
          <a
            href={buildCarfaxUrl(vehicle.vin) ?? undefined}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-lg border border-gold/45 px-3 py-1.5 text-xs font-medium text-gold hover:border-gold hover:bg-gold/10"
          >
            {t.admin.inventory.carfax}
          </a>
        ) : (
          <span className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium text-softWhite/40">
            {t.admin.inventory.carfax}
          </span>
        )}

        <a
          href={`/api/admin/vehicles/${vehicle.id}/pdf?lang=${locale}`}
          className="rounded-lg border border-cyan/45 px-3 py-1.5 text-xs font-medium text-cyan hover:border-cyan hover:bg-cyan/10"
        >
          {t.admin.inventory.downloadPdf}
        </a>
      </div>

      <VehicleForm
        title={`${t.admin.vehicleForm.editPrefix} ${vehicle.title}`}
        submitLabel={t.admin.vehicleForm.saveChanges}
        action={updateVehicleAction}
        vehicle={vehicle}
        message={message}
        locale={locale}
      />
    </div>
  );
}
