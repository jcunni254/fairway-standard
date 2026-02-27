import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { serviceId, providerId, scheduledAt, notes, totalPrice } =
      await req.json();

    if (!serviceId || !providerId || !scheduledAt || !totalPrice) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (userId === providerId) {
      return NextResponse.json(
        { error: "You cannot book your own service" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        service_id: serviceId,
        player_id: userId,
        provider_id: providerId,
        status: "pending",
        scheduled_at: scheduledAt,
        notes: notes || null,
        total_price: totalPrice,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Booking request sent!", bookingId: data.id },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
