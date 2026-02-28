# OMB AUTO SALES

Production-grade dealership web app built with Next.js App Router, TypeScript, Tailwind, and Supabase (Auth, Postgres, Storage, RLS).

## Tech Stack
- Next.js 15 (App Router)
- TypeScript + Tailwind CSS
- Supabase Auth / Postgres / Storage
- Server Actions for secured admin CRUD
- Vercel deployment

## Main Features
- Public website: Home, Inventory, Vehicle detail, About, Contact
- Admin dashboard: Inventory, Site Settings, Leads, Testimonials, Team Members
- ES/EN language toggle across UI
- Team section in About with admin-managed photos + bios
- Health endpoint for operations: `/api/health`

## Environment Variables
Copy `.env.example` to `.env.local` and fill values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
```

## Database Setup (Supabase)
Run these migrations in order from `supabase/migrations`:
1. `20260227160000_init_schema.sql`
2. `20260228181000_add_team_members.sql`
3. `20260228193000_add_performance_indexes.sql`

This creates:
- Core tables + RLS + policies
- Buckets: `vehicle-images`, `team-images`
- Team members table for About page
- Performance indexes for inventory/search/admin queries

## Create First Admin
1. Sign up at `/login`
2. In Supabase SQL editor:

```sql
update public.profiles
set role = 'admin'
where id = 'USER_UUID_HERE';
```

Find the user UUID:

```sql
select id, email from auth.users order by created_at desc;
```

## Local Run
Install dependencies:

```bash
pnpm install
```

Validate env + types + lint:

```bash
pnpm verify
```

Run dev server:

```bash
pnpm dev
```

Open:
- App: `http://localhost:3000`
- Health check: `http://localhost:3000/api/health`

## Production Deploy (Vercel)
1. Push `main` to GitHub
2. Import project in Vercel
3. Add env vars in Vercel (`Production`, `Preview`, `Development`)
4. Deploy
5. Run all migrations in the production Supabase project
6. Verify: `/api/health` returns `status: "ok"`

## Operational Notes
- Admin routes are server-protected (`requireAdmin`)
- RLS enforces admin-only writes for protected tables
- Public reads are restricted to published records where applicable
- Storage writes/deletes are admin-only via policies
- Footer includes direct `Admin Login` link
