import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

export default async function AdminOverview() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [playersRes, caddiesRes, instructorsRes, coursesRes, bookingsRes, activeSubsRes] = await Promise.all([
    supabase.from("players").select("id", { count: "exact", head: true }),
    supabase.from("caddies").select("id", { count: "exact", head: true }),
    supabase.from("instructors").select("id", { count: "exact", head: true }),
    supabase.from("courses").select("id", { count: "exact", head: true }),
    supabase.from("bookings").select("status, total_price"),
    supabase.from("caddies").select("id", { count: "exact", head: true }).eq("subscription_status", "active"),
  ]);

  const bookings = bookingsRes.data || [];
  const completed = bookings.filter((b) => b.status === "completed");
  const revenue = completed.reduce((s, b) => s + Number(b.total_price || 0), 0);

  const stats = [
    { label: "Players", value: playersRes.count || 0, href: "/admin/players" },
    { label: "Caddies", value: caddiesRes.count || 0, href: "/admin/caddies" },
    { label: "Instructors", value: instructorsRes.count || 0, href: "/admin/instructors" },
    { label: "Courses", value: coursesRes.count || 0, href: "/admin/courses" },
    { label: "Active Subscriptions", value: activeSubsRes.count || 0, href: "/admin/caddies" },
    { label: "Total Bookings", value: bookings.length, href: "/admin/bookings" },
    { label: "Completed", value: completed.length, href: "/admin/bookings" },
    { label: "Revenue", value: `$${revenue.toFixed(0)}`, href: "/admin/bookings" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
      <p className="mt-1 text-gray-500">The Fairway Standard platform at a glance.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <p className="text-sm font-medium text-gray-500">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{s.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
