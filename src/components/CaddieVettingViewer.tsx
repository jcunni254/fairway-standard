"use client";

import { useState } from "react";

interface VettingResponse {
  experience_level: string;
  club_selection_answer: string;
  course_familiarity: string;
  etiquette_answer: string;
  motivation_and_people_skills: string;
  created_at: string;
}

const EXPERIENCE_LABELS: Record<string, string> = {
  none: "No prior experience, but eager to learn",
  casual: "Some experience (caddied casually or for friends/family)",
  "1-3_years": "1–3 years at a golf course or caddie program",
  "3+_years": "3+ years professional caddie experience",
};

const CLUB_LABELS: Record<string, string> = {
  land_short: "Hit the 7-iron and aim to land short",
  club_up: "Club up to a 6-iron and swing easy",
  hard_7: "Hit a hard 7-iron to fight the wind",
  ask_golfer: "Ask the golfer what they're comfortable with",
};

const ETIQUETTE_LABELS: Record<string, string> = {
  walk_away: "Walk away quickly to maintain pace of play",
  rake_properly: "Rake the bunker smooth, entering and exiting from the low side",
  leave_crew: "Leave it for the maintenance crew",
  smooth_foot: "Smooth it over with your foot",
};

interface Props {
  responses: VettingResponse;
  caddieName: string;
}

export default function CaddieVettingViewer({ responses, caddieName }: Props) {
  const [open, setOpen] = useState(false);

  const questions = [
    {
      label: "Experience Level",
      answer: EXPERIENCE_LABELS[responses.experience_level] || responses.experience_level,
    },
    {
      label: "Club Selection (155yd, headwind, 7i = 150yd)",
      answer: CLUB_LABELS[responses.club_selection_answer] || responses.club_selection_answer,
    },
    {
      label: "Course Familiarity",
      answer: responses.course_familiarity,
    },
    {
      label: "Bunker Etiquette",
      answer: ETIQUETTE_LABELS[responses.etiquette_answer] || responses.etiquette_answer,
    },
    {
      label: "Motivation & People Skills",
      answer: responses.motivation_and_people_skills,
    },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs font-medium text-brand-green-600 hover:text-brand-green-700 hover:underline"
      >
        View
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-brand-border px-6 py-4">
              <div>
                <h3 className="font-display text-lg font-bold text-brand-charcoal">
                  Vetting Responses
                </h3>
                <p className="text-sm text-brand-muted">{caddieName}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-brand-muted transition hover:bg-brand-cream hover:text-brand-charcoal"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-6 py-5 space-y-5">
              {questions.map((q) => (
                <div key={q.label}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
                    {q.label}
                  </p>
                  <p className="mt-1 text-sm text-brand-charcoal leading-relaxed">
                    {q.answer}
                  </p>
                </div>
              ))}
              <div className="border-t border-brand-border pt-3">
                <p className="text-xs text-brand-muted">
                  Submitted{" "}
                  {new Date(responses.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="border-t border-brand-border px-6 py-4">
              <button
                onClick={() => setOpen(false)}
                className="w-full rounded-lg bg-brand-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-green-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
