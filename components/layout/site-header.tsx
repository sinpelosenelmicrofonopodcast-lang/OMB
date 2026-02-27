import Link from "next/link";
import { getSessionUser } from "@/lib/auth/guards";
import { BrandLogo } from "@/components/layout/brand-logo";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/inventory", label: "Inventory" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export async function SiteHeader() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-matteBlack/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 md:px-8">
        <div>
          <BrandLogo width={118} height={68} priority imageClassName="max-w-[118px] md:max-w-[126px]" />
        </div>

        <nav className="hidden items-center gap-5 md:flex">
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
              Admin
            </Link>
          ) : (
            <Link href="/login" className="rounded-xl border border-white/20 px-3 py-1.5 text-sm text-softWhite hover:border-gold/55">
              Login
            </Link>
          )}
        </nav>
      </div>
      <div className="h-[2px] w-full bg-gradient-to-r from-cyan via-gold to-cyan/80" />
    </header>
  );
}
