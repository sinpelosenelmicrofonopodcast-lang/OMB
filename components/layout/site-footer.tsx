import Link from "next/link";
import { getPublicSiteSettings } from "@/lib/db/site-settings";
import { BrandLogo } from "@/components/layout/brand-logo";
import { getLocale } from "@/lib/i18n/server-locale";
import { getDictionary } from "@/lib/i18n/messages";

export async function SiteFooter() {
  const locale = await getLocale();
  const settings = await getPublicSiteSettings(locale);
  const t = getDictionary(locale);

  return (
    <footer className="mt-24 border-t border-white/10 bg-[#0b0b0b]">
      <div className="h-[2px] w-full bg-gradient-to-r from-cyan via-gold to-cyan/80" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-3 md:px-8">
        <div>
          <BrandLogo width={240} height={139} imageClassName="max-w-[240px]" />
          <p className="mt-3 text-sm text-softWhite/70">{t.footer.tagline}</p>
        </div>

        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-gold/95">{t.footer.visit}</p>
          <p className="mt-3 text-sm text-softWhite/75">{settings.address}</p>
          <p className="mt-1 text-sm text-softWhite/75">{settings.hours_text}</p>
        </div>

        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-gold/95">{t.footer.connect}</p>
          <p className="mt-3 text-sm text-softWhite/75">{settings.phone}</p>
          <div className="mt-4 flex gap-4 text-sm">
            <Link href="/inventory" className="text-softWhite/70 hover:text-gold">
              {t.nav.inventory}
            </Link>
            <Link href="/contact" className="text-softWhite/70 hover:text-gold">
              {t.nav.contact}
            </Link>
            <Link href="/about" className="text-softWhite/70 hover:text-gold">
              {t.nav.about}
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-softWhite/50">
        © {new Date().getFullYear()} OMB AUTO SALES. {t.footer.rights}
      </div>
    </footer>
  );
}
