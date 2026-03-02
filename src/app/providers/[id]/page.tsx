import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Link from "next/link";
import StarRating from "@/components/StarRating";
import ScrollReveal from "@/components/motion/ScrollReveal";
import StaggerContainer from "@/components/motion/StaggerContainer";
import StaggerItem from "@/components/motion/StaggerItem";
import type { Metadata } from "next";

interface Props { params: Promise<{ id: string }>; }
interface ProviderData {
  id: string; full_name: string; avatar_url: string | null; bio: string | null;
  hourly_rate: number | null; years_experience: number | null; verified: boolean;
  phone: string | null; email: string | null; _type: "caddie" | "instructor";
}

async function getProvider(supabase: SupabaseClient, id: string): Promise<ProviderData | null> {
  const { data: caddie } = await supabase.from("caddies").select("*").eq("id", id).maybeSingle();
  if (caddie) return { ...(caddie as Record<string, unknown>), _type: "caddie" } as ProviderData;
  const { data: instructor } = await supabase.from("instructors").select("*").eq("id", id).maybeSingle();
  if (instructor) return { ...(instructor as Record<string, unknown>), _type: "instructor" } as ProviderData;
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const provider = await getProvider(supabase, id);
  if (!provider) return { title: "Provider Not Found" };
  const roleLabel = provider._type === "caddie" ? "Caddie" : "Golf Instructor";
  return { title: `${provider.full_name} — ${roleLabel} | The Fairway Standard` };
}

export default async function ProviderPage({ params }: Props) {
  const { id } = await params;
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const provider = await getProvider(supabase, id);
  if (!provider) notFound();

  const servicesTable = provider._type === "caddie" ? "caddie_services" : "instructor_services";
  const providerIdCol = provider._type === "caddie" ? "caddie_id" : "instructor_id";
  const [servicesResult, reviewsResult] = await Promise.all([
    supabase.from(servicesTable).select("*").eq(providerIdCol, id).eq("available", true).order("created_at", { ascending: false }),
    supabase.from("reviews").select("*").eq("provider_id", id).order("created_at", { ascending: false }),
  ]);
  const services = servicesResult.data || [];
  const reviews = reviewsResult.data || [];
  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  const reviewerIds = [...new Set(reviews.map((r) => r.reviewer_id))];
  let reviewersMap: Record<string, { full_name: string }> = {};
  if (reviewerIds.length > 0) {
    const { data: reviewers } = await supabase.from("players").select("id, full_name").in("id", reviewerIds);
    if (reviewers) for (const r of reviewers) reviewersMap[r.id] = r;
  }
  const roleLabel = provider._type === "caddie" ? "Caddie" : "Golf Instructor";

  return (
    <div className="min-h-[calc(100vh-65px)]">
      <div className="border-b border-brand-border bg-white">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <ScrollReveal>
            <Link href="/browse" className="inline-flex items-center gap-1.5 text-sm text-brand-muted transition hover:text-brand-green-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
              All Providers
            </Link>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="mt-6 flex items-start gap-5">
              {provider.avatar_url ? (
                <img src={provider.avatar_url} alt={provider.full_name} className="h-20 w-20 rounded-2xl object-cover ring-2 ring-brand-border" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-green-500 to-brand-green-700 text-3xl font-bold text-white ring-2 ring-brand-green-100">{provider.full_name?.[0] || "?"}</div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2.5">
                  <h1 className="font-display text-2xl font-bold text-brand-charcoal">{provider.full_name}</h1>
                  {provider.verified && (
                    <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-gold-50 to-brand-gold-100 px-2.5 py-0.5 text-xs font-semibold text-brand-gold-600">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      Verified
                    </span>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                  <span className={`rounded px-2.5 py-0.5 font-semibold ${provider._type === "caddie" ? "bg-brand-green-50 text-brand-green-700" : "bg-navy-50 text-navy-700"}`}>{roleLabel}</span>
                  {provider.hourly_rate && <span className="font-semibold text-brand-charcoal">${Number(provider.hourly_rate).toFixed(0)}<span className="font-normal text-brand-muted">/hr</span></span>}
                  {provider.years_experience && <span className="text-brand-muted">{provider.years_experience} years</span>}
                  {reviews.length > 0 && <StarRating rating={avgRating} count={reviews.length} />}
                </div>
              </div>
            </div>
          </ScrollReveal>
          {provider.bio && (
            <ScrollReveal delay={0.2}>
              <p className="mt-5 leading-relaxed text-brand-charcoal/70">{provider.bio}</p>
            </ScrollReveal>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-10 space-y-10">
        {services.length > 0 && (
          <div>
            <ScrollReveal>
              <h2 className="font-display text-lg font-bold text-brand-charcoal">Available Services</h2>
            </ScrollReveal>
            <StaggerContainer className="mt-4 space-y-3" staggerDelay={0.1}>
              {services.map((service) => (
                <StaggerItem key={service.id}>
                  <div className="flex items-center justify-between rounded-xl border border-brand-border bg-white p-5 shadow-sm transition duration-300 hover:shadow-md hover:border-brand-gold-300/50 hover:-translate-y-0.5">
                    <div>
                      <h3 className="font-semibold text-brand-charcoal">{service.title}</h3>
                      {service.description && <p className="mt-1 text-sm text-brand-muted">{service.description}</p>}
                      <p className="mt-1.5 text-xs text-brand-muted">{service.duration_minutes} minutes</p>
                    </div>
                    <div className="flex flex-col items-end gap-2.5">
                      <p className="text-xl font-bold text-brand-charcoal">${Number(service.price).toFixed(0)}</p>
                      <Link href={`/book/${service.id}?type=${provider._type}`} className="rounded-lg bg-gradient-to-r from-brand-green-600 to-brand-green-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:shadow-md">Book Now</Link>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        )}

        {reviews.length > 0 && (
          <div>
            <ScrollReveal>
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-brand-charcoal">Reviews</h2>
                <div className="flex items-center gap-2 text-sm">
                  <StarRating rating={avgRating} size="md" />
                  <span className="font-semibold text-brand-charcoal">{avgRating.toFixed(1)}</span>
                  <span className="text-brand-muted">({reviews.length})</span>
                </div>
              </div>
            </ScrollReveal>
            <StaggerContainer className="mt-4 space-y-3" staggerDelay={0.08}>
              {reviews.map((review) => {
                const reviewer = reviewersMap[review.reviewer_id];
                return (
                  <StaggerItem key={review.id}>
                    <div className="rounded-xl border border-brand-border bg-white p-5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-green-500 to-brand-green-700 text-xs font-bold text-white">{reviewer?.full_name?.[0] || "?"}</div>
                          <div>
                            <p className="text-sm font-medium text-brand-charcoal">{reviewer?.full_name || "Golfer"}</p>
                            <p className="text-xs text-brand-muted">{new Date(review.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                          </div>
                        </div>
                        <StarRating rating={review.rating} />
                      </div>
                      {review.comment && <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/70">{review.comment}</p>}
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        )}
      </div>
    </div>
  );
}
