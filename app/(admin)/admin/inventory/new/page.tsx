import { VehicleForm } from "@/components/admin/vehicle-form";
import { createVehicleAction } from "@/actions/vehicle-actions";

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

  return <VehicleForm title="Add Vehicle" submitLabel="Create Vehicle" action={createVehicleAction} message={message} />;
}
