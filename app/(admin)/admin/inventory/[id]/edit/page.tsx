import { notFound } from "next/navigation";
import { VehicleForm } from "@/components/admin/vehicle-form";
import { updateVehicleAction } from "@/actions/vehicle-actions";
import { getVehicleById } from "@/lib/db/vehicles";

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
  const vehicle = await getVehicleById(id);
  if (!vehicle) notFound();

  const message = first(resolvedSearchParams.message);

  return (
    <VehicleForm
      title={`Edit Vehicle: ${vehicle.title}`}
      submitLabel="Save Changes"
      action={updateVehicleAction}
      vehicle={vehicle}
      message={message}
    />
  );
}
