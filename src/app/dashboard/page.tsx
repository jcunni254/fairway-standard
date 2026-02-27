import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import BookingActions from "@/components/BookingActions";
import StripeConnectButton from "@/components/StripeConnectButton";
import SubscriptionButton from "@/components/SubscriptionButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — The Fairway Standard",
};

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/join");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);

  const roleList = roles?.map((r) => r.role) || [];
  const isCaddie = roleList.includes("caddie");
  const isInstructor = roleList.includes("instructor");

  if (!isCaddie && !isInstructor) redirect("/onboarding");

  interface ProviderProfile {
    id: string;
    full_name: string;
    email: string | null;
    phone: string | null;
    avatar_url: string | null;
    bio: string | null;
    years_experience: number | null;
    hourly_rate: number | null;
    verified: boolean;
    subscription_status?: string;
    stripe_connect_id?: string | null;
  }

  let profile: ProviderProfile | null = null;

  if (isCaddie) {
    const { data } = await supabase.from("caddies").select("*").eq("id", userId).maybeSingle();
    profile = data as ProviderProfile | null;
  } else if (isInstructor) {
    const { data } = await supabase.from("instructors").select("*").eq("id", userId).maybeSingle();
    profile = data as ProviderProfile | null;
  }

  if (!profile) redirect("/onboarding");

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*")
    .eq("provider_id", userId)
    .order("scheduled_at", { ascending: true });

  const pendingBookings = bookings?.filter((b) => b.status === "pending") || [];
  const upcomingBookings = bookings?.filter((b) => b.status === "confirmed") || [];
  const completedBookings = bookings?.filter((b) => b.status === "completed") || [];

  const totalEarnings = completedBookings.reduce((sum, b) => sum + Number(b.total_price), 0);
  const pendingEarnings = upcomingBookings.reduce((sum, b) => sum + Number(b.total_price), 0);

  const playerIds = [...new Set(bookings?.map((b) => b.player_id) || [])];
  let playersMap: Record<string, { full_name: string }> = {};

  if (playerIds.length > 0) {
    const { data: players } = await supabase
      .from("players")
      .select("id, full_name")
      .in("id", playerIds);
    if (players) {
      for (const p of players) playersMap[p.id] = p;
    }
  }

  const roleLabel = isCaddie ? "Caddie" : "Instructor";
  const rate = profile.hourly_rate ? `$${Number(profile.hourly_rate).toFixed(0)}/hr` : "Rate not set";

  return (
    <div className="min-h-[calc(100vh-65px)] bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {profile.full_name}
            </h1>
            <p className="mt-1 text-gray-500">
              {roleLabel} · {rate}
              {profile.years_experience && profile.years_experience > 0
                ? ` · ${profile.years_experience} years experience`
                : ""}
            </p>
          </div>
          <SignOutButton>
            <button className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50">
              Sign Out
            </button>
          </SignOutButton>
        </div>

        {/* Caddie Subscription */}
        {isCaddie && (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-gray-900">Subscription</h2>
            <div className="mt-4">
              <SubscriptionButton status={profile.subscription_status || "none"} />
            </div>
          </div>
        )}

        {/* Caddie: rate set by admin notice */}
        {isCaddie && !profile.hourly_rate && (
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            Your rate has not been set yet. The admin will review your profile and set your rate.
          </div>
        )}

        {/* Earnings */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total Earned</p>
            <p className="mt-1 text-2xl font-bold text-fairway-700">${totalEarnings.toFixed(0)}</p>
            <p className="mt-1 text-xs text-gray-400">{completedBookings.length} completed</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Upcoming</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">${pendingEarnings.toFixed(0)}</p>
            <p className="mt-1 text-xs text-gray-400">{upcomingBookings.length} confirmed</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Pending Requests</p>
            <p className="mt-1 text-2xl font-bold text-yellow-600">{pendingBookings.length}</p>
            <p className="mt-1 text-xs text-gray-400">awaiting your response</p>
          </div>
        </div>

        {/* Pending Requests */}
        {pendingBookings.length > 0 && (
          <div className="mt-8">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 text-xs font-bold text-yellow-700">
                {pendingBookings.length}
              </span>
              Pending Requests
            </h2>
            <div className="mt-4 space-y-4">
              {pendingBookings.map((booking) => {
                const player = playersMap[booking.player_id];
                const d = new Date(booking.scheduled_at);
                return (
                  <div key={booking.id} className="rounded-xl border-2 border-yellow-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">${Number(booking.total_price).toFixed(0)}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Requested by <span className="font-medium text-gray-700">{player?.full_name || "Player"}</span>
                        </p>
                        <p className="mt-1 text-sm text-gray-400">
                          {d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} at {d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                    {booking.notes && <p className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-500">&quot;{booking.notes}&quot;</p>}
                    <div className="mt-4">
                      <BookingActions bookingId={booking.id} role="provider" currentStatus={booking.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Upcoming */}
        {upcomingBookings.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-gray-900">Upcoming Bookings</h2>
            <div className="mt-4 space-y-4">
              {upcomingBookings.map((booking) => {
                const player = playersMap[booking.player_id];
                const d = new Date(booking.scheduled_at);
                return (
                  <div key={booking.id} className="rounded-xl border border-green-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="mt-1 text-sm text-gray-500">
                          {player?.full_name || "Player"} · {d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} at {d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                        </p>
                      </div>
                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">Confirmed</span>
                    </div>
                    <div className="mt-4">
                      <BookingActions bookingId={booking.id} role="provider" currentStatus={booking.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Profile Card */}
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Your Profile</h2>
            <span className="rounded-full bg-fairway-100 px-3 py-1 text-xs font-semibold text-fairway-700">
              {isCaddie && profile.subscription_status === "active" ? "Live" : isCaddie ? "Hidden" : "Live"}
            </span>
          </div>
          <p className="mt-3 text-gray-600">{profile.bio}</p>
          {profile.phone && <p className="mt-2 text-sm text-gray-400">{profile.phone}</p>}
          <p className="mt-4 text-sm text-gray-400">
            Your public profile:{" "}
            <Link href={`/providers/${userId}`} className="font-medium text-fairway-600 hover:underline">
              View →
            </Link>
          </p>
        </div>

        {/* Stripe Connect (for receiving booking payments) */}
        {isCaddie && (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-gray-900">Receive Payments</h2>
            <div className="mt-4">
              <StripeConnectButton connected={!!profile.stripe_connect_id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
