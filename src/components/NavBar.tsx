"use client";

import Link from "next/link";
import Image from "next/image";
import { useUser, useClerk, SignUpButton } from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface UserLike {
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
  hasImage?: boolean;
  primaryEmailAddress?: { emailAddress: string } | null;
}

function getInitials(user: UserLike | null | undefined): string {
  if (user?.firstName && user?.lastName) return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  if (user?.firstName) return user.firstName[0].toUpperCase();
  if (user?.lastName) return user.lastName[0].toUpperCase();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (email) return email[0].toUpperCase();
  return "U";
}

function UserAvatar({ user, size = 24 }: { user: UserLike | null | undefined; size?: number }) {
  const initials = getInitials(user);

  if (user?.hasImage && user.imageUrl) {
    return (
      <Image
        src={user.imageUrl}
        alt=""
        width={size}
        height={size}
        className="rounded-full"
      />
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-full bg-gradient-to-br from-brand-gold-400 to-brand-gold-600 font-bold text-white shadow-sm"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials}
    </div>
  );
}

export default function NavBar() {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
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

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const isActive = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link
        href={href}
        className={`relative px-1 py-1 text-sm font-medium transition ${
          isActive ? "text-brand-gold-400" : "text-white/70 hover:text-white"
        }`}
        onMouseEnter={() => setHoveredLink(href)}
        onMouseLeave={() => setHoveredLink(null)}
      >
        {children}
        {(hoveredLink === href || isActive) && (
          <motion.span
            layoutId="nav-underline"
            className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-gold-400 to-brand-gold-600"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
      </Link>
    );
  };

  const UserDropdown = () => (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/15"
      >
        <UserAvatar user={user} size={24} />
        <span className="hidden sm:inline">{user?.firstName || user?.lastName || "Account"}</span>
        <svg className={`h-3.5 w-3.5 transition ${dropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </motion.button>
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-brand-border bg-white shadow-2xl"
          >
            <div className="border-b border-brand-border px-4 py-3">
              <p className="text-sm font-medium text-brand-charcoal">{user?.fullName}</p>
              <p className="text-xs text-brand-muted">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
            {isProvider && (
              <Link
                href="/dashboard"
                onClick={() => setDropdownOpen(false)}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-brand-charcoal transition hover:bg-brand-cream"
              >
                Dashboard
              </Link>
            )}
            {isCourseManager && (
              <Link
                href="/course"
                onClick={() => setDropdownOpen(false)}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-brand-charcoal transition hover:bg-brand-cream"
              >
                My Course
              </Link>
            )}
            <Link
              href="/bookings"
              onClick={() => setDropdownOpen(false)}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-brand-charcoal transition hover:bg-brand-cream"
            >
              My Bookings
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setDropdownOpen(false)}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-brand-gold-600 transition hover:bg-brand-cream"
              >
                Admin Panel
              </Link>
            )}
            <div className="border-t border-brand-border">
              <button
                onClick={() => signOut({ redirectUrl: "/" })}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-500 transition hover:bg-red-50"
              >
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed left-0 right-0 top-0 z-50 bg-brand-green-950 shadow-lg shadow-black/10"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2.5">
        {/* Logo */}
        <Link href={isAdmin ? "/admin" : "/"} className="flex items-center gap-2.5">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <Image
              src="/logo-tree-flag-cropped.png"
              alt="The Fairway Standard"
              width={567}
              height={412}
              className="h-12 w-auto sm:h-14"
              priority
            />
          </motion.div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden flex-1 items-center justify-evenly md:flex">
          {isAdminPage ? (
            <UserDropdown />
          ) : isSignedIn && isCaddie ? (
            <>
              <NavLink href="/caddie/profile">My Profile</NavLink>
              <NavLink href="/dashboard/schedule">Schedule</NavLink>
              <NavLink href="/dashboard/social">Social</NavLink>
              <NavLink href="/contact">Contact Us</NavLink>
              <UserDropdown />
            </>
          ) : (
            <>
              <NavLink href="/browse?type=instructor">Find an Instructor</NavLink>
              <NavLink href="/browse">Find a Caddie</NavLink>
              <NavLink href="/join/caddie">Become a Caddie</NavLink>
              <a
                href="mailto:support@thefairwaystandard.org"
                className="relative px-1 py-1 text-sm font-medium text-white/70 transition hover:text-white"
              >
                Contact Us
              </a>
              {isSignedIn ? (
                <UserDropdown />
              ) : (
                <>
                  <Link href="/sign-in">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/15"
                    >
                      Sign In
                    </motion.button>
                  </Link>
                  <SignUpButton mode="modal" forceRedirectUrl="/onboarding">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="rounded-full bg-gradient-to-r from-brand-gold-500 to-brand-gold-400 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-brand-gold-500/20 transition hover:shadow-lg hover:shadow-brand-gold-500/30"
                    >
                      Get Started
                    </motion.button>
                  </SignUpButton>
                </>
              )}
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white md:hidden" aria-label="Toggle menu">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      <div className="h-1 bg-gradient-to-r from-brand-gold-600 via-brand-gold-400 to-brand-gold-600" />

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-white/10 bg-brand-green-950/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {isAdminPage ? (
                <button onClick={() => { setMobileOpen(false); signOut({ redirectUrl: "/" }); }} className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white">
                  Sign Out
                </button>
              ) : isSignedIn && isCaddie ? (
                <>
                  <Link href="/caddie/profile" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white">
                    My Profile
                  </Link>
                  <Link href="/dashboard/schedule" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white">
                    Schedule
                  </Link>
                  <Link href="/dashboard/social" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white">
                    Social
                  </Link>
                  <Link href="/contact" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white">
                    Contact Us
                  </Link>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white">
                    Dashboard
                  </Link>
                  <Link href="/bookings" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white">
                    My Bookings
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-brand-gold-400 transition hover:bg-white/10 hover:text-white">
                      Admin Panel
                    </Link>
                  )}
                  <div className="my-1 h-px bg-white/10" />
                  <button onClick={() => { setMobileOpen(false); signOut({ redirectUrl: "/" }); }} className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-400 transition hover:bg-red-500/10">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/browse?type=instructor" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white">
                    Find an Instructor
                  </Link>
                  <Link href="/browse" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white">
                    Find a Caddie
                  </Link>
                  <Link href="/join/caddie" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white">
                    Become a Caddie
                  </Link>
                  <a href="mailto:support@thefairwaystandard.org" className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white">
                    Contact Us
                  </a>
                  {isSignedIn ? (
                    <>
                      <Link href="/bookings" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white">
                        My Bookings
                      </Link>
                      {isProvider && (
                        <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white">
                          Dashboard
                        </Link>
                      )}
                      {isCourseManager && (
                        <Link href="/course" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white">
                          My Course
                        </Link>
                      )}
                      {isAdmin && (
                        <Link href="/admin" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-brand-gold-400 transition hover:bg-white/10">
                          Admin Panel
                        </Link>
                      )}
                      <div className="my-1 h-px bg-white/10" />
                      <button onClick={() => { setMobileOpen(false); signOut({ redirectUrl: "/" }); }} className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-400 transition hover:bg-red-500/10">
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="my-2 h-px bg-white/10" />
                      <div className="flex flex-col gap-2">
                        <Link href="/sign-in" onClick={() => setMobileOpen(false)} className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-center text-sm font-medium text-white">
                          Sign In
                        </Link>
                        <SignUpButton mode="modal" forceRedirectUrl="/onboarding">
                          <button className="w-full rounded-full bg-gradient-to-r from-brand-gold-500 to-brand-gold-400 px-4 py-2.5 text-sm font-semibold text-white">
                            Get Started
                          </button>
                        </SignUpButton>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
