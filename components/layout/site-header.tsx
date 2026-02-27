import Link from "next/link";
import { getSessionUser } from "@/lib/auth/guards";
import { BrandLogo } from "@/components/layout/brand-logo";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { getLocale } from "@/lib/i18n/server-locale";
import { getDictionary } from "@/lib/i18n/messages";

export async function SiteHeader() {
  const [user, locale] = await Promise.all([getSessionUser(), getLocale()]);
  const t = getDictionary(locale);
  const navItems = [
    { href: "/", label: t.nav.home },
    { href: "/inventory", label: t.nav.inventory },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact }
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-matteBlack/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 md:px-8">
        <div>
          <BrandLogo width={118} height={68} priority imageClassName="max-w-[118px] md:max-w-[126px]" />
        </div>

        <nav className="hidden items-center gap-5 md:flex">
          <LanguageToggle />
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-softWhite/80 transition hover:text-gold">
              {item.label}
            </Link>
          ))}
          {user ? (
            <Link
              href="/admin"
              className="rounded-xl border border-gold/50 px-3 py-1.5 text-sm text-gold shadow-[0_0_0_1px_rgba(20,185,231,0.22)] hover:bg-gold/10"
            >
              {t.nav.admin}
            </Link>
          ) : (
            <Link href="/login" className="rounded-xl border border-white/20 px-3 py-1.5 text-sm text-softWhite hover:border-gold/55">
              {t.nav.login}
            </Link>
          )}
        </nav>
        <div className="md:hidden">
          <LanguageToggle />
        </div>
      </div>
      <div className="h-[2px] w-full bg-gradient-to-r from-cyan via-gold to-cyan/80" />
    </header>
  );
}
