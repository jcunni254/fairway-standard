import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getStripe } from "@/lib/stripe";
import { sendBookingConfirmation, sendNewBookingNotification } from "@/lib/email";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata;

    if (!meta?.serviceId || !meta?.providerId || !meta?.playerId) {
      return NextResponse.json({ received: true });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: booking } = await supabase
      .from("bookings")
      .insert({
        service_id: meta.serviceId,
        player_id: meta.playerId,
        provider_id: meta.providerId,
        status: "pending",
        scheduled_at: meta.scheduledAt,
        notes: meta.notes || null,
        total_price: parseFloat(meta.totalPrice),
      })
      .select("id")
      .single();

    if (booking) {
      const [playerResult, providerResult, serviceResult] = await Promise.all([
        supabase.from("profiles").select("full_name, email").eq("id", meta.playerId).maybeSingle(),
        supabase.from("profiles").select("full_name, email").eq("id", meta.providerId).maybeSingle(),
        supabase.from("services").select("title").eq("id", meta.serviceId).maybeSingle(),
      ]);

      const d = new Date(meta.scheduledAt);
      const dateStr = d.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });

      if (providerResult.data?.email) {
        sendNewBookingNotification({
          to: providerResult.data.email,
          providerName: providerResult.data.full_name || "Provider",
          playerName: playerResult.data?.full_name || "A golfer",
          serviceName: serviceResult.data?.title || "Service",
          date: dateStr,
          price: meta.totalPrice,
        }).catch(() => {});
      }

      if (playerResult.data?.email) {
        sendBookingConfirmation({
          to: playerResult.data.email,
          playerName: playerResult.data.full_name || "Golfer",
          providerName: providerResult.data?.full_name || "Provider",
          serviceName: serviceResult.data?.title || "Service",
          date: dateStr,
          price: meta.totalPrice,
        }).catch(() => {});
      }
    }
  }

  return NextResponse.json({ received: true });
}
