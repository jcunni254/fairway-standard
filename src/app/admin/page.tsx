import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

export default async function AdminOverview() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

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
      <h1 className="font-display text-2xl font-bold text-brand-charcoal">Dashboard</h1>
      <p className="mt-1 text-brand-muted">The Fairway Standard at a glance.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Caddies", value: caddiesRes.count || 0, href: "/admin/caddies", color: "brand-green" },
          { label: "Instructors", value: instructorsRes.count || 0, href: "/admin/instructors", color: "navy" },
          { label: "Players", value: playersRes.count || 0, href: "/admin/players", color: "gray" },
          { label: "Courses", value: coursesRes.count || 0, href: "/admin/courses", color: "gray" },
        ].map((s) => (
          <Link key={s.label} href={s.href} className="group rounded-xl border border-brand-border bg-white p-6 shadow-sm transition hover:border-brand-gold-300 hover:shadow-md">
            <p className="text-sm font-medium text-brand-muted">{s.label}</p>
            <p className="mt-2 text-3xl font-bold text-brand-charcoal">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-brand-border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-brand-muted">Active Subscriptions</p>
          <p className="mt-2 text-3xl font-bold text-brand-green-600">{activeSubsRes.count || 0}</p>
        </div>
        <Link href="/admin/bookings" className="rounded-xl border border-brand-border bg-white p-6 shadow-sm transition hover:shadow-md">
          <p className="text-sm font-medium text-brand-muted">Total Bookings</p>
          <p className="mt-2 text-3xl font-bold text-brand-charcoal">{bookings.length}</p>
          <p className="mt-1 text-xs text-brand-muted">{pending.length} pending</p>
        </Link>
        <div className="rounded-xl border border-brand-border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-brand-muted">Completed</p>
          <p className="mt-2 text-3xl font-bold text-brand-charcoal">{completed.length}</p>
        </div>
        <div className="rounded-xl border border-brand-border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-brand-muted">Revenue</p>
          <p className="mt-2 text-3xl font-bold text-brand-gold-500">${revenue.toFixed(0)}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-brand-muted">Quick Actions</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: "/admin/caddies", label: "Manage Caddies", desc: "Set rates, verify providers" },
            { href: "/admin/instructors", label: "Manage Instructors", desc: "Verify and review" },
            { href: "/admin/interviews", label: "Interviews", desc: `${interviewsRes.count || 0} recorded` },
            { href: "/admin/bookings", label: "View Bookings", desc: "All platform bookings" },
            { href: "/admin/players", label: "View Players", desc: "Registered golfers" },
            { href: "/admin/courses", label: "View Courses", desc: "Registered courses" },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="group flex items-center justify-between rounded-xl border border-brand-border bg-white px-5 py-4 shadow-sm transition hover:border-brand-gold-300 hover:shadow-md">
              <div>
                <p className="font-medium text-brand-charcoal group-hover:text-brand-green-600 transition">{item.label}</p>
                <p className="mt-0.5 text-xs text-brand-muted">{item.desc}</p>
              </div>
              <svg className="h-4 w-4 text-brand-border transition group-hover:text-brand-gold-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
