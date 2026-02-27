import { updateSiteSettingsAction } from "@/actions/site-actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getAdminSiteSettings } from "@/lib/db/site-settings";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function AdminSiteSettingsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const settings = await getAdminSiteSettings();
  const message = first(resolvedSearchParams.message);

  return (
    <div className="space-y-5">
      <h1 className="font-heading text-4xl text-softWhite">Site Settings</h1>
      {message ? (
        <p className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-2 text-sm text-gold/90">{message}</p>
      ) : null}

      <form action={updateSiteSettingsAction} className="panel space-y-4">
        <div>
          <label htmlFor="business_name" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
            Business Name
          </label>
          <Input id="business_name" name="business_name" defaultValue={settings.business_name ?? ""} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="phone" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              Phone
            </label>
            <Input id="phone" name="phone" defaultValue={settings.phone ?? ""} />
          </div>
          <div>
            <label htmlFor="hours_text" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              Hours
            </label>
            <Input id="hours_text" name="hours_text" defaultValue={settings.hours_text ?? ""} />
          </div>
        </div>

        <div>
          <label htmlFor="address" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
            Address
          </label>
          <Input id="address" name="address" defaultValue={settings.address ?? ""} />
        </div>

        <div>
          <label htmlFor="hero_headline" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
            Hero Headline
          </label>
          <Input id="hero_headline" name="hero_headline" defaultValue={settings.hero_headline ?? ""} />
        </div>

        <div>
          <label htmlFor="hero_subheadline" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
            Hero Subheadline
          </label>
          <Textarea
            id="hero_subheadline"
            name="hero_subheadline"
            rows={3}
            defaultValue={settings.hero_subheadline ?? ""}
          />
        </div>

        <div>
          <label htmlFor="hero_bg_url" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
            Hero Background URL
          </label>
          <Input id="hero_bg_url" name="hero_bg_url" defaultValue={settings.hero_bg_url ?? ""} />
        </div>

        <button className="rounded-2xl bg-gradient-to-r from-gold to-[#ff9a47] px-5 py-2 text-sm font-semibold text-matteBlack hover:from-cyan hover:to-gold">
          Save Settings
        </button>
      </form>
    </div>
  );
}
