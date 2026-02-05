"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, AlertCircle, Shield } from "lucide-react";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "tresaurio2024";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  // Check if already logged in
  useEffect(() => {
    const session = sessionStorage.getItem("admin_session");
    if (session) {
      const parsed = JSON.parse(session);
      if (parsed.expires > Date.now()) {
        router.push("/admin/dashboard");
      }
    }
  }, [router]);

  // Lock timer countdown
  useEffect(() => {
    if (lockTimer > 0) {
      const interval = setInterval(() => {
        setLockTimer((t) => t - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (lockTimer === 0 && locked) {
      setLocked(false);
      setAttempts(0);
    }
  }, [lockTimer, locked]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (locked) return;

    setLoading(true);
    setError("");

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 500));

    if (password === ADMIN_PASSWORD) {
      // Create session (expires in 4 hours)
      const session = {
        authenticated: true,
        expires: Date.now() + 4 * 60 * 60 * 1000,
        loginTime: Date.now(),
      };
      sessionStorage.setItem("admin_session", JSON.stringify(session));
      router.push("/admin/dashboard");
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 5) {
        setLocked(true);
        setLockTimer(60); // 1 minute lockout
        setError("Too many failed attempts. Locked for 60 seconds.");
      } else {
        setError(`Invalid password. ${5 - newAttempts} attempts remaining.`);
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#030711] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20" />

      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-white/50 text-sm">Tresaurio System Management</p>
        </div>

        <div className="bg-[#0a0f1a] border border-white/10 rounded-2xl p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={locked}
                  placeholder="Enter admin password"
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-11 py-3 text-white placeholder:text-white/30 outline-none focus:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {locked && (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 mb-2">
                  <span className="text-2xl font-bold text-red-400">{lockTimer}</span>
                </div>
                <p className="text-white/40 text-sm">seconds until unlock</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || locked || !password}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 rounded-xl transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : locked ? (
                "Locked"
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Access Admin Panel
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/5">
            <p className="text-white/30 text-xs text-center">
              This area is restricted to authorized personnel only.
              <br />
              All access attempts are logged.
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <a
            href="/"
            className="text-white/40 hover:text-white/60 text-sm transition-colors"
          >
            Return to Main Site
          </a>
        </div>
      </div>
    </div>
  );
}
