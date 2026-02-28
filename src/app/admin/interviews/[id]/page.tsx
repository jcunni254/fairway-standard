import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function InterviewDetailPage({ params }: Props) {
  const { id } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: interview } = await supabase
    .from("interviews")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!interview) notFound();

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/interviews"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to Interviews
      </Link>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {interview.interviewee_name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span className="rounded-full bg-fairway-50 px-3 py-0.5 font-medium capitalize text-fairway-700">
                {interview.interviewee_role}
              </span>
              <span>
                {new Date(interview.created_at).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              {interview.duration_seconds && (
                <span>{Math.round(interview.duration_seconds / 60)} min</span>
              )}
            </div>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
              interview.status === "completed"
                ? "bg-green-50 text-green-700"
                : interview.status === "failed"
                ? "bg-red-50 text-red-700"
                : "bg-yellow-50 text-yellow-700"
            }`}
          >
            {interview.status}
          </span>
        </div>

        {interview.interviewer_notes && (
          <div className="mt-4 rounded-lg bg-gray-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Notes
            </p>
            <p className="mt-1 text-sm text-gray-600">{interview.interviewer_notes}</p>
          </div>
        )}
      </div>

      {interview.status === "completed" && interview.transcript ? (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-gray-900">Transcript</h2>
          <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {interview.transcript}
            </div>
          </div>
        </div>
      ) : interview.status === "failed" ? (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-medium text-red-700">Transcription failed</p>
          <p className="mt-1 text-sm text-red-600">
            Try uploading the recording again. If the issue persists, check that the audio file is valid.
          </p>
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-yellow-200 bg-yellow-50 p-6 text-center">
          <p className="font-medium text-yellow-700">Transcription in progress...</p>
          <p className="mt-1 text-sm text-yellow-600">
            Refresh this page in a moment to see the transcript.
          </p>
        </div>
      )}
    </div>
  );
}
