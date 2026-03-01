import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join The Fairway Standard — Caddies & Instructors",
  description: "Sign up as a caddie or golf instructor. Build your reputation and get booked by golfers in your area.",
};

async function hasProfile(userId: string): Promise<boolean> {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data } = await supabase.from("profiles").select("id").eq("id", userId).maybeSingle();
  return !!data;
}

export default async function JoinPage() {
  const { userId } = await auth();
  if (userId) {
    const exists = await hasProfile(userId);
    if (exists) redirect("/dashboard");
  }

  return (
    <div className="min-h-[calc(100vh-65px)]">
      {/* Banner with photo */}
      <div className="relative h-64 sm:h-80">
        <Image src="/images/flag-green.jpg" alt="Golf green" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-green-950/70 to-brand-green-950/90" />
        <div className="relative flex h-full items-center justify-center text-center px-6">
          <div>
            <p className="font-display text-sm tracking-[0.2em] text-brand-gold-400 uppercase">For Caddies & Instructors</p>
            <h1 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">Start Getting Booked</h1>
            <p className="mx-auto mt-3 max-w-lg text-brand-green-100/70">
              Create your profile and connect with golfers in your area.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-12 space-y-12">
        {/* CTA */}
        <div className="text-center">
          <SignedOut>
            <SignUpButton mode="modal" forceRedirectUrl="/onboarding">
              <button className="rounded-lg bg-brand-gold-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-brand-gold-400">
                Get Started
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <a href="/onboarding" className="inline-block rounded-lg bg-brand-gold-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-brand-gold-400">
              Complete Your Profile
            </a>
          </SignedIn>
        </div>

        {/* Steps */}
        <div className="grid gap-px bg-brand-border sm:grid-cols-3 rounded-xl overflow-hidden border border-brand-border">
          {[
            { step: "1", title: "Create Account", desc: "Quick sign-up with email or Google." },
            { step: "2", title: "Build Your Profile", desc: "Add your experience, bio, and details." },
            { step: "3", title: "Start Booking", desc: "Get discovered by golfers and start earning." },
          ].map((item) => (
            <div key={item.step} className="bg-white p-8 text-center">
              <span className="font-display text-2xl font-bold text-brand-gold-400/30">{item.step}</span>
              <h3 className="mt-2 font-display font-semibold text-brand-charcoal">{item.title}</h3>
              <p className="mt-2 text-sm text-brand-muted">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Two paths */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-xl border border-brand-border bg-white p-6">
            <h3 className="font-display text-lg font-bold text-brand-charcoal">Caddies</h3>
            <ul className="mt-4 space-y-3">
              {["$19.99/month subscription to be listed", "Rates set by the platform for consistency", "Get booked directly by golfers", "Build your reputation with reviews"].map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-brand-charcoal/80">
                  <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-brand-green-50 text-brand-green-600">
                    <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-brand-border bg-white p-6">
            <h3 className="font-display text-lg font-bold text-brand-charcoal">Instructors</h3>
            <ul className="mt-4 space-y-3">
              {["No subscription fee — join for free", "Set your own rates and availability", "Affiliate with your home course", "Full control over your schedule"].map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-brand-charcoal/80">
                  <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-brand-gold-50 text-brand-gold-500">
                    <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
