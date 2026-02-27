import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { getStripe, PLATFORM_FEE_PERCENT } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { serviceId, providerId, scheduledAt, notes } = await req.json();

    if (!serviceId || !providerId || !scheduledAt) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (userId === providerId) {
      return NextResponse.json(
        { error: "Cannot book your own service" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const [serviceResult, providerResult] = await Promise.all([
      supabase.from("services").select("*").eq("id", serviceId).eq("available", true).single(),
      supabase.from("profiles").select("stripe_account_id, full_name").eq("id", providerId).single(),
    ]);

    const service = serviceResult.data;
    const provider = providerResult.data;

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    if (!provider?.stripe_account_id) {
      return NextResponse.json(
        { error: "This provider hasn't set up payments yet. Contact them directly." },
        { status: 400 }
      );
    }

    const priceInCents = Math.round(Number(service.price) * 100);
    const feeInCents = Math.round(priceInCents * (PLATFORM_FEE_PERCENT / 100));

    const origin = process.env.NEXT_PUBLIC_APP_URL || "https://thefairwaystandard.org";

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: service.title,
              description: `${service.duration_minutes} min with ${provider.full_name}`,
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: feeInCents,
        transfer_data: {
          destination: provider.stripe_account_id,
        },
      },
      metadata: {
        serviceId,
        providerId,
        playerId: userId,
        scheduledAt,
        notes: notes || "",
        totalPrice: service.price.toString(),
      },
      success_url: `${origin}/bookings?payment=success`,
      cancel_url: `${origin}/book/${serviceId}?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
