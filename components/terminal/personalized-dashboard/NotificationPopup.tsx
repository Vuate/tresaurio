"use client";

import { useEffect, useState } from "react";
import { X, Check, Info, AlertCircle } from "lucide-react";

interface NotificationPopupProps {
  show: boolean;
  type: "success" | "error" | "info";
  title: string;
  message: string;
  onClose: () => void;
}

const TYPE_CONFIG = {
  success: {
    icon: <Check className="w-4 h-4" />,
    iconBg: "bg-[#1A73E8]/15 dark:bg-[#1A73E8]/20",
    iconColor: "text-[#1A73E8]",
    accentBar: "bg-[#1A73E8]",
  },
  error: {
    icon: <AlertCircle className="w-4 h-4" />,
    iconBg: "bg-red-500/15 dark:bg-red-500/20",
    iconColor: "text-red-600 dark:text-red-400",
    accentBar: "bg-red-500",
  },
  info: {
    icon: <Info className="w-4 h-4" />,
    iconBg: "bg-blue-500/15 dark:bg-blue-500/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    accentBar: "bg-blue-500",
  },
};

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

  const cfg = TYPE_CONFIG[type];

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-9998
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
          className="bg-card border border-border rounded-xl overflow-hidden
            w-95 max-w-[90vw]
            shadow-lg shadow-black/15 dark:shadow-black/40 select-none"
        >
          {/* Colored accent bar at top */}
          <div className={`h-0.5 w-full ${cfg.accentBar}`} />

          <div className="px-5 py-4">
            <div className="flex items-start gap-3.5">
              {/* Icon */}
              <div
                className={`${cfg.iconBg} ${cfg.iconColor}
                  shrink-0 w-8 h-8 rounded-lg
                  flex items-center justify-center mt-0.5`}
              >
                {cfg.icon}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="text-foreground font-semibold text-sm mb-1">
                  {title}
                </div>
                <div className="text-muted-foreground text-xs leading-relaxed">
                  {message}
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={handleClose}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer
                  shrink-0 w-6 h-6 flex items-center justify-center
                  rounded hover:bg-black/5 dark:hover:bg-white/8"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
