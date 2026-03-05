"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Step = "identifier" | "password";

export default function CustomSignIn() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [step, setStep] = useState<Step>("identifier");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");

  if (!isLoaded) {
    return (
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-brand-green-600 border-t-transparent" />
      </div>
    );
  }

  async function handleIdentifier(e: React.FormEvent) {
    e.preventDefault();
    if (!identifier.trim()) return;
    setError("");
    setLoading(true);
    setDebugInfo("");

    try {
      const result = await signIn!.create({ identifier: identifier.trim() });
      setDebugInfo(`Status after identifier: ${result.status}`);

      if (result.status === "needs_first_factor") {
        setStep("password");
      } else if (result.status === "complete") {
        await setActive!({ session: result.createdSessionId });
        router.push("/");
      } else {
        setError(`Unexpected status: ${result.status}. Please try again.`);
        setDebugInfo(JSON.stringify(result, null, 2));
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ message: string; longMessage?: string; code?: string }> };
      const msg = clerkError.errors?.[0]?.longMessage || clerkError.errors?.[0]?.message || String(err);
      setError(msg);
      setDebugInfo(`Error code: ${clerkError.errors?.[0]?.code || "unknown"}`);
    } finally {
      setLoading(false);
    }
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!password) return;
    setError("");
    setLoading(true);
    setDebugInfo("");

    try {
      const result = await signIn!.attemptFirstFactor({
        strategy: "password",
        password,
      });

      setDebugInfo(`Status after password: ${result.status}`);

      if (result.status === "complete") {
        await setActive!({ session: result.createdSessionId });
        router.push("/");
      } else if (result.status === "needs_second_factor") {
        setError("Two-factor authentication is required but not yet supported. Contact support.");
      } else {
        setError(`Sign-in returned status: ${result.status}. Please contact support.`);
        setDebugInfo(JSON.stringify(result, null, 2));
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ message: string; longMessage?: string; code?: string }> };
      const msg = clerkError.errors?.[0]?.longMessage || clerkError.errors?.[0]?.message || String(err);
      setError(msg);
      setDebugInfo(`Error code: ${clerkError.errors?.[0]?.code || "unknown"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
      <div className="mb-6 text-center">
        <Image
          src="/logo-tfs.png"
          alt="The Fairway Standard"
          width={48}
          height={48}
          className="mx-auto mb-4"
        />
        <h1 className="font-display text-xl font-bold text-brand-charcoal">
          {step === "identifier" ? "Sign In" : "Enter Your Password"}
        </h1>
        {step === "password" && (
          <p className="mt-1 text-sm text-brand-muted">
            Signing in as{" "}
            <button
              onClick={() => { setStep("identifier"); setPassword(""); setError(""); setDebugInfo(""); }}
              className="font-medium text-brand-green-600 hover:underline"
            >
              {identifier}
            </button>
          </p>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {step === "identifier" ? (
        <form onSubmit={handleIdentifier} className="space-y-4">
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-brand-charcoal">
              Phone or Email
            </label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="+1 (615) 310-7111"
              autoFocus
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-brand-charcoal placeholder-gray-400 focus:border-brand-green-500 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !identifier.trim()}
            className="w-full rounded-lg bg-brand-green-700 px-4 py-3 font-semibold text-white transition hover:bg-brand-green-800 disabled:opacity-50"
          >
            {loading ? "Checking..." : "Continue"}
          </button>
        </form>
      ) : (
        <form onSubmit={handlePassword} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-brand-charcoal">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoFocus
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-brand-charcoal placeholder-gray-400 focus:border-brand-green-500 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full rounded-lg bg-brand-green-700 px-4 py-3 font-semibold text-white transition hover:bg-brand-green-800 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      )}

      {debugInfo && (
        <pre className="mt-4 max-h-40 overflow-auto rounded bg-gray-100 p-3 text-xs text-gray-600">
          {debugInfo}
        </pre>
      )}

      <p className="mt-6 text-center text-sm text-brand-muted">
        Don&apos;t have an account?{" "}
        <Link href="/join" className="font-medium text-brand-green-600 hover:underline">
          Get Started
        </Link>
      </p>
    </div>
  );
}
