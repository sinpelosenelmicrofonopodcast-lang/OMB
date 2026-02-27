import Link from "next/link";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/messages";

type AdminSidebarProps = {
  locale: Locale;
};

export function AdminSidebar({ locale }: AdminSidebarProps) {
  const t = getDictionary(locale);
  const links = [
    { href: "/admin", label: t.admin.sidebar.dashboard },
    { href: "/admin/inventory", label: t.admin.sidebar.inventory },
    { href: "/admin/inventory/new", label: t.admin.sidebar.addVehicle },
    { href: "/admin/site", label: t.admin.sidebar.siteSettings },
    { href: "/admin/leads", label: t.admin.sidebar.leads },
    { href: "/admin/testimonials", label: t.admin.sidebar.testimonials }
  ];

  return (
    <aside className="rounded-3xl border border-white/10 bg-[#111111] p-5 md:p-6">
      <p className="font-heading text-2xl text-softWhite">
        <span className="bg-gradient-to-r from-cyan to-gold bg-clip-text text-transparent">OMB</span>{" "}
        {locale === "es" ? "Administracion" : "Admin"}
      </p>
      <nav className="mt-8 space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-xl px-3 py-2 text-sm text-softWhite/75 transition hover:bg-white/5 hover:text-gold"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
