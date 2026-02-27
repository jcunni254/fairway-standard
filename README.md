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

## Project Knowledge Base

See `FAIRWAY_STANDARD_PROJECT.md` in the parent directory for the full project context, integration order, and platform setup notes.
