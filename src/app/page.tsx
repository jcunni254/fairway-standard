import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { SignUpButton } from "@clerk/nextjs";
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
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen overflow-hidden bg-brand-green-950">
        {/* Background layers */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-golf.jpg"
            alt="Golf course fairway"
            fill
            priority
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-green-950/60 via-brand-green-950/80 to-brand-green-950" />
        </div>

        {/* Decorative logo watermark */}
        <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none hidden lg:block">
          <Image
            src="/logo-tree-flag.png"
            alt=""
            width={700}
            height={700}
            className="select-none"
          />
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6">
          <div className="w-full py-32">
            <div className="max-w-3xl">
              <ScrollReveal delay={0.2}>
                <div className="flex items-center gap-3">
                  <Image
                    src="/logo-crest.png"
                    alt="Est. 2026"
                    width={44}
                    height={44}
                    className="opacity-80"
                  />
                  <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-brand-gold-500/60 to-transparent" />
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.4}>
                <h1 className="mt-8 font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                  Book a Caddie
                  <br />
                  <span className="bg-gradient-to-r from-brand-gold-400 via-brand-gold-300 to-brand-gold-500 bg-clip-text text-transparent">
                    for Your Next Round
                  </span>
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={0.6}>
                <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/60 sm:text-xl">
                  Connect with experienced, vetted caddies in your area.
                  Better reads. Better strategy. Better golf.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.8}>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Link
                    href="/browse"
                    className="group relative overflow-hidden rounded-full bg-gradient-to-r from-brand-gold-500 to-brand-gold-400 px-8 py-4 text-center text-lg font-semibold text-white shadow-xl shadow-brand-gold-500/20 transition hover:shadow-2xl hover:shadow-brand-gold-500/30"
                  >
                    <span className="relative z-10">Browse Caddies</span>
                  </Link>
                  <SignUpButton mode="modal" forceRedirectUrl="/onboarding">
                    <button className="rounded-full border border-white/20 bg-white/5 px-8 py-4 text-center font-semibold text-white backdrop-blur-sm transition hover:border-white/30 hover:bg-white/10">
                      Create Account
                    </button>
                  </SignUpButton>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={1.0}>
                <div className="mt-14 flex items-center gap-8 text-sm text-white/40">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-brand-gold-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Vetted Caddies
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-brand-gold-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Lower Rates
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-brand-gold-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    No Membership Fees
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ScrollReveal delay={1.4}>
            <div className="flex flex-col items-center gap-2 text-white/30">
              <span className="text-xs tracking-widest uppercase">Scroll</span>
              <div className="h-8 w-px animate-pulse bg-gradient-to-b from-white/30 to-transparent" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Gold accent line */}
      <div className="h-1 bg-gradient-to-r from-brand-gold-600 via-brand-gold-400 to-brand-gold-600" />

      {/* ─── HOW IT WORKS ─── */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal>
            <div className="text-center">
              <p className="font-display text-sm tracking-[0.25em] text-brand-gold-500 uppercase">
                Simple Process
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-brand-charcoal sm:text-4xl">
                Your Better Round in Three Steps
              </h2>
            </div>
          </ScrollReveal>

          <StaggerContainer className="mt-16 grid gap-8 sm:grid-cols-3" staggerDelay={0.15}>
            {[
              {
                step: "01",
                title: "Browse",
                desc: "Search caddies by location, experience, and reviews. Find the right fit for your game and your course.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "Book",
                desc: "Pick your date and time, confirm the details, and pay securely. No cash, no hassle.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Play",
                desc: "Show up and enjoy the round. Your caddie handles the reads, the clubs, and the strategy.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
                  </svg>
                ),
              },
            ].map((item) => (
              <StaggerItem key={item.step}>
                <div className="group relative overflow-hidden rounded-2xl border border-brand-border bg-brand-cream/50 p-8 transition duration-300 hover:border-brand-gold-300/50 hover:shadow-lg hover:-translate-y-1">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-green-600 to-brand-green-700 text-white shadow-md shadow-brand-green-600/20">
                      {item.icon}
                    </div>
                    <span className="font-display text-3xl font-bold text-brand-border group-hover:text-brand-gold-300 transition">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold text-brand-charcoal">
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

      {/* ─── WHY A CADDIE? ─── */}
      <section className="overflow-hidden bg-brand-cream py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <ScrollReveal direction="left">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl shadow-brand-green-900/20">
                <Image
                  src="/images/caddie-course.jpg"
                  alt="Caddie assisting a golfer on the course"
                  fill
                  className="object-cover transition duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-green-950/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                    <p className="text-sm font-medium text-white">
                      &ldquo;A good caddie is more than a bag carrier — they&rsquo;re a strategist, a psychologist, and a second set of eyes.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.15}>
              <div>
                <p className="font-display text-sm tracking-[0.25em] text-brand-gold-500 uppercase">
                  Elevate Your Game
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold text-brand-charcoal sm:text-4xl">
                  Why Book a Caddie?
                </h2>
                <p className="mt-4 text-brand-muted leading-relaxed">
                  The difference between a good round and a great one often comes
                  down to decisions. A caddie who knows the course gives you an
                  edge you can&rsquo;t get from a GPS.
                </p>
                <ul className="mt-8 space-y-4">
                  {[
                    {
                      title: "Course Strategy",
                      desc: "Know where to aim, where to lay up, and where the trouble hides.",
                    },
                    {
                      title: "Green Reading",
                      desc: "Breaks, speed, grain — your caddie has walked every putt.",
                    },
                    {
                      title: "Club Selection",
                      desc: "Wind, elevation, lie — the right club for the right shot, every time.",
                    },
                    {
                      title: "Focus on Your Game",
                      desc: "No yardage math, no bag dragging. Just golf.",
                    },
                  ].map((item) => (
                    <li key={item.title} className="flex gap-4">
                      <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-600 text-white">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </span>
                      <div>
                        <h3 className="font-semibold text-brand-charcoal">{item.title}</h3>
                        <p className="mt-0.5 text-sm text-brand-muted">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─── THE FAIRWAY STANDARD DIFFERENCE ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-green-950 via-brand-green-900 to-brand-green-950 py-24 sm:py-32">
        {/* Subtle watermark */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
          <Image src="/logo-main.png" alt="" width={600} height={600} className="select-none" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6">
          <ScrollReveal>
            <div className="text-center">
              <Image
                src="/logo-flag.png"
                alt=""
                width={32}
                height={48}
                className="mx-auto mb-6 opacity-60"
              />
              <p className="font-display text-sm tracking-[0.25em] text-brand-gold-400 uppercase">
                The Difference
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
                Why The Fairway Standard?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/50">
                We built this platform because golfers deserve better access to
                great caddies — and caddies deserve a better way to work.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="mx-auto mt-16 grid max-w-4xl gap-5 sm:grid-cols-2" staggerDelay={0.1}>
            {[
              {
                title: "Vetted Caddies",
                desc: "Every caddie is screened for golf knowledge, course etiquette, and people skills before they join the platform.",
              },
              {
                title: "Lower Rates",
                desc: "No pro shop markup. No caddie master cut. You pay the caddie directly at honest rates.",
              },
              {
                title: "No Commitments",
                desc: "No membership fees, no subscriptions for players. Book when you want, pay per round.",
              },
              {
                title: "Reviews You Can Trust",
                desc: "Every review comes from a verified booking. See exactly what other golfers experienced.",
              },
            ].map((item) => (
              <StaggerItem key={item.title}>
                <div className="group rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm transition duration-300 hover:bg-white/10 hover:border-brand-gold-400/20 hover:-translate-y-1">
                  <h3 className="font-display text-lg font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/50 group-hover:text-white/60 transition">
                    {item.desc}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── FOR CADDIES (subtle section) ─── */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <ScrollReveal direction="left" delay={0.1}>
              <div>
                <p className="font-display text-sm tracking-[0.25em] text-brand-green-500 uppercase">
                  For Caddies
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold text-brand-charcoal sm:text-4xl">
                  Love the Game? Get Paid for It.
                </h2>
                <p className="mt-4 text-brand-muted leading-relaxed">
                  Join a growing network of caddies who set their own schedules,
                  build real reputations, and get booked directly by golfers.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "Direct bookings from golfers in your area",
                    "Just $19.99/mo — no per-round cuts",
                    "Build your profile with verified reviews",
                    "Work when you want, where you want",
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-brand-charcoal/80">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-green-50 text-brand-green-600">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link
                    href="/join/caddie"
                    className="inline-flex items-center gap-2 rounded-full bg-brand-green-600 px-7 py-3 text-sm font-semibold text-white shadow-md shadow-brand-green-600/20 transition hover:bg-brand-green-700 hover:shadow-lg"
                  >
                    Apply to Caddie
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl shadow-brand-green-900/15">
                <Image
                  src="/images/flag-green.jpg"
                  alt="Golf flag on a green"
                  fill
                  className="object-cover transition duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-green-950/30 to-transparent" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA ─── */}
      <ParallaxImage
        src="/images/golf-sunset.jpg"
        alt="Golf course at sunset"
        className="py-24 sm:py-32"
        speed={0.3}
        overlay="bg-brand-green-950/85"
      >
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <ScrollReveal>
            <Image
              src="/logo-tfs.png"
              alt="TFS"
              width={56}
              height={56}
              className="mx-auto mb-8 opacity-60"
            />
            <h2 className="font-display text-3xl font-bold text-white sm:text-5xl">
              Ready to Play Your Best Round?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/50">
              Find experienced caddies in your area and book in minutes.
              No membership required.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/browse"
                className="rounded-full bg-gradient-to-r from-brand-gold-500 to-brand-gold-400 px-9 py-4 text-lg font-semibold text-white shadow-xl shadow-brand-gold-500/20 transition hover:shadow-2xl hover:shadow-brand-gold-500/30"
              >
                Browse Caddies
              </Link>
              <Link
                href="/join/caddie"
                className="rounded-full border border-white/20 bg-white/5 px-9 py-4 font-semibold text-white backdrop-blur-sm transition hover:border-white/30 hover:bg-white/10"
              >
                Apply as a Caddie
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </ParallaxImage>
    </div>
  );
}
