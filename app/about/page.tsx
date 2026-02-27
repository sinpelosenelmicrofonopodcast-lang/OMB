import { getPublicSiteSettings } from "@/lib/db/site-settings";

export default async function AboutPage() {
  const settings = await getPublicSiteSettings();

  return (
    <section className="mx-auto max-w-5xl px-4 py-20 md:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-gold/80">About Us</p>
      <h1 className="mt-4 font-heading text-5xl text-softWhite md:text-6xl">OMB AUTO SALES</h1>
      <p className="mt-6 max-w-3xl text-softWhite/75 md:text-lg">
        OMB AUTO SALES delivers a premium dealership experience with a focus on luxury vehicles, transparent guidance,
        and long-term customer relationships. We serve drivers across Central Texas from our Killeen location.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="panel">
          <h2 className="font-heading text-3xl text-softWhite">Our Mission</h2>
          <p className="mt-4 text-softWhite/70">
            Provide exceptional vehicles and concierge-level service with integrity at every step of the buying process.
          </p>
        </div>
        <div className="panel">
          <h2 className="font-heading text-3xl text-softWhite">Visit Us</h2>
          <p className="mt-4 text-softWhite/75">{settings.address}</p>
          <p className="mt-2 text-softWhite/75">{settings.phone}</p>
          <p className="mt-2 text-softWhite/70">{settings.hours_text}</p>
        </div>
      </div>
    </section>
  );
}
