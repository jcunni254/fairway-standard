# The Fairway Standard — Setup Status & Next Steps

## Completed

- [x] Node.js v22 installed (`~/.local/node/bin`)
- [x] Next.js 15 app scaffolded with TypeScript, Tailwind, App Router
- [x] Clerk SDK installed and ClerkProvider wired into root layout
- [x] Supabase client library installed with Clerk-aware helper
- [x] Middleware configured at `src/middleware.ts`
- [x] Dev server verified running (HTTP 200)
- [x] Clerk running in keyless mode (auto-provisioned temp app)

## Next: Connect Platforms

### 1. Clerk — DONE

Keys configured. Instance: `above-bat-30.clerk.accounts.dev`

### 2. Supabase — DONE

Project: `yucnwzlbhrytdiwqgukw`. Keys configured.

### 3. Clerk + Supabase Integration — DONE

Clerk set as third-party auth provider in Supabase. RLS policies use `auth.jwt()->>'sub'` for Clerk user IDs.

### 4. Deploy to Vercel

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add env vars in Vercel project settings

### 5. Later integrations

- Resend (emails), PostHog (analytics), Sentry (errors), Cloudflare (security/DNS), Namecheap (domain)
