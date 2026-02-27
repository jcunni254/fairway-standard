import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { sendBookingConfirmation } from "@/lib/email";

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Props) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const { status: newStatus } = await req.json();

  const validTransitions: Record<string, string[]> = {
    pending: ["confirmed", "declined", "cancelled"],
    confirmed: ["completed", "cancelled"],
  };

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("status, player_id, provider_id, service_id, scheduled_at, total_price")
    .eq("id", id)
    .single();

  if (fetchError || !booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const isProvider = userId === booking.provider_id;
  const isPlayer = userId === booking.player_id;

  if (!isProvider && !isPlayer) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  if (isPlayer && newStatus !== "cancelled") {
    return NextResponse.json(
      { error: "Players can only cancel bookings" },
      { status: 403 }
    );
  }

  const allowed = validTransitions[booking.status];
  if (!allowed || !allowed.includes(newStatus)) {
    return NextResponse.json(
      { error: `Cannot change from ${booking.status} to ${newStatus}` },
      { status: 400 }
    );
  }

  const { error: updateError } = await supabase
    .from("bookings")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  if (newStatus === "confirmed") {
    const [playerResult, providerResult, serviceResult] = await Promise.all([
      supabase.from("profiles").select("full_name, email").eq("id", booking.player_id).maybeSingle(),
      supabase.from("profiles").select("full_name").eq("id", booking.provider_id).maybeSingle(),
      supabase.from("services").select("title").eq("id", booking.service_id).maybeSingle(),
    ]);

    if (playerResult.data?.email) {
      const d = new Date(booking.scheduled_at);
      sendBookingConfirmation({
        to: playerResult.data.email,
        playerName: playerResult.data.full_name || "Golfer",
        providerName: providerResult.data?.full_name || "Provider",
        serviceName: serviceResult.data?.title || "Service",
        date: d.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
        price: Number(booking.total_price).toFixed(0),
      }).catch(() => {});
    }
  }

  return NextResponse.json({ message: `Booking ${newStatus}` });
}
