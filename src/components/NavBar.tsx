"use client";

import Link from "next/link";
import Image from "next/image";
import { useUser, useClerk, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function NavBar() {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
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

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
        {user?.imageUrl ? (
          <Image
            src={user.imageUrl}
            alt=""
            width={24}
            height={24}
            className="rounded-full"
          />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-gold-500/30 text-xs font-bold text-brand-gold-400">
            {user?.firstName?.[0] || "?"}
          </div>
        )}
        <span className="hidden sm:inline">{user?.firstName || "Account"}</span>
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
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-brand-green-950/90 shadow-lg shadow-black/10 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href={isAdmin ? "/admin" : "/"} className="flex items-center gap-2.5">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <Image
              src="/logo-horizontal.png"
              alt="The Fairway Standard"
              width={200}
              height={48}
              className="h-10 w-auto sm:h-11"
              priority
            />
          </motion.div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-7 md:flex">
          {isAdminPage ? (
            <UserDropdown />
          ) : (
            <>
              <NavLink href="/browse">Find a Caddie</NavLink>
              {isSignedIn ? (
                <>
                  {!isProvider && !isCourseManager && (
                    <NavLink href="/join">Become a Caddie</NavLink>
                  )}
                  <UserDropdown />
                </>
              ) : (
                <>
                  <NavLink href="/join/caddie">Become a Caddie</NavLink>
                  <SignInButton mode="modal">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/15"
                    >
                      Sign In
                    </motion.button>
                  </SignInButton>
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
              ) : (
                <>
                  <Link href="/browse" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white">
                    Find a Caddie
                  </Link>
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
                      <Link href="/join/caddie" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white">
                        Become a Caddie
                      </Link>
                      <div className="my-2 h-px bg-white/10" />
                      <div className="flex flex-col gap-2">
                        <SignInButton mode="modal">
                          <button className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white">
                            Sign In
                          </button>
                        </SignInButton>
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
