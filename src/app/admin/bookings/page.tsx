import { createClient } from "@supabase/supabase-js";

export default async function AdminBookingsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const statusStyles: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700",
    confirmed: "bg-green-50 text-green-700",
    completed: "bg-fairway-50 text-fairway-700",
    declined: "bg-red-50 text-red-700",
    cancelled: "bg-gray-50 text-gray-500",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">All Bookings</h1>
      <p className="mt-1 text-gray-500">Platform-wide booking activity.</p>

      <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-600">Date</th>
              <th className="px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 font-medium text-gray-600">Price</th>
              <th className="px-4 py-3 font-medium text-gray-600">Scheduled</th>
              <th className="px-4 py-3 font-medium text-gray-600">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings && bookings.length > 0 ? (
              bookings.map((b) => (
                <tr key={b.id}>
                  <td className="px-4 py-3 text-gray-900 text-xs font-mono">
                    {b.id.slice(0, 8)}...
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[b.status] || statusStyles.pending}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    ${Number(b.total_price).toFixed(0)}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(b.scheduled_at).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(b.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">No bookings yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
