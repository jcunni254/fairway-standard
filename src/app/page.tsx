import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { SignUpButton } from "@clerk/nextjs";
import { Suspense } from "react";
import ScrollReveal from "@/components/motion/ScrollReveal";
import StaggerContainer from "@/components/motion/StaggerContainer";
import StaggerItem from "@/components/motion/StaggerItem";
import CourseMap from "@/components/CourseMap";
import ApplicationSuccessBanner from "@/components/ApplicationSuccessBanner";

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || "").split(",").filter(Boolean);

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const justApplied = params.applied === "caddie";

  const { userId } = await auth();
  if (userId && !justApplied) {
    if (ADMIN_USER_IDS.includes(userId)) redirect("/admin");
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    const roleList = roles?.map((r) => r.role) || [];
    if (roleList.includes("caddie")) redirect("/caddie/profile");
    if (roleList.includes("instructor")) redirect("/dashboard");
    if (roleList.includes("course_manager")) redirect("/course");
    if (roleList.includes("player")) redirect("/browse");
  }

  return (
    <div className="flex flex-col">
      <Suspense>
        <ApplicationSuccessBanner />
      </Suspense>
      {/* ─── HERO ─── CSS grid: content centers, scroll+gold pinned to bottom */}
      <section className="grid h-[100svh] grid-rows-[1fr_auto_auto] bg-brand-green-950">
        <div className="flex items-center justify-center overflow-hidden px-6">
          <div className="mx-auto max-w-3xl text-center">
            <ScrollReveal delay={0.2}>
              <Image
                src="/logo-main-cropped.png"
                alt="The Fairway Standard"
                width={624}
                height={585}
                className="mx-auto w-40 sm:w-48 md:w-56"
                priority
              />
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <h1 className="mt-10 font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Book Caddies or Instructors
                <br />
                <span className="bg-gradient-to-r from-brand-gold-400 via-brand-gold-300 to-brand-gold-500 bg-clip-text text-transparent">
                  up to Your Standard
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.6}>
              <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-white/60 sm:text-xl">
                Experience the best on the bag.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.8}>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
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

            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-white/40 animate-[fadeIn_0.6s_ease_1s_both]">
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
          </div>
        </div>

        <div className="flex justify-center pb-3 pt-1 animate-[fadeIn_0.6s_ease_1.2s_both]">
          <div className="flex flex-col items-center gap-1.5 text-white/30">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <div className="h-5 w-px animate-pulse bg-gradient-to-b from-white/30 to-transparent" />
          </div>
        </div>

        <div className="h-1 bg-gradient-to-r from-brand-gold-600 via-brand-gold-400 to-brand-gold-600" />
      </section>

      {/* ─── COURSE MAP ─── */}
      <section className="relative overflow-hidden bg-brand-green-950 py-20 sm:py-28">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <Image
            src="/logo-main.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <div className="text-center">
              <p className="font-display text-sm tracking-[0.25em] text-brand-gold-400 uppercase">
                Explore
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
                Find Courses Near You
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/50">
                Discover golf courses in your area. When our caddies and instructors
                become available at a course, you&rsquo;ll be able to book directly from the map.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="mt-12">
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.06]">
                <CourseMap />
                <div className="pointer-events-none absolute inset-0 z-[5] rounded-2xl shadow-[inset_0_0_80px_rgba(11,37,20,0.5)]" />
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.5}>
            <div className="mt-8 flex items-center justify-center gap-10 text-sm">
              <div className="flex items-center gap-2.5">
                <span className="h-3 w-3 rounded-full bg-brand-gold-400 shadow-[0_0_8px_rgba(232,191,101,0.5)]" />
                <span className="text-white/40">Available Now</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="h-3 w-3 rounded-full bg-white/20" />
                <span className="text-white/30">Coming Soon</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="h-1 bg-gradient-to-r from-brand-gold-600 via-brand-gold-400 to-brand-gold-600" />

      {/* ─── HOW TO BECOME A CADDIE ─── */}
      <section className="relative overflow-hidden bg-brand-green-950 py-20 sm:py-24">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <Image src="/logo-main.png" alt="" fill className="object-contain" />
        </div>

        <div className="relative mx-auto max-w-5xl px-6">
          <ScrollReveal>
            <div className="text-center">
              <Image
                src="/logo-tfs.png"
                alt="The Fairway Standard"
                width={64}
                height={64}
                className="mx-auto mb-6 drop-shadow-[0_0_24px_rgba(232,191,101,0.12)]"
              />
              <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
                How to Become a Caddie
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-white/45">
                Apply in minutes. Get vetted. Start earning.
              </p>
            </div>
          </ScrollReveal>

          <div className="relative mt-14">
            <div className="absolute top-5 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-brand-gold-400/20 via-brand-gold-400/40 to-brand-gold-400/20 hidden lg:block" />

            <StaggerContainer className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.1}>
              {[
                { num: "1", title: "Create Your Account", desc: "Sign up free at thefairwaystandard.org/join/caddie" },
                { num: "2", title: "Answer 5 Questions", desc: "Golf knowledge, course experience, and motivation" },
                { num: "3", title: "We Review", desc: "Our team personally reads every submission" },
                { num: "4", title: "Start Earning", desc: "Get approved, build your profile, get booked" },
              ].map((item) => (
                <StaggerItem key={item.num}>
                  <div className="text-center">
                    <div className="relative mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-600 text-sm font-bold text-white shadow-lg shadow-brand-gold-500/20">
                      {item.num}
                    </div>
                    <h3 className="mt-4 font-display text-sm font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-white/40">
                      {item.desc}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          <ScrollReveal delay={0.3}>
            <div className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-2.5 sm:grid-cols-3">
              {[
                "$19.99/mo — no per-round cuts",
                "Set your own schedule",
                "Direct golfer bookings",
                "Fast Stripe payouts",
                "Build verified reviews",
                "Early access advantage",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <svg className="h-3.5 w-3.5 flex-shrink-0 text-brand-gold-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span className="text-xs text-white/50">{item}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <div className="mt-10 text-center">
              <Link
                href="/join/caddie"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-gold-500 to-brand-gold-400 px-8 py-3.5 font-semibold text-white shadow-xl shadow-brand-gold-500/20 transition hover:shadow-2xl hover:shadow-brand-gold-500/30"
              >
                Apply to Caddie
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <p className="mt-3 text-xs text-white/25">
                Takes about 2 minutes
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Gold accent line */}
      <div className="h-1 bg-gradient-to-r from-brand-gold-600 via-brand-gold-400 to-brand-gold-600" />

      {/* ─── COURSES & ORGANIZATIONS ─── */}
      <section className="relative overflow-hidden bg-brand-green-950 pt-24 pb-14 sm:pt-32 sm:pb-16">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <Image src="/logo-main.png" alt="" fill className="object-contain" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid gap-10 lg:grid-cols-[minmax(280px,380px)_1fr] lg:items-center">
            <ScrollReveal direction="left">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/[0.08] shadow-xl">
                <Image
                  src="/images/flag-green.jpg"
                  alt="Golf course green with flag"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 380px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-green-950/40 to-transparent pointer-events-none" />
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.15}>
              <div className="text-center lg:text-left">
                <p className="font-display text-sm tracking-[0.25em] text-brand-gold-400 uppercase">
                  Partner With Us
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
                  Bring The Fairway Standard to Your Course
                </h2>
                <p className="mt-4 text-white/50 leading-relaxed">
                  We partner with golf courses, country clubs, and resorts to offer
                  vetted caddie and instructor services directly to your members and guests.
                </p>
                <ul className="mt-8 space-y-3">
                  {[
                    "Vetted, professional caddies ready for your course",
                    "Seamless booking for your members and guests",
                    "Custom onboarding for your facility",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-gold-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span className="text-sm text-white/60">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row lg:justify-start justify-center">
                  <a
                    href="mailto:partnerships@thefairwaystandard.com?subject=Course%20Partnership%20Inquiry"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-gold-500 to-brand-gold-400 px-8 py-3.5 font-semibold text-white shadow-xl shadow-brand-gold-500/20 transition hover:shadow-2xl hover:shadow-brand-gold-500/30"
                  >
                    Get in Touch
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
