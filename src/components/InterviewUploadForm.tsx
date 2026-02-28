"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function InterviewUploadForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState<"caddie" | "instructor">("caddie");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [progress, setProgress] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !name) return;

    setStatus("uploading");
    setProgress("Uploading audio file...");
    setErrorMsg("");

    const formData = new FormData();
    formData.append("audio", file);
    formData.append("name", name);
    formData.append("role", role);
    if (notes) formData.append("notes", notes);

    try {
      setProgress("Uploading and transcribing (this may take 30-60 seconds)...");

      const res = await fetch("/api/admin/interviews", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Upload failed");
        return;
      }

      setStatus("idle");
      setOpen(false);
      setName("");
      setNotes("");
      setFile(null);
      router.refresh();

      if (data.id) {
        router.push(`/admin/interviews/${data.id}`);
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error — please try again");
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl bg-fairway-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-fairway-800"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Upload Interview
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Upload Interview Recording</h3>
        <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700">Interviewee Name *</label>
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Smith"
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-fairway-500 focus:outline-none focus:ring-2 focus:ring-fairway-500/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Role *</label>
          <div className="mt-2 flex gap-3">
            {(["caddie", "instructor"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition ${
                  role === r
                    ? "border-fairway-600 bg-fairway-50 text-fairway-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {r === "caddie" ? "Caddie" : "Instructor"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notes (optional)</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any context about this interview..."
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-fairway-500 focus:outline-none focus:ring-2 focus:ring-fairway-500/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Audio File *</label>
          <div
            onClick={() => fileRef.current?.click()}
            className={`mt-1 cursor-pointer rounded-lg border-2 border-dashed px-6 py-8 text-center transition ${
              file ? "border-fairway-300 bg-fairway-50" : "border-gray-300 hover:border-gray-400"
            }`}
          >
            {file ? (
              <div>
                <p className="text-sm font-medium text-fairway-700">{file.name}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>
            ) : (
              <div>
                <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                </svg>
                <p className="mt-2 text-sm text-gray-500">Click to select audio file</p>
                <p className="mt-1 text-xs text-gray-400">.m4a, .mp3, .wav, .webm supported</p>
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="audio/*,.m4a,.mp3,.wav,.webm,.mp4"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
          />
        </div>

        {status === "error" && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {status === "uploading" && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {progress}
          </div>
        )}

        <button
          type="submit"
          disabled={status === "uploading" || !file || !name}
          className="w-full rounded-xl bg-fairway-700 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-fairway-800 disabled:opacity-50"
        >
          {status === "uploading" ? "Processing..." : "Upload & Transcribe"}
        </button>
      </form>
    </div>
  );
}
