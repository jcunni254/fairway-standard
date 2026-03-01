import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import OnboardingForm from "@/components/OnboardingForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Started — The Fairway Standard",
};

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) redirect("/join");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: existingRoles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);

  const roles = existingRoles?.map((r) => r.role) || [];
  if (roles.includes("caddie") || roles.includes("instructor")) redirect("/dashboard");
  if (roles.includes("course_manager")) redirect("/course");

  const { data: courses } = await supabase
    .from("courses")
    .select("id, name")
    .order("name");

  const user = await currentUser();
  const prefill = {
    email: user?.emailAddresses?.[0]?.emailAddress || "",
    fullName: [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "",
    avatarUrl: user?.imageUrl || "",
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-brand-charcoal">
            Welcome to The Fairway Standard
          </h1>
          <p className="mt-3 text-brand-muted">
            Tell us who you are so we can set up the right experience for you.
          </p>
        </div>
        <div className="mt-10">
          <OnboardingForm
            prefill={prefill}
            courses={courses || []}
            existingRoles={roles}
          />
        </div>
      </div>
    </div>
  );
}
