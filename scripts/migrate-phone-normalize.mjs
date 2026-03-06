#!/usr/bin/env node
/**
 * One-time migration: normalize all phone numbers in the database to +1 (XXX) XXX-XXXX.
 *
 * Tables updated: caddies, players, instructors, courses
 *
 * Prerequisites:
 *   - Node 18+
 *   - .env.local with NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *
 * Run (from fairway-standard directory):
 *   node --env-file=.env.local scripts/migrate-phone-normalize.mjs
 *
 * Dry run (preview changes without writing):
 *   DRY_RUN=1 node --env-file=.env.local scripts/migrate-phone-normalize.mjs
 */

/** Normalize phone to display format: +1 (615) 123-1234. */
function normalizePhoneToDisplay(phone) {
  if (!phone || typeof phone !== "string") return null;
  const digits = phone.replace(/\D/g, "");
  let e164 = null;
  if (digits.length === 10) e164 = `+1${digits}`;
  else if (digits.length === 11 && digits.startsWith("1")) e164 = `+${digits}`;
  else if (digits.length >= 10) e164 = `+${digits}`;
  if (!e164) return null;

  const d = e164.slice(1);
  const ten = d.length === 11 && d.startsWith("1") ? d.slice(1) : d.slice(0, 10);
  if (ten.length !== 10) return e164;
  return `+1 (${ten.slice(0, 3)}) ${ten.slice(3, 6)}-${ten.slice(6)}`;
}

async function migrateTable(supabase, table, idColumn = "id") {
  const { data: rows, error } = await supabase
    .from(table)
    .select(`${idColumn}, phone`)
    .not("phone", "is", null);

  if (error) throw new Error(`${table}: ${error.message}`);

  let updated = 0;
  for (const row of rows || []) {
    const normalized = normalizePhoneToDisplay(row.phone);
    if (!normalized) continue;
    if (normalized === row.phone) continue;

    if (process.env.DRY_RUN) {
      console.log(`  [DRY RUN] ${table} ${row[idColumn]}: "${row.phone}" → "${normalized}"`);
    } else {
      const { error: updErr } = await supabase
        .from(table)
        .update({ phone: normalized })
        .eq(idColumn, row[idColumn]);
      if (updErr) throw new Error(`${table} update: ${updErr.message}`);
      console.log(`  ${table} ${row[idColumn]}: "${row.phone}" → "${normalized}"`);
    }
    updated++;
  }
  return updated;
}

async function main() {
  const dryRun = !!process.env.DRY_RUN;
  if (dryRun) console.log("DRY RUN — no changes will be written.\n");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const tables = ["caddies", "players", "instructors", "courses"];
  let total = 0;

  for (const table of tables) {
    console.log(`Migrating ${table}...`);
    const count = await migrateTable(supabase, table);
    total += count;
    if (count === 0) console.log(`  (no changes needed)`);
  }

  console.log(`\nDone. ${total} phone number(s) ${dryRun ? "would be " : ""}normalized.`);
  if (dryRun && total > 0) {
    console.log("Run without DRY_RUN=1 to apply changes.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
