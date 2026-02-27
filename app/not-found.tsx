import Link from "next/link";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/messages";

export default async function NotFound() {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <section className="mx-auto max-w-3xl px-4 py-28 text-center md:px-8">
      <p className="text-sm uppercase tracking-[0.3em] text-gold/70">404</p>
      <h1 className="mt-4 font-heading text-5xl text-softWhite">{t.notFound.title}</h1>
      <p className="mt-4 text-softWhite/70">{t.notFound.description}</p>
      <Link
        href="/"
        className="mt-10 inline-flex rounded-2xl border border-gold/50 bg-gold/10 px-5 py-2 text-sm text-gold hover:bg-gold/20"
      >
        {t.notFound.returnHome}
      </Link>
    </section>
  );
}
