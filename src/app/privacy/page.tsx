import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — The Fairway Standard",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-[calc(100vh-65px)] bg-white">
      <div className="mx-auto max-w-3xl px-6 py-12 sm:py-20">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Last updated: February 2026
        </p>

        <div className="mt-8 space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900">
              1. Information We Collect
            </h2>
            <p className="mt-2">
              When you use The Fairway Standard, we collect:
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li><strong>Account Information:</strong> Name, email address, and profile details you provide during registration via Clerk.</li>
              <li><strong>Booking Data:</strong> Service selections, scheduling details, notes, and booking history.</li>
              <li><strong>Payment Information:</strong> Processed by Stripe. We do not store your credit card numbers — Stripe handles this securely.</li>
              <li><strong>Usage Data:</strong> Page views, feature interactions, and session data collected via PostHog for product improvement.</li>
              <li><strong>Error Data:</strong> Application errors and performance data collected via Sentry to improve reliability.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">
              2. How We Use Your Information
            </h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>To provide, operate, and improve the Platform</li>
              <li>To process bookings and facilitate communication between Players and Providers</li>
              <li>To process payments and payouts through Stripe</li>
              <li>To send booking confirmations, notifications, and service emails via Resend</li>
              <li>To analyze usage patterns and improve user experience</li>
              <li>To monitor and fix errors and performance issues</li>
              <li>To enforce our Terms of Service and protect against fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">
              3. Third-Party Services
            </h2>
            <p className="mt-2">
              We use the following third-party services that may process your data:
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li><strong>Clerk</strong> — Authentication and user management</li>
              <li><strong>Supabase</strong> — Database and data storage (hosted in the US)</li>
              <li><strong>Stripe</strong> — Payment processing</li>
              <li><strong>Vercel</strong> — Website hosting</li>
              <li><strong>PostHog</strong> — Product analytics</li>
              <li><strong>Sentry</strong> — Error monitoring</li>
              <li><strong>Resend</strong> — Transactional email delivery</li>
            </ul>
            <p className="mt-2">
              Each service has its own privacy policy governing how they handle your data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">
              4. Data Sharing
            </h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>We do not sell your personal information.</li>
              <li>Provider profiles (name, bio, rates, reviews) are publicly visible on the Platform.</li>
              <li>Player names are shared with Providers when a booking is made.</li>
              <li>We may share data if required by law or to protect the safety of our users.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">
              5. Data Retention
            </h2>
            <p className="mt-2">
              We retain your data for as long as your account is active. If you request account deletion, we will remove your personal data within 30 days, except where retention is required by law or for legitimate business purposes (e.g., financial records).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">
              6. Your Rights
            </h2>
            <p className="mt-2">You have the right to:</p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt out of analytics tracking</li>
              <li>Export your data in a portable format</li>
            </ul>
            <p className="mt-2">
              To exercise these rights, contact us at{" "}
              <a href="mailto:support@thefairwaystandard.org" className="text-fairway-600 hover:underline">
                support@thefairwaystandard.org
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">
              7. Cookies and Tracking
            </h2>
            <p className="mt-2">
              We use essential cookies for authentication and session management. PostHog collects anonymous usage analytics. You can opt out of analytics by contacting us or using browser privacy settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">
              8. Security
            </h2>
            <p className="mt-2">
              We use industry-standard security measures including HTTPS encryption, secure authentication via Clerk, and PCI-compliant payment processing via Stripe. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">
              9. Children&apos;s Privacy
            </h2>
            <p className="mt-2">
              The Platform is not intended for users under 18 years of age. We do not knowingly collect data from children.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">
              10. Changes to This Policy
            </h2>
            <p className="mt-2">
              We may update this Privacy Policy from time to time. We will notify registered users of material changes via email. Continued use of the Platform constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">
              11. Contact
            </h2>
            <p className="mt-2">
              For privacy-related questions or requests, email us at{" "}
              <a href="mailto:support@thefairwaystandard.org" className="text-fairway-600 hover:underline">
                support@thefairwaystandard.org
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
