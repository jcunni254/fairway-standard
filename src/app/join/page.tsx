import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join The Fairway Standard — Caddies & Instructors",
  description:
    "Sign up as a caddie or golf instructor. Set your own rates, build your reputation, and get booked by golfers in your area.",
};

async function hasProfile(userId: string): Promise<boolean> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();
  return !!data;
}

export default async function JoinPage() {
  const { userId } = await auth();

  if (userId) {
    const exists = await hasProfile(userId);
    if (exists) redirect("/dashboard");
  }

  return (
    <div className="min-h-[calc(100vh-65px)] bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <div className="text-center">
          <p className="mb-3 inline-block rounded-full border border-fairway-200 bg-fairway-50 px-4 py-1.5 text-sm font-medium text-fairway-700">
            For Caddies & Instructors
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Start Getting Booked
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-500">
            Create your profile, set your rates, and connect with golfers in
            your area. No upfront fees — you only pay when you get booked.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "Create Account",
              desc: "Quick sign-up with email or Google. Takes 30 seconds.",
            },
            {
              step: "2",
              title: "Build Your Profile",
              desc: "Add your experience, bio, and set your hourly rate.",
            },
            {
              step: "3",
              title: "List Your Services",
              desc: "Describe what you offer and start getting booked.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm"
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-fairway-100 text-sm font-bold text-fairway-700">
                {item.step}
              </div>
              <h3 className="mt-3 font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <SignedOut>
            <SignUpButton mode="modal" forceRedirectUrl="/onboarding">
              <button className="rounded-xl bg-fairway-700 px-8 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-fairway-800">
                Sign Up as a Provider
              </button>
            </SignUpButton>
            <p className="mt-4 text-sm text-gray-400">
              Already have an account?{" "}
              <span className="text-fairway-600">Sign in above to continue.</span>
            </p>
          </SignedOut>
          <SignedIn>
            <a
              href="/onboarding"
              className="inline-block rounded-xl bg-fairway-700 px-8 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-fairway-800"
            >
              Complete Your Profile →
            </a>
          </SignedIn>
        </div>

        <div className="mt-16 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Why providers choose The Fairway Standard
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "Set Your Own Rates",
                desc: "You decide what to charge. No mandatory pricing tiers or fixed fees.",
              },
              {
                title: "Flexible Schedule",
                desc: "Accept bookings when you want. Block off days. You're in control.",
              },
              {
                title: "Build Your Reputation",
                desc: "Verified reviews from real golfers help you stand out and get more bookings.",
              },
              {
                title: "Lower Platform Fees",
                desc: "We take less than traditional caddie programs so you keep more of what you earn.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <span className="mt-0.5 text-fairway-500">✓</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
