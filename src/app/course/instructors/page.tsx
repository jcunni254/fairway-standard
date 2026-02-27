import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export default async function CourseInstructorsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/join");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: course } = await supabase
    .from("courses")
    .select("id, name")
    .eq("manager_id", userId)
    .maybeSingle();

  if (!course) redirect("/onboarding");

  const { data: instructors } = await supabase
    .from("instructors")
    .select("*")
    .eq("course_id", course.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Instructors at {course.name}</h1>
      <p className="mt-1 text-gray-500">
        Instructors affiliated with your course.
      </p>

      <div className="mt-8 space-y-4">
        {instructors && instructors.length > 0 ? (
          instructors.map((inst) => (
            <div key={inst.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {inst.full_name}
                    {inst.verified && (
                      <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">Verified</span>
                    )}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{inst.bio || "No bio"}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {inst.email || "No email"} {inst.phone ? `· ${inst.phone}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  {inst.hourly_rate && (
                    <p className="text-lg font-bold text-fairway-700">
                      ${Number(inst.hourly_rate).toFixed(0)}/hr
                    </p>
                  )}
                  {inst.years_experience && (
                    <p className="text-xs text-gray-400">{inst.years_experience} yrs exp</p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-400">No instructors affiliated yet.</p>
            <p className="mt-2 text-sm text-gray-400">
              Instructors can select your course during their signup.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
