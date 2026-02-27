import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Link from "next/link";
import StarRating from "@/components/StarRating";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", id)
    .maybeSingle();

  if (!profile) return { title: "Provider Not Found" };

  const roleLabel = profile.role === "caddie" ? "Caddie" : "Golf Instructor";
  return {
    title: `${profile.full_name} — ${roleLabel} | The Fairway Standard`,
    description: `Book ${profile.full_name}, a ${roleLabel.toLowerCase()} on The Fairway Standard.`,
  };
}

export default async function ProviderPage({ params }: Props) {
  const { id } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!profile || (profile.role !== "caddie" && profile.role !== "instructor")) {
    notFound();
  }

  const [servicesResult, reviewsResult] = await Promise.all([
    supabase
      .from("services")
      .select("*")
      .eq("provider_id", id)
      .eq("available", true)
      .order("created_at", { ascending: false }),
    supabase
      .from("reviews")
      .select("*")
      .eq("provider_id", id)
      .order("created_at", { ascending: false }),
  ]);

  const services = servicesResult.data;
  const reviews = reviewsResult.data || [];

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const reviewerIds = [...new Set(reviews.map((r) => r.reviewer_id))];
  let reviewersMap: Record<string, { full_name: string }> = {};
  if (reviewerIds.length > 0) {
    const { data: reviewers } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", reviewerIds);
    if (reviewers) {
      for (const r of reviewers) reviewersMap[r.id] = r;
    }
  }

  const roleLabel = profile.role === "caddie" ? "Caddie" : "Golf Instructor";

  return (
    <div className="min-h-[calc(100vh-65px)] bg-gray-50">
      <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        {/* Profile Header */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-5">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-fairway-100 text-2xl font-bold text-fairway-700">
                {profile.full_name?.[0] || "?"}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile.full_name}
                </h1>
                {profile.verified && (
                  <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                )}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <span className="rounded-full bg-fairway-50 px-3 py-0.5 font-medium text-fairway-700">
                  {roleLabel}
                </span>
                {profile.hourly_rate && (
                  <span>${Number(profile.hourly_rate).toFixed(0)}/hr</span>
                )}
                {profile.years_experience && (
                  <span>{profile.years_experience} years exp.</span>
                )}
                {reviews.length > 0 && (
                  <StarRating rating={avgRating} count={reviews.length} />
                )}
              </div>
            </div>
          </div>
          {profile.bio && (
            <p className="mt-5 leading-relaxed text-gray-600">{profile.bio}</p>
          )}
        </div>

        {/* Services */}
        {services && services.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-gray-900">
              Available Services
            </h2>
            <div className="mt-4 space-y-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {service.title}
                      </h3>
                      {service.description && (
                        <p className="mt-1 text-sm text-gray-500">
                          {service.description}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-gray-400">
                        {service.duration_minutes} minutes
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="text-xl font-bold text-fairway-700">
                        ${Number(service.price).toFixed(0)}
                      </p>
                      <Link
                        href={`/book/${service.id}`}
                        className="rounded-lg bg-fairway-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-fairway-800"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Reviews</h2>
              <div className="flex items-center gap-2">
                <StarRating rating={avgRating} size="md" />
                <span className="text-sm font-medium text-gray-700">
                  {avgRating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-400">
                  ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                </span>
              </div>
            </div>
            <div className="mt-4 space-y-4">
              {reviews.map((review) => {
                const reviewer = reviewersMap[review.reviewer_id];
                return (
                  <div
                    key={review.id}
                    className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                          {reviewer?.full_name?.[0] || "?"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {reviewer?.full_name || "Golfer"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(review.created_at).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric", year: "numeric" }
                            )}
                          </p>
                        </div>
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                    {review.comment && (
                      <p className="mt-3 text-sm text-gray-600">
                        {review.comment}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/browse"
            className="text-sm text-gray-400 hover:text-fairway-600"
          >
            ← Browse all providers
          </Link>
        </div>
      </div>
    </div>
  );
}
