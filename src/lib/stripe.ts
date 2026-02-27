import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
    });
  }
  return _stripe;
}

export const PLATFORM_FEE_PERCENT = 12;

export const CADDIE_SUBSCRIPTION_PRICE = process.env.STRIPE_CADDIE_PRICE_ID || "";
export const CADDIE_MONTHLY_AMOUNT = 1999;
