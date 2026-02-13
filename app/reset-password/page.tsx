"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

interface PasswordRequirement {
  label: string;
  met: boolean;
}

const validatePassword = (password: string): { valid: boolean; requirements: PasswordRequirement[] } => {
  const requirements: PasswordRequirement[] = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Uppercase letter (A-Z)", met: /[A-Z]/.test(password) },
    { label: "Lowercase letter (a-z)", met: /[a-z]/.test(password) },
    { label: "Number (0-9)", met: /[0-9]/.test(password) },
  ];

  const valid = requirements.every((r) => r.met);
  return { valid, requirements };
};

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirement[]>([]);
  const [showRequirements, setShowRequirements] = useState(false);

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const { requirements } = validatePassword(value);
    setPasswordRequirements(requirements);
    setShowRequirements(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError(null);

    // Validate passwords match
    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength
    const { valid, requirements } = validatePassword(password);
    if (!valid) {
      const missing = requirements.filter((r) => !r.met).map((r) => r.label);
      setError("Missing: " + missing.join(", "));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
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

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center">
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
              Invalid Link
            </h1>
            <p className="text-gray-400 mb-6">
              This password reset link is invalid.
            </p>

            <Link
              href="/forgot-password"
              className="inline-block w-full bg-white text-black rounded-lg py-3 font-medium hover:bg-gray-100 transition"
            >
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
          {success ? (
            <div className="text-center">
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
                Password Updated!
              </h1>
              <p className="text-gray-400 mb-6">
                Your password has been successfully updated. You can now log in.
              </p>

              <Link
                href="/"
                className="inline-block w-full bg-white text-black rounded-lg py-3 font-medium hover:bg-gray-100 transition"
              >
                Log In
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white mb-2">
                  Set New Password
                </h1>
                <p className="text-gray-400 text-sm">
                  Set a new password for your account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    placeholder="New password"
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

                  {/* Password requirements */}
                  {showRequirements && passwordRequirements.length > 0 && (
                    <div className="grid grid-cols-2 gap-1 mt-2">
                      {passwordRequirements.map((req, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-1.5 text-[10px] ${
                            req.met ? "text-green-400" : "text-gray-500"
                          }`}
                        >
                          {req.met ? (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          <span>{req.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <input
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="New password (again)"
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
                  {loading ? "Updating..." : "Update My Password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}