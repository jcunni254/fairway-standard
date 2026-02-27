import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Link from "next/link";
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

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("provider_id", id)
    .eq("available", true)
    .order("created_at", { ascending: false });

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
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.full_name}
              </h1>
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
              </div>
            </div>
          </div>
          {profile.bio && (
            <p className="mt-5 text-gray-600 leading-relaxed">{profile.bio}</p>
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

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-fairway-600"
          >
            ← Back to The Fairway Standard
          </Link>
        </div>
      </div>
    </div>
  );
}
