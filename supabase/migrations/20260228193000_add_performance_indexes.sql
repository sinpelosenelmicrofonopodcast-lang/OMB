-- Performance indexes for common queries

create extension if not exists pg_trgm;

-- Vehicles
create index if not exists idx_vehicles_published_created_at
  on public.vehicles (published, created_at desc);

create index if not exists idx_vehicles_featured_published_created_at
  on public.vehicles (featured, published, created_at desc);

create index if not exists idx_vehicles_published_price
  on public.vehicles (published, price);

create index if not exists idx_vehicles_published_make
  on public.vehicles (published, make);

create index if not exists idx_vehicles_published_year
  on public.vehicles (published, year);

create index if not exists idx_vehicles_published_status
  on public.vehicles (published, status);

create index if not exists idx_vehicles_search_trgm
  on public.vehicles
  using gin (
    (
      coalesce(title, '') || ' ' ||
      coalesce(make, '') || ' ' ||
      coalesce(model, '') || ' ' ||
      coalesce(trim, '')
    ) gin_trgm_ops
  );

-- Testimonials
create index if not exists idx_testimonials_published_created_at
  on public.testimonials (published, created_at desc);

-- Leads
create index if not exists idx_leads_created_at
  on public.leads (created_at desc);

create index if not exists idx_leads_vehicle_id
  on public.leads (vehicle_id);

-- Team members
create index if not exists idx_team_members_published_order
  on public.team_members (published, display_order, created_at);
