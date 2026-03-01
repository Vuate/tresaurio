"use client";

import { useEffect, useState } from "react";
import { X, Check, Info } from "lucide-react";

interface NotificationPopupProps {
  show: boolean;
  type: "success" | "error" | "info";
  title: string;
  message: string;
  onClose: () => void;
}

export default function NotificationPopup({
  show,
  type,
  title,
  message,
  onClose,
}: NotificationPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  // KEYBOARD HANDLER 
  useEffect(() => {
    if (!show) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        setIsVisible(false);
        setTimeout(onClose, 300);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [show, onClose]);

  // AUTO-CLOSE TIMER
  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show) return null;

  const bgColor =
    type === "error"
      ? "bg-[#041F20]/95"
      : type === "success"
      ? "bg-[#032D2F]/95"
      : "bg-[#031A1C]/95";

  const borderColor =
    type === "error"
      ? "border-emerald-500/30"
      : type === "success"
      ? "border-emerald-400/40"
      : "border-teal-400/30";

  const iconColor =
    type === "error"
      ? "text-emerald-400"
      : type === "success"
      ? "text-emerald-300"
      : "text-teal-300";

  const icon = type === "error" ? <X className="w-4 h-4" /> : type === "success" ? <Check className="w-4 h-4" /> : <Info className="w-4 h-4" />;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]
          transition-opacity duration-300
          ${isVisible ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
      />

      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999]
          transition-all duration-300 ease-out
          ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        <div
          className={`${bgColor} ${borderColor}
            backdrop-blur-xl border rounded-xl
            px-6 py-5 w-[400px] max-w-[90vw]
            shadow-2xl shadow-black/50 select-none`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`${iconColor} text-2xl font-bold mt-0.5 
                flex-shrink-0 w-8 h-8 rounded-full 
                flex items-center justify-center
                ${type === "error" ? "bg-red-500/20" : 
                  type === "success" ? "bg-emerald-500/20" : "bg-teal-500/20"}`}
            >
              {icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-white font-semibold text-base mb-2">
                {title}
              </div>
              <div className="text-white/70 text-sm leading-relaxed">
                {message}
              </div>
            </div>

            <button
              onClick={handleClose}
              className="text-white/40 hover:text-white/80 transition cursor-pointer
                flex-shrink-0 w-6 h-6 flex items-center justify-center
                rounded hover:bg-white/10"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleClose}
              className={`px-6 py-2 rounded-lg font-medium text-sm
                transition-all duration-200 cursor-pointer
                ${type === "error"
                  ? "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25"
                  : type === "success"
                  ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                  : "bg-teal-500/20 text-teal-300 hover:bg-teal-500/30"
                }`}
            >
              Okey
            </button>
          </div>
        </div>
      </div>
    </>
  );
}