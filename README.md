# The Fairway Standard

Golf services platform for booking caddies and golf instructors at lower rates.

## Tech Stack

- **Next.js 15** (App Router, TypeScript, Tailwind)
- **Clerk** — Auth & user management
- **Supabase** — Database (PostgreSQL) + RLS
- **Vercel** — Hosting (ready for deploy)

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up Clerk**
   - Sign up at [clerk.com](https://clerk.com)
   - Create an application
   - Add keys to `.env.local` (copy from `.env.local.example`)

3. **Set up Supabase**
   - Create a project at [supabase.com](https://supabase.com)
   - Add URL and anon key to `.env.local`
   - In Clerk: [Connect with Supabase](https://dashboard.clerk.com/setup/supabase)
   - In Supabase: Authentication → Sign In / Up → Add Clerk as third-party provider

4. **Run dev server**
   ```bash
   npm run dev
   ```

## Project context (single source of truth)

This repo is the **canonical** app and project-context repo. Third-party integrations (Builder.io, Vercel, Clerk, etc.) and collaborators are set up here.

- **Full PRD, schema, sprint plan:** `FAIRWAY_STANDARD_PROJECT.md` (repo root)
- **Onboarding & AI context:** `docs/TEAMMATE_ONBOARDING_PROMPT.md`, `docs/CHATGPT_PLATFORM_CONTEXT.md`, `docs/CHATGPT_25_FILE_BREAKDOWN.md`
- **Cursor rules:** `.cursor/rules/` (fairway-standard-context.mdc, fairway-standard.mdc)
