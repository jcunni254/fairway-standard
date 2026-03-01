"use client";

import Link from "next/link";
import Image from "next/image";
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

  const UserDropdown = () => (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 rounded-lg border border-brand-gold-500/30 bg-brand-gold-500/10 px-4 py-2 text-sm font-medium text-brand-gold-400 transition hover:bg-brand-gold-500/20"
      >
        {user?.firstName || "Account"}
        <svg className={`h-3.5 w-3.5 transition ${dropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-lg border border-brand-border bg-white py-1 shadow-lg">
          <button
            onClick={() => signOut({ redirectUrl: "/" })}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-brand-muted transition hover:bg-brand-cream hover:text-brand-charcoal"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-brand-green-950/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href={isAdmin ? "/admin" : "/"} className="flex items-center gap-3">
          <Image src="/logo.png" alt="The Fairway Standard" width={42} height={42} className="rounded-sm" />
          <span className="hidden font-display text-lg font-semibold tracking-wide text-white sm:block">
            The Fairway Standard
          </span>
        </Link>

        <div className="hidden items-center gap-6 sm:flex">
          {isAdminPage ? (
            <UserDropdown />
          ) : (
            <>
              <Link href="/browse" className="text-sm font-medium text-gray-300 transition hover:text-brand-gold-400">
                Browse
              </Link>
              {isSignedIn ? (
                <>
                  <Link href="/bookings" className="text-sm font-medium text-gray-300 transition hover:text-brand-gold-400">
                    My Bookings
                  </Link>
                  {isProvider && (
                    <Link href="/dashboard" className="text-sm font-medium text-gray-300 transition hover:text-brand-gold-400">
                      Dashboard
                    </Link>
                  )}
                  {isCourseManager && (
                    <Link href="/course" className="text-sm font-medium text-gray-300 transition hover:text-brand-gold-400">
                      My Course
                    </Link>
                  )}
                  {isAdmin && (
                    <Link href="/admin" className="text-sm font-medium text-brand-gold-400 transition hover:text-brand-gold-300">
                      Admin
                    </Link>
                  )}
                  {!isProvider && !isCourseManager && (
                    <Link href="/join" className="text-sm font-medium text-gray-300 transition hover:text-brand-gold-400">
                      Become a Provider
                    </Link>
                  )}
                  <UserDropdown />
                </>
              ) : (
                <>
                  <Link href="/join" className="text-sm font-medium text-gray-300 transition hover:text-brand-gold-400">
                    For Providers
                  </Link>
                  <SignInButton mode="modal">
                    <button className="rounded-lg border border-brand-gold-500/40 bg-brand-gold-500/15 px-5 py-2 text-sm font-semibold text-brand-gold-400 transition hover:bg-brand-gold-500/25">
                      Sign In
                    </button>
                  </SignInButton>
                </>
              )}
            </>
          )}
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white sm:hidden" aria-label="Toggle menu">
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
        <div className="border-t border-white/10 bg-brand-green-950/95 px-6 pb-4 sm:hidden">
          <div className="flex flex-col gap-3 pt-3">
            {isAdminPage ? (
              <button onClick={() => { setMobileOpen(false); signOut({ redirectUrl: "/" }); }} className="text-left text-sm font-medium text-gray-300">Sign Out</button>
            ) : (
              <>
                <Link href="/browse" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-300">Browse</Link>
                {isSignedIn ? (
                  <>
                    <Link href="/bookings" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-300">My Bookings</Link>
                    {isProvider && <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-300">Dashboard</Link>}
                    {isCourseManager && <Link href="/course" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-300">My Course</Link>}
                    {isAdmin && <Link href="/admin" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-brand-gold-400">Admin</Link>}
                    <button onClick={() => { setMobileOpen(false); signOut({ redirectUrl: "/" }); }} className="text-left text-sm font-medium text-red-400">Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link href="/join" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-300">For Providers</Link>
                    <SignInButton mode="modal">
                      <button className="mt-2 w-full rounded-lg border border-brand-gold-500/40 bg-brand-gold-500/15 px-4 py-2 text-sm font-semibold text-brand-gold-400">Sign In</button>
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
