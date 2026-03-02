"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface MultipleChoiceQuestion {
  type: "multiple_choice";
  id: string;
  question: string;
  subtitle?: string;
  options: { value: string; label: string }[];
}

interface ShortAnswerQuestion {
  type: "short_answer";
  id: string;
  question: string;
  subtitle?: string;
  placeholder: string;
  minLength: number;
}

type Question = MultipleChoiceQuestion | ShortAnswerQuestion;

const QUESTIONS: Question[] = [
  {
    type: "multiple_choice",
    id: "experience_level",
    question: "How would you describe your caddie experience?",
    subtitle: "Be honest — we welcome all experience levels.",
    options: [
      { value: "none", label: "No prior experience, but eager to learn" },
      { value: "casual", label: "Some experience (caddied casually or for friends/family)" },
      { value: "1-3_years", label: "1–3 years at a golf course or caddie program" },
      { value: "3+_years", label: "3+ years of professional caddie experience" },
    ],
  },
  {
    type: "multiple_choice",
    id: "club_selection_answer",
    question:
      "A golfer faces a 155-yard approach with a slight headwind. They typically hit their 7-iron 150 yards. What would you recommend?",
    subtitle: "Pick the advice you'd give on the course.",
    options: [
      { value: "land_short", label: "Hit the 7-iron and aim to land short" },
      { value: "club_up", label: "Club up to a 6-iron and swing easy" },
      { value: "hard_7", label: "Hit a hard 7-iron to fight the wind" },
      { value: "ask_golfer", label: "Ask the golfer what they're comfortable with" },
    ],
  },
  {
    type: "short_answer",
    id: "course_familiarity",
    question:
      "What courses have you caddied at or played regularly?",
    subtitle:
      "If you're new to caddying, describe how you'd prepare to caddie at an unfamiliar course.",
    placeholder:
      "E.g., I've played Pine Valley and Merion regularly for 3 years and caddied at Aronimink...",
    minLength: 20,
  },
  {
    type: "multiple_choice",
    id: "etiquette_answer",
    question:
      "A player's ball lands in a greenside bunker. After they hit out, what's the proper procedure?",
    options: [
      { value: "walk_away", label: "Walk away quickly to maintain pace of play" },
      { value: "rake_properly", label: "Rake the bunker smooth, entering and exiting from the low side" },
      { value: "leave_crew", label: "Leave it for the maintenance crew" },
      { value: "smooth_foot", label: "Smooth it over with your foot" },
    ],
  },
  {
    type: "short_answer",
    id: "motivation_and_people_skills",
    question:
      "Why do you want to caddie with The Fairway Standard?",
    subtitle:
      "Also tell us — how would you handle a golfer who's visibly frustrated after several bad holes?",
    placeholder:
      "Tell us what motivates you and how you handle tough situations on the course...",
    minLength: 30,
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

export default function CaddieVettingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const question = QUESTIONS[step];
  const totalSteps = QUESTIONS.length;
  const progress = ((step + 1) / totalSteps) * 100;
  const currentAnswer = answers[question.id] || "";

  const canProceed =
    question.type === "multiple_choice"
      ? currentAnswer.length > 0
      : currentAnswer.length >= question.minLength;

  function setAnswer(value: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  }

  function goNext() {
    if (!canProceed) return;
    if (step < totalSteps - 1) {
      setDirection(1);
      setStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  }

  function goBack() {
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  }

  async function handleSubmit() {
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/onboarding/caddie-vetting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        return;
      }

      router.push(data.redirect || "/dashboard");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-brand-muted">
          <span>
            Question {step + 1} of {totalSteps}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-brand-border">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-brand-green-500 to-brand-green-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="relative min-h-[400px] overflow-hidden rounded-2xl border border-brand-border bg-white shadow-sm">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="p-6 sm:p-10"
          >
            <h2 className="font-display text-xl font-bold text-brand-charcoal sm:text-2xl leading-snug">
              {question.question}
            </h2>
            {question.subtitle && (
              <p className="mt-2 text-sm text-brand-muted">
                {question.subtitle}
              </p>
            )}

            <div className="mt-8">
              {question.type === "multiple_choice" ? (
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setAnswer(option.value)}
                      className={`w-full rounded-xl border-2 p-4 text-left transition ${
                        currentAnswer === option.value
                          ? "border-brand-green-600 bg-brand-green-50"
                          : "border-brand-border hover:border-brand-green-300"
                      }`}
                    >
                      <span
                        className={`text-sm font-medium ${
                          currentAnswer === option.value
                            ? "text-brand-green-700"
                            : "text-brand-charcoal"
                        }`}
                      >
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder={question.placeholder}
                    rows={5}
                    className="w-full rounded-xl border border-brand-border px-4 py-3 text-sm shadow-sm transition focus:border-brand-green-500 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20"
                  />
                  {currentAnswer.length > 0 &&
                    currentAnswer.length < question.minLength && (
                      <p className="mt-2 text-xs text-brand-muted">
                        Please write at least {question.minLength} characters (
                        {currentAnswer.length}/{question.minLength})
                      </p>
                    )}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Error message */}
      {status === "error" && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0}
          className="rounded-lg px-6 py-3 text-sm font-medium text-brand-muted transition hover:text-brand-charcoal disabled:invisible"
        >
          Back
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={!canProceed || status === "submitting"}
          className="rounded-xl bg-brand-green-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-green-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {status === "submitting"
            ? "Submitting..."
            : step === totalSteps - 1
              ? "Submit Application"
              : "Continue"}
        </button>
      </div>
    </div>
  );
}
