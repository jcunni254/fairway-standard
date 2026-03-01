"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InstructorVerifyButton({ id, verified }: { id: string; verified: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    await fetch(`/api/admin/instructors/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verified: !verified }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`rounded px-3 py-1 text-xs font-medium ${
        verified
          ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
          : "bg-gray-100 text-brand-charcoal/70 hover:bg-gray-200"
      } disabled:opacity-50`}
    >
      {verified ? "Verified" : "Verify"}
    </button>
  );
}
