import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import BookingActions from "@/components/BookingActions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Bookings — The Fairway Standard",
};

export default async function BookingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/join");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*")
    .eq("player_id", userId)
    .order("scheduled_at", { ascending: true });

  const providerIds = [...new Set(bookings?.map((b) => b.provider_id) || [])];
  const serviceIds = [...new Set(bookings?.map((b) => b.service_id) || [])];

  let providersMap: Record<string, { full_name: string }> = {};
  let servicesMap: Record<string, { title: string }> = {};

  if (providerIds.length > 0) {
    const { data: providers } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", providerIds);
    if (providers) {
      for (const p of providers) providersMap[p.id] = p;
    }
  }

  if (serviceIds.length > 0) {
    const { data: services } = await supabase
      .from("services")
      .select("id, title")
      .in("id", serviceIds);
    if (services) {
      for (const s of services) servicesMap[s.id] = s;
    }
  }

  const statusStyles: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    confirmed: "bg-green-50 text-green-700 border-green-200",
    declined: "bg-red-50 text-red-700 border-red-200",
    cancelled: "bg-gray-50 text-gray-500 border-gray-200",
    completed: "bg-fairway-50 text-fairway-700 border-fairway-200",
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-gray-50">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="mt-1 text-gray-500">
          Track your caddie and instructor bookings.
        </p>

        {bookings && bookings.length > 0 ? (
          <div className="mt-8 space-y-4">
            {bookings.map((booking) => {
              const provider = providersMap[booking.provider_id];
              const service = servicesMap[booking.service_id];
              const scheduledDate = new Date(booking.scheduled_at);
              return (
                <div
                  key={booking.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {service?.title || "Service"}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        with{" "}
                        <Link
                          href={`/providers/${booking.provider_id}`}
                          className="text-fairway-600 hover:underline"
                        >
                          {provider?.full_name || "Provider"}
                        </Link>
                      </p>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusStyles[booking.status] || statusStyles.pending}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                    <span>
                      {scheduledDate.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span>
                      {scheduledDate.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="font-medium text-gray-700">
                      ${Number(booking.total_price).toFixed(0)}
                    </span>
                  </div>
                  {booking.notes && (
                    <p className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
                      {booking.notes}
                    </p>
                  )}
                  {(booking.status === "pending" ||
                    booking.status === "confirmed") && (
                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <BookingActions
                        bookingId={booking.id}
                        role="player"
                        currentStatus={booking.status}
                      />
                    </div>
                  )}
                  {booking.status === "completed" && (
                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <Link
                        href={`/review/${booking.id}`}
                        className="inline-block rounded-lg bg-fairway-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-fairway-800"
                      >
                        Leave a Review
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-12 rounded-2xl border border-dashed border-gray-300 p-12 text-center">
            <p className="text-lg font-medium text-gray-400">
              No bookings yet
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Browse providers and book your first session!
            </p>
            <Link
              href="/browse"
              className="mt-4 inline-block rounded-lg bg-fairway-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-fairway-800"
            >
              Browse Providers
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
