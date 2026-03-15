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

const bgColor = "bg-[#2B8FE0]/8";
const borderColor = "border-[#2B8FE0]/35";
const iconColor = "text-[#19D8D0]";


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
              type === "success" ? "bg-[#2B8FE0]/20" : "bg-[#2B8FE0]/20"}`}
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
                rounded ,"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 flex justify-end">

          </div>
        </div>
      </div>
    </>
  );
}