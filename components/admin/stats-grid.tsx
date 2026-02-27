import { Card } from "@/components/ui/card";

type StatsGridProps = {
  totalVehicles: number;
  availableVehicles: number;
  soldVehicles: number;
  recentLeads: number;
};

export function StatsGrid({ totalVehicles, availableVehicles, soldVehicles, recentLeads }: StatsGridProps) {
  const stats = [
    { label: "Total Vehicles", value: totalVehicles },
    { label: "Available", value: availableVehicles },
    { label: "Sold", value: soldVehicles },
    { label: "Leads (7d)", value: recentLeads }
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
