"use client";

import { useState } from "react";

interface Props {
  connected: boolean;
}

export default function StripeConnectButton({ connected }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleConnect() {
    setLoading(true);
    const res = await fetch("/api/stripe/connect", {
      method: "POST",
    });
    const data = await res.json();

    if (res.ok && data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error || "Failed to start Stripe onboarding");
      setLoading(false);
    }
  }

  if (connected) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
        <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-medium text-green-700">
          Stripe connected — you can receive payments
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#635bff] px-6 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-[#5a52e0] disabled:opacity-50"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.918 3.757 7.117c0 4.024 2.447 5.738 6.381 7.11 2.514.877 3.366 1.549 3.366 2.584 0 .953-.783 1.516-2.199 1.516-1.907 0-4.756-.867-6.772-2.137l-.89 5.549C5.576 22.747 8.252 24 12.165 24c2.591 0 4.753-.683 6.311-1.928 1.658-1.315 2.523-3.264 2.523-5.601 0-4.058-2.441-5.678-7.023-7.321z" />
      </svg>
      {loading ? "Setting up..." : "Set Up Payments with Stripe"}
    </button>
  );
}
