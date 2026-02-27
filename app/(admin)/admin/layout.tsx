import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth/guards";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";
import { getLocale } from "@/lib/i18n/locale";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const [adminResult, locale] = await Promise.all([requireAdmin(), getLocale()]);
  const { user } = adminResult;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <AdminSidebar locale={locale} />
        <div>
          <AdminTopbar userEmail={user.email ?? "admin"} locale={locale} />
          {children}
        </div>
      </div>
    </section>
  );
}
