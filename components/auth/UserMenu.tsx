"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";

import {
  User,
  Settings,
  Wallet,
  History,
  LogOut,
  ChevronDown,
  Key,
} from "lucide-react";

interface UserMenuProps {
  variant?: "default" | "mobile";
  compact?: boolean;
  onClose?: () => void;
}

export default function UserMenu({ variant = "default", compact = false, onClose }: UserMenuProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const setUserMenuOpen = usePersonalizedDashboardStore((s) => s.setUserMenuOpen);
  const closeAllPanels = usePersonalizedDashboardStore((s) => s.closeAllPanels);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
        setUserMenuOpen(false);
      }
    };
    const handleTouchOutside = (e: TouchEvent) => {
      if (e.touches.length > 1) return;
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleTouchOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleTouchOutside);
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  if (!session?.user) return null;

  const user = session.user;
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email?.charAt(0).toUpperCase() || "U";

  const menuItems = [
    { icon: User,     label: "Profile",       onClick: () => {}, disabled: true },
    { icon: Key,      label: "API Keys",      onClick: () => {}, disabled: true },
    { icon: Wallet,   label: "Balance",        onClick: () => {}, badge: "Demo", disabled: true },
    { icon: History,  label: "Recent Orders",  onClick: () => {}, disabled: true },
    { icon: Settings, label: "Settings",       onClick: () => {}, disabled: true },
  ];

  // ========================================
  // MOBILE VARIANT
  // ========================================
  if (variant === "mobile") {
    return (
      <div className="w-full">
        {/* User Info */}
        <div className="flex items-center gap-3 py-3 mb-1">
          {user.image ? (
            <img src={user.image} alt={user.name || "Avatar"} className="w-11 h-11 rounded-full object-cover" />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-base font-bold shrink-0">
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[0.9rem] font-semibold text-foreground truncate">{user.name || "User"}</p>
            <p className="text-xs text-foreground/45 truncate">{user.email}</p>
          </div>
        </div>

        {/* Menu Items */}
        {menuItems.map((item, i) => (
          <button
            key={i}
            disabled={item.disabled}
            onClick={item.disabled ? undefined : item.onClick}
            title={item.disabled ? "Coming Coming Soon" : undefined}
            className={`w-full flex items-center gap-3 py-3 border-t border-border-sub text-[0.875rem] font-medium transition-colors ${
              item.disabled
                ? "opacity-35 cursor-not-allowed text-foreground/50"
                : "text-foreground/65 hover:text-foreground cursor-pointer"
            }`}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <span className="px-2 py-0.5 text-[0.65rem] font-semibold bg-teal-500/15 text-teal-400 rounded">
                {item.badge}
              </span>
            )}
            {item.disabled && (
              <span className="text-[0.65rem] text-foreground/35">Coming Soon</span>
            )}
          </button>
        ))}

        {/* Logout */}
        <button
          onClick={() => { signOut({ callbackUrl: window.location.href }); onClose?.(); }}
          className="w-full flex items-center gap-3 py-3 border-t border-border-sub text-[0.875rem] font-medium text-red-400 hover:text-red-300 transition-colors cursor-pointer mt-1"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Log Out</span>
        </button>
      </div>
    );
  }

  // ========================================
  // DEFAULT VARIANT - Dropdown
  // ========================================
  return (
    <div ref={menuRef} className="relative">
      {/* Avatar Button */}
      <button
        onClick={() => {
          const newState = !open;
          setOpen(newState);
          setUserMenuOpen(newState);
          if (newState) closeAllPanels();
        }}
        className={`
          flex items-center
          ${compact
            ? "gap-1.5 sm:gap-2 px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5"
            : "gap-2 sm:gap-2.5 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2"
          }
          rounded-lg sm:rounded-xl
          bg-input border border-border
          hover:bg-foreground/8 hover:border-border-emphasis
          transition-all cursor-pointer
        `}
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || "Avatar"}
            className={`rounded-full object-cover ${compact ? "w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" : "w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9"}`}
          />
        ) : (
          <div
            className={`rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-medium
              ${compact ? "w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-xs sm:text-sm" : "w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-sm sm:text-base"}`}
          >
            {initials}
          </div>
        )}

        <span className={`text-foreground/80 truncate hidden lg:block ${compact ? "text-xs sm:text-sm max-w-20 md:max-w-25" : "text-sm md:text-base max-w-25 md:max-w-30"}`}>
          {user.name?.split(" ")[0] || user.email?.split("@")[0]}
        </span>

        <ChevronDown
          className={`text-[#71717A] transition-transform shrink-0 hidden lg:block ${compact ? "w-3 h-3 sm:w-3.5 sm:h-3.5" : "w-3.5 h-3.5 sm:w-4 sm:h-4"} ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className={`
          fixed
          right-2 sm:right-3 md:right-4 lg:right-6
          bg-card border border-border rounded-xl shadow-2xl
          overflow-y-auto z-[200]
          max-h-[calc(100vh-64px)]
          ${compact
            ? "top-13 sm:top-14 md:top-16 w-52 sm:w-60 md:w-64 max-w-[calc(100vw-16px)]"
            : "top-18 md:top-22 w-56 sm:w-64 md:w-72 max-w-[calc(100vw-16px)]"
          }
        `}>
          {/* User Info Header */}
          <div className={`border-b border-border bg-foreground/2 ${compact ? "px-3 sm:px-4 py-2.5 sm:py-3" : "px-3.5 sm:px-4 py-3 sm:py-3.5"}`}>
            <div className="flex items-center gap-2 sm:gap-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "Avatar"}
                  className={`rounded-full object-cover ${compact ? "w-9 h-9 sm:w-10 sm:h-10" : "w-10 h-10 sm:w-11 sm:h-11"}`}
                />
              ) : (
                <div
                  className={`rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-medium
                    ${compact ? "w-9 h-9 sm:w-10 sm:h-10 text-sm" : "w-10 h-10 sm:w-11 sm:h-11 text-base"}`}
                >
                  {initials}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-foreground truncate ${compact ? "text-xs sm:text-sm" : "text-sm"}`}>
                  {user.name || "User"}
                </p>
                <p className={`text-[#71717A] truncate ${compact ? "text-[10px] sm:text-xs" : "text-xs"}`}>
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {menuItems.map((item, i) => (
              <button
                key={i}
                disabled={item.disabled}
                onClick={item.disabled ? undefined : item.onClick}
                title={undefined}
                className={`
                  w-full flex items-center transition-colors
                  ${item.disabled
                    ? "opacity-40 cursor-not-allowed text-[#71717A]"
                    : "text-foreground/70 hover:text-foreground hover:bg-foreground/4 cursor-pointer"
                  }
                  ${compact
                    ? "gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm"
                    : "gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2.5 text-sm"
                  }
                `}
              >
                <item.icon className={`text-[#71717A] shrink-0 ${compact ? "w-3.5 h-3.5 sm:w-4 sm:h-4" : "w-4 h-4"}`} />
                <span className="flex-1 text-left font-medium">{item.label}</span>
                {item.badge && (
                  <span className={`font-semibold bg-teal-500/20 text-teal-400 rounded shrink-0 ${compact ? "px-1.5 py-0.5 text-[9px] sm:text-[10px]" : "px-2 py-0.5 text-[10px]"}`}>
                    {item.badge}
                  </span>
                )}
                {item.disabled && (
                  <span className="text-[0.65rem] text-foreground/35 shrink-0">Coming Soon</span>
                )}
              </button>
            ))}
          </div>

          {/* Logout */}
          <div className="border-t border-border">
            <button
              onClick={() => {
                signOut({ callbackUrl: window.location.href });
                setOpen(false);
                setUserMenuOpen(false);
              }}
              className={`
                w-full flex items-center text-red-400
                hover:text-red-300 hover:bg-red-500/5
                transition-colors cursor-pointer
                ${compact
                  ? "gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm"
                  : "gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2.5 text-sm"
                }
              `}
            >
              <LogOut className={`shrink-0 ${compact ? "w-3.5 h-3.5 sm:w-4 sm:h-4" : "w-4 h-4"}`} />
              <span className="font-medium">Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
