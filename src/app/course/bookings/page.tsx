import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export default async function CourseBookingsPage() {
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
    .select("id, full_name")
    .eq("course_id", course.id);

  const instructorIds = instructors?.map((i) => i.id) || [];
  const instructorMap: Record<string, string> = {};
  instructors?.forEach((i) => { instructorMap[i.id] = i.full_name; });

  let bookings: Array<Record<string, unknown>> = [];
  if (instructorIds.length > 0) {
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .in("provider_id", instructorIds)
      .order("scheduled_at", { ascending: false })
      .limit(50);
    bookings = data || [];
  }

  const statusStyles: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700",
    confirmed: "bg-green-50 text-green-700",
    completed: "bg-fairway-50 text-fairway-700",
    declined: "bg-red-50 text-red-700",
    cancelled: "bg-gray-50 text-gray-500",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Bookings at {course.name}</h1>
      <p className="mt-1 text-gray-500">All bookings for your affiliated instructors.</p>

      <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-600">Instructor</th>
              <th className="px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 font-medium text-gray-600">Price</th>
              <th className="px-4 py-3 font-medium text-gray-600">Scheduled</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.length > 0 ? (
              bookings.map((b) => (
                <tr key={b.id as string}>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {instructorMap[b.provider_id as string] || "Unknown"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[b.status as string] || ""}`}>
                      {b.status as string}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-900">${Number(b.total_price).toFixed(0)}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(b.scheduled_at as string).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  No bookings yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
