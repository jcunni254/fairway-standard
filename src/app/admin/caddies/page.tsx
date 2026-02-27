import { createClient } from "@supabase/supabase-js";
import CaddieRateEditor from "@/components/CaddieRateEditor";

export default async function AdminCaddiesPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: caddies } = await supabase
    .from("caddies")
    .select("*")
    .order("created_at", { ascending: false });

  const subStyles: Record<string, string> = {
    active: "bg-green-50 text-green-700",
    past_due: "bg-yellow-50 text-yellow-700",
    cancelled: "bg-red-50 text-red-700",
    none: "bg-gray-50 text-gray-500",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Manage Caddies</h1>
      <p className="mt-1 text-gray-500">
        Set rates, verify caddies, and monitor subscriptions.
      </p>

      <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="px-4 py-3 font-medium text-gray-600">Email</th>
              <th className="px-4 py-3 font-medium text-gray-600">Experience</th>
              <th className="px-4 py-3 font-medium text-gray-600">Subscription</th>
              <th className="px-4 py-3 font-medium text-gray-600">Rate / Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {caddies && caddies.length > 0 ? (
              caddies.map((caddie) => (
                <tr key={caddie.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {caddie.full_name}
                    {caddie.verified && (
                      <span className="ml-1 text-blue-500" title="Verified">
                        &#10003;
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{caddie.email || "—"}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {caddie.years_experience ? `${caddie.years_experience} yrs` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${subStyles[caddie.subscription_status] || subStyles.none}`}>
                      {caddie.subscription_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <CaddieRateEditor
                      caddieId={caddie.id}
                      currentRate={caddie.hourly_rate}
                      verified={caddie.verified}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  No caddies yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
