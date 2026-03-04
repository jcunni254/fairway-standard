# Scripts

## seed-caddies.mjs

One-time script to add the first two caddies (Keith McArthur and Preston Cobb) to the platform.

**What it does:**
- Creates two users in **Clerk** with email + password so they can sign in.
- Inserts **Supabase** records: `user_roles` (role: caddie) and `caddies` (name, phone, etc.).

**Your admin account:** Not modified. Admin access is controlled by `ADMIN_USER_IDS` in `.env.local`. Only the two new caddie accounts are created.

**Caddie accounts created:**

| Name           | Email                                      | Phone            | Password      |
|----------------|--------------------------------------------|------------------|---------------|
| Keith McArthur | keith.mcarthur@thefairwaystandard.org      | (909) 618-9494   | StandardCaddie |
| Preston Cobb   | preston.cobb@thefairwaystandard.org        | +1 (615) 310-7111 | StandardCaddie |

**How to run (from `fairway-standard` directory):**

```bash
# Load .env.local and run (Node 20+)
node --env-file=.env.local scripts/seed-caddies.mjs
```

Or set env vars and run:

```bash
export CLERK_SECRET_KEY="sk_..."
export NEXT_PUBLIC_SUPABASE_URL="https://....supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="..."
node scripts/seed-caddies.mjs
```

**Required env vars:** `CLERK_SECRET_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

After running, both caddies can sign in at the app with their email and password.

**To show on the Browse page:** Caddies only appear when `subscription_status` is `active` and `hourly_rate` is set. You can set these in the [Admin → Caddies](https://thefairwaystandard.org/admin/caddies) UI (edit each caddie to set rate and subscription status), or the caddies can complete onboarding and subscription flow.
