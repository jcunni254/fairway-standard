import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import CaddieVettingWizard from "@/components/CaddieVettingWizard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Caddie Application — The Fairway Standard",
  description: "Answer a few quick questions so we can get to know you as a caddie.",
};

export default async function CaddieVettingPage() {
  const { userId } = await auth();
  if (!userId) redirect("/join/caddie");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);

  const roleList = roles?.map((r) => r.role) || [];
  if (!roleList.includes("caddie")) redirect("/onboarding");

  const { data: existing } = await supabase
    .from("caddie_vetting_responses")
    .select("id")
    .eq("caddie_id", userId)
    .maybeSingle();

  if (existing) redirect("/dashboard");

  return (
    <div className="min-h-[calc(100vh-65px)] bg-brand-cream">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-10 text-center">
          <p className="font-display text-sm tracking-[0.25em] text-brand-gold-500 uppercase">
            Almost There
          </p>
          <h1 className="mt-3 font-display text-2xl font-bold text-brand-charcoal sm:text-3xl">
            A Few Quick Questions
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-brand-muted">
            Help us understand your golf knowledge and experience. There are no
            wrong answers — we just want to get to know you.
          </p>
        </div>

        <CaddieVettingWizard />
      </div>
    </div>
  );
}
