# OMB AUTO SALES

Production-ready luxury dealership web app built with Next.js App Router, TypeScript, Tailwind CSS, and Supabase (Auth + Postgres + Storage + RLS).

## Stack
- Next.js App Router + TypeScript
- Tailwind CSS (premium black/charcoal/gold design system)
- Supabase Auth + Postgres + Storage + RLS
- Server Actions for secure admin CRUD
- Vercel-ready deployment

## Project Scaffold

```txt
/Users/gabriel/OMB
├── actions
│   ├── _helpers.ts
│   ├── auth-actions.ts
│   ├── lead-actions.ts
│   ├── site-actions.ts
│   ├── testimonial-actions.ts
│   └── vehicle-actions.ts
├── app
│   ├── (admin)
│   │   └── admin
│   │       ├── inventory
│   │       │   ├── [id]
│   │       │   │   └── edit
│   │       │   │       └── page.tsx
│   │       │   ├── new
│   │       │   │   └── page.tsx
│   │       │   └── page.tsx
│   │       ├── layout.tsx
│   │       ├── leads
│   │       │   └── page.tsx
│   │       ├── page.tsx
│   │       ├── site
│   │       │   └── page.tsx
│   │       └── testimonials
│   │           └── page.tsx
│   ├── about
│   │   └── page.tsx
│   ├── contact
│   │   └── page.tsx
│   ├── inventory
│   │   ├── [slug]
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── login
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── page.tsx
├── components
│   ├── admin
│   │   ├── sidebar.tsx
│   │   ├── stats-grid.tsx
│   │   ├── topbar.tsx
│   │   └── vehicle-form.tsx
│   ├── layout
│   │   ├── section-title.tsx
│   │   ├── site-footer.tsx
│   │   └── site-header.tsx
│   ├── ui
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── reveal.tsx
│   │   ├── select.tsx
│   │   └── textarea.tsx
│   └── vehicle-card.tsx
├── lib
│   ├── auth
│   │   └── guards.ts
│   ├── db
│   │   ├── admin.ts
│   │   ├── leads.ts
│   │   ├── site-settings.ts
│   │   ├── testimonials.ts
│   │   ├── types.ts
│   │   └── vehicles.ts
│   ├── supabase
│   │   ├── browser.ts
│   │   └── server.ts
│   └── utils.ts
├── supabase
│   └── migrations
│       └── 20260227160000_init_schema.sql
├── .env.example
├── .eslintrc.json
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Environment Variables
Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Set values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
```

## Supabase Setup
1. Create a Supabase project.
2. In SQL Editor, run migration `supabase/migrations/20260227160000_init_schema.sql`.
3. Confirm bucket exists: `vehicle-images` (public).
4. In Auth settings, ensure Email/Password provider is enabled.
5. In Storage, verify object policies exist for `vehicle-images` (public read, admin write/delete).

## Create First Admin User
1. Go to `/login` and create an account (Sign Up).
2. In Supabase SQL editor, promote user:

```sql
update public.profiles
set role = 'admin'
where id = 'USER_UUID_HERE';
```

To find UUID:

```sql
select id, email from auth.users order by created_at desc;
```

## Run Locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Deploy to Vercel
1. Push repo to GitHub.
2. Import project in Vercel.
3. Add env vars in Vercel Project Settings.
4. Deploy.
5. Run Supabase migration in production project before first use.

## Security Notes
- RLS is enabled on all app tables.
- Admin writes are enforced via `public.is_admin(auth.uid())`.
- Public access is limited to published inventory/testimonials and read-only site settings.
- Leads allow public insert only; only admins can read/delete.
- Admin routes are protected server-side in `/app/(admin)/admin/layout.tsx`.

