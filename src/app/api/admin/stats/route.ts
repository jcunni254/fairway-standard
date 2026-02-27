import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [playersRes, caddiesRes, instructorsRes, coursesRes, bookingsRes, activeSubs] = await Promise.all([
    supabase.from("players").select("id", { count: "exact", head: true }),
    supabase.from("caddies").select("id", { count: "exact", head: true }),
    supabase.from("instructors").select("id", { count: "exact", head: true }),
    supabase.from("courses").select("id", { count: "exact", head: true }),
    supabase.from("bookings").select("id, status, total_price"),
    supabase.from("caddies").select("id", { count: "exact", head: true }).eq("subscription_status", "active"),
  ]);

  const bookings = bookingsRes.data || [];
  const totalRevenue = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + Number(b.total_price || 0), 0);

  return NextResponse.json({
    players: playersRes.count || 0,
    caddies: caddiesRes.count || 0,
    instructors: instructorsRes.count || 0,
    courses: coursesRes.count || 0,
    totalBookings: bookings.length,
    completedBookings: bookings.filter((b) => b.status === "completed").length,
    pendingBookings: bookings.filter((b) => b.status === "pending").length,
    activeSubscriptions: activeSubs.count || 0,
    totalRevenue,
  });
}
