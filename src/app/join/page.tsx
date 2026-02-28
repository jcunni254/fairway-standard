import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join The Fairway Standard — Caddies & Instructors",
  description:
    "Sign up as a caddie or golf instructor. Build your reputation and get booked by golfers in your area.",
};

async function hasProfile(userId: string): Promise<boolean> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
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
    <div className="min-h-[calc(100vh-65px)] bg-gray-50/50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center sm:py-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-fairway-200 bg-fairway-50 px-4 py-1.5 text-sm font-medium text-fairway-700">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
            </svg>
            For Caddies & Instructors
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Start Getting Booked
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-500">
            Create your profile and connect with golfers in your area. Caddies join for $19.99/month. Instructors set their own rates.
          </p>
          <div className="mt-8">
            <SignedOut>
              <SignUpButton mode="modal" forceRedirectUrl="/onboarding">
                <button className="rounded-xl bg-fairway-700 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-fairway-700/20 transition hover:bg-fairway-800">
                  Get Started
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <a href="/onboarding" className="inline-block rounded-xl bg-fairway-700 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-fairway-700/20 transition hover:bg-fairway-800">
                Complete Your Profile
              </a>
            </SignedIn>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-12 space-y-12">
        {/* Steps */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { step: "1", title: "Create Account", desc: "Quick sign-up with email or Google." },
            { step: "2", title: "Build Your Profile", desc: "Add your experience, bio, and details." },
            { step: "3", title: "Start Booking", desc: "Get discovered by golfers and start earning." },
          ].map((item) => (
            <div key={item.step} className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-fairway-50 text-sm font-bold text-fairway-700">
                {item.step}
              </div>
              <h3 className="mt-3 font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Two paths */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fairway-50 text-fairway-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Caddies</h3>
            </div>
            <ul className="mt-4 space-y-2.5">
              {[
                "$19.99/month subscription to be listed",
                "Rates set by the platform for consistency",
                "Get booked directly by golfers",
                "Build your reputation with reviews",
              ].map((item, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-gray-600">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-fairway-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-navy-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Instructors</h3>
            </div>
            <ul className="mt-4 space-y-2.5">
              {[
                "No subscription fee — join for free",
                "Set your own rates and availability",
                "Affiliate with your home course",
                "Full control over your schedule",
              ].map((item, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-gray-600">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-navy-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
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
