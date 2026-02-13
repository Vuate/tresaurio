"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "An error occurred");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
          {success ? (
            <div className="text-center">
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-white mb-2">
                Check Your Email
              </h1>
              <p className="text-gray-400 mb-6">
                If this email is registered, a password reset link has been sent.
              </p>

              <Link
                href="/"
                className="inline-block w-full bg-white/10 text-white rounded-lg py-3 font-medium hover:bg-white/20 transition"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white mb-2">
                  Forgot Password
                </h1>
                <p className="text-gray-400 text-sm">
                  Enter your email address and we'll send you a password reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  disabled={loading}
                  className="
                    w-full
                    rounded-lg
                    bg-white/5 border border-white/10
                    px-4 py-3
                    text-sm
                    outline-none
                    text-white
                    focus:border-white/20 focus:bg-white/[0.07]
                    transition-all
                    placeholder:text-gray-500
                    disabled:opacity-60
                  "
                />

                {error && (
                  <p className="text-sm text-red-400">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full
                    rounded-lg
                    bg-white text-black
                    py-3
                    text-sm
                    font-medium
                    hover:bg-gray-100
                    transition-all
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  {loading ? "Sending..." : "Send Password Reset Link"}
                </button>

                <Link
                  href="/"
                  className="block text-center text-sm text-gray-400 hover:text-white transition"
                >
                  Back to login
                </Link>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}