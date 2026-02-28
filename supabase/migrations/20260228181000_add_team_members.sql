-- Team members for About Us section

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  role text,
  bio text,
  photo_url text,
  display_order int not null default 0,
  published boolean not null default true
);

drop trigger if exists set_team_members_updated_at on public.team_members;
create trigger set_team_members_updated_at
before update on public.team_members
for each row
execute function public.set_updated_at();

alter table public.team_members enable row level security;

drop policy if exists "team_members_public_read_published" on public.team_members;
create policy "team_members_public_read_published"
on public.team_members
for select
using (published = true or public.is_admin(auth.uid()));

drop policy if exists "team_members_admin_insert" on public.team_members;
create policy "team_members_admin_insert"
on public.team_members
for insert
with check (public.is_admin(auth.uid()));

drop policy if exists "team_members_admin_update" on public.team_members;
create policy "team_members_admin_update"
on public.team_members
for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "team_members_admin_delete" on public.team_members;
create policy "team_members_admin_delete"
on public.team_members
for delete
using (public.is_admin(auth.uid()));

insert into storage.buckets (id, name, public)
values ('team-images', 'team-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "team_images_public_read" on storage.objects;
create policy "team_images_public_read"
on storage.objects
for select
using (bucket_id = 'team-images');

drop policy if exists "team_images_admin_insert" on storage.objects;
create policy "team_images_admin_insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'team-images'
  and public.is_admin(auth.uid())
);

drop policy if exists "team_images_admin_update" on storage.objects;
create policy "team_images_admin_update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'team-images'
  and public.is_admin(auth.uid())
)
with check (
  bucket_id = 'team-images'
  and public.is_admin(auth.uid())
);

drop policy if exists "team_images_admin_delete" on storage.objects;
create policy "team_images_admin_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'team-images'
  and public.is_admin(auth.uid())
);
