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
    <div className="min-h-[calc(100vh-65px)] bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-3">
          <Link href="/course" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Overview
          </Link>
          <Link href="/course/instructors" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Instructors
          </Link>
          <Link href="/course/bookings" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Bookings
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-6 py-8">{children}</div>
    </div>
  );
}
