import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth/guards";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { user } = await requireAdmin();

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <AdminSidebar />
        <div>
          <AdminTopbar userEmail={user.email ?? "admin"} />
          {children}
        </div>
      </div>
    </section>
  );
}
