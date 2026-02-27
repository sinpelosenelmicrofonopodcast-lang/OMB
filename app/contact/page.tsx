import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createLeadAction } from "@/actions/lead-actions";
import { getPublicSiteSettings } from "@/lib/db/site-settings";
import { getPublicVehicleById } from "@/lib/db/vehicles";
import { getLocale } from "@/lib/i18n/server-locale";
import { getDictionary, translateUiMessage } from "@/lib/i18n/messages";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function ContactPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const vehicleId = first(resolvedSearchParams.vehicleId);
  const submitted = first(resolvedSearchParams.submitted) === "1";
  const message = first(resolvedSearchParams.message);
  const locale = await getLocale();
  const t = getDictionary(locale);

  const [settings, vehicle] = await Promise.all([
    getPublicSiteSettings(locale),
    vehicleId ? getPublicVehicleById(vehicleId) : Promise.resolve(null)
  ]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-8">
      <div className="mb-10 grid gap-8 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold/80">{t.contact.eyebrow}</p>
          <h1 className="mt-4 font-heading text-5xl text-softWhite">{t.contact.title}</h1>
          <p className="mt-4 text-softWhite/75">{t.contact.description}</p>

          <div className="mt-8 space-y-3 text-softWhite/80">
            <p>{settings.business_name}</p>
            <p>{settings.address}</p>
            <p>{settings.phone}</p>
            <p>{settings.hours_text}</p>
          </div>

          <a
            href={`tel:${settings.phone?.replace(/[^\d+]/g, "")}`}
            className="mt-6 inline-block rounded-2xl bg-gradient-to-r from-gold to-[#ff9a47] px-5 py-2 text-sm font-semibold text-matteBlack hover:from-cyan hover:to-gold"
          >
            {t.contact.callNow}
          </a>
        </div>

        <div className="panel">
          {submitted ? (
            <div className="mb-5 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-300">
              {t.contact.submitted}
            </div>
          ) : null}
          {message ? (
            <div className="mb-5 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-300">
              {translateUiMessage(message, locale)}
            </div>
          ) : null}

          {vehicle ? (
            <div className="mb-5 rounded-2xl border border-gold/35 bg-gold/10 p-4 text-sm text-gold/90">
              {t.contact.linkedTo} <strong>{vehicle.title}</strong>
              <Link href={`/inventory/${vehicle.slug}`} className="ml-2 underline">
                {t.contact.viewVehicle}
              </Link>
            </div>
          ) : null}

          <form action={createLeadAction} className="space-y-4">
            <input type="hidden" name="vehicle_id" value={vehicle?.id ?? ""} />
            <div>
              <label htmlFor="name" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
                {t.contact.name}
              </label>
              <Input id="name" name="name" required />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
                {t.contact.email}
              </label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div>
              <label htmlFor="phone" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
                {t.contact.phone}
              </label>
              <Input id="phone" name="phone" />
            </div>
            <div>
              <label htmlFor="message" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
                {t.contact.message}
              </label>
              <Textarea id="message" name="message" rows={5} placeholder={t.contact.messagePlaceholder} />
            </div>
            <button className="w-full rounded-2xl bg-gradient-to-r from-gold to-[#ff9a47] px-4 py-2 text-sm font-semibold text-matteBlack hover:from-cyan hover:to-gold">
              {t.contact.sendInquiry}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
