# The Fairway Standard — Project Knowledge Base

> **Purpose:** Central reference for The Fairway Standard golf services startup. Use this document to orient yourself and maintain consistency across sessions. Update it as decisions are made.

---

## Vision

**The Fairway Standard** is a golf services startup focused on making caddie and golf instructor bookings affordable and accessible. Players can book either service at lower rates than typical market pricing.

---

## Tech Stack & Integration Order

Follow this order when connecting platforms. Each step builds on the previous.

| Phase | Platform | Purpose | Key Docs |
|-------|----------|---------|----------|
| 1 | **Supabase** | PostgreSQL database, auth provider integration | [supabase.com/docs](https://supabase.com/docs) |
| 2 | **Next.js** | App framework (use with App Router) | [nextjs.org/docs](https://nextjs.org/docs) |
| 3 | **Clerk** | Auth & user management | [clerk.com/docs](https://clerk.com/docs) |
| 4 | **Clerk ↔ Supabase** | JWT template + RLS policies | [clerk.com/docs/integrations/databases/supabase](https://clerk.com/docs/guides/development/integrations/databases/supabase) |
| 5 | **Vercel** | Hosting & deployments | [vercel.com/docs](https://vercel.com/docs) |
| 6 | **Resend** | Transactional emails | [resend.com/docs](https://resend.com/docs) |
| 7 | **PostHog** | Product analytics & funnels | [posthog.com/docs](https://posthog.com/docs) |
| 8 | **Sentry** | Error monitoring & debugging | [sentry.io/docs](https://docs.sentry.io) |
| 9 | **Cloudflare** | DNS, CDN, security (optional edge layer) | [developers.cloudflare.com](https://developers.cloudflare.com) |
| 10 | **Namecheap** | Domain registration & DNS | Connect via Vercel or Cloudflare |

---

## Clerk + Supabase Integration (Critical Path)

1. **Vercel Marketplace:** Install Clerk via [Vercel Marketplace](https://vercel.com/marketplace/clerk) for fastest setup.
2. **Supabase as third-party auth:** In Clerk Dashboard → [Supabase setup](https://dashboard.clerk.com/setup/supabase) → Activate integration.
3. **Supabase Dashboard:** Authentication → Sign In / Up → Add Clerk as provider, paste Clerk domain.
4. **RLS policies:** Create policies that use `auth.jwt()->>'sub'` for user_id (Clerk ID).
5. **Client setup:** Use `createClerkSupabaseClient(getToken)` from `src/lib/supabase.ts` so Supabase receives Clerk session tokens.

> As of April 2025, the native Supabase integration is preferred over the deprecated JWT template (no need to share Supabase JWT secret with Clerk).

---

## Environment Variables Checklist

Keep these in `.env.local` (and Vercel env vars). Never commit secrets.

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `RESEND_API_KEY` (when you add Resend)
- `NEXT_PUBLIC_POSTHOG_KEY` / `NEXT_PUBLIC_POSTHOG_HOST` (when you add PostHog)
- `SENTRY_DSN` (when you add Sentry)

---

## Current Status

- Node.js v22, GitHub CLI, Vercel CLI installed
- App scaffolded, dependencies installed, dev server verified
- Clerk connected (instance: `above-bat-30.clerk.accounts.dev`)
- Supabase connected (project: `yucnwzlbhrytdiwqgukw`)
- Clerk ↔ Supabase integration active (third-party auth provider)
- Database tables: profiles, courses, services, bookings, reviews, waitlist
- RLS policies active on all tables (13+ policies)
- Landing page live with waitlist form (connected to Supabase)
- GitHub repo: github.com/jcunni254/fairway-standard
- **LIVE at: https://fairway-standard.vercel.app**

## Brand System

- **Colors:** fairway green (primary), navy (secondary), sand gold (accent)
- **Font:** Inter (Google Fonts) — clean, modern, premium
- **Tone:** Professional but accessible, golf heritage meets modern tech
- **No logo yet** — name styled in Inter Bold is the current wordmark

## Using Cursor as Central Knowledge Base

1. **Rules:** `.cursor/rules/` — Project context and conventions auto-apply in Cursor.
2. **This file:** Update when you make architectural or product decisions.
3. **APM:** Run `apm init` in this directory, then use `/apm-1-initiate-setup` for structured planning.
4. **Prompting tips (from Reddit/Indie Hackers):**
   - Write a short PRD before big features (goal, problem, description).
   - Use RAPID: Role, Ask, Project Files, Instructions, Deliver.
   - Add logs for debugging; paste raw logs back for AI analysis.

---

## Reference Links

- [Clerk + Supabase Integration](https://clerk.com/docs/guides/development/integrations/databases/supabase)
- [clerk-supabase-nextjs Demo](https://github.com/clerk/clerk-supabase-nextjs)
- [PostHog + Next.js + Supabase Funnel](https://posthog.com/tutorials/nextjs-supabase-signup-funnel)
- [Agentic Project Management Docs](https://agentic-project-management.dev/docs)

---

*Last updated: February 2025*
