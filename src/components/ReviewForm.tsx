"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  bookingId: string;
  providerId: string;
  providerName: string;
  serviceName: string;
}

export default function ReviewForm({
  bookingId,
  providerId,
  providerName,
  serviceName,
}: Props) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) return;

    setStatus("submitting");
    setErrorMsg("");

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingId,
        providerId,
        rating,
        comment: comment.trim() || null,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setStatus("error");
      setErrorMsg(data.error || "Failed to submit review");
      return;
    }

    router.push(`/providers/${providerId}`);
    router.refresh();
  }

  const stars = [1, 2, 3, 4, 5];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-brand-border bg-brand-cream p-5">
        <p className="font-semibold text-brand-charcoal">{serviceName}</p>
        <p className="mt-1 text-sm text-brand-muted">with {providerName}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-charcoal">
          Rating *
        </label>
        <div className="mt-2 flex gap-1">
          {stars.map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="focus:outline-none"
            >
              <svg
                className={`h-8 w-8 transition ${
                  star <= (hovered || rating)
                    ? "text-yellow-400"
                    : "text-gray-200"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
        {rating === 0 && status === "error" && (
          <p className="mt-1 text-xs text-red-500">Please select a rating</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-charcoal">
          Your Review
        </label>
        <textarea
          rows={4}
          placeholder="How was your experience? This helps other golfers decide..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mt-1 w-full rounded-lg border border-brand-border px-4 py-3 text-sm shadow-sm focus:border-brand-green-500 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20"
        />
      </div>

      {status === "error" && errorMsg && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={rating === 0 || status === "submitting"}
        className="w-full rounded-xl bg-brand-green-600 px-6 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-brand-green-700 disabled:opacity-50"
      >
        {status === "submitting" ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
