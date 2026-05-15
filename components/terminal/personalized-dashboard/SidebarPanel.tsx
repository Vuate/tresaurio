"use client";

import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function SidebarPanel() {
  const { 
    sidebarOpen, 
    toggleSidebar,
    topBarHeight,    
    notesBarHeight,    
    notesOpen,  
  } = usePersonalizedDashboardStore();

  const router = useRouter();
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const [headerHeight, setHeaderHeight] = useState(64);

  const effectiveNotesHeight = notesOpen ? notesBarHeight : (
    typeof window !== 'undefined' 
      ? (window.innerWidth >= 1536 ? 56 : window.innerWidth >= 1280 ? 52 : 48)
      : 48
  );

  const [availableHeight, setAvailableHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      setAvailableHeight(window.innerHeight - topBarHeight - effectiveNotesHeight - 32);
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [topBarHeight, effectiveNotesHeight]);

  useEffect(() => {
    if (sidebarOpen && headerRef.current) {
      const height = headerRef.current.getBoundingClientRect().height;
      setHeaderHeight(height);
    }
  }, [sidebarOpen]);
    
  useEffect(() => {
    if (!sidebarOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      
      if (sidebarRef.current?.contains(target)) return;
      
      const topBar = document.querySelector('[data-topbar]');
      if (topBar?.contains(target)) return;
      
      toggleSidebar();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        toggleSidebar();
      }
    };

const handleTouchOutside = (e: TouchEvent) => {
  if (e.touches.length > 1) return;
  const target = e.target as Node;
  if (sidebarRef.current?.contains(target)) return;
  const topBar = document.querySelector('[data-topbar]');
  if (topBar?.contains(target)) return;
  toggleSidebar();
};
const timer = setTimeout(() => {
  document.addEventListener("mousedown", handleClickOutside);
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("touchstart", handleTouchOutside);
}, 100);
return () => {
  clearTimeout(timer);
  document.removeEventListener("mousedown", handleClickOutside);
  document.removeEventListener("keydown", handleKeyDown);
  document.removeEventListener("touchstart", handleTouchOutside);
};
  }, [sidebarOpen, toggleSidebar]);

  if (!sidebarOpen) return null;

  return (
    <div
      ref={sidebarRef}
      data-ui-panel 
      onWheelCapture={(e) => e.stopPropagation()}
      style={{
        top: topBarHeight + 16,
        maxHeight: availableHeight
      }}
className="fixed left-4 z-40 w-[260px] xl:w-[280px] 2xl:w-[320px] bg-card border border-border rounded-xl shadow-[0_12px_48px_rgba(0,0,0,0.6)] overflow-hidden select-none"
    >

      <div
        ref={headerRef}
className="flex items-center justify-between px-3 py-3 border-b border-border select-none bg-card relative z-10"
      >
        <div className="flex items-center gap-2">
<div className="text-[13px] xl:text-[13.5px] 2xl:text-sm font-semibold text-foreground">Sidebar</div>
        </div>
      </div>

<div
  style={{
    maxHeight: `calc(${availableHeight}px - ${headerHeight}px)`,
  }}
className="p-3 space-y-4 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-foreground/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:cursor-pointer [&::-webkit-scrollbar-thumb:hover]:bg-foreground/60 scrollbar-thin scrollbar-thumb-foreground/40 scrollbar-track-transparent [scrollbar-color:rgba(0,0,0,0.5)_transparent] dark:[scrollbar-color:rgba(255,255,255,0.5)_transparent]"
  onWheel={(e) => {e.stopPropagation();}}
>
        <div className="space-y-1">
          <SidebarItem
            title="Home"
            active={pathname === "/terminal/home"}
            onClick={() => router.push("/terminal/home")}
          />
        </div>

        {/* TRADE */}
        <SidebarSection title="TRADE">
          <SidebarItem
            title="Trade & Portfolio"
            active={pathname === "/terminal/trade"}
            onClick={() => router.push("/terminal/trade")}
          />
          <SidebarItem
            title="Transfer"
            soon
            active={false}
            onClick={() => {}}
          />
          <SidebarItem
            title="Staking"
            active={pathname === "/terminal/staking"}
            onClick={() => router.push("/terminal/staking")}
          />
        </SidebarSection>

        {/* ANALYTICS */}
        <SidebarSection title="ANALYTICS">
          <SidebarItem
            title="News"
            active={pathname === "/terminal/news"}
            onClick={() => router.push("/terminal/news")}
          />
          <SidebarItem
            title="Wallet Tracker"
            active={pathname === "/terminal/wallet"}
            onClick={() => router.push("/terminal/wallet")}
          />
          <SidebarItem
            title="Market Intelligence"
            active={pathname === "/terminal/market-intelligence"}
            onClick={() => router.push("/terminal/market-intelligence")}
          />
          <SidebarItem
            title="Reporting"
            active={pathname === "/terminal/reporting"}
            onClick={() => router.push("/terminal/reporting")}
          />
        </SidebarSection>

        {/* SETTINGS */}
        <SidebarSection title="SETTINGS">
          <SidebarItem
            title="API Keys"
            soon
            active={false}
            onClick={() => {}}
          />
        </SidebarSection>

      </div>
    </div>
  );
}

/* SUB COMPONENTS */
function SidebarSection({ title, children }: { title: string; children: React.ReactNode; }) {
  return (
    <div className="space-y-2">
      <div className="px-1 py-1 text-[10px] xl:text-[10.5px] 2xl:text-[11px] uppercase text-muted-foreground font-bold tracking-wider">
        {title}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function SidebarItem({ title, onClick, active, soon }: { title: string; onClick: () => void; active?: boolean; soon?: boolean; }) {
  return (
<button
  onClick={soon ? undefined : onClick}
  disabled={soon}
  className={`w-full text-left rounded-lg px-3 py-2.5 text-[13px] xl:text-[13.5px] 2xl:text-sm transition border flex items-center justify-between ${
    soon
      ? "bg-foreground/3 border-border text-muted-foreground opacity-50 cursor-not-allowed"
      : active
        ? "bg-[#1A73E8]/15 border-[#1A73E8]/35 text-foreground cursor-pointer"
        : "bg-foreground/3 border-border text-foreground hover:bg-[#1A73E8]/10 hover:border-[#1A73E8]/25 cursor-pointer"
  }`}
>
  <span>{title}</span>
  {soon && (
    <span className="text-[10px] xl:text-[10.5px] 2xl:text-[11px] font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">
      Coming Soon
    </span>
  )}
</button>
  );
}