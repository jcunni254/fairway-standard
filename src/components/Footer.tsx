import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="text-lg font-bold text-gray-900">
              The Fairway Standard
            </Link>
            <p className="mt-3 max-w-xs text-sm text-gray-500 leading-relaxed">
              Premium golf services at fair prices. Connecting golfers with experienced caddies and qualified instructors.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Platform</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/browse" className="text-sm text-gray-600 transition hover:text-fairway-600">Browse Providers</Link>
              </li>
              <li>
                <Link href="/join" className="text-sm text-gray-600 transition hover:text-fairway-600">Become a Provider</Link>
              </li>
              <li>
                <Link href="/bookings" className="text-sm text-gray-600 transition hover:text-fairway-600">My Bookings</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Legal</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/terms" className="text-sm text-gray-600 transition hover:text-fairway-600">Terms of Service</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 transition hover:text-fairway-600">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Contact</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a href="mailto:support@thefairwaystandard.org" className="text-sm text-gray-600 transition hover:text-fairway-600">
                  support@thefairwaystandard.org
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} The Fairway Standard. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link href="/terms" className="text-xs text-gray-400 transition hover:text-gray-600">Terms</Link>
            <Link href="/privacy" className="text-xs text-gray-400 transition hover:text-gray-600">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
