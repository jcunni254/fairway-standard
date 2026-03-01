import { createClient } from "@supabase/supabase-js";

export default async function AdminPlayersPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: players } = await supabase
    .from("players")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-charcoal">Players</h1>
      <p className="mt-1 text-brand-muted">All registered golfers on the platform.</p>

      <div className="mt-8 overflow-hidden rounded-xl border border-brand-border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-brand-border bg-brand-cream">
            <tr>
              <th className="px-4 py-3 font-medium text-brand-charcoal/70">Name</th>
              <th className="px-4 py-3 font-medium text-brand-charcoal/70">Email</th>
              <th className="px-4 py-3 font-medium text-brand-charcoal/70">Phone</th>
              <th className="px-4 py-3 font-medium text-brand-charcoal/70">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {players && players.length > 0 ? (
              players.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-medium text-brand-charcoal">{p.full_name}</td>
                  <td className="px-4 py-3 text-brand-muted">{p.email || "—"}</td>
                  <td className="px-4 py-3 text-brand-muted">{p.phone || "—"}</td>
                  <td className="px-4 py-3 text-brand-muted text-xs">
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-brand-muted">No players yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
