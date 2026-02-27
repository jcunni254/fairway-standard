import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getStripe, CADDIE_SUBSCRIPTION_PRICE } from "@/lib/stripe";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!CADDIE_SUBSCRIPTION_PRICE) {
    return NextResponse.json(
      { error: "Subscription not configured yet. Contact support." },
      { status: 500 }
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: caddie } = await supabase
    .from("caddies")
    .select("stripe_customer_id, email, full_name, subscription_status")
    .eq("id", userId)
    .maybeSingle();

  if (!caddie) {
    return NextResponse.json({ error: "Caddie profile not found" }, { status: 404 });
  }

  if (caddie.subscription_status === "active") {
    return NextResponse.json({ error: "Already subscribed" }, { status: 400 });
  }

  const stripe = getStripe();
  let customerId = caddie.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: caddie.email || undefined,
      name: caddie.full_name || undefined,
      metadata: { userId, role: "caddie" },
    });
    customerId = customer.id;

    await supabase
      .from("caddies")
      .update({ stripe_customer_id: customerId })
      .eq("id", userId);
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL || "https://thefairwaystandard.org";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: CADDIE_SUBSCRIPTION_PRICE, quantity: 1 }],
    metadata: { userId, role: "caddie" },
    success_url: `${origin}/dashboard?subscription=active`,
    cancel_url: `${origin}/dashboard?subscription=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}
