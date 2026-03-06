# The Fairway Standard — Project Knowledge Base

> **Purpose:** Central reference for The Fairway Standard golf services marketplace. Every AI session and development decision should consult this document. Update it as decisions are made.

---

## 1. Vision & Positioning

**The Fairway Standard** is a structured, verified performance marketplace for booking vetted caddies and golf instructors.

**Strategic positioning:** Structured premium with transparent pricing. Not a discount gig platform. Not a country club replacement. A professional standard for golf services.

**Core value loop:** Verified providers → searchable supply → bookable inventory → paid transaction → review → repeat booking.

**Live URL:** https://thefairwaystandard.org
**Vercel alias:** fairway-standard.vercel.app
**GitHub:** github.com/jcunni254/fairway-standard

---

## 2. Tech Stack (All Connected)

| Platform | Purpose | Status |
|----------|---------|--------|
| **Next.js 15** | App framework (App Router, TypeScript, Tailwind) | Active |
| **Clerk** | Auth & user management | Active |
| **Supabase** | PostgreSQL database, RLS policies | Active |
| **Vercel** | Hosting & deployments | Active |
| **Stripe Connect** | Payment processing (Express accounts, 12% platform fee) | Ready (needs API keys) |
| **Resend** | Booking confirmation & notification emails | Active |
| **PostHog** | Product analytics & pageview tracking | Active |
| **Sentry** | Error monitoring, session replay | Active |
| **Namecheap** | Domain (thefairwaystandard.org) | Active |
| **Cloudflare** | DNS, CDN, security | Optional |

**Clerk instance:** above-bat-30.clerk.accounts.dev
**Supabase project:** yucnwzlbhrytdiwqgukw
**Resend domain:** thefairwaystandard.org (verified)

---

## 3. Marketplace Model

**Type:** Two-sided marketplace
- **Supply:** Caddies, Golf Instructors
- **Demand:** Golfers (players)

**Revenue:** 12% platform commission on bookings via Stripe Connect (Express accounts).

**Future:** Optional premium visibility tier, subscription for caddies ($19.99/mo).

---

## 4. Current Database Schema

The app uses **role-specific tables** (not a unified `profiles` table). This is the authoritative schema:

### Core Tables (Live in Supabase)

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `user_roles` | Maps Clerk user IDs to roles | `id`, `user_id`, `role` |
| `players` | Golfer profiles | `id`, `full_name`, `email`, `avatar_url`, `phone`, `created_at` |
| `caddies` | Caddie profiles | `id`, `full_name`, `email`, `avatar_url`, `bio`, `phone`, `years_experience`, `hourly_rate`, `verified`, `vetting_status`, `subscription_status`, `stripe_subscription_id`, `stripe_customer_id`, `subscription_ends_at`, `created_at`, `updated_at` |
| `instructors` | Instructor profiles | `id`, `full_name`, `email`, `avatar_url`, `bio`, `phone`, `years_experience`, `hourly_rate`, `verified`, `course_id`, `created_at`, `updated_at` |
| `courses` | Golf courses | `id`, `name`, `address`, `city`, `state`, `zip`, `phone`, `website`, `manager_id` |
| `caddie_services` | Services offered by caddies | `id`, `caddie_id`, `title`, `description`, `price`, `duration_minutes`, `available` |
| `instructor_services` | Services offered by instructors | `id`, `instructor_id`, `title`, `description`, `price`, `duration_minutes`, `available` |
| `bookings` | All bookings | `id`, `service_id`, `player_id`, `provider_id`, `status`, `scheduled_at`, `notes`, `total_price`, `created_at`, `updated_at` |
| `reviews` | Post-booking reviews | `id`, `booking_id`, `reviewer_id`, `provider_id`, `rating`, `comment`, `created_at` |
| `waitlist` | Pre-launch signups | `id`, `email`, `created_at` |
| `caddie_vetting_responses` | Caddie quiz answers | `id`, `caddie_id`, `experience_level`, `club_selection_answer`, `course_familiarity`, `etiquette_answer`, `motivation_and_people_skills`, `created_at` |
| `interviews` | Admin interview recordings | `id`, `interviewee_name`, `interviewee_role`, `status`, `duration_seconds`, `audio_url`, `transcript`, `interviewer_notes`, `created_at` |

### Legacy/Inconsistent Table: `profiles`

Some routes (`/api/stripe/checkout`, `/api/stripe/connect`, `/api/bookings`, `/book/[serviceId]`, `/bookings`, `/review/[bookingId]`) reference a `profiles` table with columns `id`, `full_name`, `email`, `stripe_account_id`, `role`, `avatar_url`. **This table may not match the live schema.** These routes need to be migrated to use the role-specific tables (`caddies`, `instructors`, `players`).

### Legacy/Inconsistent Table: `services`

Similarly, some routes reference a unified `services` table, while the actual schema uses `caddie_services` and `instructor_services`. These also need migration.

### Tables Needed (Not Yet Created)

| Table | Purpose | Columns |
|-------|---------|---------|
| `payments` | Payment ledger (source of truth for money) | `id`, `booking_id`, `payment_intent_id`, `charge_id`, `amount_total`, `platform_fee`, `provider_amount`, `currency`, `status`, `created_at`, `updated_at` |

### Booking Status State Machine

```
                  ┌─── declined
                  │
pending ──────────┼─── confirmed ────┬─── completed
                  │                  │
                  └─── cancelled     ├─── cancelled
                                     │
                                     └─── no_show
```

**Transitions:**
- `pending` → `confirmed` (provider accepts)
- `pending` → `declined` (provider declines)
- `pending` → `cancelled` (player cancels)
- `confirmed` → `completed` (provider marks done)
- `confirmed` → `cancelled` (either party)
- `confirmed` → `no_show` (admin/provider, future)

**Rule:** `confirmed` status should only be set after Stripe webhook confirmation for paid bookings.

### RLS Policy Requirements

- Users can only read/write their own rows (via `auth.uid()` matching Clerk JWT)
- Providers see bookings where `provider_id = auth.uid()`
- Players see bookings where `player_id = auth.uid()`
- Admin operations use the service role key (bypass RLS)
- Public read for verified providers only (`verified = true`)

---

## 5. Critical Technical Issues (Current State)

### ISSUE 1: Supabase Client Misuse (HIGH)
Almost every API route and server component creates a bare `createClient(URL, ANON_KEY)` without a Clerk JWT. The Clerk-aware client (`createClerkSupabaseClient` in `src/lib/supabase.ts`) is rarely used. This means **RLS policies see no user identity** — queries either fail silently or rely on overly permissive anon policies.

**Fix:** API routes handling user-scoped operations must use the Clerk-aware client. Admin routes and webhooks must use `getAdminSupabase()` (service role).

### ISSUE 2: Schema Split (HIGH)
The checkout flow, connect flow, bookings API, and several pages reference `profiles` and `services` tables. The rest of the app uses `caddies`/`instructors`/`players` and `caddie_services`/`instructor_services`. This creates runtime failures when the two paradigms don't align.

**Fix:** Standardize on the role-specific tables. Migrate all `profiles`/`services` references.

### ISSUE 3: Webhook Handler Uses Anon Key (CRITICAL)
`/api/stripe/webhook/route.ts` uses `createClient(URL, ANON_KEY)` with no JWT. Webhooks have no user session — this route **must** use the service role client. Current state: writes to `caddies` and `bookings` will fail if RLS is enforced.

**Fix:** Use `getAdminSupabase()` in the webhook handler.

### ISSUE 4: Admin Routes Don't Use Service Role (MEDIUM)
All admin GET/PATCH routes use anon key. They should use `getAdminSupabase()`.

### ISSUE 5: Missing `stripe_customer_id` Write (MEDIUM)
The subscription checkout handler sets subscription fields on `caddies` but never writes `stripe_customer_id`. Subsequent subscription lifecycle events (`updated`, `deleted`, `payment_failed`) filter by `stripe_customer_id` and will never match.

### ISSUE 6: No Price Validation on Non-Stripe Bookings (MEDIUM)
`/api/bookings` POST accepts `totalPrice` from the client body with no server-side validation against the actual service price.

### ISSUE 7: Missing `courseId` in Instructor Onboarding (LOW)
`OnboardingForm` collects `courseId` for instructors but doesn't include it in the API payload.

### ISSUE 8: No Payments Ledger Table (MEDIUM)
Money state is inferred from booking rows. Need a dedicated `payments` table with `payment_intent_id`, amounts, and status for proper accounting and idempotency.

---

## 6. Product Pages & Routes

### Public Pages
| Route | Purpose |
|-------|---------|
| `/` | Landing page — hero, how it works, value props, waitlist |
| `/browse` | Browse verified caddies & instructors, filter by type |
| `/providers/[id]` | Public provider profile with services, reviews, book buttons |
| `/book/[serviceId]` | Booking form (Stripe checkout or request) |
| `/join` | Provider signup landing |
| `/join/caddie` | Caddie-specific recruitment page |
| `/terms` | Terms of Service |
| `/privacy` | Privacy Policy |

### Authenticated Pages
| Route | Purpose | Role |
|-------|---------|------|
| `/onboarding` | Role selection + profile creation | All new users |
| `/onboarding/caddie-vetting` | Caddie vetting questionnaire | Caddies |
| `/dashboard` | Provider home — earnings, bookings, Stripe | Caddies, Instructors |
| `/bookings` | Player booking history | Players |
| `/review/[bookingId]` | Leave a review | Players |

### Course Manager Pages
| Route | Purpose |
|-------|---------|
| `/course` | Course overview & stats |
| `/course/instructors` | Affiliated instructors |
| `/course/bookings` | Course bookings |

### Admin Pages
| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard stats |
| `/admin/bookings` | All bookings |
| `/admin/caddies` | Manage caddies (verify, set rates, view vetting) |
| `/admin/instructors` | Manage instructors (verify) |
| `/admin/players` | View all players |
| `/admin/courses` | View all courses |
| `/admin/interviews` | Manage interview recordings |
| `/admin/interviews/[id]` | Interview detail & transcript |

### API Routes
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/waitlist` | POST | Waitlist signup |
| `/api/auth/role` | GET | Get user roles |
| `/api/onboarding` | POST | Create profile + role |
| `/api/onboarding/caddie-vetting` | POST | Submit vetting quiz |
| `/api/bookings` | POST | Create booking (non-Stripe) |
| `/api/bookings/[id]` | PATCH | Update booking status |
| `/api/reviews` | POST | Submit review |
| `/api/stripe/connect` | POST | Stripe Connect onboarding |
| `/api/stripe/checkout` | POST | Create checkout session |
| `/api/stripe/subscription` | POST | Create subscription checkout |
| `/api/stripe/webhook` | POST | Handle Stripe events |
| `/api/admin/*` | GET/PATCH | Admin CRUD operations |

---

## 7. Brand System

| Element | Value |
|---------|-------|
| **Primary** | Fairway green (`brand-green-500: #2d7a48`) |
| **Secondary** | Navy (`navy-800: #1e3a5f`) |
| **Accent** | Sand gold (`brand-gold-300: #e8bf65`) |
| **Background** | Cream (`brand-cream: #faf8f5`) |
| **Text** | Charcoal (`brand-charcoal: #1c1c1c`) |
| **Body font** | Inter (sans-serif) |
| **Display font** | Playfair Display (serif) |
| **Tone** | Professional, structured, premium. No discount vibe. No slang. |

**Tailwind note:** Both `brand-green-*` and `fairway-*` color scales exist in `tailwind.config.ts` with identical values. Standardize on `brand-green-*` in code.

---

## 8. Environment Variables

All set in Vercel and `.env.local`:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key |
| `CLERK_SECRET_KEY` | Clerk server key |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin key (server-only) |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project key |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN |
| `SENTRY_ORG` / `SENTRY_PROJECT` | Sentry identifiers |
| `RESEND_API_KEY` | Resend email API key |
| `STRIPE_SECRET_KEY` | Stripe server key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_APP_URL` | App base URL |
| `ADMIN_USER_IDS` | Comma-separated Clerk admin IDs |
| `OPENAI_API_KEY` | OpenAI (for interview transcription) |

---

## 9. Security Guardrails

### Non-Negotiables
1. **RLS active on every table.** No exceptions.
2. **No secrets in repo.** All secrets in `.env.local` and Vercel env vars.
3. **Stripe webhooks verified server-side.** Raw body + signature verification.
4. **Role-based route protection.** Middleware + per-route auth checks.
5. **All production errors logged via Sentry.**
6. **No direct DB access from client without RLS policies.**
7. **Service role key is server-only.** Never exposed to client.
8. **Webhooks are the source of truth for payment state.** Never trust client-side payment confirmations.
9. **Idempotent webhook processing.** Same event can arrive multiple times.
10. **Admin actions use service role client.** Not anon key.

### AI-Specific Security Rules
1. **Treat all LLM-generated code as untrusted.** Review for auth gaps, missing RLS, exposed secrets.
2. **Never auto-execute model output** without validation.
3. **Pin dependency versions.** Verify package names (LLMs hallucinate package names).
4. **Never paste secrets into prompts.** Redact logs before sharing.
5. **Build permission tests** that try to read/write other users' rows to prove RLS works.

---

## 10. Sprint Plan (PRD-Aligned)

### Sprint 1: Fix Foundation (Schema + Security)
- [ ] Migrate all `profiles` table references → role-specific tables (`caddies`, `instructors`, `players`)
- [ ] Migrate all `services` table references → `caddie_services` / `instructor_services`
- [ ] Fix Stripe webhook to use `getAdminSupabase()` (service role)
- [ ] Fix all admin routes to use `getAdminSupabase()`
- [ ] Consolidate inline service-role clients to use `getAdminSupabase()`
- [ ] Add server-side price validation to `/api/bookings`
- [ ] Fix `stripe_customer_id` write in subscription checkout handler
- [ ] Fix `courseId` inclusion in instructor onboarding POST
- [ ] Add `stripe_account_id` column to `caddies` and `instructors` tables (currently only on `profiles`)
- [ ] Create `payments` table migration

### Sprint 2: Stripe Connect + Booking Engine
- [ ] Add Stripe API keys to Vercel environment
- [ ] Complete Stripe Connect onboarding for caddies AND instructors
- [ ] Wire `is_verified = true` AND `stripe_account_id IS NOT NULL` as requirements to appear in search
- [ ] Implement PaymentIntent flow (create server-side, confirm client-side, webhook updates DB)
- [ ] Booking becomes `confirmed` only via webhook
- [ ] Implement provider Stripe payout tracking
- [ ] Build the `payments` ledger (insert on webhook events)

### Sprint 3: Provider Approval + Service Creation
- [ ] Admin provider approval dashboard (verify/reject with notes)
- [ ] Provider service creation flow (dashboard → add services)
- [ ] Search & discovery filters (course, service type, date, price, rating)
- [ ] Provider availability system (at minimum, `availability_json` on profiles)
- [ ] Cancellation policy engine (24h free, late = 50%, no-show = full)

### Sprint 4: Polish + Soft Launch
- [ ] Booking under 90 seconds (UX audit)
- [ ] Transparent pricing breakdown on booking page
- [ ] Review average recalculation (DB trigger or post-insert update)
- [ ] Email templates for all booking state transitions
- [ ] Onboard first 10 verified providers (Nashville)
- [ ] Soft launch to controlled golfer audience
- [ ] Push first 25 paid bookings

---

## 11. Phase 2 Roadmap (Post-Launch)

- Calendar sync
- Recurring lesson packages
- Subscription tier for instructors
- Performance tracking
- Loyalty incentives
- AI matching
- Featured provider placement
- Corporate outing booking
- In-app messaging
- Mobile app

---

## 12. Definition of Success (Year 1)

| Metric | Target |
|--------|--------|
| Approved providers | 100 |
| Launch markets | 2–3 cities |
| Total bookings | 2,000 |
| Repeat booking rate | 60%+ |
| Average rating | 4.6+ |
| Unit economics | Positive |

---

## 13. Founder Discipline Rules

Before adding features:
1. Write micro-PRD
2. Define revenue impact
3. Define complexity cost
4. Define measurable success metric

**Build slow. Ship structured. Never dilute premium positioning.**

---

*Last updated: March 2026*
