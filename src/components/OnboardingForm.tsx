"use client";

import { useState } from "react";
import { useSession, useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

interface Props {
  prefill: { email: string; fullName: string; avatarUrl: string };
}

export default function OnboardingForm({ prefill }: Props) {
  const { session } = useSession();
  const { user } = useUser();
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: prefill.fullName,
    role: "caddie" as "caddie" | "instructor",
    bio: "",
    phone: "",
    hourlyRate: "",
    yearsExperience: "",
    serviceTitle: "",
    serviceDescription: "",
    servicePrice: "",
    serviceDuration: "60",
  });

  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function createClerkSupabaseClient() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { accessToken: async () => session?.getToken() ?? null }
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !session) return;

    setStatus("saving");
    setErrorMsg("");

    const supabase = createClerkSupabaseClient();

    const { error: profileError } = await supabase.from("profiles").insert({
      id: user.id,
      email: prefill.email,
      full_name: form.fullName,
      avatar_url: prefill.avatarUrl,
      role: form.role,
      bio: form.bio,
      phone: form.phone || null,
      hourly_rate: parseFloat(form.hourlyRate) || null,
      years_experience: parseInt(form.yearsExperience) || null,
    });

    if (profileError) {
      setStatus("error");
      setErrorMsg(
        profileError.code === "23505"
          ? "Profile already exists. Redirecting..."
          : profileError.message
      );
      if (profileError.code === "23505") {
        setTimeout(() => router.push("/dashboard"), 1500);
      }
      return;
    }

    if (form.serviceTitle && form.servicePrice) {
      const { error: serviceError } = await supabase
        .from("services")
        .insert({
          provider_id: user.id,
          type: form.role,
          title: form.serviceTitle,
          description: form.serviceDescription || null,
          price: parseFloat(form.servicePrice),
          duration_minutes: parseInt(form.serviceDuration) || 60,
        });

      if (serviceError) {
        setStatus("error");
        setErrorMsg("Profile saved but service creation failed: " + serviceError.message);
        return;
      }
    }

    router.push("/dashboard");
  }

  const roleLabel = form.role === "caddie" ? "Caddie" : "Instructor";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Profile Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-bold text-gray-900">About You</h2>
        <div className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <input
              required
              type="text"
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-fairway-500 focus:outline-none focus:ring-2 focus:ring-fairway-500/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              I am a: *
            </label>
            <div className="mt-2 flex gap-4">
              {(["caddie", "instructor"] as const).map((r) => (
                <label
                  key={r}
                  className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition ${
                    form.role === r
                      ? "border-fairway-600 bg-fairway-50 text-fairway-700"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={form.role === r}
                    onChange={() => update("role", r)}
                    className="sr-only"
                  />
                  {r === "caddie" ? "🏌️ Caddie" : "🎓 Instructor"}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bio *
            </label>
            <textarea
              required
              rows={3}
              placeholder={
                form.role === "caddie"
                  ? "Tell golfers about your experience on the course..."
                  : "Describe your teaching style and what players can expect..."
              }
              value={form.bio}
              onChange={(e) => update("bio", e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-fairway-500 focus:outline-none focus:ring-2 focus:ring-fairway-500/20"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hourly Rate ($) *
              </label>
              <input
                required
                type="number"
                min="1"
                step="0.01"
                placeholder="50"
                value={form.hourlyRate}
                onChange={(e) => update("hourlyRate", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-fairway-500 focus:outline-none focus:ring-2 focus:ring-fairway-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Years Experience
              </label>
              <input
                type="number"
                min="0"
                placeholder="3"
                value={form.yearsExperience}
                onChange={(e) => update("yearsExperience", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-fairway-500 focus:outline-none focus:ring-2 focus:ring-fairway-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                placeholder="(555) 123-4567"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-fairway-500 focus:outline-none focus:ring-2 focus:ring-fairway-500/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* First Service */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-bold text-gray-900">
          Your First {roleLabel} Service
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Create your first listing so golfers can find and book you.
        </p>
        <div className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Service Title *
            </label>
            <input
              required
              type="text"
              placeholder={
                form.role === "caddie"
                  ? "e.g. 18-Hole Caddie Experience"
                  : "e.g. 1-Hour Swing Lesson"
              }
              value={form.serviceTitle}
              onChange={(e) => update("serviceTitle", e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-fairway-500 focus:outline-none focus:ring-2 focus:ring-fairway-500/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="What does the golfer get? What makes your service stand out?"
              value={form.serviceDescription}
              onChange={(e) => update("serviceDescription", e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-fairway-500 focus:outline-none focus:ring-2 focus:ring-fairway-500/20"
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price ($) *
              </label>
              <input
                required
                type="number"
                min="1"
                step="0.01"
                placeholder="75"
                value={form.servicePrice}
                onChange={(e) => update("servicePrice", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-fairway-500 focus:outline-none focus:ring-2 focus:ring-fairway-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Duration (minutes)
              </label>
              <select
                value={form.serviceDuration}
                onChange={(e) => update("serviceDuration", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-fairway-500 focus:outline-none focus:ring-2 focus:ring-fairway-500/20"
              >
                <option value="30">30 min</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
                <option value="180">3 hours</option>
                <option value="240">4 hours (full round)</option>
                <option value="300">5 hours</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {status === "error" && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "saving"}
        className="w-full rounded-xl bg-fairway-700 px-6 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-fairway-800 disabled:opacity-50"
      >
        {status === "saving" ? "Creating your profile..." : "Create Profile & Go Live"}
      </button>
    </form>
  );
}
