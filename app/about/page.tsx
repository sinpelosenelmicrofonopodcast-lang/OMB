import Image from "next/image";
import { getPublicSiteSettings } from "@/lib/db/site-settings";
import { getPublishedTeamMembers } from "@/lib/db/team-members";
import { getLocale } from "@/lib/i18n/server-locale";
import { getDictionary } from "@/lib/i18n/messages";

export default async function AboutPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const [settings, teamMembers] = await Promise.all([getPublicSiteSettings(locale), getPublishedTeamMembers()]);

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

      <div className="mt-16">
        <p className="text-xs uppercase tracking-[0.28em] text-gold/80">{t.about.teamEyebrow}</p>
        <h2 className="mt-3 font-heading text-4xl text-softWhite md:text-5xl">{t.about.teamTitle}</h2>
        <p className="mt-4 max-w-3xl text-softWhite/70">{t.about.teamDescription}</p>

        {teamMembers.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <article key={member.id} className="panel">
                <div className="relative h-52 overflow-hidden rounded-2xl border border-white/10 bg-charcoal">
                  {member.photo_url ? (
                    <Image src={member.photo_url} alt={member.name} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-softWhite/45">{member.name}</div>
                  )}
                </div>
                <h3 className="mt-4 font-heading text-2xl text-softWhite">{member.name}</h3>
                {member.role ? <p className="mt-1 text-sm text-gold/90">{member.role}</p> : null}
                {member.bio ? <p className="mt-3 text-sm leading-relaxed text-softWhite/75">{member.bio}</p> : null}
              </article>
            ))}
          </div>
        ) : (
          <div className="panel mt-8">
            <p className="text-softWhite/65">{t.about.teamEmpty}</p>
          </div>
        )}
      </div>
    </section>
  );
}
