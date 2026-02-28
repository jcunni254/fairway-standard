import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import StarRating from "@/components/StarRating";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Caddies & Instructors — The Fairway Standard",
  description:
    "Find experienced caddies and golf instructors near you. Compare rates, read reviews, and book instantly.",
};

interface SearchParams {
  type?: string;
}

interface BrowseProvider {
  id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  hourly_rate: number | null;
  years_experience: number | null;
  verified: boolean;
  _type: "caddie" | "instructor";
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { type } = await searchParams;
  const filter = type === "caddie" || type === "instructor" ? type : "all";

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  let caddies: BrowseProvider[] = [];
  let instructors: BrowseProvider[] = [];

  if (filter === "all" || filter === "caddie") {
    const { data } = await supabase
      .from("caddies")
      .select("id, full_name, avatar_url, bio, hourly_rate, years_experience, verified")
      .eq("subscription_status", "active")
      .not("hourly_rate", "is", null)
      .order("created_at", { ascending: false });
    caddies = (data || []).map((c) => ({ ...c, _type: "caddie" as const }));
  }

  if (filter === "all" || filter === "instructor") {
    const { data } = await supabase
      .from("instructors")
      .select("id, full_name, avatar_url, bio, hourly_rate, years_experience, verified")
      .not("hourly_rate", "is", null)
      .order("created_at", { ascending: false });
    instructors = (data || []).map((i) => ({ ...i, _type: "instructor" as const }));
  }

  const providers: BrowseProvider[] = [...caddies, ...instructors];

  const providerIds = providers.map((p) => p.id);
  let ratingsMap: Record<string, { avg: number; count: number }> = {};

  if (providerIds.length > 0) {
    const { data: reviews } = await supabase
      .from("reviews")
      .select("provider_id, rating")
      .in("provider_id", providerIds);

    if (reviews) {
      for (const r of reviews) {
        if (!ratingsMap[r.provider_id]) {
          ratingsMap[r.provider_id] = { avg: 0, count: 0 };
        }
        ratingsMap[r.provider_id].count++;
        ratingsMap[r.provider_id].avg += r.rating;
      }
      for (const pid of Object.keys(ratingsMap)) {
        ratingsMap[pid].avg = ratingsMap[pid].avg / ratingsMap[pid].count;
      }
    }
  }

  const filterLabel =
    filter === "caddie" ? "Caddie" : filter === "instructor" ? "Instructor" : "Provider";

  return (
    <div className="min-h-[calc(100vh-65px)] bg-gray-50/50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Find Your {filterLabel}
          </h1>
          <p className="mt-2 max-w-xl text-lg text-gray-500">
            Browse experienced providers, compare rates, and book the right fit for your game.
          </p>

          <div className="mt-6 flex gap-2">
            {[
              { value: "all", label: "All Providers" },
              { value: "caddie", label: "Caddies" },
              { value: "instructor", label: "Instructors" },
            ].map((tab) => (
              <Link
                key={tab.value}
                href={tab.value === "all" ? "/browse" : `/browse?type=${tab.value}`}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  filter === tab.value
                    ? "bg-fairway-700 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        {providers.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider) => {
              const rat = ratingsMap[provider.id];
              const roleLabel = provider._type === "caddie" ? "Caddie" : "Instructor";
              return (
                <Link
                  key={provider.id}
                  href={`/providers/${provider.id}`}
                  className="group flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-fairway-300 hover:shadow-lg hover:shadow-fairway-100/50"
                >
                  <div className="p-6 pb-0">
                    <div className="flex items-start gap-4">
                      {provider.avatar_url ? (
                        <img
                          src={provider.avatar_url}
                          alt={provider.full_name}
                          className="h-14 w-14 rounded-full object-cover ring-2 ring-gray-100"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-fairway-100 to-fairway-200 text-xl font-bold text-fairway-700 ring-2 ring-fairway-100">
                          {provider.full_name?.[0] || "?"}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate font-semibold text-gray-900 group-hover:text-fairway-700 transition">
                            {provider.full_name}
                          </h3>
                          {provider.verified && (
                            <svg className="h-4.5 w-4.5 flex-shrink-0 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                              provider._type === "caddie"
                                ? "bg-fairway-50 text-fairway-700"
                                : "bg-navy-50 text-navy-700"
                            }`}
                          >
                            {roleLabel}
                          </span>
                          {provider.years_experience && provider.years_experience > 0 && (
                            <span className="text-xs text-gray-400">
                              {provider.years_experience} yrs exp
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {provider.bio && (
                    <p className="mt-4 px-6 line-clamp-2 text-sm text-gray-500 leading-relaxed">
                      {provider.bio}
                    </p>
                  )}

                  <div className="mt-auto border-t border-gray-100 p-6 pt-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {provider.hourly_rate && (
                          <span className="text-xl font-bold text-gray-900">
                            ${Number(provider.hourly_rate).toFixed(0)}
                            <span className="text-sm font-normal text-gray-400">/hr</span>
                          </span>
                        )}
                        {rat && (
                          <div className="border-l border-gray-200 pl-3">
                            <StarRating rating={rat.avg} count={rat.count} />
                          </div>
                        )}
                      </div>
                      <span className="flex items-center gap-1 text-xs font-medium text-fairway-600 opacity-0 transition group-hover:opacity-100">
                        View
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            <p className="mt-4 text-lg font-semibold text-gray-400">
              No providers yet
            </p>
            <p className="mt-1 text-sm text-gray-400">Be the first to join the platform.</p>
            <Link
              href="/join"
              className="mt-6 inline-block rounded-xl bg-fairway-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-fairway-800"
            >
              Sign Up as a Provider
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
