import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import ScrollReveal from "@/components/motion/ScrollReveal";
import StaggerContainer from "@/components/motion/StaggerContainer";
import StaggerItem from "@/components/motion/StaggerItem";
import ParallaxImage from "@/components/motion/ParallaxImage";

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || "").split(",").filter(Boolean);

export default async function Home() {
  const { userId } = await auth();
  if (userId) {
    if (ADMIN_USER_IDS.includes(userId)) redirect("/admin");
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    const roleList = roles?.map((r) => r.role) || [];
    if (roleList.includes("caddie") || roleList.includes("instructor")) redirect("/dashboard");
    if (roleList.includes("course_manager")) redirect("/course");
    if (roleList.includes("player")) redirect("/browse");
  }

  return (
    <div className="flex flex-col">
      {/* Hero — Parallax golf course photo */}
      <ParallaxImage
        src="/images/hero-golf.jpg"
        alt="Golf course fairway"
        className="min-h-[90vh] flex items-center"
        speed={0.4}
        priority
        overlay="bg-gradient-to-r from-brand-green-950/90 via-brand-green-950/75 to-brand-green-950/50"
      >
        <div className="relative mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <ScrollReveal delay={0.2}>
              <p className="font-display text-sm tracking-[0.25em] text-brand-gold-400 uppercase">
                Est. 2026
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
              <h1 className="mt-4 font-display text-5xl font-bold leading-[1.1] text-white sm:text-6xl lg:text-7xl">
                Premium Golf Services,{" "}
                <span className="bg-gradient-to-r from-brand-gold-400 via-brand-gold-300 to-brand-gold-500 bg-clip-text text-transparent">
                  Lower Rates
                </span>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.6}>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-brand-green-100/70">
                The Fairway Standard connects golfers with experienced caddies and
                qualified instructors at prices that make sense.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.8}>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/browse"
                  className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-brand-gold-500 to-brand-gold-400 px-8 py-4 text-center font-semibold text-white shadow-lg shadow-brand-gold-500/25 transition hover:shadow-brand-gold-500/40 hover:shadow-xl"
                >
                  <span className="relative z-10">Browse Providers</span>
                </Link>
                <Link
                  href="/join"
                  className="rounded-lg border border-white/20 px-8 py-4 text-center font-semibold text-white backdrop-blur-sm transition hover:border-brand-gold-400/40 hover:bg-white/10"
                >
                  Join as a Provider
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </ParallaxImage>

      {/* Gold divider */}
      <div className="h-1 bg-gradient-to-r from-brand-gold-600 via-brand-gold-400 to-brand-gold-600" />

      {/* How It Works */}
      <section className="bg-brand-cream py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal>
            <div className="max-w-xl">
              <p className="font-display text-sm tracking-[0.25em] text-brand-gold-500 uppercase">
                How It Works
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-brand-charcoal sm:text-4xl">
                Three Steps to a Better Round
              </h2>
            </div>
          </ScrollReveal>
          <StaggerContainer className="mt-16 grid gap-px bg-brand-border sm:grid-cols-3 rounded-xl overflow-hidden border border-brand-border" staggerDelay={0.15}>
            {[
              {
                step: "01",
                title: "Browse",
                desc: "Find caddies and instructors in your area. Compare rates, experience, and reviews from other golfers.",
              },
              {
                step: "02",
                title: "Book",
                desc: "Pick a time that works, confirm the details, and pay securely through the platform.",
              },
              {
                step: "03",
                title: "Play",
                desc: "Show up and enjoy a better round. Rate your experience afterward to help the community.",
              },
            ].map((item) => (
              <StaggerItem key={item.step}>
                <div className="group bg-white p-10 transition hover:bg-brand-cream">
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

      {/* For Players — image left, text right */}
      <section className="bg-white py-24 sm:py-32 overflow-hidden">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <ScrollReveal direction="left">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl shadow-brand-green-900/20">
                <Image
                  src="/images/caddie-course.jpg"
                  alt="Golfers on the course"
                  fill
                  className="object-cover transition duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-green-950/30 to-transparent" />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.2}>
              <div>
                <p className="font-display text-sm tracking-[0.25em] text-brand-gold-500 uppercase">
                  For Players
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold text-brand-charcoal sm:text-4xl">
                  Better Rounds, Better Prices
                </h2>
                <ul className="mt-8 space-y-5">
                  {[
                    "Access experienced caddies at rates lower than traditional caddie programs",
                    "Find and book qualified instructors without overpriced pro shop markups",
                    "Read verified reviews from other golfers before you book",
                    "No membership fees — pay per session, that\u2019s it",
                  ].map((item, i) => (
                    <li key={i} className="flex gap-4 text-brand-charcoal/80">
                      <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-600 text-white">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-gold-400/40 to-transparent" />

      {/* For Providers — reversed layout */}
      <section className="bg-gradient-to-br from-brand-green-950 via-brand-green-900 to-brand-green-950 py-24 sm:py-32 overflow-hidden">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <ScrollReveal direction="left" delay={0.2} className="order-2 lg:order-1">
              <div>
                <p className="font-display text-sm tracking-[0.25em] text-brand-gold-400 uppercase">
                  For Caddies & Instructors
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
                  More Clients, Your Schedule
                </h2>
                <ul className="mt-8 space-y-5">
                  {[
                    "Get booked directly by golfers in your area \u2014 no cold outreach",
                    "Build your reputation with verified reviews and a professional profile",
                    "Caddies join for just $19.99/month \u2014 lower fees than traditional programs",
                    "Instructors set their own rates with full control over their schedule",
                  ].map((item, i) => (
                    <li key={i} className="flex gap-4 text-brand-green-100/80">
                      <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-600 text-white">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" className="order-1 lg:order-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl shadow-black/30 ring-1 ring-white/10">
                <Image
                  src="/images/flag-green.jpg"
                  alt="Golf flag on a green"
                  fill
                  className="object-cover transition duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-green-950/40 to-transparent" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Why Different */}
      <section className="bg-brand-cream py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal>
            <div className="text-center">
              <p className="font-display text-sm tracking-[0.25em] text-brand-gold-500 uppercase">
                The Difference
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-brand-charcoal sm:text-4xl">
                Why The Fairway Standard?
              </h2>
            </div>
          </ScrollReveal>
          <StaggerContainer className="mx-auto mt-16 grid max-w-4xl gap-y-8 gap-x-12 sm:grid-cols-2" staggerDelay={0.12}>
            {[
              { title: "Lower Rates", desc: "We cut out the middleman markups that inflate traditional caddie and instructor fees." },
              { title: "Verified Providers", desc: "Every caddie and instructor is vetted. Real experience, real credentials, verified by us." },
              { title: "No Commitments", desc: "Players pay per session with no memberships. Book when you want, on your terms." },
              { title: "Local First", desc: "We\u2019re starting in select markets to ensure a quality experience before expanding." },
            ].map((item) => (
              <StaggerItem key={item.title}>
                <div className="group flex gap-5 rounded-xl border border-brand-border bg-white p-6 shadow-sm transition hover:border-brand-gold-300/50 hover:shadow-md hover:-translate-y-1">
                  <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-600">
                    <div className="h-2.5 w-2.5 rounded-full bg-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-brand-charcoal">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-brand-muted">{item.desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Bottom CTA — Parallax */}
      <ParallaxImage
        src="/images/golf-sunset.jpg"
        alt="Golf course at sunset"
        className="py-24 sm:py-32"
        speed={0.3}
        overlay="bg-brand-green-950/85"
      >
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <ScrollReveal>
            <h2 className="font-display text-3xl font-bold text-white sm:text-5xl">
              Ready to Elevate Your Game?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-brand-green-100/60">
              Whether you&apos;re looking for a caddie, an instructor, or looking
              to get booked — your next round starts here.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/browse"
                className="rounded-lg bg-gradient-to-r from-brand-gold-500 to-brand-gold-400 px-8 py-4 font-semibold text-white shadow-lg shadow-brand-gold-500/25 transition hover:shadow-brand-gold-500/40 hover:shadow-xl"
              >
                Find a Provider
              </Link>
              <Link
                href="/join"
                className="rounded-lg border border-white/20 px-8 py-4 font-semibold text-white backdrop-blur-sm transition hover:border-brand-gold-400/40 hover:bg-white/10"
              >
                Become a Provider
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </ParallaxImage>
    </div>
  );
}
