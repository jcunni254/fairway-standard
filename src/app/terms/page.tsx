import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — The Fairway Standard",
};

export default function TermsPage() {
  return (
    <div className="min-h-[calc(100vh-65px)] bg-white">
      <div className="mx-auto max-w-3xl px-6 py-12 sm:py-20">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Last updated: February 2026
        </p>

        <div className="mt-8 space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900">
              1. Agreement to Terms
            </h2>
            <p className="mt-2">
              By accessing or using The Fairway Standard (&quot;Platform&quot;), operated by The Fairway Standard LLC (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">
              2. Description of Service
            </h2>
            <p className="mt-2">
              The Fairway Standard is a marketplace that connects golfers (&quot;Players&quot;) with caddies and golf instructors (&quot;Providers&quot;). We facilitate bookings and payment processing but are not a party to the actual golf services rendered.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">
              3. User Accounts
            </h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>You must be at least 18 years old to use the Platform.</li>
              <li>You are responsible for maintaining the security of your account credentials.</li>
              <li>You must provide accurate and current information during registration.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">
              4. Booking and Cancellation
            </h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Bookings are requests until confirmed by the Provider.</li>
              <li>Players may cancel pending or confirmed bookings. Cancellation policies regarding refunds are determined at the time of booking.</li>
              <li>Providers may accept, decline, or cancel bookings. Repeated cancellations by providers may result in account review.</li>
              <li>No-shows by either party may result in penalties or account restrictions.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">
              5. Payments and Fees
            </h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Payments are processed securely through Stripe.</li>
              <li>The Platform charges a service fee on each transaction. This fee is deducted before Provider payouts.</li>
              <li>Providers are responsible for their own tax obligations on income earned through the Platform.</li>
              <li>Refund eligibility is determined on a case-by-case basis.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">
              6. Provider Responsibilities
            </h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Providers are independent contractors, not employees of The Fairway Standard.</li>
              <li>Providers must accurately represent their qualifications, experience, and pricing.</li>
              <li>Providers must deliver services as described in their listings.</li>
              <li>Providers are responsible for their own insurance and certifications.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">
              7. Reviews and Content
            </h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Reviews must be honest, relevant, and based on actual booking experiences.</li>
              <li>We reserve the right to remove reviews that contain profanity, harassment, or false claims.</li>
              <li>You retain ownership of content you post but grant us a license to display it on the Platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">
              8. Limitation of Liability
            </h2>
            <p className="mt-2">
              The Fairway Standard is a marketplace and does not provide golf services directly. We are not liable for the quality, safety, or legality of services provided by Providers. Use of the Platform is at your own risk. To the maximum extent permitted by law, our liability is limited to the fees you paid to us in the 12 months preceding any claim.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">
              9. Dispute Resolution
            </h2>
            <p className="mt-2">
              Disputes between Players and Providers should first be resolved directly between the parties. If unresolved, contact us at support@thefairwaystandard.org and we will attempt to mediate. We are not obligated to resolve disputes but will make good-faith efforts.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">
              10. Modifications
            </h2>
            <p className="mt-2">
              We may update these terms at any time. Continued use of the Platform after changes constitutes acceptance. We will notify registered users of material changes via email.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">
              11. Contact
            </h2>
            <p className="mt-2">
              Questions about these Terms? Email us at{" "}
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
