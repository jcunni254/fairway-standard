import Link from "next/link";
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
      {/* Hero */}
      <section className="relative overflow-hidden bg-fairway-950">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(22,163,74,0.3),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_100%_50%,rgba(54,79,199,0.15),transparent)]" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-fairway-400/40 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-28 sm:pb-32 sm:pt-36 lg:pb-40 lg:pt-44">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-fairway-500/20 bg-fairway-500/10 px-4 py-1.5 text-sm font-medium text-fairway-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fairway-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-fairway-400" />
              </span>
              Now accepting caddies & instructors
            </div>
            <h1 className="mt-8 font-display text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Premium Golf Services,{" "}
              <span className="bg-gradient-to-r from-fairway-300 to-fairway-500 bg-clip-text text-transparent">
                Lower Rates
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-400 sm:text-xl">
              The Fairway Standard connects golfers with experienced caddies and
              qualified instructors at prices that make sense.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/browse"
                className="group flex items-center gap-2 rounded-xl bg-fairway-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-fairway-600/25 transition hover:bg-fairway-500 hover:shadow-fairway-500/30"
              >
                Browse Providers
                <svg className="h-5 w-5 transition group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/join"
                className="rounded-xl border border-white/15 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition hover:border-white/30 hover:bg-white/5"
              >
                Join as a Provider
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-fairway-600">Simple process</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-gray-500">
              Three steps to a better round.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Browse",
                desc: "Find caddies and instructors in your area. Compare rates, experience, and reviews from other golfers.",
                icon: (
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "Book",
                desc: "Pick a time that works, confirm the details, and pay securely. No phone calls needed.",
                icon: (
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Play",
                desc: "Show up and enjoy a better round. Rate your experience afterward to help the community.",
                icon: (
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group relative rounded-2xl border border-gray-100 bg-white p-8 text-center transition hover:border-fairway-200 hover:shadow-lg hover:shadow-fairway-100/50"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-fairway-50 text-fairway-600 transition group-hover:bg-fairway-100">
                  {item.icon}
                </div>
                <p className="mt-6 text-xs font-bold uppercase tracking-widest text-fairway-600">
                  Step {item.step}
                </p>
                <h3 className="mt-2 text-xl font-bold text-gray-900">{item.title}</h3>
                <p className="mt-3 text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two-Sided Value */}
      <section className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-fairway-600">Built for everyone</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Both Sides of the Game
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-gray-500">
              Whether you play, caddie, or teach — The Fairway Standard works for you.
            </p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            {/* Players */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-md sm:p-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-fairway-50 px-4 py-1.5 text-sm font-semibold text-fairway-700">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                For Players
              </div>
              <h3 className="mt-5 text-2xl font-bold text-gray-900">
                Better Rounds, Better Prices
              </h3>
              <ul className="mt-6 space-y-4">
                {[
                  "Access experienced caddies at rates lower than traditional caddie programs",
                  "Find and book qualified instructors without overpriced pro shop markups",
                  "Read verified reviews from other golfers before you book",
                  "No membership fees — pay per session, that's it",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-gray-600">
                    <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-fairway-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* Providers */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-md sm:p-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-navy-50 px-4 py-1.5 text-sm font-semibold text-navy-700">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                </svg>
                For Caddies & Instructors
              </div>
              <h3 className="mt-5 text-2xl font-bold text-gray-900">
                More Clients, Your Schedule
              </h3>
              <ul className="mt-6 space-y-4">
                {[
                  "Get booked directly by golfers in your area — no cold outreach",
                  "Build your reputation with verified reviews and a professional profile",
                  "Caddies join for just $19.99/month — lower fees than traditional programs",
                  "Instructors set their own rates with full control over their schedule",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-gray-600">
                    <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-navy-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Different */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-fairway-600">The difference</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why The Fairway Standard?
            </h2>
          </div>
          <div className="mx-auto mt-16 grid max-w-4xl gap-x-12 gap-y-10 sm:grid-cols-2">
            {[
              {
                title: "Lower Rates",
                desc: "We cut out the middleman markups that inflate traditional caddie and instructor fees.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                title: "Verified Providers",
                desc: "Every caddie and instructor is vetted. Real experience, real credentials, verified by us.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
              },
              {
                title: "No Commitments",
                desc: "Players pay per session with no memberships. Book when you want, on your terms.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                ),
              },
              {
                title: "Local First",
                desc: "We're starting in select markets to ensure a quality experience before expanding nationwide.",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-fairway-50 text-fairway-600">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-fairway-950 py-24 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fairway-800/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Elevate Your Game?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-fairway-200/80">
            Whether you&apos;re looking for a caddie, an instructor, or looking
            to get booked — your next round starts here.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/browse"
              className="rounded-xl bg-white px-8 py-4 text-lg font-semibold text-fairway-900 shadow-lg transition hover:bg-gray-100"
            >
              Find a Provider
            </Link>
            <Link
              href="/join"
              className="rounded-xl border border-white/20 px-8 py-4 text-lg font-semibold text-white transition hover:bg-white/10"
            >
              Become a Provider
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
