"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    "missing-token": "Verification link is invalid.",
    "invalid-token": "Verification link is invalid or has already been used.",
    "expired-token": "Verification link has expired. Please request a new link.",
    "user-not-found": "User not found.",
    "server-error": "An error occurred. Please try again.",
  };

  return (
    <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center">
          {success === "true" ? (
            <>
              {/* Success Icon */}
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-white mb-2">
                Email Verified!
              </h1>
              <p className="text-gray-400 mb-6">
                Your account has been successfully activated. You can now log in.
              </p>

              <Link
                href="/"
                className="inline-block w-full bg-white text-black rounded-lg py-3 font-medium hover:bg-gray-100 transition"
              >
                Log In
              </Link>
            </>
          ) : error ? (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-white mb-2">
                Verification Failed
              </h1>
              <p className="text-gray-400 mb-6">
                {errorMessages[error] || "An error occurred."}
              </p>

              <div className="space-y-3">
                <Link
                  href="/"
                  className="inline-block w-full bg-white/10 text-white rounded-lg py-3 font-medium hover:bg-white/20 transition"
                >
                  Back to Home
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-blue-400 animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-white mb-2">
                Check Your Email
              </h1>
              <p className="text-gray-400 mb-6">
                Click the verification link sent to your email to activate your account.
              </p>

              <Link
                href="/"
                className="inline-block w-full bg-white/10 text-white rounded-lg py-3 font-medium hover:bg-white/20 transition"
              >
                Back to Home
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}