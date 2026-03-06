# Phone Number Migration — Step-by-Step Guide

This guide walks you through normalizing existing phone numbers in your database to the format `+1 (615) 123-1234`.

---

## Step 1: Backup (Recommended)

Before changing production data, consider backing up the affected tables:

- **Supabase Dashboard**: Project → Database → Backups (if you have daily backups enabled)
- **Manual export**: Run a quick export of `caddies`, `players`, `instructors`, and `courses` if you want a snapshot

---

## Step 2: Dry Run (Preview Changes)

Run the migration in **dry run** mode to see what would change without writing anything:

```bash
cd fairway-standard
DRY_RUN=1 node --env-file=.env.local scripts/migrate-phone-normalize.mjs
```

You’ll see output like:

```
DRY RUN — no changes will be written.

Migrating caddies...
  [DRY RUN] caddies user_abc123: "6152342345" → "+1 (615) 234-2345"
  [DRY RUN] caddies user_xyz789: "(909) 618-9494" → "+1 (909) 618-9494"

Migrating players...
  (no changes needed)

...

Done. 2 phone number(s) would be normalized.
Run without DRY_RUN=1 to apply changes.
```

Review the output to confirm the changes look correct.

---

## Step 3: Run the Migration

When you’re satisfied with the dry run, run it for real:

```bash
node --env-file=.env.local scripts/migrate-phone-normalize.mjs
```

You’ll see:

```
Migrating caddies...
  caddies user_abc123: "6152342345" → "+1 (615) 234-2345"
  ...

Done. 2 phone number(s) normalized.
```

---

## Step 4: Verify

1. **Supabase Dashboard** → Table Editor → open `caddies`, `players`, `instructors`, `courses` and check the `phone` column.
2. **App**: Sign in with a phone number and confirm it still works.
3. **Admin**: Open the caddies admin page and confirm phone numbers display as `+1 (XXX) XXX-XXXX`.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required` | Ensure `.env.local` exists in `fairway-standard/` and contains both variables. |
| `@supabase/supabase-js` not found | Run `npm install` in the fairway-standard directory. |
| Script updates 0 rows | Either all phones are already normalized, or the tables are empty. Run the dry run to confirm. |

---

## What Gets Updated

| Table | Column | Format before | Format after |
|-------|--------|---------------|--------------|
| caddies | phone | 6152342345, (615) 234-2345, etc. | +1 (615) 234-2345 |
| players | phone | (same) | +1 (615) 234-2345 |
| instructors | phone | (same) | +1 (615) 234-2345 |
| courses | phone | (same) | +1 (615) 234-2345 |

Numbers that can’t be normalized (e.g. too few digits) are left unchanged.
