import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "@/components/motion/ScrollReveal";

export default function Footer() {
  return (
    <footer className="bg-brand-green-950">
      <div className="h-px bg-gradient-to-r from-transparent via-brand-gold-500/50 to-transparent" />
      <div className="mx-auto max-w-6xl px-6 py-14">
        <ScrollReveal>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="inline-block">
                <Image src="/logo-horizontal.png" alt="The Fairway Standard" width={180} height={44} className="h-10 w-auto" />
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-green-300/70">
                Book experienced, vetted caddies for your next round. Better reads. Better strategy. Better golf.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-gold-500">For Players</h3>
              <ul className="mt-4 space-y-3">
                <li><Link href="/browse" className="text-sm text-brand-green-200/70 transition hover:text-white">Find a Caddie</Link></li>
                <li><Link href="/bookings" className="text-sm text-brand-green-200/70 transition hover:text-white">My Bookings</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-gold-500">For Caddies</h3>
              <ul className="mt-4 space-y-3">
                <li><Link href="/join/caddie" className="text-sm text-brand-green-200/70 transition hover:text-white">Apply to Caddie</Link></li>
                <li><Link href="/dashboard" className="text-sm text-brand-green-200/70 transition hover:text-white">Caddie Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-gold-500">Legal</h3>
              <ul className="mt-4 space-y-3">
                <li><Link href="/terms" className="text-sm text-brand-green-200/70 transition hover:text-white">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-sm text-brand-green-200/70 transition hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-gold-500">Contact</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <a href="mailto:support@thefairwaystandard.org" className="text-sm text-brand-green-200/70 transition hover:text-white">
                    support@thefairwaystandard.org
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </ScrollReveal>

        <div className="mt-12 flex flex-col items-center gap-3 border-t border-brand-green-800/50 pt-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-brand-green-400/50">
            &copy; {new Date().getFullYear()} The Fairway Standard. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link href="/terms" className="text-xs text-brand-green-400/50 transition hover:text-brand-green-200">Terms</Link>
            <Link href="/privacy" className="text-xs text-brand-green-400/50 transition hover:text-brand-green-200">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
