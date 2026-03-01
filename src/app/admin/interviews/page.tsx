import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import InterviewUploadForm from "@/components/InterviewUploadForm";

export default async function AdminInterviewsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: interviews } = await supabase
    .from("interviews")
    .select("id, interviewee_name, interviewee_role, status, duration_seconds, created_at")
    .order("created_at", { ascending: false });

  const statusStyles: Record<string, string> = {
    uploading: "bg-blue-50 text-blue-700",
    transcribing: "bg-yellow-50 text-yellow-700",
    completed: "bg-green-50 text-green-700",
    failed: "bg-red-50 text-red-700",
  };

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-charcoal">Interviews</h1>
          <p className="mt-1 text-brand-muted">
            Upload voice recordings and get automatic transcriptions.
          </p>
        </div>
        <InterviewUploadForm />
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-brand-border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-brand-border bg-brand-cream">
            <tr>
              <th className="px-4 py-3 font-medium text-brand-charcoal/70">Name</th>
              <th className="px-4 py-3 font-medium text-brand-charcoal/70">Role</th>
              <th className="px-4 py-3 font-medium text-brand-charcoal/70">Status</th>
              <th className="px-4 py-3 font-medium text-brand-charcoal/70">Date</th>
              <th className="px-4 py-3 font-medium text-brand-charcoal/70"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {interviews && interviews.length > 0 ? (
              interviews.map((interview) => (
                <tr key={interview.id}>
                  <td className="px-4 py-3 font-medium text-brand-charcoal">
                    {interview.interviewee_name}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-brand-green-50 px-2.5 py-0.5 text-xs font-semibold capitalize text-brand-green-700">
                      {interview.interviewee_role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                        statusStyles[interview.status] || ""
                      }`}
                    >
                      {interview.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-brand-muted text-xs">
                    {new Date(interview.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    {interview.status === "completed" && (
                      <Link
                        href={`/admin/interviews/${interview.id}`}
                        className="text-sm font-medium text-brand-green-600 hover:text-fairway-800"
                      >
                        Read Transcript
                      </Link>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-brand-muted">
                  <p className="text-lg font-medium">No interviews yet</p>
                  <p className="mt-1 text-sm">
                    Upload your first voice memo to get started.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
