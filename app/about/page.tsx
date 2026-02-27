import { getPublicSiteSettings } from "@/lib/db/site-settings";
import { getLocale } from "@/lib/i18n/server-locale";
import { getDictionary } from "@/lib/i18n/messages";

export default async function AboutPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const settings = await getPublicSiteSettings(locale);

  return (
    <section className="mx-auto max-w-5xl px-4 py-20 md:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-gold/80">{t.about.eyebrow}</p>
      <h1 className="mt-4 font-heading text-5xl text-softWhite md:text-6xl">{t.about.title}</h1>
      <p className="mt-6 max-w-3xl text-softWhite/75 md:text-lg">{t.about.intro}</p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="panel">
          <h2 className="font-heading text-3xl text-softWhite">{t.about.missionTitle}</h2>
          <p className="mt-4 text-softWhite/70">{t.about.missionDescription}</p>
        </div>
        <div className="panel">
          <h2 className="font-heading text-3xl text-softWhite">{t.about.visitTitle}</h2>
          <p className="mt-4 text-softWhite/75">{settings.address}</p>
          <p className="mt-2 text-softWhite/75">{settings.phone}</p>
          <p className="mt-2 text-softWhite/70">{settings.hours_text}</p>
        </div>
      </div>
    </section>
  );
}
