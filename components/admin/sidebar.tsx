import Link from "next/link";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/inventory/new", label: "Add Vehicle" },
  { href: "/admin/site", label: "Site Settings" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/testimonials", label: "Testimonials" }
];

export function AdminSidebar() {
  return (
    <aside className="rounded-3xl border border-white/10 bg-[#111111] p-5 md:p-6">
      <p className="font-heading text-2xl text-softWhite">
        <span className="bg-gradient-to-r from-cyan to-gold bg-clip-text text-transparent">OMB</span> Admin
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
