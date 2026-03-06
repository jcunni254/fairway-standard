# The Fairway Standard — Full Project Context for Cursor Agent

> **Instructions:** Paste this entire document into your Cursor agent chat when you first open the project. It gives your AI agent complete context about the codebase, architecture, conventions, known issues, and sprint plan. After ingesting this, set up the Cursor Rule described at the bottom so every future session starts with this context automatically.

---

## 1. What This Project Is

**The Fairway Standard** is a two-sided marketplace for booking vetted caddies and golf instructors. Think of it as the "structured, premium" alternative to informal caddie booking — not a discount gig platform, not a country club replacement. Professional standard for golf services.

- **Supply side:** Caddies and golf instructors apply, get vetted via a 5-question quiz, and are approved by admins before they appear in search.
- **Demand side:** Golfers browse verified providers, book services, pay via Stripe, and leave reviews.
- **Revenue model:** 12% platform commission on every booking, collected via Stripe Connect (Express accounts). Caddies also pay a $19.99/mo subscription to be listed.

**Live URL:** https://thefairwaystandard.org
**Vercel alias:** fairway-standard.vercel.app
**GitHub:** github.com/jcunni254/fairway-standard

---

## 2. Tech Stack (Every Service and Why)

| Service | Purpose | Status |
|---------|---------|--------|
| **Next.js 15** | App framework — App Router, TypeScript, Tailwind CSS | Active |
| **Clerk** | Authentication & user management (sign-up, sign-in, session tokens) | Active |
| **Supabase** | PostgreSQL database with Row Level Security (RLS) | Active |
| **Stripe Connect** | Payment processing — Express accounts, 12% platform fee | Wired (needs live API keys) |
| **Vercel** | Hosting, CI/CD, edge deployments | Active |
| **Resend** | Transactional emails (booking confirmations, provider notifications) | Active |
| **PostHog** | Product analytics & pageview tracking | Active |
| **Sentry** | Error monitoring, session replay, performance traces | Active |
| **Mapbox** | Interactive course map on landing page | Active |
| **OpenAI** | Interview transcription (admin feature) | Active |
| **Namecheap** | Domain registrar (thefairwaystandard.org) | Active |

**Key identifiers:**
- Clerk instance: `above-bat-30.clerk.accounts.dev`
- Supabase project ID: `yucnwzlbhrytdiwqgukw`
- Resend sending domain: `thefairwaystandard.org`

### Package Versions (from package.json)

```
next: ^15.2.4
react/react-dom: ^19.1.0
@clerk/nextjs: ^6.12.12
@supabase/supabase-js: ^2.49.4
stripe: ^20.4.0
framer-motion: ^12.34.3
@sentry/nextjs: ^10.40.0
resend: ^6.9.2
openai: ^6.25.0
mapbox-gl: ^3.19.0
tailwindcss: ^3.4.16
typescript: ^5.7.2
```

---

## 3. Project Structure

```
fairway-standard/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── layout.tsx                # Root layout (ClerkProvider, fonts, NavBar, Footer)
│   │   ├── page.tsx                  # Landing page (hero, course map, caddie CTA, partnerships)
│   │   ├── globals.css               # Tailwind + custom CSS (map styles, animations)
│   │   ├── providers.tsx             # PostHog provider wrapper
│   │   ├── global-error.tsx          # Sentry global error boundary
│   │   ├── browse/page.tsx           # Browse verified caddies & instructors
│   │   ├── book/[serviceId]/page.tsx # Booking form (Stripe checkout or request)
│   │   ├── bookings/page.tsx         # Player booking history
│   │   ├── dashboard/page.tsx        # Provider dashboard (earnings, bookings, Stripe)
│   │   ├── onboarding/page.tsx       # Role selection + profile creation
│   │   ├── onboarding/caddie-vetting/page.tsx  # Caddie vetting questionnaire
│   │   ├── join/page.tsx             # Provider signup landing
│   │   ├── join/caddie/page.tsx      # Caddie-specific recruitment page
│   │   ├── providers/[id]/page.tsx   # Public provider profile
│   │   ├── review/[bookingId]/page.tsx # Post-booking review form
│   │   ├── course/                   # Course manager pages (layout, overview, instructors, bookings)
│   │   ├── admin/                    # Admin pages (dashboard, caddies, instructors, players, bookings, courses, interviews)
│   │   ├── privacy/page.tsx          # Privacy policy
│   │   ├── terms/page.tsx            # Terms of service
│   │   └── api/                      # API routes
│   │       ├── waitlist/route.ts
│   │       ├── auth/role/route.ts
│   │       ├── onboarding/route.ts
│   │       ├── onboarding/caddie-vetting/route.ts
│   │       ├── bookings/route.ts
│   │       ├── bookings/[id]/route.ts
│   │       ├── reviews/route.ts
│   │       ├── stripe/checkout/route.ts
│   │       ├── stripe/connect/route.ts
│   │       ├── stripe/subscription/route.ts
│   │       ├── stripe/webhook/route.ts
│   │       └── admin/               # Admin CRUD API routes
│   ├── components/                   # Shared UI components
│   │   ├── NavBar.tsx
│   │   ├── Footer.tsx
│   │   ├── BookingForm.tsx
│   │   ├── BookingActions.tsx
│   │   ├── OnboardingForm.tsx
│   │   ├── CaddieVettingWizard.tsx
│   │   ├── CaddieVettingViewer.tsx
│   │   ├── CaddieRateEditor.tsx
│   │   ├── ReviewForm.tsx
│   │   ├── StarRating.tsx
│   │   ├── WaitlistForm.tsx
│   │   ├── CourseMap.tsx
│   │   ├── AdminSidebar.tsx
│   │   ├── InterviewUploadForm.tsx
│   │   ├── InstructorVerifyButton.tsx
│   │   ├── StripeConnectButton.tsx
│   │   ├── SubscriptionButton.tsx
│   │   └── motion/                   # Animation wrappers
│   │       ├── ScrollReveal.tsx
│   │       ├── StaggerContainer.tsx
│   │       ├── StaggerItem.tsx
│   │       ├── AnimatedCounter.tsx
│   │       ├── HoverVideo.tsx
│   │       ├── ParallaxImage.tsx
│   │       └── SmoothScroll.tsx
│   ├── lib/                          # Utility modules
│   │   ├── supabase.ts               # Clerk-aware Supabase client (for user-scoped queries)
│   │   ├── supabase-admin.ts         # Service role Supabase client (for admin/webhook ops)
│   │   ├── stripe.ts                 # Stripe singleton + constants (12% fee, subscription price)
│   │   ├── email.ts                  # Resend email helpers (booking confirmation, provider notification)
│   │   └── admin.ts                  # Admin auth helpers (requireAdmin, isAdmin)
│   ├── middleware.ts                 # Clerk middleware — route protection (admin, dashboard, bookings, onboarding)
│   ├── instrumentation.ts           # Sentry server instrumentation
│   └── instrumentation-client.ts    # Sentry client instrumentation
├── supabase/
│   └── migrations/
│       └── 20260302_caddie_vetting.sql  # Vetting status + responses table migration
├── public/                           # Static assets (logos, images)
├── FAIRWAY_STANDARD_PROJECT.md       # Central knowledge base (PRD, schema, sprint plan)
├── SETUP_NEXT_STEPS.md               # Platform integration status
├── .env.local.example                # Template for environment variables
├── tailwind.config.ts                # Custom brand colors, fonts
├── next.config.ts                    # Sentry-wrapped Next.js config
├── tsconfig.json                     # TypeScript config (path alias: @/* → ./src/*)
├── package.json
└── postcss.config.mjs
```

---

## 4. Database Schema (Authoritative — This Is What Exists in Supabase)

### Core Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `user_roles` | Maps Clerk user IDs to platform roles | `id`, `user_id`, `role` |
| `players` | Golfer profiles | `id`, `full_name`, `email`, `avatar_url`, `phone`, `created_at` |
| `caddies` | Caddie profiles | `id`, `full_name`, `email`, `avatar_url`, `bio`, `phone`, `years_experience`, `hourly_rate`, `verified`, `vetting_status`, `subscription_status`, `stripe_subscription_id`, `stripe_customer_id`, `subscription_ends_at`, `created_at`, `updated_at` |
| `instructors` | Instructor profiles | `id`, `full_name`, `email`, `avatar_url`, `bio`, `phone`, `years_experience`, `hourly_rate`, `verified`, `course_id`, `created_at`, `updated_at` |
| `courses` | Golf courses | `id`, `name`, `address`, `city`, `state`, `zip`, `phone`, `website`, `manager_id` |
| `caddie_services` | Services offered by caddies | `id`, `caddie_id`, `title`, `description`, `price`, `duration_minutes`, `available` |
| `instructor_services` | Services offered by instructors | `id`, `instructor_id`, `title`, `description`, `price`, `duration_minutes`, `available` |
| `bookings` | All bookings | `id`, `service_id`, `player_id`, `provider_id`, `status`, `scheduled_at`, `notes`, `total_price`, `created_at`, `updated_at` |
| `reviews` | Post-booking reviews | `id`, `booking_id`, `reviewer_id`, `provider_id`, `rating`, `comment`, `created_at` |
| `waitlist` | Pre-launch email signups | `id`, `email`, `created_at` |
| `caddie_vetting_responses` | Caddie quiz answers (5 questions) | `id`, `caddie_id`, `experience_level`, `club_selection_answer`, `course_familiarity`, `etiquette_answer`, `motivation_and_people_skills`, `created_at` |
| `interviews` | Admin interview recordings | `id`, `interviewee_name`, `interviewee_role`, `status`, `duration_seconds`, `audio_url`, `transcript`, `interviewer_notes`, `created_at` |

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

- `pending` → `confirmed` (provider accepts)
- `pending` → `declined` (provider declines)
- `pending` → `cancelled` (player cancels)
- `confirmed` → `completed` (provider marks done)
- `confirmed` → `cancelled` (either party)
- `confirmed` → `no_show` (admin/provider, future)
- **Rule:** `confirmed` should only be set after Stripe webhook confirmation for paid bookings.

### Table That Needs to Be Created

| Table | Purpose | Columns |
|-------|---------|---------|
| `payments` | Payment ledger (source of truth for money) | `id`, `booking_id`, `payment_intent_id`, `charge_id`, `amount_total`, `platform_fee`, `provider_amount`, `currency`, `status`, `created_at`, `updated_at` |

### RLS Policy Rules

- Users read/write their own rows (`auth.uid()` matching Clerk JWT `sub` claim)
- Providers see bookings where `provider_id = auth.uid()`
- Players see bookings where `player_id = auth.uid()`
- Admin operations use service role key (bypasses RLS)
- Public read for verified providers only (`verified = true`)

---

## 5. Authentication & Authorization Architecture

### Clerk Setup

- Clerk manages all authentication (sign-up, sign-in, OAuth, session tokens)
- Root layout wraps everything in `<ClerkProvider>`
- Clerk issues JWTs that Supabase uses for RLS via `auth.jwt()->>'sub'`

### Middleware (`src/middleware.ts`)

- `/admin/*` — requires user ID in `ADMIN_USER_IDS` env var, otherwise redirects to `/`
- `/course/*`, `/dashboard/*`, `/bookings/*`, `/onboarding/*` — requires authenticated user, otherwise redirects to `/join`

### Admin Auth (`src/lib/admin.ts`)

- `requireAdmin()` — returns userId if admin, null otherwise
- `isAdmin(userId)` — boolean check
- Admin IDs stored in `ADMIN_USER_IDS` env var (comma-separated Clerk user IDs)

### Supabase Client Rules (CRITICAL — Follow These Exactly)

| Context | Which Client | Import From |
|---------|-------------|-------------|
| API routes handling user data | `createClerkSupabaseClient(getToken)` | `src/lib/supabase.ts` |
| Admin API routes | `getAdminSupabase()` | `src/lib/supabase-admin.ts` |
| Stripe webhook handler | `getAdminSupabase()` | `src/lib/supabase-admin.ts` |
| Server components (user data) | `createClerkSupabaseClient` with Clerk session | `src/lib/supabase.ts` |
| Server components (public data) | Anon client acceptable | direct `createClient` |

**NEVER create inline `createClient(URL, SUPABASE_SERVICE_ROLE_KEY)`.** Always use `getAdminSupabase()`.

---

## 6. Stripe Integration Details

### Architecture

- **Stripe Connect** with Express accounts — providers onboard their own Stripe account
- **12% platform fee** (`PLATFORM_FEE_PERCENT = 12` in `src/lib/stripe.ts`)
- **Caddie subscription:** $19.99/mo (`CADDIE_MONTHLY_AMOUNT = 1999` cents)
- Stripe client is a lazy singleton via `getStripe()` in `src/lib/stripe.ts`
- API version: `2026-02-25.clover`

### API Routes

| Route | Purpose |
|-------|---------|
| `/api/stripe/connect` | Creates Stripe Connect onboarding link for providers |
| `/api/stripe/checkout` | Creates Stripe Checkout Session for booking payment |
| `/api/stripe/subscription` | Creates subscription checkout for caddie monthly plan |
| `/api/stripe/webhook` | Handles all Stripe webhook events (payment, subscription lifecycle) |

### Webhook Rules

1. Webhooks are the **source of truth** for payment state — never trust client-side
2. Verify signatures using raw body (`request.text()` — Next.js may modify body)
3. Webhook handler **must** use `getAdminSupabase()` (no user session in webhooks)
4. Process idempotently — same event can arrive multiple times

---

## 7. Known Issues (Current State — Read Carefully)

These are documented bugs and architectural problems that need fixing:

### ISSUE 1: Supabase Client Misuse (HIGH)
Almost every API route creates a bare `createClient(URL, ANON_KEY)` without a Clerk JWT. This means RLS policies see no user identity, so queries either fail silently or rely on overly permissive anon policies.

### ISSUE 2: Schema Split (HIGH)
Some routes reference legacy `profiles` and `services` tables. The actual schema uses `caddies`/`instructors`/`players` and `caddie_services`/`instructor_services`. This causes runtime failures.

### ISSUE 3: Webhook Handler Uses Anon Key (CRITICAL)
`/api/stripe/webhook/route.ts` uses anon client with no JWT. Must use `getAdminSupabase()`.

### ISSUE 4: Admin Routes Don't Use Service Role (MEDIUM)
Admin GET/PATCH routes use anon key. Should use `getAdminSupabase()`.

### ISSUE 5: Missing `stripe_customer_id` Write (MEDIUM)
Subscription checkout sets subscription fields on `caddies` but never writes `stripe_customer_id`. Downstream lifecycle events filter by `stripe_customer_id` and will never match.

### ISSUE 6: No Price Validation on Non-Stripe Bookings (MEDIUM)
`/api/bookings` POST accepts `totalPrice` from client body without server-side validation against actual service price.

### ISSUE 7: Missing `courseId` in Instructor Onboarding (LOW)
`OnboardingForm` collects `courseId` for instructors but doesn't include it in the API payload.

### ISSUE 8: No Payments Ledger Table (MEDIUM)
Money state is inferred from booking rows. Need a dedicated `payments` table.

---

## 8. Sprint Plan (What We're Building, In Order)

### Sprint 1: Fix Foundation (Schema + Security) ← CURRENT PRIORITY
- Migrate all `profiles` references → `caddies`/`instructors`/`players`
- Migrate all `services` references → `caddie_services`/`instructor_services`
- Fix Stripe webhook to use `getAdminSupabase()`
- Fix all admin routes to use `getAdminSupabase()`
- Consolidate inline service-role clients
- Add server-side price validation to `/api/bookings`
- Fix `stripe_customer_id` write in subscription checkout
- Fix `courseId` in instructor onboarding
- Add `stripe_account_id` column to `caddies` and `instructors`
- Create `payments` table migration

### Sprint 2: Stripe Connect + Booking Engine
- Add live Stripe API keys
- Complete Connect onboarding for both provider types
- Wire `verified = true` AND `stripe_account_id IS NOT NULL` for search visibility
- Implement PaymentIntent flow (create server-side, confirm client-side, webhook updates DB)
- Booking becomes `confirmed` only via webhook
- Provider payout tracking
- Build `payments` ledger

### Sprint 3: Provider Approval + Service Creation
- Admin approval dashboard (verify/reject with notes)
- Provider service creation flow
- Search filters (course, service type, date, price, rating)
- Provider availability system
- Cancellation policy engine (24h free, late = 50%, no-show = full)

### Sprint 4: Polish + Soft Launch
- Booking under 90 seconds (UX audit)
- Transparent pricing breakdown
- Review average recalculation
- Email templates for all booking state transitions
- Onboard first 10 providers (Nashville)
- Soft launch, push first 25 paid bookings

---

## 9. Brand System & Design Conventions

### Colors (Tailwind)

| Token | Hex | Usage |
|-------|-----|-------|
| `brand-green-500` | `#2d7a48` | Primary — buttons, accents |
| `navy-800` | `#1e3a5f` | Secondary — headers, dark backgrounds |
| `brand-gold-300` | `#e8bf65` | Accent — highlights, CTAs, premium feel |
| `brand-cream` | `#faf8f5` | Background |
| `brand-charcoal` | `#1c1c1c` | Body text |

**Important:** Both `brand-green-*` and `fairway-*` color scales exist in `tailwind.config.ts` with identical values. **Always use `brand-green-*`** in code.

### Typography

- **Body font:** Inter (`font-sans`, CSS variable `--font-inter`)
- **Display/heading font:** Playfair Display (`font-display`, CSS variable `--font-playfair`)

### Tone

Professional, structured, premium. No discount vibe. No slang. Think "the standard for golf services" — not "cheap caddies near you."

### Custom CSS Utilities (in globals.css)

- `.text-gradient-gold` — gold gradient text
- `.text-gradient-green` — green gradient text
- `.animate-gradient` — shifting background gradient
- `.animate-glow` — pulsing gold glow
- `.tfs-pin`, `.tfs-popup-wrap`, etc. — Mapbox course map styling

---

## 10. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your keys:

```
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=

# Resend
RESEND_API_KEY=

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# Sentry
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=

# OpenAI
OPENAI_API_KEY=

# App
NEXT_PUBLIC_APP_URL=https://thefairwaystandard.org
ADMIN_USER_IDS=   # comma-separated Clerk user IDs
```

---

## 11. Security Rules (Non-Negotiable)

1. **RLS active on every table.** No exceptions.
2. **No secrets in the repo.** All secrets in `.env.local` and Vercel env vars.
3. **Stripe webhooks verified server-side.** Use raw body + signature verification.
4. **Webhooks are the source of truth** for payment state. Never trust client-side.
5. **Service role key is server-only.** Never expose to client.
6. **Admin actions use `getAdminSupabase()`** (service role). Not the anon key.
7. **Idempotent webhook processing.** Same event can arrive multiple times.
8. **Pin dependency versions.** Verify package names before installing (LLMs hallucinate package names).
9. **Never paste secrets into prompts.** Redact logs before sharing.
10. **Role-based route protection** via middleware + per-route checks.

---

## 12. How to Run the Project Locally

```bash
# Clone the repo
git clone https://github.com/jcunni254/fairway-standard.git
cd fairway-standard

# Install dependencies
npm install

# Copy env template and fill in your keys
cp .env.local.example .env.local
# (edit .env.local with your actual keys — get them from Jacob)

# Start dev server with Turbopack
npm run dev
```

The dev server runs at `http://localhost:3000`. The landing page auto-redirects authenticated users based on their role (admin → `/admin`, provider → `/dashboard`, player → `/browse`).

---

## 13. Path Alias

TypeScript path alias is configured: `@/*` maps to `./src/*`. So `import NavBar from "@/components/NavBar"` resolves to `./src/components/NavBar`.

---

## 14. Feature Development Discipline

Before adding any feature:
1. Check `FAIRWAY_STANDARD_PROJECT.md` sprint plan — is this in scope?
2. Does it advance the core value loop? (providers → search → book → pay → review → repeat)
3. Write a micro-PRD if it's non-trivial
4. Define revenue impact, complexity cost, and measurable success metric
5. **Build slow. Ship structured. Never dilute premium positioning.**

---

## 15. Year 1 Success Metrics

| Metric | Target |
|--------|--------|
| Approved providers | 100 |
| Launch markets | 2–3 cities |
| Total bookings | 2,000 |
| Repeat booking rate | 60%+ |
| Average rating | 4.6+ |
| Unit economics | Positive |

---

## 16. Setup Your Cursor Rule (Do This After Reading)

Create a file at `.cursor/rules/fairway-standard.mdc` in your project with this content so every future Cursor session has context automatically:

```
---
description: The Fairway Standard project context, tech stack, and conventions
alwaysApply: true
---

# The Fairway Standard — Project Context

## What This Project Is

**The Fairway Standard** is a structured, verified performance marketplace for booking vetted caddies and golf instructors. Two-sided marketplace: supply (caddies, instructors) and demand (golfers). Revenue via 12% platform commission on Stripe Connect.

## Tech Stack

| Service | Purpose |
|---------|---------|
| Next.js 15 | App framework (App Router, TypeScript, Tailwind) |
| Clerk | Auth & user management |
| Supabase | PostgreSQL database, RLS policies |
| Stripe Connect | Payments (Express accounts, 12% fee) |
| Vercel | Hosting & deployments |
| Resend | Transactional emails |
| PostHog | Product analytics |
| Sentry | Error monitoring |

## Central Knowledge Base

- **Full PRD, schema, gap analysis, sprint plan:** `FAIRWAY_STANDARD_PROJECT.md` (repo root)
- **Always consult this file** before making architectural decisions or adding features.

## Database Schema (Authoritative)

Role-specific tables: `user_roles`, `players`, `caddies`, `instructors`, `courses`, `caddie_services`, `instructor_services`, `bookings`, `reviews`, `waitlist`, `caddie_vetting_responses`, `interviews`.

**NEVER reference `profiles` or `services` as table names.** These are legacy references that need migration.

## Supabase Client Rules (Critical)

| Context | Client |
|---------|--------|
| User-scoped API routes | `createClerkSupabaseClient(getToken)` from `src/lib/supabase.ts` |
| Admin routes / webhooks | `getAdminSupabase()` from `src/lib/supabase-admin.ts` |
| Public read-only queries | Anon client acceptable |

**Never** create inline `createClient(URL, SERVICE_ROLE_KEY)`. Use `getAdminSupabase()`.

## Security Non-Negotiables

1. RLS active on every table
2. No secrets in repo
3. Stripe webhooks verified with raw body + signature
4. Webhooks are source of truth for payment state
5. Service role key is server-only
6. Admin actions use service role client
7. Idempotent webhook processing
8. Pin dependency versions; verify package names

## Brand

- Colors: `brand-green-*` (primary), `navy-*` (secondary), `brand-gold-*` (accent)
- Use `brand-green-*` not `fairway-*` (both exist, standardize on `brand-green`)
- Font: Inter (sans), Playfair Display (display)
- Tone: Professional, structured, premium. No discount vibe. No slang.
```

---

*This document was generated March 2, 2026. The authoritative project knowledge base is `FAIRWAY_STANDARD_PROJECT.md` in the repo root — always keep that file updated as the single source of truth.*
