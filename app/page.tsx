import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/layout/section-title";
import { VehicleCard } from "@/components/vehicle-card";
import { getPublicSiteSettings } from "@/lib/db/site-settings";
import { getFeaturedVehicles } from "@/lib/db/vehicles";
import { getPublishedTestimonials } from "@/lib/db/testimonials";

const features = [
  {
    title: "Curated Luxury Inventory",
    description: "Hand-selected sedans, SUVs, and performance vehicles from trusted brands."
  },
  {
    title: "Transparent Purchase Process",
    description: "Clear pricing, complete vehicle disclosures, and straightforward financing support."
  },
  {
    title: "Local, Relationship-Driven Service",
    description: "Personalized attention from first visit to long-term ownership support."
  }
];

export default async function HomePage() {
  const [settings, featuredVehicles, testimonials] = await Promise.all([
    getPublicSiteSettings(),
    getFeaturedVehicles(3),
    getPublishedTestimonials(3)
  ]);

  return (
    <div>
      <section
        className="relative overflow-hidden border-b border-white/10"
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(0,0,0,0.75), rgba(0,0,0,0.4)), url(${settings.hero_bg_url})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-28 md:px-8 md:py-36">
          <Reveal className="max-w-3xl space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-gold/80">Premium Automotive Experience</p>
            <h1 className="font-heading text-5xl leading-tight text-softWhite md:text-7xl">{settings.hero_headline}</h1>
            <p className="max-w-2xl text-base text-softWhite/75 md:text-lg">{settings.hero_subheadline}</p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/inventory"
                className="rounded-2xl bg-gradient-to-r from-gold to-[#ff9a47] px-6 py-3 text-sm font-semibold text-matteBlack transition hover:from-cyan hover:to-gold"
              >
                Explore Inventory
              </Link>
              <a
                href={`tel:${settings.phone?.replace(/[^\d+]/g, "")}`}
                className="rounded-2xl border border-white/30 px-6 py-3 text-sm text-softWhite transition hover:border-gold/60 hover:text-gold"
              >
                Call {settings.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-8">
        <SectionTitle
          eyebrow="Featured"
          title="Featured Vehicles"
          description="A rotating showcase of high-demand luxury inventory available now."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredVehicles.map((vehicle, index) => (
            <Reveal key={vehicle.id} delayMs={index * 120}>
              <VehicleCard vehicle={vehicle} />
            </Reveal>
          ))}
          {featuredVehicles.length === 0 ? (
            <Card>
              <p className="text-softWhite/70">No featured vehicles are published yet.</p>
            </Card>
          ) : null}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-4 md:px-8">
        <SectionTitle
          eyebrow="Why OMB"
          title="Luxury Standards, Local Trust"
          description="Every part of our process is designed for confidence, discretion, and premium value."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <Reveal key={feature.title} delayMs={index * 100}>
              <Card className="h-full">
                <h3 className="font-heading text-2xl text-softWhite">{feature.title}</h3>
                <p className="mt-4 text-sm text-softWhite/70">{feature.description}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-4 md:px-8">
        <div className="grid gap-8 rounded-3xl border border-gold/20 bg-gradient-to-r from-charcoal to-[#111111] p-8 md:grid-cols-2 md:p-12">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-gold/80">About OMB AUTO SALES</p>
            <h2 className="mt-4 font-heading text-4xl text-softWhite">Driven by quality. Built on trust.</h2>
            <p className="mt-4 text-softWhite/70">
              OMB AUTO SALES is a Killeen-based dealership focused on luxury and performance vehicles with transparent,
              relationship-first service.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-block rounded-2xl border border-white/20 px-5 py-2 text-sm text-softWhite hover:border-gold/60 hover:text-gold"
            >
              Learn More
            </Link>
          </div>
          <div className="space-y-3 rounded-2xl border border-white/10 bg-black/25 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-gold/80">Location & Contact</p>
            <p className="text-softWhite/80">{settings.address}</p>
            <p className="text-softWhite/80">{settings.phone}</p>
            <p className="text-softWhite/70">{settings.hours_text}</p>
            <Link
              href="/contact"
              className="mt-2 inline-block rounded-2xl bg-gradient-to-r from-gold to-[#ff9a47] px-5 py-2 text-sm font-semibold text-matteBlack hover:from-cyan hover:to-gold"
            >
              Schedule a Visit
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-4 pb-10 md:px-8">
        <SectionTitle eyebrow="Testimonials" title="Client Experiences" />
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <Reveal key={item.id} delayMs={index * 90}>
              <Card className="h-full">
                <p className="text-gold">{"★".repeat(Math.max(1, Math.min(item.rating, 5)))}</p>
                <p className="mt-4 text-sm leading-relaxed text-softWhite/75">“{item.quote}”</p>
                <p className="mt-5 text-sm text-softWhite">{item.name}</p>
              </Card>
            </Reveal>
          ))}
          {testimonials.length === 0 ? (
            <Card>
              <p className="text-softWhite/70">Testimonials will appear here once published in admin.</p>
            </Card>
          ) : null}
        </div>
      </section>
    </div>
  );
}
