import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

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
      {/* Hero — Full-bleed golf course photo */}
      <section className="relative min-h-[85vh] flex items-center">
        <Image
          src="/images/hero-golf.jpg"
          alt="Golf course fairway"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-green-950/90 via-brand-green-950/70 to-brand-green-950/40" />
        <div className="relative mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="font-display text-sm tracking-[0.2em] text-brand-gold-400 uppercase">
              Est. 2026
            </p>
            <h1 className="mt-4 font-display text-5xl font-bold leading-[1.1] text-white sm:text-6xl lg:text-7xl">
              Premium Golf Services,{" "}
              <span className="text-brand-gold-400">Lower Rates</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-brand-green-100/70">
              The Fairway Standard connects golfers with experienced caddies and
              qualified instructors at prices that make sense.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/browse"
                className="rounded-lg bg-brand-gold-500 px-8 py-4 text-center font-semibold text-white shadow-lg transition hover:bg-brand-gold-400"
              >
                Browse Providers
              </Link>
              <Link
                href="/join"
                className="rounded-lg border border-white/20 px-8 py-4 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Join as a Provider
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-brand-cream py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-xl">
            <p className="font-display text-sm tracking-[0.2em] text-brand-gold-500 uppercase">
              How It Works
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-brand-charcoal sm:text-4xl">
              Three Steps to a Better Round
            </h2>
          </div>
          <div className="mt-16 grid gap-px bg-brand-border sm:grid-cols-3 rounded-xl overflow-hidden border border-brand-border">
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
              <div key={item.step} className="bg-white p-10">
                <span className="font-display text-3xl font-bold text-brand-gold-400/30">
                  {item.step}
                </span>
                <h3 className="mt-4 font-display text-xl font-bold text-brand-charcoal">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-muted">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two-Sided Value — Asymmetric with image */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/caddie-course.jpg"
                alt="Golfers on the course"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-display text-sm tracking-[0.2em] text-brand-gold-500 uppercase">
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
                  "No membership fees — pay per session, that's it",
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 text-brand-charcoal/80">
                    <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-gold-50 text-brand-gold-500">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Provider Value — Reversed layout */}
      <section className="bg-brand-cream py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1">
              <p className="font-display text-sm tracking-[0.2em] text-brand-gold-500 uppercase">
                For Caddies & Instructors
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-brand-charcoal sm:text-4xl">
                More Clients, Your Schedule
              </h2>
              <ul className="mt-8 space-y-5">
                {[
                  "Get booked directly by golfers in your area — no cold outreach",
                  "Build your reputation with verified reviews and a professional profile",
                  "Caddies join for just $19.99/month — lower fees than traditional programs",
                  "Instructors set their own rates with full control over their schedule",
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 text-brand-charcoal/80">
                    <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-green-50 text-brand-green-600">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-2xl lg:order-2">
              <Image
                src="/images/flag-green.jpg"
                alt="Golf flag on a green"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Different */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="font-display text-sm tracking-[0.2em] text-brand-gold-500 uppercase">
              The Difference
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-brand-charcoal sm:text-4xl">
              Why The Fairway Standard?
            </h2>
          </div>
          <div className="mx-auto mt-16 grid max-w-4xl gap-y-12 gap-x-16 sm:grid-cols-2">
            {[
              { title: "Lower Rates", desc: "We cut out the middleman markups that inflate traditional caddie and instructor fees." },
              { title: "Verified Providers", desc: "Every caddie and instructor is vetted. Real experience, real credentials, verified by us." },
              { title: "No Commitments", desc: "Players pay per session with no memberships. Book when you want, on your terms." },
              { title: "Local First", desc: "We're starting in select markets to ensure a quality experience before expanding." },
            ].map((item) => (
              <div key={item.title} className="flex gap-5">
                <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-brand-gold-200 bg-brand-gold-50">
                  <div className="h-2 w-2 rounded-full bg-brand-gold-500" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-brand-charcoal">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative py-24 sm:py-32">
        <Image
          src="/images/golf-sunset.jpg"
          alt="Golf course at sunset"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-brand-green-950/85" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Ready to Elevate Your Game?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-brand-green-100/60">
            Whether you&apos;re looking for a caddie, an instructor, or looking
            to get booked — your next round starts here.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/browse"
              className="rounded-lg bg-brand-gold-500 px-8 py-4 font-semibold text-white shadow-lg transition hover:bg-brand-gold-400"
            >
              Find a Provider
            </Link>
            <Link
              href="/join"
              className="rounded-lg border border-white/20 px-8 py-4 font-semibold text-white transition hover:bg-white/10"
            >
              Become a Provider
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
