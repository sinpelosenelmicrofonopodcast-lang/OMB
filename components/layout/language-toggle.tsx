import { setLocaleAction } from "@/actions/locale-actions";
import { getLocale } from "@/lib/i18n/server-locale";
import { getDictionary } from "@/lib/i18n/messages";

export async function LanguageToggle() {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <form action={setLocaleAction} className="inline-flex items-center gap-1 rounded-xl border border-white/20 bg-charcoal/80 p-1">
      <span className="px-1.5 text-[10px] uppercase tracking-[0.2em] text-softWhite/50">{t.language.switchLabel}</span>
      <button
        name="locale"
        value="en"
        className={`rounded-md px-2 py-1 text-xs transition ${
          locale === "en" ? "bg-gold text-matteBlack" : "text-softWhite/70 hover:text-softWhite"
        }`}
      >
        {t.language.en}
      </button>
      <button
        name="locale"
        value="es"
        className={`rounded-md px-2 py-1 text-xs transition ${
          locale === "es" ? "bg-gold text-matteBlack" : "text-softWhite/70 hover:text-softWhite"
        }`}
      >
        {t.language.es}
      </button>
    </form>
  );
}
