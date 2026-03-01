import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import StarRating from "@/components/StarRating";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Caddies & Instructors — The Fairway Standard",
  description: "Find experienced caddies and golf instructors near you. Compare rates, read reviews, and book instantly.",
};

interface SearchParams { type?: string; }
interface BrowseProvider {
  id: string; full_name: string; avatar_url: string | null; bio: string | null;
  hourly_rate: number | null; years_experience: number | null; verified: boolean;
  _type: "caddie" | "instructor";
}

export default async function BrowsePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { type } = await searchParams;
  const filter = type === "caddie" || type === "instructor" ? type : "all";
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  let caddies: BrowseProvider[] = [];
  let instructors: BrowseProvider[] = [];

  if (filter === "all" || filter === "caddie") {
    const { data } = await supabase.from("caddies").select("id, full_name, avatar_url, bio, hourly_rate, years_experience, verified").eq("subscription_status", "active").not("hourly_rate", "is", null).order("created_at", { ascending: false });
    caddies = (data || []).map((c) => ({ ...c, _type: "caddie" as const }));
  }
  if (filter === "all" || filter === "instructor") {
    const { data } = await supabase.from("instructors").select("id, full_name, avatar_url, bio, hourly_rate, years_experience, verified").not("hourly_rate", "is", null).order("created_at", { ascending: false });
    instructors = (data || []).map((i) => ({ ...i, _type: "instructor" as const }));
  }

  const providers: BrowseProvider[] = [...caddies, ...instructors];
  const providerIds = providers.map((p) => p.id);
  let ratingsMap: Record<string, { avg: number; count: number }> = {};
  if (providerIds.length > 0) {
    const { data: reviews } = await supabase.from("reviews").select("provider_id, rating").in("provider_id", providerIds);
    if (reviews) {
      for (const r of reviews) {
        if (!ratingsMap[r.provider_id]) ratingsMap[r.provider_id] = { avg: 0, count: 0 };
        ratingsMap[r.provider_id].count++;
        ratingsMap[r.provider_id].avg += r.rating;
      }
      for (const pid of Object.keys(ratingsMap)) ratingsMap[pid].avg = ratingsMap[pid].avg / ratingsMap[pid].count;
    }
  }

  const filterLabel = filter === "caddie" ? "Caddie" : filter === "instructor" ? "Instructor" : "Provider";

  return (
    <div className="min-h-[calc(100vh-65px)]">
      <div className="border-b border-brand-border bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
          <p className="font-display text-sm tracking-[0.2em] text-brand-gold-500 uppercase">Browse</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-brand-charcoal sm:text-4xl">
            Find Your {filterLabel}
          </h1>
          <p className="mt-2 max-w-xl text-brand-muted">
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
                    ? "bg-brand-green-600 text-white"
                    : "border border-brand-border bg-white text-brand-muted hover:border-brand-green-300 hover:text-brand-charcoal"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

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
                  className="group flex flex-col rounded-xl border border-brand-border bg-white shadow-sm transition hover:border-brand-gold-300 hover:shadow-md"
                >
                  <div className="p-6 pb-0">
                    <div className="flex items-start gap-4">
                      {provider.avatar_url ? (
                        <img src={provider.avatar_url} alt={provider.full_name} className="h-14 w-14 rounded-full object-cover ring-2 ring-brand-border" />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green-50 text-xl font-bold text-brand-green-700 ring-2 ring-brand-green-100">
                          {provider.full_name?.[0] || "?"}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate font-display font-semibold text-brand-charcoal group-hover:text-brand-green-600 transition">{provider.full_name}</h3>
                          {provider.verified && (
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-gold-500 text-white">
                              <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                            </span>
                          )}
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <span className={`rounded px-2 py-0.5 text-xs font-semibold ${provider._type === "caddie" ? "bg-brand-green-50 text-brand-green-700" : "bg-navy-50 text-navy-700"}`}>{roleLabel}</span>
                          {provider.years_experience && provider.years_experience > 0 && <span className="text-xs text-brand-muted">{provider.years_experience} yrs exp</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                  {provider.bio && <p className="mt-4 px-6 line-clamp-2 text-sm text-brand-muted leading-relaxed">{provider.bio}</p>}
                  <div className="mt-auto border-t border-brand-border p-6 pt-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {provider.hourly_rate && (
                          <span className="text-xl font-bold text-brand-charcoal">${Number(provider.hourly_rate).toFixed(0)}<span className="text-sm font-normal text-brand-muted">/hr</span></span>
                        )}
                        {rat && <div className="border-l border-brand-border pl-3"><StarRating rating={rat.avg} count={rat.count} /></div>}
                      </div>
                      <span className="text-xs font-medium text-brand-gold-500 opacity-0 transition group-hover:opacity-100">View &rarr;</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-xl border-2 border-dashed border-brand-border p-16 text-center">
            <p className="font-display text-lg font-semibold text-brand-muted">No providers yet</p>
            <p className="mt-1 text-sm text-brand-muted">Be the first to join the platform.</p>
            <Link href="/join" className="mt-6 inline-block rounded-lg bg-brand-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-green-700">
              Sign Up as a Provider
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
