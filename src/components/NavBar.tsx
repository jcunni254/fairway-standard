"use client";

import Link from "next/link";
import Image from "next/image";
import { useUser, useClerk, SignInButton } from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

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

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      href={href}
      className="relative px-1 py-1 text-sm font-medium text-gray-300 transition hover:text-white"
      onMouseEnter={() => setHoveredLink(href)}
      onMouseLeave={() => setHoveredLink(null)}
    >
      {children}
      {hoveredLink === href && (
        <motion.span
          layoutId="nav-underline"
          className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-gold-400 to-brand-gold-600"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
    </Link>
  );

  const UserDropdown = () => (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 rounded-lg border border-brand-gold-500/30 bg-brand-gold-500/10 px-4 py-2 text-sm font-medium text-brand-gold-400 transition hover:bg-brand-gold-500/20"
      >
        {user?.firstName || "Account"}
        <svg className={`h-3.5 w-3.5 transition ${dropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </motion.button>
      {dropdownOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 mt-2 w-44 rounded-lg border border-brand-border bg-white py-1 shadow-xl"
        >
          <button
            onClick={() => signOut({ redirectUrl: "/" })}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-brand-muted transition hover:bg-brand-cream hover:text-brand-charcoal"
          >
            Sign Out
          </button>
        </motion.div>
      )}
    </div>
  );

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-brand-green-950/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href={isAdmin ? "/admin" : "/"} className="flex items-center gap-3">
          <motion.div whileHover={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 0.5 }}>
            <Image src="/logo.png" alt="The Fairway Standard" width={42} height={42} className="rounded-sm" />
          </motion.div>
          <span className="hidden font-display text-lg font-semibold tracking-wide text-white sm:block">
            The Fairway Standard
          </span>
        </Link>

        <div className="hidden items-center gap-6 sm:flex">
          {isAdminPage ? (
            <UserDropdown />
          ) : (
            <>
              <NavLink href="/browse">Browse</NavLink>
              {isSignedIn ? (
                <>
                  <NavLink href="/bookings">My Bookings</NavLink>
                  {isProvider && <NavLink href="/dashboard">Dashboard</NavLink>}
                  {isCourseManager && <NavLink href="/course">My Course</NavLink>}
                  {isAdmin && (
                    <Link href="/admin" className="text-sm font-medium text-brand-gold-400 transition hover:text-brand-gold-300">
                      Admin
                    </Link>
                  )}
                  {!isProvider && !isCourseManager && <NavLink href="/join">Become a Provider</NavLink>}
                  <UserDropdown />
                </>
              ) : (
                <>
                  <NavLink href="/join">For Providers</NavLink>
                  <SignInButton mode="modal">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="rounded-lg border border-brand-gold-500/40 bg-brand-gold-500/15 px-5 py-2 text-sm font-semibold text-brand-gold-400 transition hover:bg-brand-gold-500/25 hover:shadow-[0_0_20px_rgba(158,124,29,0.15)]"
                    >
                      Sign In
                    </motion.button>
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
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.2 }}
          className="border-t border-white/10 bg-brand-green-950/95 px-6 pb-4 sm:hidden"
        >
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
        </motion.div>
      )}
    </motion.nav>
  );
}
