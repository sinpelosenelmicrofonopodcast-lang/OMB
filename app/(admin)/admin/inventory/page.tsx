import Link from "next/link";
import { getInventory } from "@/lib/db/vehicles";
import { formatCurrency } from "@/lib/utils";
import { getLocale } from "@/lib/i18n/server-locale";
import { getDictionary, translateStatus } from "@/lib/i18n/messages";

const sheetUrl = "https://docs.google.com/spreadsheets/d/1xDYHxFXDJUie89Zgao1ETWrpJg0eY8ByFsO4lVHiNmY/edit";

export default async function AdminInventoryPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const { vehicles } = await getInventory({ includeUnpublished: true });
  return <div className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="font-heading text-4xl text-softWhite">{t.admin.inventory.title}</h1>
        <p className="mt-2 text-sm text-softWhite/65">{vehicles.length} {t.admin.inventory.vehiclesSuffix}</p>
        <p className="mt-2 text-sm text-softWhite/70">{locale === "es"
          ? "Base oficial de HGM Group. Administra la información de los vehículos en Google Sheets."
          : "Official HGM Group inventory database. Manage vehicles in Google Sheets."}</p>
      </div>
      <a href={sheetUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-gold px-4 py-2 text-sm font-semibold text-matteBlack">
        {locale === "es" ? "Editar inventario en HGM Group" : "Edit inventory in HGM Group"}
      </a>
    </div>
    <div className="panel overflow-x-auto">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead className="text-softWhite/60"><tr className="border-b border-white/10">
          <th className="py-2">{t.admin.inventory.tableTitle}</th><th className="py-2">{t.admin.inventory.price}</th>
          <th className="py-2">{t.admin.inventory.status}</th><th className="py-2">{t.admin.inventory.published}</th>
          <th className="py-2">{t.admin.inventory.actions}</th>
        </tr></thead>
        <tbody>{vehicles.map(v => <tr key={v.id} className="border-b border-white/10 text-softWhite/85">
          <td className="py-3">{v.title}</td><td className="py-3">{formatCurrency(v.price, locale)}</td>
          <td className="py-3">{translateStatus(v.status, locale)}</td>
          <td className="py-3">{v.published ? "Yes" : "No"}</td>
          <td className="py-3"><Link className="text-gold hover:underline" href={'/inventory/' + v.slug}>View</Link></td>
        </tr>)}</tbody>
      </table>
    </div>
  </div>;
}
