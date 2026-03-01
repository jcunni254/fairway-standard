import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

export default async function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/join");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: role } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "course_manager")
    .maybeSingle();

  if (!role) redirect("/onboarding");

  return (
    <div className="min-h-[calc(100vh-65px)] bg-brand-cream">
      <div className="border-b border-brand-border bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-3">
          <Link href="/course" className="text-sm font-medium text-brand-charcoal/70 hover:text-brand-charcoal">
            Overview
          </Link>
          <Link href="/course/instructors" className="text-sm font-medium text-brand-charcoal/70 hover:text-brand-charcoal">
            Instructors
          </Link>
          <Link href="/course/bookings" className="text-sm font-medium text-brand-charcoal/70 hover:text-brand-charcoal">
            Bookings
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-6 py-8">{children}</div>
    </div>
  );
}
