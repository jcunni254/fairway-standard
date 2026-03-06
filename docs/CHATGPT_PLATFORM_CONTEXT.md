# The Fairway Standard — Platform Context (ChatGPT Quick Reference)

Use this with **FAIRWAY_STANDARD_PROJECT.md** when working in a ChatGPT project. This file is a condensed reference for schema, clients, env, brand, and critical issues.

---

## What This Is

**The Fairway Standard** = two-sided marketplace for booking vetted caddies and golf instructors. Supply: caddies, instructors. Demand: golfers (players). Revenue: 12% platform commission via Stripe Connect; caddies pay $19.99/mo subscription.

**Stack:** Next.js 15, Clerk, Supabase, Stripe Connect, Vercel, Resend, PostHog, Sentry.

---

## Database Schema (Authoritative)

**Role-specific tables only.** Do **not** use `profiles` or `services` (legacy; migrate to below).

| Table | Purpose |
|-------|--------|
| `user_roles` | Maps Clerk `user_id` → `role` (player, caddie, instructor, course_manager) |
| `players` | Golfer profiles: full_name, email, avatar_url, phone |
| `caddies` | Caddie profiles: full_name, email, avatar_url, bio, phone, years_experience, hourly_rate, verified, vetting_status, subscription_status, stripe_*, hometown, home_golf_course |
| `instructors` | Instructor profiles: full_name, email, avatar_url, bio, phone, years_experience, hourly_rate, verified, course_id |
| `courses` | Golf courses: name, address, city, state, zip, phone, website, manager_id |
| `caddie_services` | caddie_id, title, description, price, duration_minutes, available |
| `instructor_services` | instructor_id, title, description, price, duration_minutes, available |
| `bookings` | service_id, player_id, provider_id, status, scheduled_at, notes, total_price |
| `reviews` | booking_id, reviewer_id, provider_id, rating, comment |
| `waitlist` | Pre-launch signups (email) |
| `caddie_vetting_responses` | Caddie quiz: experience_level, club_selection_answer, course_familiarity, etiquette_answer, motivation_and_people_skills |
| `interviews` | Admin interview recordings (audio_url, transcript, etc.) |

**Booking status:** `pending` → `confirmed` | `declined` | `cancelled`; `confirmed` → `completed` | `cancelled` | `no_show`. Set `confirmed` only after Stripe webhook for paid bookings.

---

## Supabase Client Rules (Critical)

| Context | Client to use |
|--------|----------------|
| User-scoped API routes (profile, bookings, etc.) | `createClerkSupabaseClient(getToken)` from `src/lib/supabase.ts` |
| Admin routes, webhooks (no user session) | `getAdminSupabase()` from `src/lib/supabase-admin.ts` |
| Public read-only | Anon client acceptable |

- **Never** use inline `createClient(URL, SERVICE_ROLE_KEY)`. Always use `getAdminSupabase()`.
- Admin API routes must also call `requireAdmin()` from `src/lib/admin.ts`.
- If `supabase.ts` / `supabase-admin.ts` / `admin.ts` are missing, implement them per FAIRWAY_STANDARD_PROJECT.md and this spec.

---

## Environment Variables

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL`, `ADMIN_USER_IDS` (comma-separated Clerk user IDs)
- `RESEND_API_KEY`, `NEXT_PUBLIC_POSTHOG_*`, `NEXT_PUBLIC_SENTRY_DSN`, `OPENAI_API_KEY` (optional)

---

## Brand

- **Primary:** `brand-green-*` (e.g. brand-green-500 #2d7a48)
- **Secondary:** `navy-*` (e.g. navy-800 #1e3a5f)
- **Accent:** `brand-gold-*`
- **Background:** brand-cream; **text:** brand-charcoal
- **Fonts:** Inter (body), Playfair Display (display). Use `brand-green-*` in code, not `fairway-*`.

---

## Critical Known Issues (from PRD)

1. **Supabase client misuse:** Many routes use `createClient(URL, ANON_KEY)` without Clerk JWT → RLS sees no user. Use Clerk-aware client for user-scoped work; `getAdminSupabase()` for admin/webhooks.
2. **Schema split:** Some code still references `profiles` / `services`. Migrate to role-specific tables.
3. **Stripe webhook** must use `getAdminSupabase()`, not anon client.
4. **Admin routes** should use `getAdminSupabase()`, not anon key.
5. **stripe_customer_id** must be written on caddie when creating subscription checkout.
6. **Price validation:** `/api/bookings` must validate `totalPrice` against service price server-side.
7. **Instructor onboarding:** Include `courseId` in onboarding API payload when role is instructor.
8. **Payments table:** Add `payments` ledger (payment_intent_id, amounts, status) for accounting.

---

## Key Routes (for context)

- **Public:** `/`, `/browse`, `/providers/[id]`, `/book/[serviceId]`, `/join`, `/join/caddie`, `/terms`, `/privacy`
- **Auth:** `/onboarding`, `/onboarding/caddie-vetting`, `/dashboard`, `/bookings`, `/review/[bookingId]`
- **Admin:** `/admin`, `/admin/caddies`, `/admin/players`, `/admin/instructors`, etc.
- **API:** `/api/onboarding`, `/api/profile`, `/api/auth/role`, `/api/bookings`, `/api/stripe/*`, `/api/admin/*`

---

*See FAIRWAY_STANDARD_PROJECT.md for full PRD, sprint plan, and security rules.*
