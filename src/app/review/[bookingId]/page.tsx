import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import ReviewForm from "@/components/ReviewForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leave a Review — The Fairway Standard",
};

interface Props {
  params: Promise<{ bookingId: string }>;
}

export default async function ReviewPage({ params }: Props) {
  const { bookingId } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/join");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: booking } = await supabase
    .from("bookings")
    .select("player_id, provider_id, service_id, status")
    .eq("id", bookingId)
    .single();

  if (!booking || booking.player_id !== userId || booking.status !== "completed") {
    redirect("/bookings");
  }

  const { data: existing } = await supabase
    .from("reviews")
    .select("id")
    .eq("booking_id", bookingId)
    .maybeSingle();

  if (existing) redirect(`/providers/${booking.provider_id}`);

  const [providerResult, serviceResult] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", booking.provider_id).maybeSingle(),
    supabase.from("services").select("title").eq("id", booking.service_id).maybeSingle(),
  ]);

  return (
    <div className="min-h-[calc(100vh-65px)] bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-xl px-6 py-12 sm:py-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Leave a Review
          </h1>
          <p className="mt-2 text-gray-500">
            Help other golfers by sharing your experience
          </p>
        </div>
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <ReviewForm
            bookingId={bookingId}
            providerId={booking.provider_id}
            providerName={providerResult.data?.full_name || "Provider"}
            serviceName={serviceResult.data?.title || "Service"}
          />
        </div>
      </div>
    </div>
  );
}
