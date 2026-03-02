# The Fairway Standard — Project Knowledge Base (App Copy)

> This is a synced copy for the `fairway-standard/` directory. The authoritative version lives at the repo root: `../FAIRWAY_STANDARD_PROJECT.md`. Consult that for the full PRD, gap analysis, sprint plan, and security requirements.

---

## Quick Reference

- **Live:** https://thefairwaystandard.org
- **Vercel:** fairway-standard.vercel.app
- **GitHub:** github.com/jcunni254/fairway-standard
- **Clerk:** above-bat-30.clerk.accounts.dev
- **Supabase:** yucnwzlbhrytdiwqgukw
- **Stack:** Next.js 15 + Clerk + Supabase + Stripe Connect + Vercel

## Authoritative Schema

Role-specific tables: `user_roles`, `players`, `caddies`, `instructors`, `courses`, `caddie_services`, `instructor_services`, `bookings`, `reviews`, `waitlist`, `caddie_vetting_responses`, `interviews`.

**Do NOT use `profiles` or `services` as table names.** Some routes still reference these — they need migration to the role-specific tables listed above.

## Supabase Client Rules

| Context | Client to use |
|---------|---------------|
| User-scoped API routes | `createClerkSupabaseClient(getToken)` from `src/lib/supabase.ts` |
| Admin API routes | `getAdminSupabase()` from `src/lib/supabase-admin.ts` |
| Stripe webhooks | `getAdminSupabase()` from `src/lib/supabase-admin.ts` |
| Server components (user data) | `createClerkSupabaseClient` with Clerk session |
| Server components (public data) | Anon client is acceptable for read-only public queries |

**Never** create inline `createClient(URL, SERVICE_ROLE_KEY)` — always use `getAdminSupabase()`.

## Brand Colors (Tailwind)

Use `brand-green-*` (not `fairway-*`). Both exist with identical values — standardize on `brand-green-*`.

---

*See `../FAIRWAY_STANDARD_PROJECT.md` for the full document.*
