import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — The Fairway Standard",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-65px)] items-center justify-center bg-brand-green-950 px-4">
      <SignIn
        forceRedirectUrl="/"
        signUpUrl="/sign-up"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-2xl",
          },
        }}
      />
    </div>
  );
}
