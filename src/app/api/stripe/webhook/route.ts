import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
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

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.mode === "subscription") {
        await handleSubscriptionCheckout(supabase, session);
      } else if (session.mode === "payment") {
        await handlePaymentCheckout(supabase, session);
      }
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      await updateSubscriptionStatus(supabase, sub);
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await handleSubscriptionDeleted(supabase, sub);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const invoiceCustomerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.toString();
      if (invoiceCustomerId) {
        await supabase
          .from("caddies")
          .update({ subscription_status: "past_due" })
          .eq("stripe_customer_id", invoiceCustomerId);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}

async function handleSubscriptionCheckout(
  supabase: SupabaseClient,
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.userId;
  if (!userId) return;

  const subscriptionId = typeof session.subscription === "string"
    ? session.subscription
    : session.subscription?.toString();

  await supabase
    .from("caddies")
    .update({
      subscription_status: "active",
      stripe_subscription_id: subscriptionId || null,
    })
    .eq("id", userId);
}

async function handlePaymentCheckout(
  supabase: SupabaseClient,
  session: Stripe.Checkout.Session
) {
  const meta = session.metadata;
  if (!meta?.serviceId || !meta?.providerId || !meta?.playerId) return;

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
      supabase.from("players").select("full_name, email").eq("id", meta.playerId).maybeSingle(),
      supabase.from("caddies").select("full_name, email").eq("id", meta.providerId).maybeSingle(),
      supabase.from("caddie_services").select("title").eq("id", meta.serviceId).maybeSingle(),
    ]);

    const d = new Date(meta.scheduledAt);
    const dateStr = d.toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit",
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

async function updateSubscriptionStatus(
  supabase: SupabaseClient,
  sub: Stripe.Subscription
) {
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.toString();
  if (!customerId) return;

  let status: string = "none";
  if (sub.status === "active" || sub.status === "trialing") {
    status = "active";
  } else if (sub.status === "past_due") {
    status = "past_due";
  } else if (sub.status === "canceled" || sub.status === "unpaid") {
    status = "cancelled";
  }

  await supabase
    .from("caddies")
    .update({
      subscription_status: status,
      subscription_ends_at: sub.cancel_at
        ? new Date(sub.cancel_at * 1000).toISOString()
        : null,
    })
    .eq("stripe_customer_id", customerId);
}

async function handleSubscriptionDeleted(
  supabase: SupabaseClient,
  sub: Stripe.Subscription
) {
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.toString();
  if (!customerId) return;

  await supabase
    .from("caddies")
    .update({
      subscription_status: "cancelled",
      stripe_subscription_id: null,
    })
    .eq("stripe_customer_id", customerId);
}
