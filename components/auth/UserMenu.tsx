"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  User,
  Settings,
  Wallet,
  History,
  LogOut,
  ChevronDown,
} from "lucide-react";

export default function UserMenu() {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
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
    {
      icon: User,
      label: "Profil",
      onClick: () => router.push("/profile"),
    },
    {
      icon: Wallet,
      label: "Bakiye",
      onClick: () => router.push("/terminal/home"),
      badge: "Demo",
    },
    {
      icon: History,
      label: "Son Emirler",
      onClick: () => router.push("/terminal/home"),
    },
    {
      icon: Settings,
      label: "Ayarlar",
      onClick: () => router.push("/settings"),
    },
  ];

  return (
    <div ref={menuRef} className="relative">
      {/* Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || "Avatar"}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-sm font-medium">
            {initials}
          </div>
        )}
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-[#0d0f14] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "Avatar"}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-medium">
                  {initials}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.name || "Kullanıcı"}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {menuItems.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  item.onClick();
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
              >
                <item.icon className="w-4 h-4 text-gray-500" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-medium bg-teal-500/20 text-teal-400 rounded">
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
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
