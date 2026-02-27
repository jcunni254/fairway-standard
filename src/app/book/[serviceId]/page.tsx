import { auth } from "@clerk/nextjs/server";
import { SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import BookingForm from "@/components/BookingForm";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ serviceId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { serviceId } = await params;
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: service } = await supabase
    .from("services")
    .select("title")
    .eq("id", serviceId)
    .maybeSingle();

  return {
    title: service
      ? `Book: ${service.title} — The Fairway Standard`
      : "Book a Service — The Fairway Standard",
  };
}

export default async function BookPage({ params }: Props) {
  const { serviceId } = await params;
  await auth();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("id", serviceId)
    .eq("available", true)
    .maybeSingle();

  if (!service) notFound();

  const { data: provider } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, role")
    .eq("id", service.provider_id)
    .maybeSingle();

  if (!provider) notFound();

  return (
    <div className="min-h-[calc(100vh-65px)] bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-xl px-6 py-12 sm:py-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Book This Service
          </h1>
          <p className="mt-2 text-gray-500">
            Request a booking with {provider.full_name}
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <SignedOut>
            <div className="py-8 text-center">
              <p className="text-gray-600">
                Sign in to request a booking
              </p>
              <SignUpButton mode="modal" forceRedirectUrl={`/book/${serviceId}`}>
                <button className="mt-4 rounded-xl bg-fairway-700 px-8 py-3 font-semibold text-white transition hover:bg-fairway-800">
                  Sign Up / Sign In
                </button>
              </SignUpButton>
            </div>
          </SignedOut>
          <SignedIn>
            <BookingForm
              service={{
                id: service.id,
                title: service.title,
                price: service.price,
                duration_minutes: service.duration_minutes,
                description: service.description,
              }}
              providerName={provider.full_name}
              providerId={service.provider_id}
            />
          </SignedIn>
        </div>
      </div>
    </div>
  );
}
