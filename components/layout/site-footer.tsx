import Link from "next/link";
import { getPublicSiteSettings } from "@/lib/db/site-settings";
import { BrandLogo } from "@/components/layout/brand-logo";

export async function SiteFooter() {
  const settings = await getPublicSiteSettings();

  return (
    <footer className="mt-24 border-t border-white/10 bg-[#0b0b0b]">
      <div className="h-[2px] w-full bg-gradient-to-r from-cyan via-gold to-cyan/80" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-3 md:px-8">
        <div>
          <BrandLogo width={240} height={139} imageClassName="max-w-[240px]" />
          <p className="mt-3 text-sm text-softWhite/70">Luxury inventory, transparent service, and elevated buying experience.</p>
        </div>

        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-gold/95">Visit</p>
          <p className="mt-3 text-sm text-softWhite/75">{settings.address}</p>
          <p className="mt-1 text-sm text-softWhite/75">{settings.hours_text}</p>
        </div>

        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-gold/95">Connect</p>
          <p className="mt-3 text-sm text-softWhite/75">{settings.phone}</p>
          <div className="mt-4 flex gap-4 text-sm">
            <Link href="/inventory" className="text-softWhite/70 hover:text-gold">
              Inventory
            </Link>
            <Link href="/contact" className="text-softWhite/70 hover:text-gold">
              Contact
            </Link>
            <Link href="/about" className="text-softWhite/70 hover:text-gold">
              About
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-softWhite/50">
        © {new Date().getFullYear()} OMB AUTO SALES. All rights reserved.
      </div>
    </footer>
  );
}
