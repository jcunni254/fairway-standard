import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us — The Fairway Standard",
};

export default function ContactPage() {
  return (
    <div className="min-h-[calc(100vh-65px)] bg-brand-cream">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="font-display text-2xl font-bold text-brand-charcoal">Contact Us</h1>
        <p className="mt-2 text-brand-muted">
          Get in touch with The Fairway Standard team. More options coming soon.
        </p>
        <p className="mt-4 text-sm text-brand-charcoal/80">
          Email:{" "}
          <a
            href="mailto:support@thefairwaystandard.org"
            className="font-medium text-brand-green-600 hover:underline"
          >
            support@thefairwaystandard.org
          </a>
        </p>
        <p className="mt-4">
          <Link href="/dashboard" className="text-sm font-medium text-brand-green-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
