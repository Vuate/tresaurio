"use client";

import { useEffect, useRef, useState } from "react";
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
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 xl:p-3.5 2xl:p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* CARD */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        className="
          relative w-full
          max-w-[360px] xl:max-w-[380px] 2xl:max-w-[400px]
          z-10
          rounded-lg xl:rounded-xl 2xl:rounded-2xl
          border border-white/10
          bg-[#0d0f14]
          p-5 xl:p-5.5 2xl:p-6
          shadow-2xl
          outline-none
        "
      >
        {/* HEADER */}
        <div className="mb-5 xl:mb-5.5 2xl:mb-6 flex items-start justify-between">
          <div className="flex items-center gap-2.5 xl:gap-2.75 2xl:gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-white/5 rounded-lg blur-md" />
              <img
                src="/treasurio.png"
                alt="Treasurio"
                className="w-9 h-9 xl:w-9.5 xl:h-9.5 2xl:w-10 2xl:h-10 object-contain relative z-10"
              />
            </div>
            <div>
              <span className="text-base xl:text-[17px] 2xl:text-lg font-semibold block text-gray-100">
                Treasurio
              </span>
              <span className="text-[9px] xl:text-[9.5px] 2xl:text-[10px] text-gray-500 block">
                Terminal
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition -mt-1 cursor-pointer"
            aria-label="Close"
          >
            <svg
              className="w-4.5 h-4.5 xl:w-4.75 xl:h-4.75 2xl:w-5 2xl:h-5"
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

        {/* TABS */}
        <div className="flex gap-1 mb-4 xl:mb-4.5 2xl:mb-5 bg-white/5 rounded-lg p-1">
          <button
            onClick={() => onChange("login")}
            className={`
              flex-1 
              py-1.5 xl:py-1.5 2xl:py-1.5
              text-xs xl:text-[13px] 2xl:text-sm
              font-medium rounded-md transition-all cursor-pointer
              ${
                mode === "login"
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white"
              }
            `}
          >
                   Log In
          </button>

          <button
            onClick={() => onChange("signup")}
            className={`
              flex-1 
              py-1.5 xl:py-1.5 2xl:py-1.5
              text-xs xl:text-[13px] 2xl:text-sm
              font-medium rounded-md transition-all cursor-pointer
              ${
                mode === "signup"
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white"
              }
            `}
          >
      Sign Up  
          </button>
        </div>

        {/* CONTENT */}
        {mode === "login" ? (
          <LoginForm onSuccess={onClose} />
        ) : (
          <SignupForm onSuccess={onClose} />
        )}

        {/* FOOTER */}
        <div className="mt-3.5 xl:mt-3.75 2xl:mt-4 text-center">
          <p className="text-[11px] xl:text-[11.5px] 2xl:text-xs text-gray-500">
            {mode === "login"
             ? "Don't have an account? "
              : "Already have an account? "}
            <button
              onClick={() =>
                onChange(mode === "login" ? "signup" : "login")
              }
              className="text-white hover:underline cursor-pointer"
            >
         {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}