"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface CaddieProfileFormData {
  full_name: string;
  bio: string | null;
  phone: string | null;
  years_experience: number | null;
  avatar_url: string | null;
  hometown: string | null;
  home_golf_course: string | null;
}

interface Props {
  initial: CaddieProfileFormData;
  roleLabel: string;
}

export default function ProfileEditForm({ initial, roleLabel }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    full_name: initial.full_name || "",
    bio: initial.bio || "",
    phone: initial.phone || "",
    years_experience: initial.years_experience != null ? String(initial.years_experience) : "",
    avatar_url: initial.avatar_url || "",
    hometown: initial.hometown || "",
    home_golf_course: initial.home_golf_course || "",
  });

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setErrorMsg("");

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: form.full_name.trim() || null,
        bio: form.bio.trim() || null,
        phone: form.phone.trim() || null,
        years_experience: form.years_experience.trim() ? parseInt(form.years_experience, 10) : null,
        avatar_url: form.avatar_url.trim() || null,
        hometown: form.hometown.trim() || null,
        home_golf_course: form.home_golf_course.trim() || null,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus("error");
      setErrorMsg(data.error || "Something went wrong");
      return;
    }

    setStatus("idle");
    setEditing(false);
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-brand-border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-semibold text-brand-charcoal">Edit profile</h2>
        {!editing ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-lg border border-brand-green-600 bg-white px-4 py-2 text-sm font-medium text-brand-green-700 transition hover:bg-brand-green-50"
          >
            Edit
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setForm({
                full_name: initial.full_name || "",
                bio: initial.bio || "",
                phone: initial.phone || "",
                years_experience: initial.years_experience != null ? String(initial.years_experience) : "",
                avatar_url: initial.avatar_url || "",
                hometown: initial.hometown || "",
                home_golf_course: initial.home_golf_course || "",
              });
            }}
            className="text-sm font-medium text-brand-muted hover:text-brand-charcoal"
          >
            Cancel
          </button>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-brand-charcoal">
              Full name
            </label>
            <input
              id="full_name"
              type="text"
              value={form.full_name}
              onChange={(e) => update("full_name", e.target.value)}
              className="mt-1 w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-brand-charcoal shadow-sm focus:border-brand-green-500 focus:outline-none focus:ring-1 focus:ring-brand-green-500"
            />
          </div>
          <div>
            <label htmlFor="avatar_url" className="block text-sm font-medium text-brand-charcoal">
              Profile photo URL
            </label>
            <input
              id="avatar_url"
              type="url"
              value={form.avatar_url}
              onChange={(e) => update("avatar_url", e.target.value)}
              placeholder="https://..."
              className="mt-1 w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-brand-charcoal shadow-sm focus:border-brand-green-500 focus:outline-none focus:ring-1 focus:ring-brand-green-500"
            />
            <p className="mt-1 text-xs text-brand-muted">Paste a link to your profile image.</p>
          </div>
          <div>
            <label htmlFor="hometown" className="block text-sm font-medium text-brand-charcoal">
              Hometown
            </label>
            <input
              id="hometown"
              type="text"
              value={form.hometown}
              onChange={(e) => update("hometown", e.target.value)}
              placeholder="e.g. Nashville, TN"
              className="mt-1 w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-brand-charcoal shadow-sm focus:border-brand-green-500 focus:outline-none focus:ring-1 focus:ring-brand-green-500"
            />
          </div>
          <div>
            <label htmlFor="home_golf_course" className="block text-sm font-medium text-brand-charcoal">
              Home golf course
            </label>
            <input
              id="home_golf_course"
              type="text"
              value={form.home_golf_course}
              onChange={(e) => update("home_golf_course", e.target.value)}
              placeholder="e.g. Belle Meade Country Club"
              className="mt-1 w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-brand-charcoal shadow-sm focus:border-brand-green-500 focus:outline-none focus:ring-1 focus:ring-brand-green-500"
            />
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-brand-charcoal">
              Bio
            </label>
            <textarea
              id="bio"
              rows={4}
              value={form.bio}
              onChange={(e) => update("bio", e.target.value)}
              className="mt-1 w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-brand-charcoal shadow-sm focus:border-brand-green-500 focus:outline-none focus:ring-1 focus:ring-brand-green-500"
              placeholder="Tell golfers a bit about yourself..."
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-brand-charcoal">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="mt-1 w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-brand-charcoal shadow-sm focus:border-brand-green-500 focus:outline-none focus:ring-1 focus:ring-brand-green-500"
              placeholder="+1 (615) 123-4567"
            />
          </div>
          <div>
            <label htmlFor="years_experience" className="block text-sm font-medium text-brand-charcoal">
              Years of experience
            </label>
            <input
              id="years_experience"
              type="number"
              min={0}
              max={99}
              value={form.years_experience}
              onChange={(e) => update("years_experience", e.target.value)}
              className="mt-1 w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-brand-charcoal shadow-sm focus:border-brand-green-500 focus:outline-none focus:ring-1 focus:ring-brand-green-500"
            />
          </div>
          {status === "error" && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errorMsg}</p>
          )}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={status === "saving"}
              className="rounded-lg bg-brand-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-green-700 disabled:opacity-60"
            >
              {status === "saving" ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      ) : (
        <p className="mt-2 text-xs text-brand-muted">
          Update name, photo, hometown, home course, bio, phone, and experience.
        </p>
      )}
    </div>
  );
}
