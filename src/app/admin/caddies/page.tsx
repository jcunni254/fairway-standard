import { getAdminSupabase } from "@/lib/supabase-admin";
import CaddieRateEditor from "@/components/CaddieRateEditor";
import CaddieVettingViewer from "@/components/CaddieVettingViewer";
import CaddieVettingStatusSelect from "@/components/CaddieVettingStatusSelect";

interface Caddie {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  years_experience: number | null;
  hourly_rate: number | null;
  verified: boolean;
  vetting_status: string | null;
  subscription_status: string;
  created_at: string;
}

interface VettingResponse {
  id: string;
  caddie_id: string;
  experience_level: string;
  club_selection_answer: string;
  course_familiarity: string;
  etiquette_answer: string;
  motivation_and_people_skills: string;
  created_at: string;
}

export default async function AdminCaddiesPage() {
  const supabase = getAdminSupabase();

  const { data } = await supabase
    .from("caddies")
    .select("*")
    .order("created_at", { ascending: false });

  const caddies = (data || []) as Caddie[];
  const caddieIds = caddies.map((c) => c.id);
  let vettingMap: Record<string, VettingResponse> = {};
  if (caddieIds.length > 0) {
    const { data: responses } = await supabase
      .from("caddie_vetting_responses")
      .select("*")
      .in("caddie_id", caddieIds);
    if (responses) {
      for (const r of responses) {
        vettingMap[(r as VettingResponse).caddie_id] = r as VettingResponse;
      }
    }
  }

  const subStyles: Record<string, string> = {
    active: "bg-green-50 text-green-700",
    past_due: "bg-yellow-50 text-yellow-700",
    cancelled: "bg-red-50 text-red-700",
    none: "bg-brand-cream text-brand-muted",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-charcoal">Manage Caddies</h1>
      <p className="mt-1 text-brand-muted">
        Set rates, verify caddies, review vetting responses, and monitor subscriptions.
      </p>

      <div className="mt-8 overflow-hidden rounded-xl border border-brand-border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-brand-border bg-brand-cream">
            <tr>
              <th className="px-4 py-3 font-medium text-brand-charcoal/70">Name</th>
              <th className="px-4 py-3 font-medium text-brand-charcoal/70">Contact</th>
              <th className="px-4 py-3 font-medium text-brand-charcoal/70">Experience</th>
              <th className="px-4 py-3 font-medium text-brand-charcoal/70">Vetting</th>
              <th className="px-4 py-3 font-medium text-brand-charcoal/70">Subscription</th>
              <th className="px-4 py-3 font-medium text-brand-charcoal/70">Rate / Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {caddies.length > 0 ? (
              caddies.map((caddie) => {
                const vetting = vettingMap[caddie.id];
                const vettingStatus = caddie.vetting_status || "pending";
                return (
                  <tr key={caddie.id}>
                    <td className="px-4 py-3 font-medium text-brand-charcoal">
                      {caddie.full_name}
                      {caddie.verified && (
                        <span className="ml-1 text-blue-500" title="Verified">
                          &#10003;
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-brand-muted text-sm">{caddie.email || "—"}</div>
                      {caddie.phone && (
                        <div className="text-xs text-brand-muted/70 mt-0.5">{caddie.phone}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-brand-muted">
                      {caddie.years_experience ? `${caddie.years_experience} yrs` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <CaddieVettingStatusSelect
                          caddieId={caddie.id}
                          currentStatus={vettingStatus}
                        />
                        {vetting && (
                          <CaddieVettingViewer responses={vetting} caddieName={caddie.full_name} />
                        )}
                      </div>
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
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-brand-muted">
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
