"use client";

import { useState } from "react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("player");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      }
    } catch {
      setStatus("error");
      setMessage("Connection error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-fairway-200 bg-fairway-50 px-6 py-8 text-center">
        <div className="text-3xl">⛳</div>
        <p className="mt-3 text-lg font-semibold text-fairway-800">{message}</p>
        <p className="mt-1 text-sm text-fairway-600">
          We&apos;ll reach out as we launch in your area.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4">
      <div>
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-base shadow-sm transition focus:border-fairway-500 focus:outline-none focus:ring-2 focus:ring-fairway-500/20"
        />
      </div>
      <div className="flex items-center justify-center gap-6 text-sm">
        <span className="text-gray-500">I&apos;m a:</span>
        {(["player", "caddie", "instructor"] as const).map((r) => (
          <label key={r} className="flex cursor-pointer items-center gap-1.5">
            <input
              type="radio"
              name="role"
              value={r}
              checked={role === r}
              onChange={() => setRole(r)}
              className="accent-fairway-600"
            />
            <span className={role === r ? "font-medium text-fairway-700" : "text-gray-600"}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </span>
          </label>
        ))}
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-xl bg-fairway-700 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-fairway-800 focus:outline-none focus:ring-2 focus:ring-fairway-500/40 disabled:opacity-50"
      >
        {status === "loading" ? "Joining..." : "Join the Waitlist"}
      </button>
      {status === "error" && (
        <p className="text-center text-sm text-red-600">{message}</p>
      )}
    </form>
  );
}
