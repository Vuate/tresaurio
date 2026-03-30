"use client";

import { useDashboardNotificationStore } from "@/store/dashboardNotificationStore";
import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, PanelLeft, Plus, LayoutTemplate } from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";
import UserMenu from "@/components/auth/UserMenu";

export default function TopBar() {
  const topBarRef = useRef<HTMLDivElement>(null);
const toggleAddTool = usePersonalizedDashboardStore((s) => s.toggleAddTool);
  const uiBlocked = usePersonalizedDashboardStore((s) => s.uiBlocked);
  const setUIBlocked = usePersonalizedDashboardStore((s) => s.setUIBlocked);
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
  const [confirmLock, setConfirmLock] = useState(false);
  const [showLockAuth, setShowLockAuth] = useState(false);
const notify = useDashboardNotificationStore((s) => s.push);

  const closeEverything = () => {
    closeAllPanels();
    setConfirmReset(false);
    setConfirmLock(false);
    setShowLockAuth(false);
  };

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
  if (!confirmReset && !confirmLock && !showLockAuth) return;
  const handleClick = (e: MouseEvent) => {
    const target = e.target as Node;
    const topBar = document.querySelector("[data-topbar]");
    if (topBar?.contains(target)) return;
    setConfirmReset(false);
    setConfirmLock(false);
    setShowLockAuth(false);
  };
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setConfirmReset(false);
      setConfirmLock(false);
      setShowLockAuth(false);
    }
  };
const handleTouchClose = (e: TouchEvent) => {
  if (e.touches.length > 1) return;
  const target = e.target as Node;
  const topBar = document.querySelector("[data-topbar]");
  if (topBar?.contains(target)) return;
  setConfirmReset(false);
  setConfirmLock(false);
  setShowLockAuth(false);
};
const timer = setTimeout(() => {
  document.addEventListener("mousedown", handleClick);
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("touchstart", handleTouchClose);
}, 100);
return () => {
  clearTimeout(timer);
  document.removeEventListener("mousedown", handleClick);
  document.removeEventListener("keydown", handleKeyDown);
  document.removeEventListener("touchstart", handleTouchClose);
};
}, [confirmReset, confirmLock, showLockAuth]);


  return (
    <div
      ref={topBarRef}
      data-topbar
      onMouseDown={(e) => e.preventDefault()}
      className="fixed top-0 left-0 right-0 z-50
        h-11 sm:h-12 md:h-14
        flex items-center justify-between
        px-2 sm:px-3 md:px-4 lg:px-6
bg-[#080A10] backdrop-blur-md
border-b border-white/[0.07] shadow-[0_1px_0_rgba(255,255,255,0.04),0_4px_24px_rgba(0,0,0,0.65)]

select-none"

    >
      <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-4">
<button
  onClick={() => { if (uiBlocked) return; router.back(); }}
  className="flex items-center justify-center
            w-8 h-8 sm:w-10 sm:h-10 md:w-10 md:h-10
            rounded-lg
          text-white/50
          hover:bg-white/[0.06] hover:text-white/90
            transition cursor-pointer shrink-0"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
          <img
            src="/treasurio.png"
            alt="Treasurio Logo"
            className="h-8 sm:h-9 md:h-10 lg:h-9 w-auto select-none shrink-0"
            draggable={false}
          />
<span className="hidden lg:inline text-xs sm:text-sm md:text-base lg:text-lg font-extrabold text-white leading-none whitespace-nowrap">
            Treasurio
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2.5 md:gap-3 lg:gap-4 ml-2 sm:ml-3 md:ml-4 lg:ml-6">
{/* Sidebar button — icon only on mobile, icon+text on sm+ */}
<button
onClick={() => {
    if (uiBlocked) return;
    const wasOpen = sidebarOpen;
    closeEverything();
    if (!wasOpen) toggleSidebar();
  }}
  disabled={uiBlocked}
  title="Sidebar"
  className={`flex items-center justify-center gap-1.5
    px-2 sm:px-2.5 md:px-3 lg:px-4
    py-1 sm:py-1 md:py-1.5
    min-w-0
    rounded-lg
    text-[9px] sm:text-[10px] md:text-xs lg:text-sm
    font-semibold
    transition cursor-pointer
    whitespace-nowrap
    ${sidebarOpen
      ? "bg-[#1A73E8] text-white"
      : "text-white/55 hover:bg-white/6 hover:text-white/90"
    }
    `}
>
  <PanelLeft className="w-3.5 h-3.5 shrink-0 lg:hidden" />
  <span className="hidden lg:inline">Sidebar</span>
</button>

{/* Add Tool button — icon only on mobile, icon+text on sm+ */}
<button
onClick={() => {
    if (uiBlocked) return;
    const wasOpen = addToolOpen;
    closeEverything();
    if (!wasOpen) toggleAddTool();
  }}
  disabled={uiBlocked}
  title="Add Tool"
  className={`flex items-center justify-center gap-1.5
    px-2 sm:px-2.5 md:px-3 lg:px-4
    py-1 sm:py-1 md:py-1.5
    min-w-0
    rounded-lg
    text-[9px] sm:text-[10px] md:text-xs lg:text-sm
    font-semibold
    transition cursor-pointer
    whitespace-nowrap
    ${
      addToolOpen
        ? "bg-[#1A73E8] text-white"
        : "text-white/55 hover:bg-white/6 hover:text-white/90"
    }`}
>
  <Plus className="w-3.5 h-3.5 shrink-0 lg:hidden" />
  <span className="hidden lg:inline">+ Add Tool</span>
</button>

{/* Templates button — icon only on mobile, icon+text on sm+ */}
<button
onClick={() => {
    if (uiBlocked) return;
    const wasOpen = templatesOpen;
    closeEverything();
    if (!wasOpen) toggleTemplates();
  }}
  disabled={uiBlocked}
  title="Templates"
  className={`flex items-center justify-center gap-1.5
    px-2 sm:px-2.5 md:px-3 lg:px-4
    py-1 sm:py-1 md:py-1.5
    min-w-0
    rounded-lg
    text-[9px] sm:text-[10px] md:text-xs lg:text-sm
    font-semibold
    transition cursor-pointer
    whitespace-nowrap
    ${
      templatesOpen
        ? "bg-[#1A73E8] text-white"
        : "text-white/55 hover:bg-white/6 hover:text-white/90"
    }`}
>
  <LayoutTemplate className="w-3.5 h-3.5 shrink-0 lg:hidden" />
  <span className="hidden lg:inline">Templates</span>
</button>

        </div>
      </div>


      <div className="flex items-center gap-0.5 sm:gap-2.5 md:gap-3 shrink-0">

        {/* Lock Dashboard */}
<div className="relative">
  <button
onClick={(e) => {
      e.stopPropagation();

      if (uiBlocked) {
        closeEverything();
        setUIBlocked(false);
        closeAllPanels();
        notify({ type: "success", title: "Dashboard Unlocked", description: "Layout is unlocked." });
        return;
      }

      if (!session?.user) {
        const wasOpen = showLockAuth;
        closeEverything();
        if (!wasOpen) setShowLockAuth(true);
        return;
      }

      // Confirmation toggle
      const wasOpen = confirmLock;
      closeEverything();
      if (!wasOpen) setConfirmLock(true);

    }}
    className={`flex items-center justify-center
      w-8 h-auto py-1.5 px-2 lg:w-10 lg:h-10 lg:py-0 lg:px-0
      rounded-lg border transition cursor-pointer
      ${uiBlocked
        ? "bg-amber-400/25 border-amber-400/50 text-amber-300"
        : confirmLock
          ? "bg-[#1A73E8] border-transparent text-white"
          : "border-transparent text-white/45 hover:bg-white/6 hover:text-white/90"
      }`}
    title={uiBlocked ? "Unlock Dashboard" : "Lock Dashboard"}
  >
    <svg
      className="w-3.5 h-3.5 lg:w-4.5 lg:h-4.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      {uiBlocked ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
      )}
    </svg>
  </button>

  {showLockAuth && (
    <div className="absolute right-0 top-full mt-3 w-64 sm:w-72 max-w-[calc(100vw-32px)] p-3.5 rounded-xl bg-[#0C0E12] border border-[#1A73E8]/35 shadow-lg z-[60]">
      <p className="text-[11px] sm:text-[12px] text-white/80 mb-3">
        Sign in to use dashboard lock.
      </p>
      <button
        onClick={() => setShowLockAuth(false)}
        className="w-full px-2 py-1 rounded-lg text-[11px] sm:text-[12px] font-semibold text-white bg-[#1A73E8] hover:bg-[#1A73E8]/85 transition cursor-pointer"
      >
        OK
      </button>
    </div>
  )}

  {confirmLock && (
    <div className="absolute right-0 top-full mt-3 w-64 sm:w-72 max-w-[calc(100vw-32px)] p-3.5 rounded-xl bg-[#0C0E12] border border-[#1A73E8]/35 shadow-lg z-[60]">
      <p className="text-[11px] sm:text-[12px] text-white/80 mb-3">
        Lock dashboard?
      </p>
      <div className="flex gap-1.5 sm:gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setUIBlocked(true);
            setConfirmLock(false);
            closeAllPanels();
            notify({ type: "success", title: "Dashboard Locked", description: "Layout is locked." });
          }}
        className="flex-1 px-2 py-1 rounded-lg text-[11px] sm:text-[12px] font-semibold text-white bg-[#1A73E8] hover:bg-[#1A73E8]/85 transition cursor-pointer"
        >
          Yes, Lock
        </button>
        <button
          onClick={() => setConfirmLock(false)}
          className="flex-1 px-2 py-1 rounded-lg text-[11px] sm:text-[12px] font-semibold text-white hover:text-white/70 border border-white/10 transition cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  )}
</div>


<div className="relative">
  <button
onClick={(e) => {
  e.stopPropagation();
  if (uiBlocked) return;
  const wasOpen = confirmReset;
  closeEverything();
  if (!wasOpen) setConfirmReset(true);
}}


    className={`flex items-center justify-center
      w-8 h-auto py-1.5 px-2 lg:w-10 lg:h-10 lg:py-0 lg:px-0
      rounded-lg border transition cursor-pointer
      ${confirmReset
        ? "bg-[#1A73E8] border-transparent text-white"
        : "border-transparent text-white/45 hover:bg-white/6 hover:text-white/90"
      }`}
    title="Reset Dashboard"
  >
            <svg
              className="w-3.5 h-3.5 lg:w-4.5 lg:h-4.5"
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
  <div className="absolute right-0 top-full mt-3 w-64 sm:w-72 max-w-[calc(100vw-32px)] p-3.5 rounded-xl bg-[#0C0E12] border border-[#1A73E8]/35 shadow-lg z-[60]">
    <p className="text-[11px] sm:text-[12px] text-white/80 mb-3">
      Reset dashboard to default? All current modules will be removed.
    </p>
    <div className="flex gap-1.5 sm:gap-2">
<button
  onClick={async (e) => {
    e.stopPropagation();
    await resetDashboard();
    setConfirmReset(false);
  }}
    className="flex-1 px-2 py-1 rounded-lg text-[11px] sm:text-[12px] font-semibold text-white bg-[#1A73E8] hover:bg-[#1A73E8]/85 transition cursor-pointer">
  Yes, Reset
</button>
      <button
        onClick={() => setConfirmReset(false)}
        className="flex-1 px-2 py-1 rounded-lg text-[11px] sm:text-[12px] font-semibold text-white hover:text-white/70 border border-white/10 transition cursor-pointer"
      >
        Cancel
      </button>
    </div>
  </div>
)}
        </div>

        {status === "loading" ? (

          <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-white/10 animate-pulse ml-1.5 lg:ml-0" />
) : session?.user ? (
   <div className="relative ml-1.5 lg:ml-0" onClick={() => { setConfirmReset(false); setConfirmLock(false); setShowLockAuth(false); }}>
       {uiBlocked && <div className="absolute inset-0 z-50 cursor-pointer" />}
       <UserMenu compact />
   </div>
) : (
<button
  onClick={() => {
    closeEverything();
    setAuthMode("login");
    setShowAuthModal(true);
  }}
  className="group flex items-center gap-1 sm:gap-1.5 md:gap-2
    ml-1.5 lg:ml-0
    px-2 sm:px-2.5 md:px-3 lg:px-4
    py-1 sm:py-1 md:py-1.5
    rounded-lg
    border border-transparent
    text-white/55 hover:bg-white/6 hover:text-white/90
    transition cursor-pointer"
>
  <svg
    className="w-3.5 h-3.5 lg:w-4.5 lg:h-4.5 shrink-0"

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
    <span className="hidden md:inline text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-semibold whitespace-nowrap">
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