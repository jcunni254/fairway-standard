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
  title: "Become a Caddie — The Fairway Standard",
  description:
    "Apply to caddie with The Fairway Standard. Get booked by golfers in your area, set your own schedule, and earn on your terms.",
};

export default async function CaddieJoinPage() {
  const { userId } = await auth();
  if (userId) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    const roleList = roles?.map((r) => r.role) || [];
    if (roleList.includes("caddie")) redirect("/dashboard");
  }

  const ApplyButton = ({ className }: { className?: string }) => (
    <>
      <SignedOut>
        <SignUpButton
          mode="modal"
          forceRedirectUrl="/onboarding?role=caddie"
        >
          <button className={className}>Apply Now</button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <a href="/onboarding?role=caddie" className={className}>
          Complete Your Application
        </a>
      </SignedIn>
    </>
  );

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <ParallaxImage
        src="/images/caddie-course.jpg"
        alt="Caddie on a golf course"
        className="min-h-[85vh] flex items-center"
        speed={0.4}
        priority
        overlay="bg-gradient-to-r from-brand-green-950/90 via-brand-green-950/80 to-brand-green-950/60"
      >
        <div className="relative mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <ScrollReveal delay={0.2}>
              <p className="font-display text-sm tracking-[0.25em] text-brand-gold-400 uppercase">
                Now Hiring
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
              <h1 className="mt-4 font-display text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
                Caddie With{" "}
                <span className="bg-gradient-to-r from-brand-gold-400 via-brand-gold-300 to-brand-gold-500 bg-clip-text text-transparent">
                  The Fairway Standard
                </span>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.6}>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-brand-green-100/80">
                Get booked by golfers in your area. Set your own schedule.
                Earn on your terms. Join a platform built for caddies who
                take the game seriously.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.8}>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <ApplyButton className="rounded-full bg-gradient-to-r from-brand-gold-500 to-brand-gold-400 px-8 py-4 text-center text-lg font-semibold text-white shadow-xl shadow-brand-gold-500/20 transition hover:shadow-2xl hover:shadow-brand-gold-500/30" />
                <p className="text-sm text-brand-green-100/50">
                  Takes about 2 minutes
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </ParallaxImage>

      <div className="h-1 bg-gradient-to-r from-brand-gold-600 via-brand-gold-400 to-brand-gold-600" />

      {/* How It Works */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <ScrollReveal>
            <div className="text-center">
              <p className="font-display text-sm tracking-[0.25em] text-brand-gold-500 uppercase">
                How It Works
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-brand-charcoal sm:text-4xl">
                From Application to Your First Round
              </h2>
            </div>
          </ScrollReveal>
          <StaggerContainer
            className="mt-14 grid gap-px bg-brand-border sm:grid-cols-3 rounded-xl overflow-hidden border border-brand-border"
            staggerDelay={0.15}
          >
            {[
              {
                step: "01",
                title: "Apply",
                desc: "Create your account and answer a few quick questions about your golf knowledge and experience.",
              },
              {
                step: "02",
                title: "Get Verified",
                desc: "Our team reviews your profile. We\u2019re looking for knowledge, reliability, and a passion for the game.",
              },
              {
                step: "03",
                title: "Start Earning",
                desc: "Once approved, golfers in your area can find and book you directly through the platform.",
              },
            ].map((item) => (
              <StaggerItem key={item.step}>
                <div className="group bg-white p-10 text-center transition hover:bg-brand-cream">
                  <span className="font-display text-4xl font-bold bg-gradient-to-b from-brand-gold-400 to-brand-gold-600 bg-clip-text text-transparent">
                    {item.step}
                  </span>
                  <h3 className="mt-4 font-display text-xl font-bold text-brand-charcoal">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-brand-muted">
                    {item.desc}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-brand-gold-400/40 to-transparent" />

      {/* What We Look For */}
      <section className="bg-brand-cream py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <ScrollReveal direction="left">
              <div>
                <p className="font-display text-sm tracking-[0.25em] text-brand-gold-500 uppercase">
                  What We Look For
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold text-brand-charcoal sm:text-4xl">
                  More Than Just Carrying a Bag
                </h2>
                <p className="mt-4 text-brand-muted leading-relaxed">
                  Great caddies elevate a round. We&apos;re looking for people who
                  understand the game, connect with players, and take pride in
                  the experience they deliver.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.15}>
              <StaggerContainer className="space-y-4" staggerDelay={0.1}>
                {[
                  {
                    title: "Golf Knowledge",
                    desc: "Club selection, course management, and the ability to read greens and conditions.",
                  },
                  {
                    title: "People Skills",
                    desc: "Every golfer is different. Great caddies read their player as well as they read the course.",
                  },
                  {
                    title: "Reliability",
                    desc: "Show up on time, prepared, and ready to deliver a great experience every round.",
                  },
                  {
                    title: "Passion for the Game",
                    desc: "The best caddies genuinely love golf. That energy is contagious on the course.",
                  },
                ].map((item) => (
                  <StaggerItem key={item.title}>
                    <div className="flex gap-4 rounded-xl border border-brand-border bg-white p-5 shadow-sm transition hover:border-brand-gold-300/50 hover:shadow-md hover:-translate-y-0.5">
                      <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-green-500 to-brand-green-700">
                        <svg
                          className="h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-brand-charcoal">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm text-brand-muted">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gradient-to-br from-brand-green-950 via-brand-green-900 to-brand-green-950 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <ScrollReveal>
            <div className="text-center">
              <p className="font-display text-sm tracking-[0.25em] text-brand-gold-400 uppercase">
                Why Join Us
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
                Built for Caddies, Not Against Them
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-brand-green-100/60">
                Traditional caddie programs take a huge cut and give you no
                control. We do things differently.
              </p>
            </div>
          </ScrollReveal>
          <StaggerContainer
            className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-3"
            staggerDelay={0.1}
          >
            {[
              {
                title: "Direct Bookings",
                desc: "Golfers find and book you directly. No middleman, no caddie master politics.",
              },
              {
                title: "$19.99/mo",
                desc: "One flat subscription. Lower than the cut traditional programs take from every round.",
              },
              {
                title: "Your Schedule",
                desc: "Work when you want. No mandatory availability windows or minimum hours.",
              },
              {
                title: "Build Your Rep",
                desc: "Verified reviews from real golfers build your profile and bring repeat clients.",
              },
              {
                title: "Get Paid Fast",
                desc: "Payments processed through Stripe. No waiting for weekly checks from the pro shop.",
              },
              {
                title: "Grow With Us",
                desc: "We\u2019re starting local and growing fast. Early caddies build the strongest profiles.",
              },
            ].map((item) => (
              <StaggerItem key={item.title}>
                <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:bg-white/10 hover:-translate-y-1">
                  <h3 className="font-display font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-green-100/60">
                    {item.desc}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Bottom CTA */}
      <ParallaxImage
        src="/images/golf-sunset.jpg"
        alt="Golf course at sunset"
        className="py-20 sm:py-28"
        speed={0.3}
        overlay="bg-brand-green-950/85"
      >
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <ScrollReveal>
            <h2 className="font-display text-3xl font-bold text-white sm:text-5xl">
              Ready to Get Started?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-brand-green-100/60">
              Apply in 2 minutes. We review every application personally
              because the standard matters.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <div className="mt-10">
              <ApplyButton className="inline-block rounded-full bg-gradient-to-r from-brand-gold-500 to-brand-gold-400 px-10 py-4 text-lg font-semibold text-white shadow-xl shadow-brand-gold-500/20 transition hover:shadow-2xl hover:shadow-brand-gold-500/30" />
            </div>
          </ScrollReveal>
        </div>
      </ParallaxImage>
    </div>
  );
}
