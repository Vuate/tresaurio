"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

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

export default function SignupForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirement[]>([]);
  const [showRequirements, setShowRequirements] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { requirements } = validatePassword(e.target.value);
    setPasswordRequirements(requirements);
    setShowRequirements(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const passwordConfirm = formData.get("passwordConfirm") as string;

    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const { valid, requirements } = validatePassword(password);
    if (!valid) {
      const missing = requirements.filter((r) => !r.met).map((r) => r.label);
      setError("Missing: " + missing.join(", "));
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError("Registration successful but login failed. Please log in manually.");
        setLoading(false);
        return;
      }

      window.location.reload();
    } catch {
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `
    w-full
    rounded-lg xl:rounded-lg 2xl:rounded-xl
    bg-foreground/5 border border-border
    px-3.5 xl:px-3.75 2xl:px-4
    py-2 xl:py-2.25 2xl:py-2.5
    text-xs xl:text-[13px] 2xl:text-sm
    outline-none
    text-foreground
    focus:border-foreground/25 focus:bg-foreground/[0.07]
    transition-all
    placeholder:text-muted-foreground
    disabled:opacity-60
  `;

  return (
    <form
      noValidate
      aria-busy={loading}
      onSubmit={handleSubmit}
      className="space-y-3.5 xl:space-y-3.75 2xl:space-y-4"
    >
      {/* Inputs */}
      <div className="space-y-2.5 xl:space-y-2.75 2xl:space-y-3">
        <input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Email"
          required
          disabled={loading}
          aria-label="Email"
          className={inputClass}
        />

        <input
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="Password"
          required
          disabled={loading}
          onChange={handlePasswordChange}
          aria-label="Password"
          className={inputClass}
        />
        {showRequirements && passwordRequirements.length > 0 && (
          <div className="grid grid-cols-2 gap-1 mt-2">
            {passwordRequirements.map((req, i) => (
              <div
                key={i}
                className={`flex items-center gap-1.5 text-[10px] ${
                  req.met ? "text-green-400" : "text-muted-foreground"
                }`}
              >
                {req.met ? (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                <span>{req.label}</span>
              </div>
            ))}
          </div>
        )}

        <input
          type="password"
          name="passwordConfirm"
          autoComplete="new-password"
          placeholder="Password (again)"
          required
          disabled={loading}
          aria-label="Password (again)"
          className={inputClass}
        />
      </div>

      {/* Agreement */}
      <label className="flex items-start gap-2 text-[11px] xl:text-[11.5px] 2xl:text-xs text-muted-foreground cursor-pointer">
        <input
          type="checkbox"
          name="agreement"
          required
          disabled={loading}
          aria-label="Terms of service and privacy policy"
          className="mt-0.5 rounded border-border bg-foreground/5 focus:ring-0 focus:ring-offset-0 cursor-pointer disabled:opacity-60"
        />
        <span>
          I accept the{" "}
          <span className="underline underline-offset-2">terms of service</span>{" "}
          and{" "}
          <span className="underline underline-offset-2">privacy policy</span>.
        </span>
      </label>

      {/* Error */}
      {error && (
        <p className="text-[11px] xl:text-[11.5px] 2xl:text-xs text-red-400" role="alert">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="
          w-full
          rounded-lg xl:rounded-lg 2xl:rounded-xl
          bg-[#2563EB] text-white border border-[#2563EB]
          hover:bg-[#1a55d5] hover:border-[#1a55d5]
          py-2 xl:py-2.25 2xl:py-2.5
          text-xs xl:text-[13px] 2xl:text-sm
          font-medium
          transition-all
          disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
        "
      >
        {loading ? "Creating account..." : "Sign Up"}
      </button>

      {/* Divider */}
      <div className="relative py-2.5 xl:py-2.75 2xl:py-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-card px-3 text-[11px] xl:text-[11.5px] 2xl:text-xs text-muted-foreground">
            or
          </span>
        </div>
      </div>

      {/* Social Logins */}
      <div className="space-y-2 xl:space-y-2 2xl:space-y-2">
        <button
          type="button"
          disabled={loading || googleLoading}
          onClick={() => {
            setGoogleLoading(true);
            signIn("google", { callbackUrl: window.location.pathname });
          }}
          className="
            w-full flex items-center justify-center
            gap-2 xl:gap-2 2xl:gap-2
            rounded-lg xl:rounded-lg 2xl:rounded-xl
            border border-border bg-foreground/3
            px-3.5 xl:px-3.75 2xl:px-4
            py-2 xl:py-2.25 2xl:py-2.5
            text-xs xl:text-[13px] 2xl:text-sm
            text-foreground
            hover:bg-foreground/6 hover:border-foreground/20
            transition-all
            disabled:opacity-50 cursor-pointer
          "
        >
          <svg className="w-3.5 h-3.5 xl:w-3.75 xl:h-3.75 2xl:w-4 2xl:h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span>Continue with Google</span>
        </button>

        <button
          type="button"
          disabled={loading}
          className="
            w-full flex items-center justify-center
            gap-2 xl:gap-2 2xl:gap-2
            rounded-lg xl:rounded-lg 2xl:rounded-xl
            border border-border bg-foreground/3
            px-3.5 xl:px-3.75 2xl:px-4
            py-2 xl:py-2.25 2xl:py-2.5
            text-xs xl:text-[13px] 2xl:text-sm
            text-foreground
            hover:bg-foreground/6 hover:border-foreground/20
            transition-all
            disabled:opacity-50 cursor-pointer
          "
        >
          <svg className="w-3.5 h-3.5 xl:w-3.75 xl:h-3.75 2xl:w-4 2xl:h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          <span>Continue with Apple</span>
        </button>
      </div>
    </form>
  );
}
