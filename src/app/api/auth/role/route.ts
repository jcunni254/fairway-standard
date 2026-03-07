import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClerkSupabaseClient } from "@/lib/supabase";

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || "").split(",").filter(Boolean);

export async function GET() {
  const { userId, getToken } = await auth();
  if (!userId) {
    return NextResponse.json({ roles: [] });
  }

  const roles: string[] = [];

  if (ADMIN_USER_IDS.includes(userId)) {
    roles.push("admin");
  }

  const supabase = getToken
    ? createClerkSupabaseClient(getToken)
    : createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);

  if (data) {
    for (const row of data) {
      if (!roles.includes(row.role)) {
        roles.push(row.role);
      }
    }
  }

  return NextResponse.json({ roles });
}
