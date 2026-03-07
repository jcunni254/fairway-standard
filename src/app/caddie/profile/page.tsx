import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { fetchOneEntry } from "@builder.io/sdk-react";
import type { Metadata } from "next";
import ProfileEditForm from "@/components/ProfileEditForm";
import BuilderProfileView from "@/components/BuilderProfileView";

/** Same initials logic as NavBar so profile and header always match. */
function getInitials(firstName: string | null, lastName: string | null, email: string | null): string {
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
  if (firstName) return firstName[0].toUpperCase();
  if (lastName) return lastName[0].toUpperCase();
  if (email) return email[0].toUpperCase();
  return "U";
}

export const metadata: Metadata = {
  title: "My Profile — The Fairway Standard",
};

interface CaddieRow {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
  years_experience: number | null;
  hourly_rate: number | null;
  verified: boolean;
  subscription_status: string | null;
  hometown?: string | null;
  home_golf_course?: string | null;
}

interface ReviewRow {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer_id: string;
}

function formatReviewDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const months = Math.floor((now.getTime() - date.getTime()) / (30 * 24 * 60 * 60 * 1000));
  if (months < 1) return "Recently";
  if (months === 1) return "1 month ago";
  if (months < 12) return `${months} months ago`;
  const years = Math.floor(months / 12);
  return years === 1 ? "1 year ago" : `${years} years ago`;
}

export default async function CaddieProfilePage() {
  const { userId } = await auth();
  if (!userId) redirect("/join");

  const clerkUser = await currentUser();
  const clerkImageUrl = clerkUser?.hasImage ? clerkUser.imageUrl : null;
  const clerkInitials = getInitials(
    clerkUser?.firstName ?? null,
    clerkUser?.lastName ?? null,
    clerkUser?.primaryEmailAddress?.emailAddress ?? null
  );

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);

  const roleList = roles?.map((r) => r.role) || [];
  const isCaddie = roleList.includes("caddie");

  if (!isCaddie) redirect("/dashboard");

  const { data: profile } = await supabase
    .from("caddies")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  const row = profile as CaddieRow | null;
  if (!row) redirect("/onboarding");

  const displayName = row.full_name || clerkUser?.fullName || "Guest";
  const avatarUrl = clerkImageUrl || row.avatar_url?.trim() || null;
  const hometown = row.hometown?.trim() || null;
  const homeCourse = row.home_golf_course?.trim() || null;
  const locationLine = [hometown, homeCourse].filter(Boolean).join(" · ") || null;

  const { data: reviewRows } = await supabase
    .from("reviews")
    .select("id, rating, comment, created_at, reviewer_id")
    .eq("provider_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);
  const reviewList = (reviewRows || []) as ReviewRow[];
  const reviewerIds = [...new Set(reviewList.map((r) => r.reviewer_id))];
  let names: Record<string, string> = {};
  if (reviewerIds.length > 0) {
    const { data: players } = await supabase
      .from("players")
      .select("id, full_name")
      .in("id", reviewerIds);
    if (players) for (const p of players) names[p.id] = p.full_name || "A golfer";
  }
  const reviews = reviewList.map((r) => ({
    ...r,
    reviewer_name: names[r.reviewer_id] || "A golfer",
  }));

  const reviewCount = reviews.length;
  const averageRating =
    reviewCount > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : null;

  const builderApiKey = process.env.NEXT_PUBLIC_BUILDER_API_KEY;
  let builderContent: Awaited<ReturnType<typeof fetchOneEntry>> = null;
  if (builderApiKey) {
    try {
      builderContent = await fetchOneEntry({
        model: "page",
        apiKey: builderApiKey,
        userAttributes: { urlPath: "/caddie/profile" },
      });
    } catch {
      // Builder not configured or fetch failed; use fallback
    }
  }

  const builderData = {
    profile: {
      displayName,
      locationLine,
      avatarUrl,
      clerkInitials,
      bio: row.bio ?? null,
      yearsExperience: row.years_experience ?? null,
      roleLabel: "Caddie",
      verified: row.verified,
      subscriptionStatus: row.subscription_status ?? null,
      isCaddie: true,
      phone: row.phone ?? null,
      email: row.email ?? null,
    },
    reviews,
    reviewCount,
    averageRating,
    userId,
  };

  if (builderApiKey && builderContent) {
    return (
      <div className="min-h-[calc(100vh-65px)]">
        <BuilderProfileView content={builderContent} apiKey={builderApiKey} data={builderData} />
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
            <ProfileEditForm
              initial={{
                full_name: row.full_name || "",
                bio: row.bio ?? null,
                phone: row.phone ?? null,
                years_experience: row.years_experience ?? null,
                avatar_url: row.avatar_url ?? null,
                hometown: row.hometown ?? null,
                home_golf_course: row.home_golf_course ?? null,
              }}
              roleLabel="Caddie"
            />
          </div>
          <p className="mt-4 text-center text-sm text-brand-muted">
            <Link href="https://builder.io" target="_blank" rel="noopener noreferrer" className="underline">
              Edit this profile layout in Builder.io
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#f5f5f2]">
      <div className="h-48 bg-gradient-to-br from-brand-green-700 via-brand-green-600 to-brand-green-800 sm:h-56" />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-24 sm:-mt-28">
          <div className="overflow-hidden rounded-2xl border border-brand-border bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                <div className="relative shrink-0">
                  <div className="relative h-28 w-28 overflow-hidden rounded-full border-[3px] border-white shadow-lg sm:h-32 sm:w-32">
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatarUrl}
                        alt=""
                        width={128}
                        height={128}
                        className="h-full w-full object-cover object-center"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-gold-400 to-brand-gold-600 text-4xl font-bold text-white">
                        {clerkInitials}
                      </div>
                    )}
                  </div>
                  {row.verified && (
                    <div className="absolute -bottom-0.5 -right-0.5 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-brand-green-500 shadow-sm" title="Verified">
                      <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <h1 className="font-display text-2xl font-bold text-brand-charcoal sm:text-3xl">{displayName}</h1>
                  {locationLine && <p className="mt-1 text-base text-brand-muted">{locationLine}</p>}
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                    <span className="inline-flex items-center rounded-full bg-brand-green-100 px-3.5 py-1 text-sm font-medium text-brand-green-800">Caddie</span>
                    {row.subscription_status === "active" ? (
                      <span className="inline-flex items-center rounded-full bg-brand-green-50 px-3.5 py-1 text-sm font-medium text-brand-green-700">Subscribed</span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-brand-muted/15 px-3.5 py-1 text-sm font-medium text-brand-muted">Not subscribed</span>
                    )}
                    {reviewCount > 0 && averageRating != null && (
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-charcoal">
                        <span className="flex text-brand-gold-500">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <svg key={i} className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </span>
                        <span>{averageRating.toFixed(1)}</span>
                        <span className="text-brand-muted">({reviewCount} reviews)</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 grid gap-8 pb-16 lg:grid-cols-[1fr,320px] lg:items-start">
          <div className="space-y-8">
            <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-display text-lg font-semibold text-brand-charcoal">About</h2>
              {row.bio ? (
                <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-brand-charcoal/90">{row.bio}</p>
              ) : (
                <p className="mt-3 text-[15px] text-brand-muted">Add a few lines about yourself in Edit profile so golfers can get to know you.</p>
              )}
            </section>
            <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-display text-lg font-semibold text-brand-charcoal">Experience</h2>
              <p className="mt-3 text-[15px] text-brand-charcoal/90">
                {row.years_experience != null ? `${row.years_experience} ${row.years_experience === 1 ? "year" : "years"} of experience` : "—"}
              </p>
            </section>
            <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-display text-lg font-semibold text-brand-charcoal">Reviews & ratings</h2>
              {reviewCount === 0 ? (
                <p className="mt-3 text-[15px] text-brand-muted">No reviews yet. Complete bookings to build your reputation with golfers.</p>
              ) : (
                <>
                  <div className="mt-4 flex items-baseline gap-3">
                    <span className="font-display text-3xl font-bold text-brand-charcoal">{averageRating!.toFixed(1)}</span>
                    <div className="flex items-center gap-1 text-brand-gold-500">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-[15px] text-brand-muted">Based on {reviewCount} {reviewCount === 1 ? "review" : "reviews"}</span>
                  </div>
                  <ul className="mt-6 space-y-5">
                    {reviews.map((r) => (
                      <li key={r.id} className="border-t border-brand-border pt-5 first:border-t-0 first:pt-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-brand-charcoal">{r.reviewer_name}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="flex">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <svg key={i} className={`h-4 w-4 ${i <= r.rating ? "text-brand-gold-500" : "text-brand-border"}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </span>
                            <span className="text-sm text-brand-muted">{formatReviewDate(r.created_at)}</span>
                          </div>
                        </div>
                        {r.comment && <p className="mt-2 text-[15px] leading-relaxed text-brand-charcoal/85">{r.comment}</p>}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>
          </div>
          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
              <h2 className="font-display text-lg font-semibold text-brand-charcoal">Contact</h2>
              <ul className="mt-3 space-y-2 text-[15px] text-brand-muted">
                {row.phone && <li>{row.phone}</li>}
                {row.email && <li className="break-all">{row.email}</li>}
              </ul>
              <Link href={`/providers/${userId}`} className="mt-5 flex w-full items-center justify-center rounded-xl bg-brand-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-green-700">
                View public profile
              </Link>
            </div>
            <ProfileEditForm
              initial={{
                full_name: row.full_name || "",
                bio: row.bio ?? null,
                phone: row.phone ?? null,
                years_experience: row.years_experience ?? null,
                avatar_url: row.avatar_url ?? null,
                hometown: row.hometown ?? null,
                home_golf_course: row.home_golf_course ?? null,
              }}
              roleLabel="Caddie"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
