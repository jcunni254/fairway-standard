import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";
import ParallaxImage from "@/components/motion/ParallaxImage";
import ScrollReveal from "@/components/motion/ScrollReveal";
import StaggerContainer from "@/components/motion/StaggerContainer";
import StaggerItem from "@/components/motion/StaggerItem";

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
      {/* Parallax banner */}
      <ParallaxImage
        src="/images/flag-green.jpg"
        alt="Golf green"
        className="h-72 sm:h-96 flex items-center justify-center"
        speed={0.3}
        overlay="bg-gradient-to-b from-brand-green-950/70 to-brand-green-950/90"
      >
        <div className="relative text-center px-6">
          <ScrollReveal>
            <p className="font-display text-sm tracking-[0.25em] text-brand-gold-400 uppercase">For Caddies & Instructors</p>
            <h1 className="mt-3 font-display text-3xl font-bold text-white sm:text-5xl">Start Getting Booked</h1>
            <p className="mx-auto mt-3 max-w-lg text-brand-green-100/70">
              Create your profile and connect with golfers in your area.
            </p>
          </ScrollReveal>
        </div>
      </ParallaxImage>

      <div className="h-1 bg-gradient-to-r from-brand-gold-600 via-brand-gold-400 to-brand-gold-600" />

      <div className="mx-auto max-w-3xl px-6 py-12 space-y-12">
        {/* CTA */}
        <ScrollReveal className="text-center">
          <SignedOut>
            <SignUpButton mode="modal" forceRedirectUrl="/onboarding">
              <button className="rounded-lg bg-gradient-to-r from-brand-gold-500 to-brand-gold-400 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-brand-gold-500/25 transition hover:shadow-brand-gold-500/40 hover:shadow-xl">
                Get Started
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <a href="/onboarding" className="inline-block rounded-lg bg-gradient-to-r from-brand-gold-500 to-brand-gold-400 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-brand-gold-500/25 transition hover:shadow-brand-gold-500/40 hover:shadow-xl">
              Complete Your Profile
            </a>
          </SignedIn>
        </ScrollReveal>

        {/* Steps */}
        <StaggerContainer className="grid gap-px bg-brand-border sm:grid-cols-3 rounded-xl overflow-hidden border border-brand-border" staggerDelay={0.12}>
          {[
            { step: "1", title: "Create Account", desc: "Quick sign-up with email or Google." },
            { step: "2", title: "Build Your Profile", desc: "Add your experience, bio, and details." },
            { step: "3", title: "Start Booking", desc: "Get discovered by golfers and start earning." },
          ].map((item) => (
            <StaggerItem key={item.step}>
              <div className="bg-white p-8 text-center">
                <span className="font-display text-3xl font-bold bg-gradient-to-b from-brand-gold-400 to-brand-gold-600 bg-clip-text text-transparent">{item.step}</span>
                <h3 className="mt-2 font-display font-semibold text-brand-charcoal">{item.title}</h3>
                <p className="mt-2 text-sm text-brand-muted">{item.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Two paths */}
        <div className="grid gap-5 sm:grid-cols-2">
          <ScrollReveal delay={0}>
            <div className="h-full rounded-xl border border-brand-border bg-white p-6 shadow-sm transition hover:border-brand-green-300/50 hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-green-500 to-brand-green-700">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" /></svg>
                </div>
                <h3 className="font-display text-lg font-bold text-brand-charcoal">Caddies</h3>
              </div>
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
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className="h-full rounded-xl border border-brand-border bg-white p-6 shadow-sm transition hover:border-brand-gold-300/50 hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-600">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" /></svg>
                </div>
                <h3 className="font-display text-lg font-bold text-brand-charcoal">Instructors</h3>
              </div>
              <ul className="mt-4 space-y-3">
                {["No subscription fee \u2014 join for free", "Set your own rates and availability", "Affiliate with your home course", "Full control over your schedule"].map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-brand-charcoal/80">
                    <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-brand-gold-50 text-brand-gold-500">
                      <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
