"use client";

import { useDashboardNotificationStore } from "@/store/dashboardNotificationStore";
import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
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
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
const [confirmReset, setConfirmReset] = useState(false);
  const [confirmLock, setConfirmLock] = useState(false);
  const [showLockAuth, setShowLockAuth] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
const notify = useDashboardNotificationStore((s) => s.push);

  const closeEverything = () => {
    closeAllPanels();
    setConfirmReset(false);
    setConfirmLock(false);
    setShowLockAuth(false);
    setSettingsOpen(false);
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
  if (!confirmReset && !confirmLock && !showLockAuth && !settingsOpen) return;
  const handleClick = (e: MouseEvent) => {
    const target = e.target as Node;
    const topBar = document.querySelector("[data-topbar]");
    if (topBar?.contains(target)) return;
    setConfirmReset(false);
    setConfirmLock(false);
    setShowLockAuth(false);
    setSettingsOpen(false);
  };
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setConfirmReset(false);
      setConfirmLock(false);
      setShowLockAuth(false);
      setSettingsOpen(false);
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
  setSettingsOpen(false);
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
}, [confirmReset, confirmLock, showLockAuth, settingsOpen]);


  return (
    <div
      ref={topBarRef}
      data-topbar
      onMouseDown={(e) => e.preventDefault()}
      className="fixed top-0 left-0 right-0 z-50
        h-11 sm:h-12 md:h-14
        flex items-center justify-between
        px-2 sm:px-3 md:px-4 lg:px-6
bg-background backdrop-blur-md
border-b border-border shadow-[0_1px_0_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_1px_0_rgba(255,255,255,0.04),0_4px_24px_rgba(0,0,0,0.65)]

select-none"

    >
      <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-4">
<button
  onClick={() => { if (uiBlocked) return; router.back(); }}
  className="flex items-center justify-center
            w-8 h-8 sm:w-10 sm:h-10 md:w-10 md:h-10
            rounded-lg
          text-foreground/50
          hover:bg-foreground/6 hover:text-foreground/90
            transition cursor-pointer shrink-0"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
          <img
            src="/treasurio.png"
            alt="Treasurio Logo"
            className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 lg:h-9 lg:w-auto object-contain select-none shrink-0"
            draggable={false}
          />
          <span className="hidden md:inline text-lg font-extrabold text-foreground leading-none whitespace-nowrap">
            Treasurio
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2.5 md:gap-3 lg:gap-4 sm:ml-2 md:ml-4 lg:ml-6">
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
      : "text-foreground/55 hover:bg-foreground/6 hover:text-foreground/90"
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
        : "text-foreground/55 hover:bg-foreground/6 hover:text-foreground/90"
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
        : "text-foreground/55 hover:bg-foreground/6 hover:text-foreground/90"
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
          : "border-transparent text-foreground/45 hover:bg-foreground/6 hover:text-foreground/90"
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
    <div className="fixed top-13 sm:top-14 md:top-16 right-2 sm:right-3 md:right-4 lg:absolute lg:top-full lg:right-0 lg:mt-3 w-72 max-w-[calc(100vw-16px)] p-3.5 rounded-xl bg-card border border-[#1A73E8]/35 shadow-lg z-60">
      <p className="text-[11px] sm:text-[12px] text-foreground/80">
        <button
          onClick={() => { setShowLockAuth(false); setAuthMode("login"); setShowAuthModal(true); }}
          className="text-[#2563EB] underline cursor-pointer font-medium"
        >
          Sign in
        </button>
        {" "}to use dashboard lock.
      </p>
    </div>
  )}

  {confirmLock && (
    <div className="fixed top-13 sm:top-14 md:top-16 right-2 sm:right-3 md:right-4 lg:absolute lg:top-full lg:right-0 lg:mt-3 w-72 max-w-[calc(100vw-16px)] p-3.5 rounded-xl bg-card border border-[#1A73E8]/35 shadow-lg z-60">
      <p className="text-[11px] sm:text-[12px] text-foreground/80 mb-3">
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
          className="flex-1 px-2 py-1 rounded-lg text-[11px] sm:text-[12px] font-semibold text-foreground/70 hover:text-foreground/50 border border-border transition cursor-pointer"
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
        : "border-transparent text-foreground/45 hover:bg-foreground/6 hover:text-foreground/90"
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
  <div className="fixed top-13 sm:top-14 md:top-16 right-2 sm:right-3 md:right-4 lg:absolute lg:top-full lg:right-0 lg:mt-3 w-72 max-w-[calc(100vw-16px)] p-3.5 rounded-xl bg-card border border-[#1A73E8]/35 shadow-lg z-60">
    <p className="text-[11px] sm:text-[12px] text-foreground/80 mb-3">
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
        className="flex-1 px-2 py-1 rounded-lg text-[11px] sm:text-[12px] font-semibold text-foreground/70 hover:text-foreground/50 border border-border transition cursor-pointer"
      >
        Cancel
      </button>
    </div>
  </div>
)}
        </div>

        {/* Settings gear — always visible for all users */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              const wasOpen = settingsOpen;
              closeEverything();
              setSettingsOpen(!wasOpen);
            }}
            className={`flex items-center justify-center w-8 h-auto py-1.5 px-2 lg:w-10 lg:h-10 lg:py-0 lg:px-0 rounded-lg border transition cursor-pointer ${
              settingsOpen
                ? "bg-[#1A73E8] border-transparent text-white"
                : "border-transparent text-foreground/45 hover:bg-foreground/6 hover:text-foreground/90"
            }`}
            title="Settings"
          >
            <svg className="w-3.5 h-3.5 lg:w-4.5 lg:h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {settingsOpen && (
            <div className="fixed top-13 sm:top-14 md:top-16 right-2 sm:right-3 md:right-4 lg:absolute lg:top-full lg:right-0 lg:mt-3 w-72 max-w-[calc(100vw-16px)] p-3.5 rounded-xl bg-card border border-[#1A73E8]/35 shadow-lg z-60">
              <div className="flex gap-1 mb-2.5">
                {[
                  { src: "/flag-tr.svg", label: "Türkçe" },
                  { src: "/flag-us.svg", label: "English" },
                ].map(({ src, label }) => (
                  <button
                    key={label}
                    disabled
                    className="flex-1 flex items-center justify-center gap-2 px-2.5 py-2 rounded-lg bg-foreground/5 border border-border cursor-not-allowed opacity-60"
                  >
                    <img src={src} alt={label} className="w-5 h-auto rounded-sm shrink-0" />
                    <span className="text-[0.78rem] font-medium text-foreground/60">{label}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-1">
                {([
                  { label: "Light", t: "light" },
                  { label: "Dark",  t: "dark"  },
                  { label: "System",t: "system"},
                ] as const).map(({ label, t }) => {
                  const isActive = mounted && theme === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`flex-1 py-1.5 rounded-lg text-[0.7rem] font-semibold cursor-pointer transition ${
                        isActive
                          ? "bg-[#1A73E8]/20 text-[#1A73E8] border border-[#1A73E8]/50"
                          : "text-foreground/55 border border-border hover:bg-[#1A73E8]/10 hover:text-[#1A73E8]/80 hover:border-[#1A73E8]/30"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {status === "loading" ? (
          <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-foreground/10 animate-pulse ml-1.5 lg:ml-0" />
        ) : session?.user ? (
          <div className="relative ml-1.5 lg:ml-0" onClick={() => { setConfirmReset(false); setConfirmLock(false); setShowLockAuth(false); setSettingsOpen(false); }}>
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
            className="flex items-center justify-center gap-1
              ml-1 lg:ml-0
              px-2 lg:px-4
              py-1 lg:py-1.5
              rounded-lg border border-transparent
              text-foreground/55 hover:bg-foreground/6 hover:text-foreground/90
              transition cursor-pointer"
            title="Login"
          >
            <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <span className="hidden lg:inline text-sm font-semibold whitespace-nowrap">Sign in</span>
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