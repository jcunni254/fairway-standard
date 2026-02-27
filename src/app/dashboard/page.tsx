import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import BookingActions from "@/components/BookingActions";
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (!profile) redirect("/onboarding");

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("provider_id", userId)
    .order("created_at", { ascending: false });

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*")
    .eq("provider_id", userId)
    .order("scheduled_at", { ascending: true });

  const pendingBookings =
    bookings?.filter((b) => b.status === "pending") || [];
  const upcomingBookings =
    bookings?.filter((b) => b.status === "confirmed") || [];

  const playerIds = [
    ...new Set(bookings?.map((b) => b.player_id) || []),
  ];
  const serviceIds = [
    ...new Set(bookings?.map((b) => b.service_id) || []),
  ];

  let playersMap: Record<string, { full_name: string; email: string }> = {};
  let servicesMap: Record<string, { title: string }> = {};

  if (playerIds.length > 0) {
    const { data: players } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", playerIds);
    if (players) {
      for (const p of players) playersMap[p.id] = p;
    }
  }
  if (serviceIds.length > 0) {
    const { data: svcData } = await supabase
      .from("services")
      .select("id, title")
      .in("id", serviceIds);
    if (svcData) {
      for (const s of svcData) servicesMap[s.id] = s;
    }
  }

  const roleLabel = profile.role === "caddie" ? "Caddie" : "Instructor";

  return (
    <div className="min-h-[calc(100vh-65px)] bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {profile.full_name}
            </h1>
            <p className="mt-1 text-gray-500">
              {roleLabel} · ${Number(profile.hourly_rate).toFixed(0)}/hr
              {profile.years_experience
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
                const service = servicesMap[booking.service_id];
                const d = new Date(booking.scheduled_at);
                return (
                  <div
                    key={booking.id}
                    className="rounded-xl border-2 border-yellow-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {service?.title || "Service"} — $
                          {Number(booking.total_price).toFixed(0)}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Requested by{" "}
                          <span className="font-medium text-gray-700">
                            {player?.full_name || "Player"}
                          </span>
                        </p>
                        <p className="mt-1 text-sm text-gray-400">
                          {d.toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}{" "}
                          at{" "}
                          {d.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    {booking.notes && (
                      <p className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
                        &quot;{booking.notes}&quot;
                      </p>
                    )}
                    <div className="mt-4">
                      <BookingActions
                        bookingId={booking.id}
                        role="provider"
                        currentStatus={booking.status}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Upcoming Confirmed */}
        {upcomingBookings.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-gray-900">
              Upcoming Bookings
            </h2>
            <div className="mt-4 space-y-4">
              {upcomingBookings.map((booking) => {
                const player = playersMap[booking.player_id];
                const service = servicesMap[booking.service_id];
                const d = new Date(booking.scheduled_at);
                return (
                  <div
                    key={booking.id}
                    className="rounded-xl border border-green-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {service?.title || "Service"}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {player?.full_name || "Player"} ·{" "}
                          {d.toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          at{" "}
                          {d.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                        Confirmed
                      </span>
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
              Live
            </span>
          </div>
          <p className="mt-3 text-gray-600">{profile.bio}</p>
          {profile.phone && (
            <p className="mt-2 text-sm text-gray-400">{profile.phone}</p>
          )}
          <p className="mt-4 text-sm text-gray-400">
            Your public profile:{" "}
            <Link
              href={`/providers/${userId}`}
              className="font-medium text-fairway-600 hover:underline"
            >
              View →
            </Link>
          </p>
        </div>

        {/* Services */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Your Services</h2>
            <span className="text-sm text-gray-400">
              {services?.length || 0} listing
              {services?.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="mt-4 space-y-4">
            {services && services.length > 0 ? (
              services.map((service) => (
                <div
                  key={service.id}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {service.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {service.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-fairway-700">
                        ${Number(service.price).toFixed(0)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {service.duration_minutes} min
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
                <p className="text-gray-400">No services yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
