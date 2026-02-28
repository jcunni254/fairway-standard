import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

export default async function AdminOverview() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [playersRes, caddiesRes, instructorsRes, coursesRes, bookingsRes, activeSubsRes, interviewsRes] =
    await Promise.all([
      supabase.from("players").select("id", { count: "exact", head: true }),
      supabase.from("caddies").select("id", { count: "exact", head: true }),
      supabase.from("instructors").select("id", { count: "exact", head: true }),
      supabase.from("courses").select("id", { count: "exact", head: true }),
      supabase.from("bookings").select("status, total_price"),
      supabase.from("caddies").select("id", { count: "exact", head: true }).eq("subscription_status", "active"),
      supabase.from("interviews").select("id", { count: "exact", head: true }),
    ]);

  const bookings = bookingsRes.data || [];
  const completed = bookings.filter((b) => b.status === "completed");
  const revenue = completed.reduce((s, b) => s + Number(b.total_price || 0), 0);
  const pending = bookings.filter((b) => b.status === "pending");

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-500">The Fairway Standard at a glance.</p>
      </div>

      {/* Primary Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/caddies" className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-fairway-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fairway-50 text-fairway-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <svg className="h-4 w-4 text-gray-300 transition group-hover:text-fairway-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
          <p className="mt-4 text-3xl font-bold text-gray-900">{caddiesRes.count || 0}</p>
          <p className="mt-1 text-sm text-gray-500">Caddies</p>
        </Link>

        <Link href="/admin/instructors" className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-navy-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-navy-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <svg className="h-4 w-4 text-gray-300 transition group-hover:text-navy-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
          <p className="mt-4 text-3xl font-bold text-gray-900">{instructorsRes.count || 0}</p>
          <p className="mt-1 text-sm text-gray-500">Instructors</p>
        </Link>

        <Link href="/admin/players" className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-gray-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <svg className="h-4 w-4 text-gray-300 transition group-hover:text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
          <p className="mt-4 text-3xl font-bold text-gray-900">{playersRes.count || 0}</p>
          <p className="mt-1 text-sm text-gray-500">Players</p>
        </Link>

        <Link href="/admin/courses" className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-gray-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sand-50 text-sand-500">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
              </svg>
            </div>
            <svg className="h-4 w-4 text-gray-300 transition group-hover:text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
          <p className="mt-4 text-3xl font-bold text-gray-900">{coursesRes.count || 0}</p>
          <p className="mt-1 text-sm text-gray-500">Courses</p>
        </Link>
      </div>

      {/* Secondary Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Active Subscriptions</p>
          <p className="mt-2 text-3xl font-bold text-fairway-700">{activeSubsRes.count || 0}</p>
          <p className="mt-1 text-xs text-gray-400">Caddies with active plans</p>
        </div>
        <Link href="/admin/bookings" className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
          <p className="text-sm font-medium text-gray-500">Total Bookings</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{bookings.length}</p>
          <p className="mt-1 text-xs text-gray-400">{pending.length} pending</p>
        </Link>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Completed</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{completed.length}</p>
          <p className="mt-1 text-xs text-gray-400">Finished sessions</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Revenue</p>
          <p className="mt-2 text-3xl font-bold text-fairway-700">${revenue.toFixed(0)}</p>
          <p className="mt-1 text-xs text-gray-400">From completed bookings</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Quick Actions</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: "/admin/caddies", label: "Manage Caddies", desc: "Set rates, verify providers", color: "fairway" },
            { href: "/admin/instructors", label: "Manage Instructors", desc: "Verify and review", color: "navy" },
            { href: "/admin/interviews", label: "Interviews", desc: `${interviewsRes.count || 0} recorded`, color: "fairway" },
            { href: "/admin/bookings", label: "View Bookings", desc: "All platform bookings", color: "gray" },
            { href: "/admin/players", label: "View Players", desc: "Registered golfers", color: "gray" },
            { href: "/admin/courses", label: "View Courses", desc: "Registered courses", color: "gray" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm transition hover:border-gray-300 hover:shadow-md"
            >
              <div>
                <p className="font-medium text-gray-900 group-hover:text-fairway-700 transition">{item.label}</p>
                <p className="mt-0.5 text-xs text-gray-400">{item.desc}</p>
              </div>
              <svg className="h-4 w-4 text-gray-300 transition group-hover:text-fairway-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
