"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", style: "bg-yellow-50 text-yellow-700" },
  { value: "completed", label: "Completed", style: "bg-blue-50 text-blue-700" },
  { value: "reviewed", label: "Reviewed", style: "bg-green-50 text-green-700" },
  { value: "rejected", label: "Rejected", style: "bg-red-50 text-red-700" },
];

interface Props {
  caddieId: string;
  currentStatus: string;
}

export default function CaddieVettingStatusSelect({ caddieId, currentStatus }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const current = STATUS_OPTIONS.find((o) => o.value === currentStatus) || STATUS_OPTIONS[0];

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    if (newStatus === currentStatus) return;
    setSaving(true);
    await fetch(`/api/admin/caddies/${caddieId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vetting_status: newStatus }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={saving}
      className={`rounded-full border-0 px-2.5 py-0.5 text-xs font-semibold cursor-pointer appearance-none pr-6 ${current.style} disabled:opacity-50`}
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
