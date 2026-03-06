import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schedule — The Fairway Standard",
};

export default async function DashboardSchedulePage() {
  const { userId } = await auth();
  if (!userId) redirect("/join");

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
  const isInstructor = roleList.includes("instructor");

  if (!isCaddie && !isInstructor) redirect("/onboarding");

  return (
    <div className="min-h-[calc(100vh-65px)] bg-brand-cream">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="font-display text-2xl font-bold text-brand-charcoal">Schedule</h1>
        <p className="mt-2 text-brand-muted">View and manage your availability and bookings. More coming soon.</p>
      </div>
    </div>
  );
}
