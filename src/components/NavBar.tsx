"use client";

import Link from "next/link";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useState } from "react";

export default function NavBar() {
  const { isSignedIn, user } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-fairway-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold text-white">
          The Fairway Standard
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-6 sm:flex">
          <Link
            href="/browse"
            className="text-sm font-medium text-gray-300 transition hover:text-white"
          >
            Browse
          </Link>
          <Link
            href="/join"
            className="text-sm font-medium text-gray-300 transition hover:text-white"
          >
            For Providers
          </Link>

          {isSignedIn ? (
            <>
              <Link
                href="/bookings"
                className="text-sm font-medium text-gray-300 transition hover:text-white"
              >
                My Bookings
              </Link>
              <Link
                href="/dashboard"
                className="rounded-lg bg-fairway-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-fairway-500"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <SignInButton mode="modal">
              <button className="rounded-lg bg-fairway-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-fairway-500">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white sm:hidden"
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-fairway-950/95 px-6 pb-4 sm:hidden">
          <div className="flex flex-col gap-3 pt-3">
            <Link
              href="/browse"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-gray-300"
            >
              Browse Providers
            </Link>
            <Link
              href="/join"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-gray-300"
            >
              For Providers
            </Link>
            {isSignedIn ? (
              <>
                <Link
                  href="/bookings"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-gray-300"
                >
                  My Bookings
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-gray-300"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <SignInButton mode="modal">
                <button className="mt-2 w-full rounded-lg bg-fairway-600 px-4 py-2 text-sm font-semibold text-white">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
