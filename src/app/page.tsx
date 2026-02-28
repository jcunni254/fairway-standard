import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import WaitlistForm from "@/components/WaitlistForm";

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || "").split(",").filter(Boolean);

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    if (ADMIN_USER_IDS.includes(userId)) {
      redirect("/admin");
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);

    const roleList = roles?.map((r) => r.role) || [];

    if (roleList.includes("caddie") || roleList.includes("instructor")) {
      redirect("/dashboard");
    }
    if (roleList.includes("course_manager")) {
      redirect("/course");
    }
    if (roleList.includes("player")) {
      redirect("/browse");
    }
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-fairway-950 via-fairway-900 to-navy-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-fairway-800/30 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-24 text-center sm:pb-28 sm:pt-32">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Premium Golf Services,{" "}
            <span className="text-fairway-400">Lower Rates</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-300 sm:text-xl">
            The Fairway Standard connects golfers with experienced caddies and
            qualified instructors at prices that make sense. Better rounds,
            better value.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/browse"
              className="rounded-xl bg-fairway-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-fairway-500"
            >
              Browse Providers
            </Link>
            <Link
              href="/join"
              className="rounded-xl border border-white/20 px-8 py-4 text-lg font-semibold text-white transition hover:bg-white/10"
            >
              Join as a Provider
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
              Three steps to a better round — whether you&apos;re booking a
              caddie or finding an instructor.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Browse",
                desc: "Find caddies and instructors in your area. Compare rates, experience, and reviews.",
                icon: "🔍",
              },
              {
                step: "02",
                title: "Book",
                desc: "Pick a time that works, confirm the details, and you're set. No phone calls needed.",
                icon: "📅",
              },
              {
                step: "03",
                title: "Play",
                desc: "Show up and enjoy. Rate your experience afterward to help the community.",
                icon: "⛳",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-2xl border border-gray-100 bg-gray-50/50 p-8 text-center"
              >
                <div className="text-4xl">{item.icon}</div>
                <p className="mt-4 text-xs font-bold uppercase tracking-widest text-fairway-600">
                  Step {item.step}
                </p>
                <h3 className="mt-2 text-xl font-bold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two-Sided Value */}
      <section className="bg-gray-50 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Built for Both Sides of the Game
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
              Whether you play, caddie, or teach — The Fairway Standard works
              for you.
            </p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-fairway-50 px-4 py-1.5 text-sm font-semibold text-fairway-700">
                🏌️ For Players
              </div>
              <h3 className="mt-5 text-2xl font-bold text-gray-900">
                Better Rounds, Better Prices
              </h3>
              <ul className="mt-6 space-y-4">
                {[
                  "Access experienced caddies at lower rates than typical caddie programs",
                  "Find and book qualified instructors without overpriced pro shop markups",
                  "Read real reviews from other golfers before you book",
                  "No membership fees — pay per session, that's it",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-gray-600">
                    <span className="mt-0.5 text-fairway-500">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-navy-50 px-4 py-1.5 text-sm font-semibold text-navy-700">
                🎓 For Caddies & Instructors
              </div>
              <h3 className="mt-5 text-2xl font-bold text-gray-900">
                More Clients, Your Schedule
              </h3>
              <ul className="mt-6 space-y-4">
                {[
                  "Set your own rates and availability — no one tells you what to charge",
                  "Get booked directly by golfers in your area without cold outreach",
                  "Build your reputation with verified reviews and ratings",
                  "Lower platform fees than traditional caddie programs",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-gray-600">
                    <span className="mt-0.5 text-navy-500">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Different */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why The Fairway Standard?
            </h2>
          </div>
          <div className="mx-auto mt-12 grid max-w-3xl gap-8 sm:grid-cols-2">
            {[
              {
                title: "Lower Rates",
                desc: "We cut out the middleman markups that inflate traditional caddie and instructor fees.",
                icon: "💰",
              },
              {
                title: "Verified Providers",
                desc: "Every caddie and instructor is vetted. Real experience, real credentials.",
                icon: "✅",
              },
              {
                title: "No Commitments",
                desc: "No memberships, no subscriptions. Book when you want, pay per session.",
                icon: "🤝",
              },
              {
                title: "Local First",
                desc: "We're starting in select markets to make sure the experience is right before expanding.",
                icon: "📍",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-fairway-900 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Be First on the Fairway
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-fairway-200">
            We&apos;re launching soon in select markets. Join the waitlist to
            get early access — whether you&apos;re looking to book or looking
            to get booked.
          </p>
          <div className="mt-10">
            <WaitlistForm />
          </div>
        </div>
      </section>
    </div>
  );
}
