import { createClient } from "@supabase/supabase-js";
import InstructorVerifyButton from "@/components/InstructorVerifyButton";

export default async function AdminInstructorsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: instructors } = await supabase
    .from("instructors")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Manage Instructors</h1>
      <p className="mt-1 text-gray-500">
        Verify instructors. They set their own rates.
      </p>

      <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="px-4 py-3 font-medium text-gray-600">Email</th>
              <th className="px-4 py-3 font-medium text-gray-600">Rate</th>
              <th className="px-4 py-3 font-medium text-gray-600">Experience</th>
              <th className="px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {instructors && instructors.length > 0 ? (
              instructors.map((inst) => (
                <tr key={inst.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {inst.full_name}
                    {inst.verified && (
                      <span className="ml-1 text-blue-500" title="Verified">&#10003;</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{inst.email || "—"}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium">
                    {inst.hourly_rate ? `$${Number(inst.hourly_rate).toFixed(0)}/hr` : "Not set"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {inst.years_experience ? `${inst.years_experience} yrs` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <InstructorVerifyButton id={inst.id} verified={inst.verified} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">No instructors yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
