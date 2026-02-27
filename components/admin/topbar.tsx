import { signOutAction } from "@/actions/auth-actions";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/messages";

type AdminTopbarProps = {
  userEmail: string;
  locale: Locale;
};

export function AdminTopbar({ userEmail, locale }: AdminTopbarProps) {
  const t = getDictionary(locale);

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-charcoal/70 px-4 py-3">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-gold/80">{t.admin.topbar.title}</p>
        <p className="text-sm text-softWhite/70">{userEmail}</p>
      </div>
      <form action={signOutAction}>
        <button className="rounded-xl border border-white/20 px-3 py-2 text-sm text-softWhite hover:border-gold/60 hover:text-gold">
          {t.admin.topbar.logout}
        </button>
      </form>
    </div>
  );
}
