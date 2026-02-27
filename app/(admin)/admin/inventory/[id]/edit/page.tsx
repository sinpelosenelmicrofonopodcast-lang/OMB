import { notFound } from "next/navigation";
import { VehicleForm } from "@/components/admin/vehicle-form";
import { updateVehicleAction } from "@/actions/vehicle-actions";
import { getVehicleById } from "@/lib/db/vehicles";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/messages";

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
    <VehicleForm
      title={`${t.admin.vehicleForm.editPrefix} ${vehicle.title}`}
      submitLabel={t.admin.vehicleForm.saveChanges}
      action={updateVehicleAction}
      vehicle={vehicle}
      message={message}
      locale={locale}
    />
  );
}
