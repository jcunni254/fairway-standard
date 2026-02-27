"use client";

import { useState } from "react";
import { useSession, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface Service {
  id: string;
  title: string;
  price: number;
  duration_minutes: number;
  description: string | null;
}

interface Props {
  service: Service;
  providerName: string;
  providerId: string;
}

export default function BookingForm({ service, providerName, providerId }: Props) {
  const { session } = useSession();
  const { user } = useUser();
  const router = useRouter();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !session) return;

    setStatus("submitting");
    setErrorMsg("");

    const scheduledAt = new Date(`${date}T${time}:00`).toISOString();

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceId: service.id,
        providerId,
        scheduledAt,
        notes: notes || null,
        totalPrice: service.price,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus("error");
      setErrorMsg(data.error || "Something went wrong");
      return;
    }

    router.push(`/bookings?new=${data.bookingId}`);
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold text-gray-900">{service.title}</p>
            <p className="mt-1 text-sm text-gray-500">with {providerName}</p>
            <p className="mt-1 text-xs text-gray-400">
              {service.duration_minutes} min
            </p>
          </div>
          <p className="text-2xl font-bold text-fairway-700">
            ${Number(service.price).toFixed(0)}
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date *
          </label>
          <input
            required
            type="date"
            min={minDate}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-fairway-500 focus:outline-none focus:ring-2 focus:ring-fairway-500/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Time *
          </label>
          <select
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-fairway-500 focus:outline-none focus:ring-2 focus:ring-fairway-500/20"
          >
            {Array.from({ length: 13 }, (_, i) => i + 6).map((h) =>
              ["00", "30"].map((m) => {
                const val = `${h.toString().padStart(2, "0")}:${m}`;
                const ampm = h >= 12 ? "PM" : "AM";
                const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
                return (
                  <option key={val} value={val}>
                    {h12}:{m} {ampm}
                  </option>
                );
              })
            )}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Notes for the provider
        </label>
        <textarea
          rows={3}
          placeholder="Any details about your round, skill level, or what you're looking for..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-fairway-500 focus:outline-none focus:ring-2 focus:ring-fairway-500/20"
        />
      </div>

      {status === "error" && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-xl bg-fairway-700 px-6 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-fairway-800 disabled:opacity-50"
      >
        {status === "submitting"
          ? "Requesting..."
          : `Request Booking — $${Number(service.price).toFixed(0)}`}
      </button>

      <p className="text-center text-xs text-gray-400">
        The provider will confirm or decline your request. No payment until
        confirmed.
      </p>
    </form>
  );
}
