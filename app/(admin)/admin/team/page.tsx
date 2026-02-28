import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createTeamMemberAction,
  deleteTeamMemberAction,
  updateTeamMemberAction
} from "@/actions/team-actions";
import { getAdminTeamMembers } from "@/lib/db/team-members";
import { getLocale } from "@/lib/i18n/server-locale";
import { getDictionary, translateUiMessage } from "@/lib/i18n/messages";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function AdminTeamPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const locale = await getLocale();
  const t = getDictionary(locale);
  const teamMembers = await getAdminTeamMembers();
  const message = first(resolvedSearchParams.message);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-4xl text-softWhite">{t.admin.team.title}</h1>
      {message ? (
        <p className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-2 text-sm text-gold/90">
          {translateUiMessage(message, locale)}
        </p>
      ) : null}

      <form action={createTeamMemberAction} className="panel space-y-4">
        <h2 className="font-heading text-3xl text-softWhite">{t.admin.team.add}</h2>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="new_name" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              {t.admin.team.name}
            </label>
            <Input id="new_name" name="name" required />
          </div>
          <div>
            <label htmlFor="new_role" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              {t.admin.team.role}
            </label>
            <Input id="new_role" name="role" />
          </div>
          <div>
            <label htmlFor="new_display_order" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              {t.admin.team.order}
            </label>
            <Input id="new_display_order" name="display_order" type="number" defaultValue={0} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="new_photo_url" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              {t.admin.team.photoUrl}
            </label>
            <Input id="new_photo_url" name="photo_url" />
          </div>
          <div>
            <label htmlFor="new_photo" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
              {t.admin.team.uploadPhoto}
            </label>
            <Input id="new_photo" name="photo" type="file" accept="image/*" />
          </div>
        </div>

        <div>
          <label htmlFor="new_bio" className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">
            {t.admin.team.bio}
          </label>
          <Textarea id="new_bio" name="bio" rows={4} />
        </div>

        <label className="inline-flex items-center gap-2 text-sm text-softWhite/80">
          <input type="checkbox" name="published" defaultChecked /> {t.admin.team.published}
        </label>

        <button className="rounded-2xl bg-gradient-to-r from-gold to-[#ff9a47] px-5 py-2 text-sm font-semibold text-matteBlack hover:from-cyan hover:to-gold">
          {t.admin.team.create}
        </button>
      </form>

      <div className="grid gap-4">
        {teamMembers.map((member) => (
          <form key={member.id} action={updateTeamMemberAction} className="panel space-y-4">
            <input type="hidden" name="id" value={member.id} />
            <input type="hidden" name="existing_photo_url" value={member.photo_url ?? ""} />

            <div className="grid gap-4 md:grid-cols-[120px_1fr]">
              <div className="relative h-[120px] w-[120px] overflow-hidden rounded-2xl border border-white/10 bg-charcoal">
                {member.photo_url ? (
                  <Image src={member.photo_url} alt={member.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-softWhite/45">{t.admin.team.noPhoto}</div>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">{t.admin.team.name}</label>
                  <Input name="name" defaultValue={member.name} required />
                </div>
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">{t.admin.team.role}</label>
                  <Input name="role" defaultValue={member.role ?? ""} />
                </div>
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">{t.admin.team.order}</label>
                  <Input name="display_order" type="number" defaultValue={member.display_order} />
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">{t.admin.team.photoUrl}</label>
                <Input name="photo_url" defaultValue={member.photo_url ?? ""} />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">{t.admin.team.uploadPhoto}</label>
                <Input name="photo" type="file" accept="image/*" />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-softWhite/60">{t.admin.team.bio}</label>
              <Textarea name="bio" rows={3} defaultValue={member.bio ?? ""} />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="inline-flex items-center gap-2 text-sm text-softWhite/80">
                <input type="checkbox" name="published" defaultChecked={member.published} /> {t.admin.team.published}
              </label>

              <div className="flex gap-2">
                <button className="rounded-xl border border-white/20 px-3 py-1.5 text-xs text-softWhite hover:border-gold/60 hover:text-gold">
                  {t.admin.team.save}
                </button>
                <button
                  formAction={deleteTeamMemberAction}
                  className="rounded-xl border border-red-500/40 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10"
                >
                  {t.admin.team.delete}
                </button>
              </div>
            </div>
          </form>
        ))}

        {teamMembers.length === 0 ? <div className="panel text-sm text-softWhite/65">{t.admin.team.empty}</div> : null}
      </div>
    </div>
  );
}
