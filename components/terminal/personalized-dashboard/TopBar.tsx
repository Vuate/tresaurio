"use client";

import { useDashboardNotificationStore } from "@/store/dashboardNotificationStore";
import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import AuthModal from "@/components/auth/AuthModal";
import UserMenu from "@/components/auth/UserMenu";

export default function TopBar() {
  const topBarRef = useRef<HTMLDivElement>(null);
  const toggleAddTool = usePersonalizedDashboardStore((s) => s.toggleAddTool);
  const toggleSidebar = usePersonalizedDashboardStore((s) => s.toggleSidebar);
  const resetDashboard = usePersonalizedDashboardStore((s) => s.resetDashboard);
  const toggleTemplates = usePersonalizedDashboardStore((s) => s.toggleTemplates);
  const closeAllPanels = usePersonalizedDashboardStore((s) => s.closeAllPanels);
  const sidebarOpen = usePersonalizedDashboardStore((s) => s.sidebarOpen);
  const addToolOpen = usePersonalizedDashboardStore((s) => s.addToolOpen);
  const templatesOpen = usePersonalizedDashboardStore((s) => s.templatesOpen);
  const setTopBarHeight = usePersonalizedDashboardStore((s) => s.setTopBarHeight);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
   const [confirmReset, setConfirmReset] = useState(false);
  const notify = useDashboardNotificationStore((s) => s.push);

  useEffect(() => {
    const measureHeight = () => {
      if (topBarRef.current) {
        const height = topBarRef.current.getBoundingClientRect().height;
        setTopBarHeight(height);
      }
    };

    measureHeight();
    window.addEventListener("resize", measureHeight);
    return () => window.removeEventListener("resize", measureHeight);
  }, [setTopBarHeight]);

  useEffect(() => {
  if (!confirmReset) return;
  const handleClick = (e: MouseEvent) => {
    const target = e.target as Node;
    const topBar = document.querySelector("[data-topbar]");
    if (topBar?.contains(target)) return;
    setConfirmReset(false);
  };
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") setConfirmReset(false);
  };
  const timer = setTimeout(() => {
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);
  }, 100);
  return () => {
    clearTimeout(timer);
    document.removeEventListener("mousedown", handleClick);
    document.removeEventListener("keydown", handleKeyDown);
  };
}, [confirmReset]);

  return (
    <div
      ref={topBarRef}
      data-topbar
      onMouseDown={(e) => e.preventDefault()}
      className="fixed top-0 left-0 right-0 z-50 
        h-11 sm:h-12 md:h-14
        flex items-center justify-between 
        px-2 sm:px-3 md:px-4 lg:px-6
        bg-[#031A1C]/95 backdrop-blur
        border-b border-white/10 select-none"
    >
      <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center
            min-w-[44px] min-h-[44px]
            w-9 h-9 sm:w-10 sm:h-10 md:w-10 md:h-10
            rounded-lg
            border border-white/10
            bg-[#041F20]/90
            text-teal-300 text-xs sm:text-sm md:text-base
            hover:bg-teal-400/10
            transition cursor-pointer flex-shrink-0"
          title="Back"
        >
          ←
        </button>

        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
          <img
            src="/treasurio.png"
            alt="Treasurio Logo"
            className="h-6 sm:h-7 md:h-8 lg:h-9 w-auto select-none flex-shrink-0"
            draggable={false}
          />
          <span className="text-xs sm:text-sm md:text-base lg:text-lg font-extrabold text-white leading-none whitespace-nowrap">
            Treasurio
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-4 ml-2 sm:ml-3 md:ml-4 lg:ml-6">
<button
  onClick={() => {
    toggleSidebar();
    setConfirmReset(false);
  }}
  className={`px-2 sm:px-2.5 md:px-3 lg:px-4 
    py-1 sm:py-1 md:py-1.5 
    rounded-lg
    border
    text-[9px] sm:text-[10px] md:text-xs lg:text-sm 
    font-semibold
    transition cursor-pointer
    whitespace-nowrap
    ${
      sidebarOpen
        ? "bg-teal-400/20 border-teal-400/40 text-teal-300"
        : "bg-[#041F20]/90 border-white/10 text-teal-300 hover:bg-teal-400/10"
    }`}
>
  Sidebar
</button>

<button
  onClick={() => {
    toggleAddTool();
    setConfirmReset(false);
  }}
  className={`px-2 sm:px-2.5 md:px-3 lg:px-4 
    py-1 sm:py-1 md:py-1.5 
    rounded-lg
    border
    text-[9px] sm:text-[10px] md:text-xs lg:text-sm 
    font-semibold
    transition cursor-pointer
    whitespace-nowrap
    ${
      addToolOpen
        ? "bg-teal-400/30 border-teal-400/50 text-teal-200"
        : "bg-teal-400/10 border-teal-400/30 text-teal-300 hover:bg-teal-400/20"
    }`}
>
  + Add Tool
</button>

<button
  onClick={() => {
    toggleTemplates();
    setConfirmReset(false);
  }}
  className={`px-2 sm:px-2.5 md:px-3 lg:px-4
    py-1 sm:py-1 md:py-1.5
    rounded-lg
    border
    text-[9px] sm:text-[10px] md:text-xs lg:text-sm
    font-semibold
    transition cursor-pointer
    whitespace-nowrap
    ${
      templatesOpen
        ? "bg-teal-400/20 border-teal-400/40 text-teal-300"
        : "bg-[#041F20]/90 border-white/10 text-teal-300 hover:bg-teal-400/10"
    }`}
>
  Templates
</button>



        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 flex-shrink-0">
        {/* Reset Dashboard */}
<div className="relative">
  <button
onClick={(e) => {
  e.stopPropagation();
  if (!confirmReset) {
    setConfirmReset(true);
    closeAllPanels();
    return;
  }
}}
    className={`flex items-center justify-center
      min-w-[44px] min-h-[44px]
      w-9 h-9 sm:w-10 sm:h-10 md:w-10 md:h-10
      rounded-lg border transition cursor-pointer
      ${confirmReset
        ? "bg-red-400/20 border-red-400/40 text-red-300"
        : "bg-[#041F20]/90 border-white/10 text-teal-300 hover:bg-teal-400/10"
      }`}
    title="Reset Dashboard"
  >
            <svg
              className="w-4 h-4 sm:w-[18px] sm:h-[18px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
{confirmReset && (
  <div className="absolute right-0 top-full mt-2 w-64 sm:w-72 max-w-[calc(100vw-32px)] p-2.5 rounded-xl bg-[#041F20]/95 backdrop-blur border border-red-400/30 shadow-lg z-[60]">
    <p className="text-[10px] sm:text-[11px] text-red-300 mb-2">
      Reset dashboard to default? All current modules will be removed.
    </p>
    <div className="flex gap-1.5 sm:gap-2">
<button
  onClick={async (e) => {
    e.stopPropagation();
    await resetDashboard();
    setConfirmReset(false);
    notify({ type: "success", title: "Dashboard Reset", description: "Dashboard has been reset to default." });
  }}
  className="flex-1 px-2 py-1 rounded-lg text-[10px] sm:text-[11px] font-semibold text-red-300 bg-red-400/15 border border-red-400/30 hover:bg-red-400/25 transition cursor-pointer"
>
  Yes, Reset
</button>
      <button
        onClick={() => setConfirmReset(false)}
        className="flex-1 px-2 py-1 rounded-lg text-[10px] sm:text-[11px] font-semibold text-white/40 hover:text-white/70 border border-white/10 transition cursor-pointer"
      >
        Cancel
      </button>
    </div>
  </div>
)}
        </div>

        {status === "loading" ? (

          <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-white/10 animate-pulse" />
        ) : session?.user ? (
          <UserMenu compact />
        ) : (
<button
  onClick={() => {
    setAuthMode("login");
    setShowAuthModal(true);
  }}
  className="group flex items-center gap-1 sm:gap-1.5 md:gap-2 
    px-2 sm:px-2.5 md:px-3 lg:px-5 
    py-1 sm:py-1 md:py-1.5 lg:py-2 
    rounded-lg lg:rounded-xl
    bg-gradient-to-r from-teal-500/20 to-teal-400/10
    border border-teal-400/40
    hover:from-teal-500/30 hover:to-teal-400/20
    hover:border-teal-400/60
    transition-all duration-300 cursor-pointer"
>
  <svg
    className="w-3 h-3 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 text-teal-400 group-hover:text-teal-300 transition-colors flex-shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
    />
  </svg>
  {/* Mobilde gizli, desktop'ta görünür */}
  <span className="hidden md:inline text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-semibold text-teal-300 group-hover:text-teal-200 transition-colors whitespace-nowrap">
    Terminal Login
  </span>
</button>
        )}
      </div>

      <AuthModal
        open={showAuthModal}
        mode={authMode}
        onClose={() => setShowAuthModal(false)}
        onChange={setAuthMode}
      />
    </div>
  );
}