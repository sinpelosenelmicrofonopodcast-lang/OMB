-- OMB AUTO SALES initial schema + security

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'public' check (role in ('admin', 'public')),
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'available' check (status in ('available', 'sold', 'pending')),
  featured boolean not null default false,
  title text not null,
  slug text not null unique,
  year int,
  make text,
  model text,
  trim text,
  mileage int,
  price int,
  vin text,
  color text,
  drivetrain text,
  transmission text,
  fuel_type text,
  description text,
  highlights text[] not null default '{}',
  main_image_url text,
  gallery_urls text[] not null default '{}',
  specs jsonb not null default '{}',
  published boolean not null default true
);

create table if not exists public.site_settings (
  id int primary key default 1,
  business_name text,
  phone text,
  address text,
  hours_text text,
  hero_headline text,
  hero_subheadline text,
  hero_bg_url text,
  updated_at timestamptz not null default now(),
  constraint site_settings_single_row check (id = 1)
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  message text,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  source text default 'website'
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  rating int not null default 5 check (rating between 1 and 5),
  quote text not null,
  published boolean not null default true
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists set_vehicles_updated_at on public.vehicles;
create trigger set_vehicles_updated_at
before update on public.vehicles
for each row
execute function public.set_updated_at();

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = uid
      and role = 'admin'
  );
$$;

grant execute on function public.is_admin(uuid) to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.site_settings enable row level security;
alter table public.leads enable row level security;
alter table public.testimonials enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles
for select
using (auth.uid() = id or public.is_admin(auth.uid()));

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
on public.profiles
for update
using (auth.uid() = id or public.is_admin(auth.uid()))
with check (auth.uid() = id or public.is_admin(auth.uid()));

drop policy if exists "vehicles_public_read_published" on public.vehicles;
create policy "vehicles_public_read_published"
on public.vehicles
for select
using (published = true or public.is_admin(auth.uid()));

drop policy if exists "vehicles_admin_insert" on public.vehicles;
create policy "vehicles_admin_insert"
on public.vehicles
for insert
with check (public.is_admin(auth.uid()));

drop policy if exists "vehicles_admin_update" on public.vehicles;
create policy "vehicles_admin_update"
on public.vehicles
for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "vehicles_admin_delete" on public.vehicles;
create policy "vehicles_admin_delete"
on public.vehicles
for delete
using (public.is_admin(auth.uid()));

drop policy if exists "site_settings_public_read" on public.site_settings;
create policy "site_settings_public_read"
on public.site_settings
for select
using (true);

drop policy if exists "site_settings_admin_insert" on public.site_settings;
create policy "site_settings_admin_insert"
on public.site_settings
for insert
with check (public.is_admin(auth.uid()));

drop policy if exists "site_settings_admin_update" on public.site_settings;
create policy "site_settings_admin_update"
on public.site_settings
for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "site_settings_admin_delete" on public.site_settings;
create policy "site_settings_admin_delete"
on public.site_settings
for delete
using (public.is_admin(auth.uid()));

drop policy if exists "leads_public_insert" on public.leads;
create policy "leads_public_insert"
on public.leads
for insert
with check (true);

drop policy if exists "leads_admin_read" on public.leads;
create policy "leads_admin_read"
on public.leads
for select
using (public.is_admin(auth.uid()));

drop policy if exists "leads_admin_delete" on public.leads;
create policy "leads_admin_delete"
on public.leads
for delete
using (public.is_admin(auth.uid()));

drop policy if exists "testimonials_public_read_published" on public.testimonials;
create policy "testimonials_public_read_published"
on public.testimonials
for select
using (published = true or public.is_admin(auth.uid()));

drop policy if exists "testimonials_admin_insert" on public.testimonials;
create policy "testimonials_admin_insert"
on public.testimonials
for insert
with check (public.is_admin(auth.uid()));

drop policy if exists "testimonials_admin_update" on public.testimonials;
create policy "testimonials_admin_update"
on public.testimonials
for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "testimonials_admin_delete" on public.testimonials;
create policy "testimonials_admin_delete"
on public.testimonials
for delete
using (public.is_admin(auth.uid()));

insert into storage.buckets (id, name, public)
values ('vehicle-images', 'vehicle-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "vehicle_images_public_read" on storage.objects;
create policy "vehicle_images_public_read"
on storage.objects
for select
using (bucket_id = 'vehicle-images');

drop policy if exists "vehicle_images_admin_insert" on storage.objects;
create policy "vehicle_images_admin_insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'vehicle-images'
  and public.is_admin(auth.uid())
);

drop policy if exists "vehicle_images_admin_update" on storage.objects;
create policy "vehicle_images_admin_update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'vehicle-images'
  and public.is_admin(auth.uid())
)
with check (
  bucket_id = 'vehicle-images'
  and public.is_admin(auth.uid())
);

drop policy if exists "vehicle_images_admin_delete" on storage.objects;
create policy "vehicle_images_admin_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'vehicle-images'
  and public.is_admin(auth.uid())
);

insert into public.site_settings (
  id,
  business_name,
  phone,
  address,
  hours_text,
  hero_headline,
  hero_subheadline,
  hero_bg_url
)
values (
  1,
  'OMB AUTO SALES',
  '(254) 393-5554',
  '710 W Veterans Memorial Blvd, Killeen, TX 76541',
  'Mon-Sat 9:00 AM - 7:00 PM',
  'Luxury, performance, and trust in every mile.',
  'Discover a curated inventory of premium vehicles at OMB AUTO SALES.',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80'
)
on conflict (id) do update set
  business_name = excluded.business_name,
  phone = excluded.phone,
  address = excluded.address,
  hours_text = excluded.hours_text,
  hero_headline = excluded.hero_headline,
  hero_subheadline = excluded.hero_subheadline,
  hero_bg_url = excluded.hero_bg_url;

insert into public.vehicles (
  id,
  status,
  featured,
  title,
  slug,
  year,
  make,
  model,
  trim,
  mileage,
  price,
  color,
  drivetrain,
  transmission,
  fuel_type,
  description,
  highlights,
  published
)
values
  (
    gen_random_uuid(),
    'available',
    true,
    '2022 Mercedes-Benz S 580 4MATIC',
    '2022-mercedes-benz-s-580-4matic-demo',
    2022,
    'Mercedes-Benz',
    'S 580',
    '4MATIC',
    28650,
    112900,
    'Obsidian Black',
    'AWD',
    '9-Speed Automatic',
    'Gasoline',
    'Flagship luxury sedan with premium materials and advanced driver assistance.',
    array['Burmester 3D Audio', 'Panoramic Roof', 'Driver Assistance Package'],
    true
  ),
  (
    gen_random_uuid(),
    'available',
    false,
    '2021 BMW X7 xDrive40i',
    '2021-bmw-x7-xdrive40i-demo',
    2021,
    'BMW',
    'X7',
    'xDrive40i',
    40120,
    68900,
    'Mineral White',
    'AWD',
    '8-Speed Automatic',
    'Gasoline',
    'Three-row luxury SUV with refined comfort and confident performance.',
    array['Captain Seats', 'Surround View Camera', 'Premium Package'],
    true
  )
on conflict (slug) do nothing;
