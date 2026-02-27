import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="text-lg font-bold text-gray-900">
              The Fairway Standard
            </Link>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
              Premium golf services at fair prices. Connecting golfers with experienced caddies and qualified instructors.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Platform</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/browse" className="text-sm text-gray-500 hover:text-fairway-600 transition">
                  Browse Providers
                </Link>
              </li>
              <li>
                <Link href="/join" className="text-sm text-gray-500 hover:text-fairway-600 transition">
                  Become a Provider
                </Link>
              </li>
              <li>
                <Link href="/bookings" className="text-sm text-gray-500 hover:text-fairway-600 transition">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-gray-500 hover:text-fairway-600 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-500 hover:text-fairway-600 transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Contact</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href="mailto:support@thefairwaystandard.org"
                  className="text-sm text-gray-500 hover:text-fairway-600 transition"
                >
                  support@thefairwaystandard.org
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} The Fairway Standard. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-xs text-gray-400 hover:text-gray-600 transition">
              Terms
            </Link>
            <Link href="/privacy" className="text-xs text-gray-400 hover:text-gray-600 transition">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
