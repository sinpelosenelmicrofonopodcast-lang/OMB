import Image from "next/image";
import Link from "next/link";
import type { Vehicle } from "@/lib/db/types";
import { formatCurrency, formatMileage } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary, translateStatus } from "@/lib/i18n/messages";

type VehicleCardProps = {
  vehicle: Vehicle;
  locale: Locale;
};

function statusTone(status: Vehicle["status"]) {
  if (status === "available") return "success" as const;
  if (status === "pending") return "warning" as const;
  return "muted" as const;
}

export function VehicleCard({ vehicle, locale }: VehicleCardProps) {
  const t = getDictionary(locale);

  return (
    <Card className="overflow-hidden p-0">
      <Link href={`/inventory/${vehicle.slug}`} className="block">
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={
              vehicle.main_image_url ||
              "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80"
            }
            alt={vehicle.title}
            fill
            className="object-cover transition duration-500 hover:scale-105"
          />
          <div className="absolute left-4 top-4 flex gap-2">
            <Badge tone={statusTone(vehicle.status)}>{translateStatus(vehicle.status, locale).toUpperCase()}</Badge>
            {vehicle.featured ? <Badge>{t.vehicleCard.featured}</Badge> : null}
          </div>
        </div>
      </Link>
      <div className="space-y-4 p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold/80">{vehicle.year ?? t.common.year}</p>
          <Link href={`/inventory/${vehicle.slug}`} className="mt-1 block font-heading text-2xl text-softWhite hover:text-gold">
            {vehicle.title}
          </Link>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs text-softWhite/50">{t.common.mileage}</p>
            <p className="text-sm text-softWhite/80">{formatMileage(vehicle.mileage, locale)}</p>
          </div>
          <p className="text-xl font-semibold text-gold">{formatCurrency(vehicle.price, locale)}</p>
        </div>
      </div>
    </Card>
  );
}
