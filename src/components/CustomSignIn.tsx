"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { isPhoneNumber, normalizePhoneToE164 } from "@/lib/phone";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Step = "identifier" | "password" | "verify_code";

interface SignInSecondFactor {
  strategy: string;
  phoneNumberId?: string;
  emailAddressId?: string;
}

export default function CustomSignIn() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [step, setStep] = useState<Step>("identifier");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");
  const [codeSent, setCodeSent] = useState(false);

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

    let resolvedIdentifier = identifier.trim();
    if (isPhoneNumber(resolvedIdentifier)) {
      const e164 = normalizePhoneToE164(resolvedIdentifier);
      if (e164) resolvedIdentifier = e164;
    }

    try {
      const result = await signIn!.create({ identifier: resolvedIdentifier });
      setDebugInfo(`Status after identifier: ${result.status}`);

      if (result.status === "needs_first_factor") {
        setStep("password");
      } else if (result.status === "complete") {
        await setActive!({ session: result.createdSessionId! });
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
        await setActive!({ session: result.createdSessionId! });
        router.push("/");
      } else if (result.status === "needs_second_factor") {
        setError("Two-factor authentication is required but not yet supported. Contact support.");
      } else if ((result as { status?: string }).status === "needs_client_trust") {
        setStep("verify_code");
        setCode("");
        setCodeSent(false);
        await sendVerificationCode();
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

  async function sendVerificationCode() {
    if (!signIn) return;
    setError("");
    setLoading(true);

    try {
      const factors = ((signIn as { supportedSecondFactors?: SignInSecondFactor[] }).supportedSecondFactors || []) as SignInSecondFactor[];
      const phoneFactor = factors.find((f) => f.strategy === "phone_code");
      const emailFactor = factors.find((f) => f.strategy === "email_code");

      if (phoneFactor && "prepareSecondFactor" in signIn) {
        await (signIn as { prepareSecondFactor: (p: { strategy: string; phoneNumberId?: string }) => Promise<unknown> }).prepareSecondFactor({
          strategy: "phone_code",
          ...(phoneFactor.phoneNumberId && { phoneNumberId: phoneFactor.phoneNumberId }),
        });
        setCodeSent(true);
        setDebugInfo("Verification code sent to your phone.");
      } else if (emailFactor && "prepareSecondFactor" in signIn) {
        await (signIn as { prepareSecondFactor: (p: { strategy: string; emailAddressId?: string }) => Promise<unknown> }).prepareSecondFactor({
          strategy: "email_code",
          ...(emailFactor.emailAddressId && { emailAddressId: emailFactor.emailAddressId }),
        });
        setCodeSent(true);
        setDebugInfo("Verification code sent to your email.");
      } else {
        setError("No verification method available. Contact support.");
        setDebugInfo(`Supported factors: ${JSON.stringify(factors)}`);
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ message: string; longMessage?: string }> };
      const msg = clerkError.errors?.[0]?.longMessage || clerkError.errors?.[0]?.message || String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim() || !signIn) return;
    setError("");
    setLoading(true);

    try {
      const factors = ((signIn as { supportedSecondFactors?: SignInSecondFactor[] }).supportedSecondFactors || []) as SignInSecondFactor[];
      const phoneFactor = factors.find((f) => f.strategy === "phone_code");
      const emailFactor = factors.find((f) => f.strategy === "email_code");

      const strategy = phoneFactor ? "phone_code" : emailFactor ? "email_code" : null;
      if (!strategy || !("attemptSecondFactor" in signIn!)) {
        setError("Verification failed. Please try again.");
        setLoading(false);
        return;
      }

      const result = await (signIn as { attemptSecondFactor: (p: { strategy: string; code: string }) => Promise<{ status?: string; createdSessionId?: string }> }).attemptSecondFactor({
        strategy,
        code: code.trim(),
      });

      if (result.status === "complete" && result.createdSessionId) {
        await setActive!({ session: result.createdSessionId });
        router.push("/");
      } else {
        setError(`Verification returned status: ${result.status}. Please try again.`);
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ message: string; longMessage?: string }> };
      const msg = clerkError.errors?.[0]?.longMessage || clerkError.errors?.[0]?.message || String(err);
      setError(msg);
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
          {step === "identifier" && "Sign In"}
          {step === "password" && "Enter Your Password"}
          {step === "verify_code" && "Verify Your Device"}
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
        {step === "verify_code" && (
          <p className="mt-1 text-sm text-brand-muted">
            We sent a 6-digit code to verify this device. Check your phone or email.
          </p>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {step === "identifier" && (
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
              placeholder="(123) 456-7890"
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
      )}

      {step === "password" && (
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

      {step === "verify_code" && (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-brand-charcoal">
              Verification Code
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              autoFocus
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-lg tracking-[0.5em] text-brand-charcoal placeholder-gray-400 focus:border-brand-green-500 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20"
            />
          </div>
          <button
            type="submit"
            disabled={loading || code.length < 6}
            className="w-full rounded-lg bg-brand-green-700 px-4 py-3 font-semibold text-white transition hover:bg-brand-green-800 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
          <button
            type="button"
            onClick={sendVerificationCode}
            disabled={loading}
            className="w-full text-sm font-medium text-brand-green-600 hover:text-brand-green-700 disabled:opacity-50"
          >
            {codeSent ? "Resend code" : "Send code"}
          </button>
        </form>
      )}

      {debugInfo && step !== "verify_code" && (
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
