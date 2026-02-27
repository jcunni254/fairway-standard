import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { PostHogProvider } from "./providers";
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
          <PostHogProvider>
            <NavBar />
            <main className="pt-[65px]">{children}</main>
            <Footer />
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
