"use client";

import { createPortal } from "react-dom";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export type AuthMode = "login" | "signup";

export default function AuthModal({
  open,
  mode,
  onClose,
  onChange,
}: {
  open: boolean;
  mode: AuthMode;
  onClose: () => void;
  onChange: (m: AuthMode) => void;
}) {
  if (!open || typeof window === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* CARD - Compact Size */}
      <div
        className="
          relative w-full max-w-[400px] z-10
          rounded-xl border border-white/10
          bg-[#0d0f14] p-6
          shadow-2xl
        "
      >
        {/* === HEADER === */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-white/5 rounded-lg blur-md" />
              <img
                src="/treasurio.png"
                alt="Treasurio"
                className="w-10 h-10 object-contain relative z-10"
              />
            </div>
            <div>
              <span className="text-lg font-semibold block text-gray-100">
                Treasurio
              </span>
              <span className="text-[10px] text-gray-500 block">Terminal</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition -mt-1"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* === TABS === */}
        <div className="flex gap-1 mb-5 bg-white/5 rounded-lg p-1">
          <button
            onClick={() => onChange("login")}
            className={`
              flex-1 py-1.5 text-sm font-medium rounded-md transition-all
              ${
                mode === "login"
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white"
              }
            `}
          >
            Giriş Yap
          </button>

          <button
            onClick={() => onChange("signup")}
            className={`
              flex-1 py-1.5 text-sm font-medium rounded-md transition-all
              ${
                mode === "signup"
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white"
              }
            `}
          >
            Kayıt Ol
          </button>
        </div>

        {/* === CONTENT === */}
        {mode === "login" ? <LoginForm /> : <SignupForm />}

        {/* === FOOTER === */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            {mode === "login"
              ? "Hesabınız yok mu? "
              : "Zaten hesabınız var mı? "}
            <button
              onClick={() => onChange(mode === "login" ? "signup" : "login")}
              className="text-white hover:underline"
            >
              {mode === "login" ? "Kayıt olun" : "Giriş yapın"}
            </button>
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
