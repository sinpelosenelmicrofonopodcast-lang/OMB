import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getPublicSiteSettings } from "@/lib/db/site-settings";
import { getVehicleBySlug } from "@/lib/db/vehicles";
import { formatCurrency, formatMileage } from "@/lib/utils";
import { getLocale } from "@/lib/i18n/server-locale";
import { getDictionary, translateStatus } from "@/lib/i18n/messages";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function VehicleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = getDictionary(locale);
  const [vehicle, settings] = await Promise.all([getVehicleBySlug(slug), getPublicSiteSettings(locale)]);

  if (!vehicle) notFound();

  const gallery = [vehicle.main_image_url, ...(vehicle.gallery_urls ?? [])].filter(Boolean) as string[];
  const specs = typeof vehicle.specs === "object" && vehicle.specs && !Array.isArray(vehicle.specs) ? vehicle.specs : {};

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Badge tone={vehicle.status === "available" ? "success" : vehicle.status === "pending" ? "warning" : "muted"}>
          {translateStatus(vehicle.status, locale).toUpperCase()}
        </Badge>
        {vehicle.featured ? <Badge>{t.vehicleDetail.featured}</Badge> : null}
      </div>

      <h1 className="font-heading text-4xl text-softWhite md:text-6xl">{vehicle.title}</h1>
      <p className="mt-4 text-xl text-gold">{formatCurrency(vehicle.price, locale)}</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          <div className="relative h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-charcoal">
            <Image
              src={
                gallery[0] ||
                "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1400&q=80"
              }
              alt={vehicle.title}
              fill
              className="object-cover"
            />
          </div>
          {gallery.length > 1 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {gallery.slice(1).map((imageUrl, index) => (
                <div key={`${imageUrl}-${index}`} className="relative h-28 overflow-hidden rounded-2xl border border-white/10">
                  <Image src={imageUrl} alt={`${vehicle.title} ${index + 2}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="panel space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-softWhite/55">{t.vehicleDetail.overview}</p>
            <div className="mt-3 grid grid-cols-2 gap-y-3 text-sm text-softWhite/80">
              <span>
                {t.common.year}: {vehicle.year ?? t.common.na}
              </span>
              <span>
                {t.vehicleDetail.make}: {vehicle.make ?? t.common.na}
              </span>
              <span>
                {t.vehicleDetail.model}: {vehicle.model ?? t.common.na}
              </span>
              <span>
                {t.vehicleDetail.trim}: {vehicle.trim ?? t.common.na}
              </span>
              <span>
                {t.common.mileage}: {formatMileage(vehicle.mileage, locale)}
              </span>
              <span>
                {t.vehicleDetail.vin}: {vehicle.vin ?? t.common.na}
              </span>
              <span>
                {t.vehicleDetail.drivetrain}: {vehicle.drivetrain ?? t.common.na}
              </span>
              <span>
                {t.vehicleDetail.transmission}: {vehicle.transmission ?? t.common.na}
              </span>
              <span>
                {t.vehicleDetail.fuelType}: {vehicle.fuel_type ?? t.common.na}
              </span>
              <span>
                {t.vehicleDetail.color}: {vehicle.color ?? t.common.na}
              </span>
            </div>
          </div>

          {vehicle.highlights.length > 0 ? (
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-softWhite/55">{t.vehicleDetail.highlights}</p>
              <ul className="mt-3 space-y-2 text-sm text-softWhite/80">
                {vehicle.highlights.map((item: string) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <a
              href={`tel:${settings.phone?.replace(/[^\d+]/g, "")}`}
              className="rounded-2xl bg-gradient-to-r from-gold to-[#ff9a47] px-5 py-2 text-sm font-semibold text-matteBlack hover:from-cyan hover:to-gold"
            >
              {t.vehicleDetail.callNow}
            </a>
            <Link
              href={`/contact?vehicleId=${vehicle.id}`}
              className="rounded-2xl border border-white/20 px-5 py-2 text-sm text-softWhite hover:border-gold/60 hover:text-gold"
            >
              {t.vehicleDetail.contactVehicle}
            </Link>
          </div>
        </div>
      </div>

      {vehicle.description ? (
        <div className="panel mt-10">
          <p className="text-xs uppercase tracking-[0.2em] text-softWhite/55">{t.vehicleDetail.description}</p>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-softWhite/80">{vehicle.description}</p>
        </div>
      ) : null}

      {Object.keys(specs).length > 0 ? (
        <div className="panel mt-8">
          <p className="text-xs uppercase tracking-[0.2em] text-softWhite/55">{t.vehicleDetail.additionalSpecs}</p>
          <div className="mt-3 grid gap-2 text-sm text-softWhite/80 md:grid-cols-2">
            {Object.entries(specs).map(([key, value]) => (
              <p key={key}>
                <span className="text-softWhite/55">{key}:</span> {String(value)}
              </p>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
