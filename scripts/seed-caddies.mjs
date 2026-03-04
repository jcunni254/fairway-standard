#!/usr/bin/env node
/**
 * One-time script to add the first two caddies to the platform.
 * Creates users in Clerk (email + password) and records in Supabase (user_roles + caddies).
 *
 * Prerequisites:
 *   - Node 18+ (for fetch)
 *   - .env.local with CLERK_SECRET_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *
 * Run (from fairway-standard directory):
 *   node --env-file=.env.local scripts/seed-caddies.mjs
 *
 * Or set env vars manually and run:
 *   node scripts/seed-caddies.mjs
 */

const CADDIES = [
  {
    firstName: "Keith",
    lastName: "McArthur",
    fullName: "Keith McArthur",
    email: "keith.mcarthur@thefairwaystandard.org",
    phone: "(909) 618-9494",
    password: "StandardCaddie",
  },
  {
    firstName: "Preston",
    lastName: "Cobb",
    fullName: "Preston Cobb",
    email: "preston.cobb@thefairwaystandard.org",
    phone: "+1 (615) 310-7111",
    password: "StandardCaddie",
  },
];

const CLERK_API_BASE = "https://api.clerk.com/v1";

/** Normalize phone to E.164-like form for Clerk (e.g. +19096189494). */
function normalizePhone(phone) {
  const digits = (phone || "").replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return phone ? `+${digits}` : null;
}

async function getClerkUserByEmail(secret, email) {
  const res = await fetch(
    `${CLERK_API_BASE}/users?query=${encodeURIComponent(email)}&limit=1`,
    { headers: { Authorization: `Bearer ${secret}` } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  const list = Array.isArray(data) ? data : data.data;
  const user = Array.isArray(list) && list.length > 0 ? list[0] : null;
  return user ? { id: user.id } : null;
}

async function createOrGetClerkUser({ firstName, lastName, email, password, phone }) {
  const secret = process.env.CLERK_SECRET_KEY;
  if (!secret) throw new Error("CLERK_SECRET_KEY is required");

  const body = {
    email_address: [email],
    first_name: firstName,
    last_name: lastName,
    password,
  };
  const phoneNumber = normalizePhone(phone);
  if (phoneNumber) body.phone_number = [phoneNumber];

  const res = await fetch(`${CLERK_API_BASE}/users`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (res.ok) {
    const data = await res.json();
    return { id: data.id };
  }

  const errText = await res.text();
  let errJson;
  try {
    errJson = JSON.parse(errText);
  } catch {
    throw new Error(`Clerk API error ${res.status}: ${errText}`);
  }
  const isAlreadyExists =
    res.status === 422 &&
    Array.isArray(errJson.errors) &&
    errJson.errors.some((e) => e.code === "form_identifier_exists");
  if (isAlreadyExists) {
    const existing = await getClerkUserByEmail(secret, email);
    if (existing) {
      console.log(`  (Clerk user already exists for ${email}, using existing id)`);
      return existing;
    }
  }
  throw new Error(`Clerk API error ${res.status}: ${errText}`);
}

async function upsertCaddieInSupabase(supabase, { userId, fullName, email, phone }) {
  const { error: roleError } = await supabase.from("user_roles").insert({
    user_id: userId,
    role: "caddie",
  });
  if (roleError) {
    const isDuplicate = roleError.code === "23505" || roleError.message?.includes("duplicate");
    if (!isDuplicate) throw new Error(`Supabase user_roles: ${roleError.message}`);
  }

  const { error: caddieError } = await supabase.from("caddies").upsert(
    {
      id: userId,
      full_name: fullName,
      email: email || null,
      avatar_url: null,
      bio: null,
      phone: phone || null,
      years_experience: null,
      subscription_status: "none",
    },
    { onConflict: "id" }
  );

  if (caddieError) throw new Error(`Supabase caddies upsert: ${caddieError.message}`);
}

async function main() {
  console.log("Seed script starting (reading .env.local)...\n");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  }
  if (!supabaseUrl.includes(".supabase.co")) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL must end with .supabase.co (e.g. https://xxxx.supabase.co)");
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  for (const caddie of CADDIES) {
    console.log(`Creating Clerk user and caddie record: ${caddie.fullName} ...`);
    const { id: userId } = await createOrGetClerkUser(caddie);
    await upsertCaddieInSupabase(supabase, {
      userId,
      fullName: caddie.fullName,
      email: caddie.email,
      phone: caddie.phone,
    });
    console.log(`  Done. Clerk user id: ${userId}`);
  }

  console.log("\nBoth caddies are in the system.");
  console.log("Sign in with email OR phone + password: StandardCaddie");
  console.log("  Keith:   keith.mcarthur@thefairwaystandard.org or +19096189494");
  console.log("  Preston: preston.cobb@thefairwaystandard.org or +16153107111");
  console.log("Your admin account is unchanged (ADMIN_USER_IDS in .env.local).");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
