import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createLeadAction } from "@/actions/lead-actions";
import { getPublicSiteSettings } from "@/lib/db/site-settings";
import { getPublicVehicleById } from "@/lib/db/vehicles";

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

  const [settings, vehicle] = await Promise.all([
    getPublicSiteSettings(),
    vehicleId ? getPublicVehicleById(vehicleId) : Promise.resolve(null)
  ]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-8">
      <div className="mb-10 grid gap-8 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold/80">Contact</p>
          <h1 className="mt-4 font-heading text-5xl text-softWhite">Let’s Talk Luxury</h1>
          <p className="mt-4 text-softWhite/75">
            Request pricing, financing options, or a showroom appointment. Our team responds quickly.
          </p>

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
            Call Now
          </a>
        </div>

        <div className="panel">
          {submitted ? (
            <div className="mb-5 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-300">
              Inquiry received. Our team will contact you shortly.
            </div>
          ) : null}
          {message ? (
            <div className="mb-5 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-300">
              {message}
            </div>
          ) : null}

          {vehicle ? (
            <div className="mb-5 rounded-2xl border border-gold/35 bg-gold/10 p-4 text-sm text-gold/90">
              Inquiry linked to: <strong>{vehicle.title}</strong>
              <Link href={`/inventory/${vehicle.slug}`} className="ml-2 underline">
                view vehicle
              </Link>
            </div>
          ) : null}

          <form action={createLeadAction} className="space-y-4">
            <input type="hidden" name="vehicle_id" value={vehicle?.id ?? ""} />
            <div>
              <label htmlFor="name" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
                Name
              </label>
              <Input id="name" name="name" required />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
                Email
              </label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div>
              <label htmlFor="phone" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
                Phone
              </label>
              <Input id="phone" name="phone" />
            </div>
            <div>
              <label htmlFor="message" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
                Message
              </label>
              <Textarea id="message" name="message" rows={5} placeholder="Tell us what you are looking for..." />
            </div>
            <button className="w-full rounded-2xl bg-gradient-to-r from-gold to-[#ff9a47] px-4 py-2 text-sm font-semibold text-matteBlack hover:from-cyan hover:to-gold">
              Send Inquiry
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
