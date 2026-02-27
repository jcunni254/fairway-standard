import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Caddies & Instructors — The Fairway Standard",
  description:
    "Find experienced caddies and golf instructors near you. Compare rates, read reviews, and book instantly.",
};

interface SearchParams {
  type?: string;
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

  let query = supabase
    .from("profiles")
    .select("*")
    .in("role", ["caddie", "instructor"])
    .order("created_at", { ascending: false });

  if (filter !== "all") {
    query = supabase
      .from("profiles")
      .select("*")
      .eq("role", filter)
      .order("created_at", { ascending: false });
  }

  const { data: providers } = await query;

  const providerIds = providers?.map((p) => p.id) || [];
  let servicesMap: Record<string, { count: number; minPrice: number }> = {};

  if (providerIds.length > 0) {
    const { data: services } = await supabase
      .from("services")
      .select("provider_id, price")
      .in("provider_id", providerIds)
      .eq("available", true);

    if (services) {
      for (const s of services) {
        if (!servicesMap[s.provider_id]) {
          servicesMap[s.provider_id] = { count: 0, minPrice: Infinity };
        }
        servicesMap[s.provider_id].count++;
        servicesMap[s.provider_id].minPrice = Math.min(
          servicesMap[s.provider_id].minPrice,
          Number(s.price)
        );
      }
    }
  }

  return (
    <div className="min-h-[calc(100vh-65px)] bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Find Your {filter === "caddie" ? "Caddie" : filter === "instructor" ? "Instructor" : "Caddie or Instructor"}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-gray-500">
            Browse experienced providers, compare rates, and book the right fit
            for your game.
          </p>
        </div>

        {/* Filters */}
        <div className="mt-8 flex justify-center gap-2">
          {[
            { value: "all", label: "All Providers" },
            { value: "caddie", label: "Caddies" },
            { value: "instructor", label: "Instructors" },
          ].map((tab) => (
            <Link
              key={tab.value}
              href={tab.value === "all" ? "/browse" : `/browse?type=${tab.value}`}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                filter === tab.value
                  ? "bg-fairway-700 text-white shadow-sm"
                  : "bg-white text-gray-600 shadow-sm hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Provider Grid */}
        {providers && providers.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider) => {
              const svc = servicesMap[provider.id];
              const roleLabel =
                provider.role === "caddie" ? "Caddie" : "Instructor";
              return (
                <Link
                  key={provider.id}
                  href={`/providers/${provider.id}`}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-fairway-300 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    {provider.avatar_url ? (
                      <img
                        src={provider.avatar_url}
                        alt={provider.full_name}
                        className="h-14 w-14 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-fairway-100 text-xl font-bold text-fairway-700">
                        {provider.full_name?.[0] || "?"}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-fairway-700">
                        {provider.full_name}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span className="rounded-full bg-fairway-50 px-2 py-0.5 font-medium text-fairway-700">
                          {roleLabel}
                        </span>
                        {provider.years_experience && (
                          <span>{provider.years_experience} yrs exp</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {provider.bio && (
                    <p className="mt-4 line-clamp-2 text-sm text-gray-500">
                      {provider.bio}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      {provider.hourly_rate && (
                        <span className="text-lg font-bold text-fairway-700">
                          ${Number(provider.hourly_rate).toFixed(0)}
                          <span className="text-sm font-normal text-gray-400">
                            /hr
                          </span>
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      {svc
                        ? `${svc.count} service${svc.count !== 1 ? "s" : ""} · from $${svc.minPrice.toFixed(0)}`
                        : "View profile →"}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-16 rounded-2xl border border-dashed border-gray-300 p-12 text-center">
            <p className="text-lg font-medium text-gray-400">
              No providers yet — be the first!
            </p>
            <Link
              href="/join"
              className="mt-4 inline-block rounded-lg bg-fairway-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-fairway-800"
            >
              Sign Up as a Provider
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
