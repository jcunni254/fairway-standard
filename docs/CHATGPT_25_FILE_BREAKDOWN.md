# ChatGPT Project Context — 25-File Breakdown

Use this list when you create a **ChatGPT project** (e.g. for working from your phone). ChatGPT projects allow a **maximum of 25 files**. Attach exactly these 25 files so the model has full platform context without overflow.

---

## How to Use

1. In ChatGPT, create or open a project for **The Fairway Standard**.
2. Add **exactly these 25 files** (in any order). Paths are relative to the **repo root** `agentic-project-management/`.
3. If your ChatGPT project root is **`fairway-standard/`** instead of the whole repo, use the paths under "If project root is `fairway-standard/`" for files 4–25, and copy **FAIRWAY_STANDARD_PROJECT.md** and **CHATGPT_PLATFORM_CONTEXT.md** into `fairway-standard/` so they’re inside the project.

---

## The 25 Files

| # | File path (from repo root) | Purpose |
|---|----------------------------|--------|
| 1 | **FAIRWAY_STANDARD_PROJECT.md** | Full PRD: vision, schema, product routes, known issues, sprint plan, env vars, security. Primary reference. |
| 2 | **CHATGPT_PLATFORM_CONTEXT.md** | Condensed reference: schema tables, Supabase/client rules, env list, brand, and critical issues. Use when you need a quick lookup. |
| 3 | **.cursor/rules/fairway-standard-context.mdc** | Cursor rule: tech stack, schema rules, Supabase client usage, security non-negotiables, brand. |
| 4 | **fairway-standard/package.json** | Dependencies and scripts (Next.js, Clerk, Supabase, Stripe, etc.). |
| 5 | **fairway-standard/tailwind.config.ts** | Brand colors (`brand-green-*`, `navy-*`, `brand-gold-*`), fonts (Inter, Playfair Display). |
| 6 | **fairway-standard/src/app/layout.tsx** | Root layout: ClerkProvider, fonts, NavBar, Footer, PostHog. |
| 7 | **fairway-standard/src/app/page.tsx** | Landing page: hero, auth redirects, course map, waitlist, caddie CTA. |
| 8 | **fairway-standard/src/app/api/auth/role/route.ts** | GET user roles (admin from env + `user_roles` table). |
| 9 | **fairway-standard/src/app/api/onboarding/route.ts** | POST onboarding: role, profile creation in `players`/`caddies`/`instructors`/`courses`. |
| 10 | **fairway-standard/src/app/api/onboarding/caddie-vetting/route.ts** | POST caddie vetting quiz → `caddie_vetting_responses`, updates `caddies.vetting_status`. |
| 11 | **fairway-standard/src/app/api/profile/route.ts** | PATCH profile by role (Clerk-aware Supabase client; `caddies`/`instructors`/`players`). |
| 12 | **fairway-standard/src/app/api/admin/caddies/[id]/route.ts** | PATCH admin caddie (rate, verified, vetting_status, subscription_status); uses `getAdminSupabase()` and `requireAdmin()`. |
| 13 | **fairway-standard/src/lib/phone.ts** | Phone normalization: E.164 for Clerk, display format for DB/UI. |
| 14 | **fairway-standard/src/components/OnboardingForm.tsx** | Role selection + profile form; calls `/api/onboarding`. |
| 15 | **fairway-standard/src/components/ProfileEditForm.tsx** | Dashboard profile edit form; calls `/api/profile` PATCH. |
| 16 | **fairway-standard/src/components/NavBar.tsx** | Main nav: auth, roles, links (browse, dashboard, admin). |
| 17 | **fairway-standard/src/components/CustomSignIn.tsx** | Phone + password sign-in (Client Trust disabled); uses `phone.ts`. |
| 18 | **fairway-standard/src/components/BuilderProfileView.tsx** | Builder.io-driven profile view (dashboard profile page). |
| 19 | **fairway-standard/src/app/dashboard/profile/page.tsx** | Provider profile page: role-based profile data, ProfileEditForm, BuilderProfileView. |
| 20 | **fairway-standard/src/app/admin/page.tsx** | Admin dashboard: counts (caddies, instructors, players, courses, bookings, revenue, subscriptions). |
| 21 | **fairway-standard/src/app/admin/caddies/page.tsx** | Admin caddie list: rates, verification, vetting, subscription; uses `getAdminSupabase()`. |
| 22 | **fairway-standard/src/app/admin/players/page.tsx** | Admin players list. |
| 23 | **fairway-standard/src/app/join/page.tsx** | Provider signup landing (join flow). |
| 24 | **fairway-standard/src/app/sign-in/[[...sign-in]]/page.tsx** | Sign-in route; renders CustomSignIn. |
| 25 | **fairway-standard/supabase/migrations/20250305_add_caddie_hometown_home_course.sql** | Example migration: `caddies.hometown`, `caddies.home_golf_course`. |

---

## If project root is `fairway-standard/`

For files **4–25**, use these paths (relative to `fairway-standard/`):

- `package.json`
- `tailwind.config.ts`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/api/auth/role/route.ts`
- `src/app/api/onboarding/route.ts`
- `src/app/api/onboarding/caddie-vetting/route.ts`
- `src/app/api/profile/route.ts`
- `src/app/api/admin/caddies/[id]/route.ts`
- `src/lib/phone.ts`
- `src/components/OnboardingForm.tsx`
- `src/components/ProfileEditForm.tsx`
- `src/components/NavBar.tsx`
- `src/components/CustomSignIn.tsx`
- `src/components/BuilderProfileView.tsx`
- `src/app/dashboard/profile/page.tsx`
- `src/app/admin/page.tsx`
- `src/app/admin/caddies/page.tsx`
- `src/app/admin/players/page.tsx`
- `src/app/join/page.tsx`
- `src/app/sign-in/[[...sign-in]]/page.tsx`
- `supabase/migrations/20250305_add_caddie_hometown_home_course.sql`

Place **FAIRWAY_STANDARD_PROJECT.md** and **CHATGPT_PLATFORM_CONTEXT.md** in `fairway-standard/` (e.g. copy from repo root) so they count as files 1 and 2.

---

## What’s not in the 25 (and why)

- **Other API routes** (bookings, reviews, Stripe): Not listed due to 25-file limit; behavior is described in FAIRWAY_STANDARD_PROJECT.md and CHATGPT_PLATFORM_CONTEXT.md.
- **`src/lib/supabase.ts` / `supabase-admin.ts` / `admin.ts`**: Referenced in code but may be missing in the repo; their **expected behavior** is in FAIRWAY_STANDARD_PROJECT.md and CHATGPT_PLATFORM_CONTEXT.md (user-scoped vs admin/client usage).
- **Other pages** (browse, book, bookings, review, terms, privacy, course, other admin): Documented in the PRD; add a specific file to the 25 if you need to work on one of them and swap out a less relevant file.

---

*Last updated: March 2026*
