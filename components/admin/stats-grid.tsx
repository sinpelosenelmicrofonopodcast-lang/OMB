import { Card } from "@/components/ui/card";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/messages";

type StatsGridProps = {
  totalVehicles: number;
  availableVehicles: number;
  soldVehicles: number;
  recentLeads: number;
  locale: Locale;
};

export function StatsGrid({ totalVehicles, availableVehicles, soldVehicles, recentLeads, locale }: StatsGridProps) {
  const t = getDictionary(locale);
  const stats = [
    { label: t.admin.stats.totalVehicles, value: totalVehicles },
    { label: t.admin.stats.available, value: availableVehicles },
    { label: t.admin.stats.sold, value: soldVehicles },
    { label: t.admin.stats.leads7d, value: recentLeads }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((item) => (
        <Card key={item.label} className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-softWhite/55">{item.label}</p>
          <p className="mt-2 font-heading text-4xl text-gold">{item.value}</p>
        </Card>
      ))}
    </div>
  );
}
