"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";

import {
  User,
  Settings,
  Wallet,
  History,
  LogOut,
  ChevronDown,
} from "lucide-react";

interface UserMenuProps {
  variant?: "default" | "mobile";
  compact?: boolean;
}

export default function UserMenu({ variant = "default", compact = false }: UserMenuProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
    const setUserMenuOpen = usePersonalizedDashboardStore((s) => s.setUserMenuOpen);
    const closeAllPanels = usePersonalizedDashboardStore((s) => s.closeAllPanels);


  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on escape
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
  { icon: User,     label: "Profile",        onClick: () => {}, disabled: true },
  { icon: Wallet,   label: "Balance",         onClick: () => {}, badge: "Demo", disabled: true },
  { icon: History,  label: "Recent Orders",   onClick: () => {}, disabled: true },
  { icon: Settings, label: "Settings",        onClick: () => {}, disabled: true },
];


  // ========================================
  // MOBILE VARIANT - Navbar mobile menu için
  // ========================================
  if (variant === "mobile") {
    return (
      <div className="w-full space-y-3">
        {/* User Info Header - Always Visible */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || "Avatar"}
              className="w-11 h-11 rounded-full object-cover border-2 border-teal-400/30"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-base font-bold border-2 border-teal-400/30">
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user.name || "User"}
            </p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
        </div>

        {/* Menu Items - Full Width Buttons */}
        <div className="space-y-2">
          {menuItems.map((item, i) => (
<button
  key={i}
  disabled={item.disabled}
  title={item.disabled ? "Coming Soon" : undefined}
  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all border border-white/10
    ${item.disabled
      ? "opacity-40 cursor-not-allowed text-gray-400"
      : "text-gray-300 hover:bg-white/5 hover:text-white hover:border-white/20"
    }`}
>

              <item.icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="flex-1 text-left font-medium">{item.label}</span>
              {item.badge && (
                <span className="px-2 py-1 text-[10px] font-semibold bg-teal-500/20 text-teal-300 rounded flex-shrink-0">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            signOut({ callbackUrl: "/" });
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 border border-red-500/30 hover:border-red-500/50 transition-all"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>Log Out</span>
        </button>
      </div>
    );
  }

  // ========================================
  // DEFAULT VARIANT - Dropdown menu
  // ========================================
  return (
    <div ref={menuRef} className="relative">
      {/* Avatar Button - Responsive */}
<button
  onClick={() => {
    const newState = !open;
    setOpen(newState);
    setUserMenuOpen(newState);
    if (newState) {
      closeAllPanels();
    }
  }}
  className={`
    flex items-center 
    ${compact 
      ? "gap-1.5 sm:gap-2 px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5" 
      : "gap-2 sm:gap-2.5 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2"
    }
    rounded-lg sm:rounded-xl 
    bg-white/5 border border-white/10 
    hover:bg-white/10 hover:border-white/20 
    transition-all cursor-pointer
  `}
>
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || "Avatar"}
            className={`
              rounded-full object-cover
              ${compact 
                ? "w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" 
                : "w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9"
              }
            `}
          />
        ) : (
          <div 
            className={`
              rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 
              flex items-center justify-center text-white font-medium
              ${compact 
                ? "w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-xs sm:text-sm" 
                : "w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-sm sm:text-base"
              }
            `}
          >
            {initials}
          </div>
        )}
        
        {/* Username - Hidden on very small screens */}
        <span className={`
          hidden sm:block text-gray-300 truncate
          ${compact 
            ? "text-xs sm:text-sm max-w-[80px] md:max-w-[100px]" 
            : "text-sm md:text-base max-w-[100px] md:max-w-[120px]"
          }
        `}>
          {user.name?.split(" ")[0] || user.email?.split("@")[0]}
        </span>

        <ChevronDown
          className={`
            text-gray-400 transition-transform flex-shrink-0
            ${compact ? "w-3 h-3 sm:w-3.5 sm:h-3.5" : "w-3.5 h-3.5 sm:w-4 sm:h-4"}
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {/* Dropdown Menu - Responsive Width */}
      {open && (
        <div className={`
          absolute right-0 top-full mt-2 
          bg-[#0d0f14] border border-white/10 rounded-xl shadow-2xl 
          overflow-hidden z-[200]
          ${compact 
            ? "w-[min(240px,calc(100vw-16px))] sm:w-[260px] md:w-[280px]" 
            : "w-[min(256px,calc(100vw-16px))] sm:w-64 md:w-72"
          }
        `}>
          {/* User Info Header */}
          <div className={`
            border-b border-white/10 bg-white/[0.02]
            ${compact ? "px-3 sm:px-4 py-2.5 sm:py-3" : "px-3.5 sm:px-4 py-3 sm:py-3.5"}
          `}>
            <div className="flex items-center gap-2 sm:gap-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "Avatar"}
                  className={`
                    rounded-full object-cover
                    ${compact ? "w-9 h-9 sm:w-10 sm:h-10" : "w-10 h-10 sm:w-11 sm:h-11"}
                  `}
                />
              ) : (
                <div 
                  className={`
                    rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 
                    flex items-center justify-center text-white font-medium
                    ${compact 
                      ? "w-9 h-9 sm:w-10 sm:h-10 text-sm" 
                      : "w-10 h-10 sm:w-11 sm:h-11 text-base"
                    }
                  `}
                >
                  {initials}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className={`
                  font-semibold text-white truncate
                  ${compact ? "text-xs sm:text-sm" : "text-sm"}
                `}>
                  {user.name || "User"}
                </p>
                <p className={`
                  text-gray-500 truncate
                  ${compact ? "text-[10px] sm:text-xs" : "text-xs"}
                `}>
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
  title={item.disabled ? "Coming Soon" : undefined}
  className={`
    w-full flex items-center transition-colors
    ${item.disabled
      ? "opacity-40 cursor-not-allowed text-gray-400"
      : "text-gray-300 hover:text-white cursor-pointer"
    }
    ${compact 
      ? "gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm" 
      : "gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2.5 text-sm"
    }
  `}
>

                <item.icon 
                  className={`
                    text-gray-500 flex-shrink-0
                    ${compact ? "w-3.5 h-3.5 sm:w-4 sm:h-4" : "w-4 h-4"}
                  `} 
                />
                <span className="flex-1 text-left font-medium">{item.label}</span>
                {item.badge && (
                  <span className={`
                    font-semibold bg-teal-500/20 text-teal-400 rounded flex-shrink-0
                    ${compact 
                      ? "px-1.5 py-0.5 text-[9px] sm:text-[10px]" 
                      : "px-2 py-0.5 text-[10px]"
                    }
                  `}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Logout */}
          <div className="border-t border-white/10">
            <button
              onClick={() => {
                signOut({ callbackUrl: "/" });
                setOpen(false);
                setUserMenuOpen(false);
              }}
              className={`
                w-full flex items-center text-red-400 
                hover:text-red-300
                transition-colors cursor-pointer
                ${compact 
                  ? "gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm" 
                  : "gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2.5 text-sm"
                }
              `}
            >
              <LogOut 
                className={`
                  flex-shrink-0
                  ${compact ? "w-3.5 h-3.5 sm:w-4 sm:h-4" : "w-4 h-4"}
                `} 
              />
              <span className="font-medium">Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}