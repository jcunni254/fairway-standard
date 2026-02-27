import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { SignOutButton } from "@clerk/nextjs";

export default async function CourseOverviewPage() {
  const { userId } = await auth();
  if (!userId) redirect("/join");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("manager_id", userId)
    .maybeSingle();

  if (!course) redirect("/onboarding");

  const { data: instructors } = await supabase
    .from("instructors")
    .select("id")
    .eq("course_id", course.id);

  const instructorIds = instructors?.map((i) => i.id) || [];
  let bookingCount = 0;
  if (instructorIds.length > 0) {
    const { count } = await supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .in("provider_id", instructorIds);
    bookingCount = count || 0;
  }

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{course.name}</h1>
          <p className="mt-1 text-gray-500">
            {[course.address, course.city, course.state, course.zip].filter(Boolean).join(", ") || "No address set"}
          </p>
        </div>
        <SignOutButton>
          <button className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50">
            Sign Out
          </button>
        </SignOutButton>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Instructors</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{instructorIds.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Bookings</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{bookingCount}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Contact</p>
          <p className="mt-1 text-sm font-medium text-gray-900">{course.phone || "Not set"}</p>
          {course.website && (
            <a href={course.website} target="_blank" rel="noopener noreferrer" className="mt-1 block text-xs text-fairway-600 hover:underline">
              {course.website}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
