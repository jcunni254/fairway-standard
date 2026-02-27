"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  caddieId: string;
  currentRate: number | null;
  verified: boolean;
}

export default function CaddieRateEditor({ caddieId, currentRate, verified }: Props) {
  const router = useRouter();
  const [rate, setRate] = useState(currentRate?.toString() || "");
  const [saving, setSaving] = useState(false);

  async function saveRate() {
    if (!rate) return;
    setSaving(true);
    await fetch(`/api/admin/caddies/${caddieId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hourly_rate: parseFloat(rate) }),
    });
    setSaving(false);
    router.refresh();
  }

  async function toggleVerified() {
    setSaving(true);
    await fetch(`/api/admin/caddies/${caddieId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verified: !verified }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <span className="text-sm text-gray-500">$</span>
        <input
          type="number"
          min="0"
          step="1"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
          placeholder="0"
        />
        <span className="text-xs text-gray-400">/hr</span>
      </div>
      <button
        onClick={saveRate}
        disabled={saving || !rate}
        className="rounded bg-fairway-700 px-2 py-1 text-xs font-medium text-white hover:bg-fairway-800 disabled:opacity-50"
      >
        Set
      </button>
      <button
        onClick={toggleVerified}
        disabled={saving}
        className={`rounded px-2 py-1 text-xs font-medium ${
          verified
            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        {verified ? "Verified" : "Verify"}
      </button>
    </div>
  );
}
