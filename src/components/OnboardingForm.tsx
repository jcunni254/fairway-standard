"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Role = "player" | "caddie" | "instructor" | "course_manager";

interface Props {
  prefill: { email: string; fullName: string; avatarUrl: string };
  courses: { id: string; name: string }[];
  existingRoles: string[];
}

const ROLES: { value: Role; label: string; desc: string }[] = [
  { value: "player", label: "Golfer / Player", desc: "Book caddies and instructors for your rounds" },
  { value: "caddie", label: "Caddie", desc: "Get hired by golfers — $19.99/mo subscription" },
  { value: "instructor", label: "Golf Instructor", desc: "List your lessons and set your own rates" },
  { value: "course_manager", label: "Course Manager", desc: "Manage your course and affiliated instructors" },
];

export default function OnboardingForm({ prefill, courses, existingRoles }: Props) {
  const router = useRouter();
  const [role, setRole] = useState<Role | null>(null);
  const [form, setForm] = useState({
    fullName: prefill.fullName,
    bio: "",
    phone: "",
    hourlyRate: "",
    yearsExperience: "",
    courseName: "",
    courseAddress: "",
    courseCity: "",
    courseState: "",
    courseZip: "",
    coursePhone: "",
    courseWebsite: "",
    courseId: "",
  });
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!role) return;

    setStatus("saving");
    setErrorMsg("");

    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role,
        fullName: form.fullName,
        email: prefill.email,
        avatarUrl: prefill.avatarUrl,
        bio: form.bio || null,
        phone: form.phone || null,
        yearsExperience: form.yearsExperience || null,
        hourlyRate: form.hourlyRate || null,
        courseName: form.courseName || null,
        courseAddress: form.courseAddress || null,
        courseCity: form.courseCity || null,
        courseState: form.courseState || null,
        courseZip: form.courseZip || null,
        coursePhone: form.coursePhone || null,
        courseWebsite: form.courseWebsite || null,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus("error");
      setErrorMsg(data.error || "Something went wrong");
      if (data.redirect) {
        setTimeout(() => router.push(data.redirect), 1500);
      }
      return;
    }

    router.push(data.redirect || "/");
  }

  const availableRoles = ROLES.filter((r) => !existingRoles.includes(r.value));

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Role Selection */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-bold text-gray-900">I am a...</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {availableRoles.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRole(r.value)}
              className={`rounded-xl border-2 p-4 text-left transition ${
                role === r.value
                  ? "border-fairway-600 bg-fairway-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <p className={`font-semibold ${role === r.value ? "text-fairway-700" : "text-gray-900"}`}>
                {r.label}
              </p>
              <p className="mt-1 text-xs text-gray-500">{r.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Common Fields */}
      {role && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-gray-900">Your Details</h2>
          <div className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name *</label>
              <input
                required
                type="text"
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-fairway-500 focus:outline-none focus:ring-2 focus:ring-fairway-500/20"
              />
            </div>

            {role !== "player" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-fairway-500 focus:outline-none focus:ring-2 focus:ring-fairway-500/20"
                />
              </div>
            )}

            {/* Caddie-specific */}
            {role === "caddie" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bio *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tell golfers about your experience on the course..."
                    value={form.bio}
                    onChange={(e) => update("bio", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-fairway-500 focus:outline-none focus:ring-2 focus:ring-fairway-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="3"
                    value={form.yearsExperience}
                    onChange={(e) => update("yearsExperience", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-fairway-500 focus:outline-none focus:ring-2 focus:ring-fairway-500/20"
                  />
                </div>
                <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                  After signing up, you will be redirected to set up your $19.99/mo subscription. Your rate will be set by the admin once your profile is reviewed.
                </div>
              </>
            )}

            {/* Instructor-specific */}
            {role === "instructor" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bio *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe your teaching style and what players can expect..."
                    value={form.bio}
                    onChange={(e) => update("bio", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-fairway-500 focus:outline-none focus:ring-2 focus:ring-fairway-500/20"
                  />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hourly Rate ($) *</label>
                    <input
                      required
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="75"
                      value={form.hourlyRate}
                      onChange={(e) => update("hourlyRate", e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-fairway-500 focus:outline-none focus:ring-2 focus:ring-fairway-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="5"
                      value={form.yearsExperience}
                      onChange={(e) => update("yearsExperience", e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-fairway-500 focus:outline-none focus:ring-2 focus:ring-fairway-500/20"
                    />
                  </div>
                </div>
                {courses.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Affiliated Course (optional)</label>
                    <select
                      value={form.courseId}
                      onChange={(e) => update("courseId", e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-fairway-500 focus:outline-none focus:ring-2 focus:ring-fairway-500/20"
                    >
                      <option value="">None — independent instructor</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}

            {/* Course Manager fields */}
            {role === "course_manager" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="Pine Valley Golf Club"
                    value={form.courseName}
                    onChange={(e) => update("courseName", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-fairway-500 focus:outline-none focus:ring-2 focus:ring-fairway-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    placeholder="123 Golf Course Road"
                    value={form.courseAddress}
                    onChange={(e) => update("courseAddress", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-fairway-500 focus:outline-none focus:ring-2 focus:ring-fairway-500/20"
                  />
                </div>
                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      value={form.courseCity}
                      onChange={(e) => update("courseCity", e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-fairway-500 focus:outline-none focus:ring-2 focus:ring-fairway-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">State</label>
                    <input
                      type="text"
                      maxLength={2}
                      placeholder="CA"
                      value={form.courseState}
                      onChange={(e) => update("courseState", e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-fairway-500 focus:outline-none focus:ring-2 focus:ring-fairway-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ZIP</label>
                    <input
                      type="text"
                      maxLength={10}
                      value={form.courseZip}
                      onChange={(e) => update("courseZip", e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-fairway-500 focus:outline-none focus:ring-2 focus:ring-fairway-500/20"
                    />
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Course Phone</label>
                    <input
                      type="tel"
                      value={form.coursePhone}
                      onChange={(e) => update("coursePhone", e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-fairway-500 focus:outline-none focus:ring-2 focus:ring-fairway-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Website</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={form.courseWebsite}
                      onChange={(e) => update("courseWebsite", e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-fairway-500 focus:outline-none focus:ring-2 focus:ring-fairway-500/20"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      {role && (
        <button
          type="submit"
          disabled={status === "saving"}
          className="w-full rounded-xl bg-fairway-700 px-6 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-fairway-800 disabled:opacity-50"
        >
          {status === "saving"
            ? "Setting up your account..."
            : role === "caddie"
              ? "Continue to Subscription"
              : "Complete Setup"}
        </button>
      )}
    </form>
  );
}
