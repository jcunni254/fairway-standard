"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  bookingId: string;
  role: "player" | "provider";
  currentStatus: string;
}

export default function BookingActions({
  bookingId,
  role,
  currentStatus,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function updateStatus(newStatus: string) {
    setLoading(newStatus);
    const res = await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.error || "Failed to update booking");
    }
    setLoading(null);
  }

  if (role === "player") {
    return (
      <button
        onClick={() => updateStatus("cancelled")}
        disabled={loading !== null}
        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
      >
        {loading === "cancelled" ? "Cancelling..." : "Cancel Booking"}
      </button>
    );
  }

  if (currentStatus === "pending") {
    return (
      <div className="flex gap-3">
        <button
          onClick={() => updateStatus("confirmed")}
          disabled={loading !== null}
          className="flex-1 rounded-lg bg-fairway-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-fairway-800 disabled:opacity-50"
        >
          {loading === "confirmed" ? "Confirming..." : "Accept"}
        </button>
        <button
          onClick={() => updateStatus("declined")}
          disabled={loading !== null}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
        >
          {loading === "declined" ? "Declining..." : "Decline"}
        </button>
      </div>
    );
  }

  if (currentStatus === "confirmed") {
    return (
      <div className="flex gap-3">
        <button
          onClick={() => updateStatus("completed")}
          disabled={loading !== null}
          className="flex-1 rounded-lg bg-fairway-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-fairway-800 disabled:opacity-50"
        >
          {loading === "completed" ? "Completing..." : "Mark Completed"}
        </button>
        <button
          onClick={() => updateStatus("cancelled")}
          disabled={loading !== null}
          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
        >
          {loading === "cancelled" ? "Cancelling..." : "Cancel"}
        </button>
      </div>
    );
  }

  return null;
}
