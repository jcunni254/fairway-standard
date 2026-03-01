"use client";

import { useState } from "react";

interface Props {
  status: string;
}

export default function SubscriptionButton({ status }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    setLoading(true);
    const res = await fetch("/api/stripe/subscription", { method: "POST" });
    const data = await res.json();

    if (res.ok && data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error || "Failed to start subscription");
      setLoading(false);
    }
  }

  if (status === "active") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
        <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-medium text-green-700">Subscription active — you are visible to golfers</span>
      </div>
    );
  }

  if (status === "past_due") {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3">
          <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <span className="text-sm font-medium text-yellow-700">Payment past due — update your payment method to stay visible</span>
        </div>
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full rounded-xl bg-yellow-600 px-6 py-3 font-semibold text-white transition hover:bg-yellow-700 disabled:opacity-50"
        >
          {loading ? "Redirecting..." : "Update Payment Method"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-brand-border bg-brand-cream px-4 py-3">
        <p className="text-sm text-brand-charcoal/70">
          Subscribe for <span className="font-bold text-brand-charcoal">$19.99/month</span> to appear in search results and get booked by golfers.
        </p>
      </div>
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="w-full rounded-xl bg-brand-green-600 px-6 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-brand-green-700 disabled:opacity-50"
      >
        {loading ? "Redirecting to checkout..." : "Subscribe — $19.99/mo"}
      </button>
    </div>
  );
}
