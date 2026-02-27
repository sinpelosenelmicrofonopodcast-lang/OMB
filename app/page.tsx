import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/layout/section-title";
import { VehicleCard } from "@/components/vehicle-card";
import { getPublicSiteSettings } from "@/lib/db/site-settings";
import { getFeaturedVehicles } from "@/lib/db/vehicles";
import { getPublishedTestimonials } from "@/lib/db/testimonials";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/messages";

export default async function HomePage() {
  const locale = await getLocale();
  const t = getDictionary(locale);

  const [settings, featuredVehicles, testimonials] = await Promise.all([
    getPublicSiteSettings(locale),
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
            <p className="text-xs uppercase tracking-[0.35em] text-gold/80">{t.home.heroEyebrow}</p>
            <h1 className="font-heading text-5xl leading-tight text-softWhite md:text-7xl">{settings.hero_headline}</h1>
            <p className="max-w-2xl text-base text-softWhite/75 md:text-lg">{settings.hero_subheadline}</p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/inventory"
                className="rounded-2xl bg-gradient-to-r from-gold to-[#ff9a47] px-6 py-3 text-sm font-semibold text-matteBlack transition hover:from-cyan hover:to-gold"
              >
                {t.home.exploreInventory}
              </Link>
              <a
                href={`tel:${settings.phone?.replace(/[^\d+]/g, "")}`}
                className="rounded-2xl border border-white/30 px-6 py-3 text-sm text-softWhite transition hover:border-gold/60 hover:text-gold"
              >
                {t.home.callPrefix} {settings.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-8">
        <SectionTitle
          eyebrow={t.home.featuredEyebrow}
          title={t.home.featuredTitle}
          description={t.home.featuredDescription}
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredVehicles.map((vehicle, index) => (
            <Reveal key={vehicle.id} delayMs={index * 120}>
              <VehicleCard vehicle={vehicle} locale={locale} />
            </Reveal>
          ))}
          {featuredVehicles.length === 0 ? (
            <Card>
              <p className="text-softWhite/70">{t.home.noFeatured}</p>
            </Card>
          ) : null}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-4 md:px-8">
        <SectionTitle
          eyebrow={t.home.whyEyebrow}
          title={t.home.whyTitle}
          description={t.home.whyDescription}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {t.home.whyCards.map((feature, index) => (
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
            <p className="text-xs uppercase tracking-[0.28em] text-gold/80">{t.home.aboutEyebrow}</p>
            <h2 className="mt-4 font-heading text-4xl text-softWhite">{t.home.aboutTitle}</h2>
            <p className="mt-4 text-softWhite/70">
              {t.home.aboutDescription}
            </p>
            <Link
              href="/about"
              className="mt-6 inline-block rounded-2xl border border-white/20 px-5 py-2 text-sm text-softWhite hover:border-gold/60 hover:text-gold"
            >
              {t.home.learnMore}
            </Link>
          </div>
          <div className="space-y-3 rounded-2xl border border-white/10 bg-black/25 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-gold/80">{t.home.locationTitle}</p>
            <p className="text-softWhite/80">{settings.address}</p>
            <p className="text-softWhite/80">{settings.phone}</p>
            <p className="text-softWhite/70">{settings.hours_text}</p>
            <Link
              href="/contact"
              className="mt-2 inline-block rounded-2xl bg-gradient-to-r from-gold to-[#ff9a47] px-5 py-2 text-sm font-semibold text-matteBlack hover:from-cyan hover:to-gold"
            >
              {t.home.scheduleVisit}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-4 pb-10 md:px-8">
        <SectionTitle eyebrow={t.home.testimonialsEyebrow} title={t.home.testimonialsTitle} />
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
              <p className="text-softWhite/70">{t.home.noTestimonials}</p>
            </Card>
          ) : null}
        </div>
      </section>
    </div>
  );
}
