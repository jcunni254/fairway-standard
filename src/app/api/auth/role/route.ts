import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ role: null });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);

  const roleList = roles?.map((r) => r.role) || [];

  const isAdmin = (process.env.ADMIN_USER_IDS || "").split(",").includes(userId);
  if (isAdmin && !roleList.includes("admin")) {
    roleList.push("admin");
  }

  return NextResponse.json({ roles: roleList, primaryRole: roleList[0] || null });
}
