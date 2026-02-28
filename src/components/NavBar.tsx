"use client";

import Link from "next/link";
import { useUser, useClerk, SignInButton } from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdminPage = pathname.startsWith("/admin");

  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/auth/role")
        .then((r) => r.json())
        .then((data) => setRoles(data.roles || []))
        .catch(() => {});
    }
  }, [isSignedIn]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAdmin = roles.includes("admin");
  const isCaddie = roles.includes("caddie");
  const isInstructor = roles.includes("instructor");
  const isCourseManager = roles.includes("course_manager");
  const isProvider = isCaddie || isInstructor;

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-fairway-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href={isAdmin ? "/admin" : "/"} className="text-lg font-bold text-white">
          The Fairway Standard
        </Link>

        <div className="hidden items-center gap-6 sm:flex">
          {isAdminPage ? (
            <>
              {isSignedIn && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 rounded-lg bg-fairway-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-fairway-500"
                  >
                    {user?.firstName || "Account"}
                    <svg className={`h-4 w-4 transition ${dropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                      <button
                        onClick={() => signOut({ redirectUrl: "/" })}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50"
                      >
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <Link href="/browse" className="text-sm font-medium text-gray-300 transition hover:text-white">
                Browse
              </Link>

              {isSignedIn ? (
                <>
                  <Link href="/bookings" className="text-sm font-medium text-gray-300 transition hover:text-white">
                    My Bookings
                  </Link>
                  {isProvider && (
                    <Link href="/dashboard" className="text-sm font-medium text-gray-300 transition hover:text-white">
                      Dashboard
                    </Link>
                  )}
                  {isCourseManager && (
                    <Link href="/course" className="text-sm font-medium text-gray-300 transition hover:text-white">
                      My Course
                    </Link>
                  )}
                  {isAdmin && (
                    <Link href="/admin" className="text-sm font-medium text-yellow-400 transition hover:text-yellow-300">
                      Admin
                    </Link>
                  )}
                  {!isProvider && !isCourseManager && (
                    <Link href="/join" className="text-sm font-medium text-gray-300 transition hover:text-white">
                      Become a Provider
                    </Link>
                  )}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 rounded-lg bg-fairway-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-fairway-500"
                    >
                      {user?.firstName || "Account"}
                      <svg className={`h-4 w-4 transition ${dropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                        <button
                          onClick={() => signOut({ redirectUrl: "/" })}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50"
                        >
                          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link href="/join" className="text-sm font-medium text-gray-300 transition hover:text-white">
                    For Providers
                  </Link>
                  <SignInButton mode="modal">
                    <button className="rounded-lg bg-fairway-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-fairway-500">
                      Sign In
                    </button>
                  </SignInButton>
                </>
              )}
            </>
          )}
        </div>

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

      {mobileOpen && (
        <div className="border-t border-white/10 bg-fairway-950/95 px-6 pb-4 sm:hidden">
          <div className="flex flex-col gap-3 pt-3">
            {isAdminPage ? (
              <button
                onClick={() => { setMobileOpen(false); signOut({ redirectUrl: "/" }); }}
                className="text-left text-sm font-medium text-gray-300"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link href="/browse" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-300">Browse</Link>
                {isSignedIn ? (
                  <>
                    <Link href="/bookings" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-300">My Bookings</Link>
                    {isProvider && <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-300">Dashboard</Link>}
                    {isCourseManager && <Link href="/course" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-300">My Course</Link>}
                    {isAdmin && <Link href="/admin" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-yellow-400">Admin</Link>}
                    <button
                      onClick={() => { setMobileOpen(false); signOut({ redirectUrl: "/" }); }}
                      className="text-left text-sm font-medium text-red-400"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/join" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-300">For Providers</Link>
                    <SignInButton mode="modal">
                      <button className="mt-2 w-full rounded-lg bg-fairway-600 px-4 py-2 text-sm font-semibold text-white">Sign In</button>
                    </SignInButton>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
