import { deleteLeadAction } from "@/actions/lead-actions";
import { getAdminLeads } from "@/lib/db/leads";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

type LeadVehicle = {
  title?: string;
  slug?: string;
};

export default async function AdminLeadsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const leads = await getAdminLeads();
  const message = first(resolvedSearchParams.message);

  return (
    <div className="space-y-5">
      <h1 className="font-heading text-4xl text-softWhite">Leads</h1>
      {message ? (
        <p className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-2 text-sm text-gold/90">{message}</p>
      ) : null}

      <div className="space-y-3">
        {leads.map((lead) => {
          const vehicle = (lead.vehicles as LeadVehicle | null) ?? null;

          return (
            <details key={lead.id} className="panel group">
              <summary className="cursor-pointer list-none">
                <div className="grid gap-2 md:grid-cols-[170px_1fr_1fr_1fr_auto] md:items-center">
                  <p className="text-xs text-softWhite/55">{new Date(lead.created_at).toLocaleString()}</p>
                  <p className="text-softWhite">{lead.name}</p>
                  <p className="text-softWhite/75">{lead.email}</p>
                  <p className="text-softWhite/70">{lead.phone ?? "-"}</p>
                  <p className="text-xs text-gold/85 group-open:text-gold">View</p>
                </div>
              </summary>

              <div className="mt-4 space-y-4 border-t border-white/10 pt-4 text-sm text-softWhite/80">
                <p>
                  <span className="text-softWhite/55">Vehicle:</span> {vehicle?.title ?? "General inquiry"}
                </p>
                <p>
                  <span className="text-softWhite/55">Message:</span> {lead.message ?? "(No message provided)"}
                </p>
                <form action={deleteLeadAction}>
                  <input type="hidden" name="id" value={lead.id} />
                  <button className="rounded-xl border border-red-500/40 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10">
                    Delete Lead
                  </button>
                </form>
              </div>
            </details>
          );
        })}

        {leads.length === 0 ? <div className="panel text-sm text-softWhite/65">No leads submitted yet.</div> : null}
      </div>
    </div>
  );
}
