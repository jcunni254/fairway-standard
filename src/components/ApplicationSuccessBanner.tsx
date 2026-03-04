"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ApplicationSuccessBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const applied = searchParams.get("applied");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (applied === "caddie") setVisible(true);
  }, [applied]);

  if (!visible) return null;

  function dismiss() {
    setVisible(false);
    router.replace("/", { scroll: false });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand-green-50">
          <svg
            className="h-8 w-8 text-brand-green-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="font-display text-xl font-bold text-brand-charcoal sm:text-2xl">
          Application Received
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-brand-muted">
          Thank you for applying to caddie with The Fairway Standard. Our team
          will review your application and reach out to you shortly.
        </p>
        <button
          onClick={dismiss}
          className="mt-6 w-full rounded-xl bg-brand-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-green-700"
        >
          Got It
        </button>
      </div>
    </div>
  );
}
