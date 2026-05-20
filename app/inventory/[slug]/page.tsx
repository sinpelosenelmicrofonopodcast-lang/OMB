import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ShareVehicleButtons } from "@/components/share/vehicle-share-buttons";
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

const fallbackVehicleImage = "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1400&q=80";

function absoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ombautosalesandservices.com";
  return new URL(pathOrUrl, baseUrl).toString();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);

  if (!vehicle) {
    return {
      title: "Vehicle Not Found | OMB AUTO SALES"
    };
  }

  const imageUrl = absoluteUrl(vehicle.main_image_url || vehicle.gallery_urls?.[0] || fallbackVehicleImage);
  const title = `${vehicle.title} | OMB AUTO SALES`;
  const description = [
    vehicle.year ? `${vehicle.year}` : null,
    vehicle.make,
    vehicle.model,
    vehicle.price ? `$${vehicle.price.toLocaleString("en-US")}` : null
  ]
    .filter(Boolean)
    .join(" · ");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/inventory/${vehicle.slug}`),
      siteName: "OMB AUTO SALES",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: vehicle.title
        }
      ],
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl]
    }
  };
}

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
          <div className="relative aspect-[4/3] max-h-[78vh] min-h-[360px] overflow-hidden rounded-3xl border border-white/10 bg-black md:min-h-[560px]">
            <Image
              src={gallery[0] || fallbackVehicleImage}
              alt={vehicle.title}
              fill
              className="object-contain p-2"
              sizes="(min-width: 1024px) 58vw, 100vw"
            />
          </div>
          {gallery.length > 1 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {gallery.slice(1).map((imageUrl, index) => (
                <div key={`${imageUrl}-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-black">
                  <Image
                    src={imageUrl}
                    alt={`${vehicle.title} ${index + 2}`}
                    fill
                    className="object-contain p-1"
                    sizes="(min-width: 768px) 18vw, 50vw"
                  />
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

          <ShareVehicleButtons
            title={vehicle.title}
            path={`/inventory/${vehicle.slug}`}
            labels={t.share}
          />
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
