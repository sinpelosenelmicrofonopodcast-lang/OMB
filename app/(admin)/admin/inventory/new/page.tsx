import { VehicleForm } from "@/components/admin/vehicle-form";
import { createVehicleAction } from "@/actions/vehicle-actions";
import { getLocale } from "@/lib/i18n/server-locale";
import { getDictionary } from "@/lib/i18n/messages";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function NewVehiclePage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const message = first(resolvedSearchParams.message);
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <VehicleForm
      title={t.admin.vehicleForm.addVehicle}
      submitLabel={t.admin.vehicleForm.createVehicle}
      action={createVehicleAction}
      message={message}
      locale={locale}
    />
  );
}
