import { createClient } from "@supabase/supabase-js";

export default async function AdminCoursesPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Golf Courses</h1>
      <p className="mt-1 text-gray-500">All registered courses and their managers.</p>

      <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-600">Course Name</th>
              <th className="px-4 py-3 font-medium text-gray-600">Location</th>
              <th className="px-4 py-3 font-medium text-gray-600">Phone</th>
              <th className="px-4 py-3 font-medium text-gray-600">Website</th>
              <th className="px-4 py-3 font-medium text-gray-600">Added</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {courses && courses.length > 0 ? (
              courses.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {[c.city, c.state].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{c.phone || "—"}</td>
                  <td className="px-4 py-3">
                    {c.website ? (
                      <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-fairway-600 hover:underline text-xs">
                        Visit
                      </a>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">No courses yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
