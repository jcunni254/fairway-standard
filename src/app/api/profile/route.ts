import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createClerkSupabaseClient } from "@/lib/supabase";
import { normalizePhoneToDisplay } from "@/lib/phone";

/**
 * PATCH /api/profile — Update the current user's profile (caddie, instructor, or player).
 * Allowed fields depend on role; only the owner can update their own row.
 */
export async function PATCH(req: NextRequest) {
  const { userId, getToken } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const supabase = createClerkSupabaseClient(getToken);

  // Resolve role: check user_roles and which table to update
  const { data: roleRows } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);

  const roles = roleRows?.map((r) => r.role) || [];
  const isCaddie = roles.includes("caddie");
  const isInstructor = roles.includes("instructor");
  const isPlayer = roles.includes("player");

  if (isCaddie) {
    const allowed: Record<string, boolean> = {
      full_name: true,
      bio: true,
      phone: true,
      years_experience: true,
      avatar_url: true,
      hometown: true,
      home_golf_course: true,
    };
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    for (const [key, value] of Object.entries(body)) {
      if (allowed[key]) {
        if (key === "phone" && typeof value === "string" && value.trim()) {
          updates[key] = normalizePhoneToDisplay(value.trim()) ?? value;
        } else {
          updates[key] = value === "" ? null : value;
        }
      }
    }
    if (Object.keys(updates).length <= 1) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }
    const { error } = await supabase.from("caddies").update(updates).eq("id", userId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: "Updated" });
  }

  if (isInstructor) {
    const allowed: Record<string, boolean> = {
      full_name: true,
      bio: true,
      phone: true,
      years_experience: true,
      avatar_url: true,
    };
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    for (const [key, value] of Object.entries(body)) {
      if (allowed[key]) {
        if (key === "phone" && typeof value === "string" && value.trim()) {
          updates[key] = normalizePhoneToDisplay(value.trim()) ?? value;
        } else {
          updates[key] = value === "" ? null : value;
        }
      }
    }
    if (Object.keys(updates).length <= 1) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }
    const { error } = await supabase.from("instructors").update(updates).eq("id", userId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: "Updated" });
  }

  if (isPlayer) {
    const allowed: Record<string, boolean> = {
      full_name: true,
      phone: true,
      avatar_url: true,
    };
    const updates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(body)) {
      if (allowed[key]) {
        if (key === "phone" && typeof value === "string" && value.trim()) {
          updates[key] = normalizePhoneToDisplay(value.trim()) ?? value;
        } else {
          updates[key] = value === "" ? null : value;
        }
      }
    }
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }
    // players table has no updated_at
    const { error } = await supabase.from("players").update(updates).eq("id", userId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: "Updated" });
  }

  return NextResponse.json({ error: "No profile to update" }, { status: 400 });
}
