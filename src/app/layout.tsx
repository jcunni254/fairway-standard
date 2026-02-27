import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Fairway Standard — Book Caddies & Golf Instructors",
  description:
    "Book experienced caddies and qualified golf instructors at lower rates. The Fairway Standard connects golfers with premium services at fair prices.",
  openGraph: {
    title: "The Fairway Standard — Book Caddies & Golf Instructors",
    description:
      "Premium golf services at fair prices. Book caddies and instructors in your area.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">
          <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-fairway-950/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <Link href="/" className="text-lg font-bold text-white">
                The Fairway Standard
              </Link>
              <div className="flex items-center gap-4">
                <Link
                  href="/join"
                  className="text-sm font-medium text-gray-300 transition hover:text-white"
                >
                  Caddies & Instructors
                </Link>
                <Link
                  href="#waitlist"
                  className="rounded-lg bg-fairway-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-fairway-500"
                >
                  Join Waitlist
                </Link>
              </div>
            </div>
          </nav>
          <main className="pt-[65px]">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
