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

    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
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
      className="fixed left-4 z-40 w-[260px] xl:w-[280px] 2xl:w-[320px] overflow-hidden bg-[#041F20]/95 backdrop-blur border border-white/10 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.45)] cursor-default"
    >
      <div 
        ref={headerRef}
        className="flex items-center justify-between px-4 py-4 border-b border-white/10 bg-[#041F20]/95"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm xl:text-[15px] 2xl:text-base font-bold text-white">Sidebar</span>
        </div>
      </div>

<div
  style={{
    maxHeight: `calc(${availableHeight}px - ${headerHeight}px)`,
  }}
  className="p-3 space-y-4 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-teal-400/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:cursor-pointer [&::-webkit-scrollbar-thumb:hover]:bg-teal-400/70 scrollbar-thin scrollbar-thumb-teal-400/40 scrollbar-track-transparent"
  onWheel={(e) => {e.stopPropagation();}}
>
        <div className="space-y-1">
          <SidebarItem
            title="Personalized Dashboard"
            active={pathname === "/personalized-dashboard"}
            onClick={() => router.push("/personalized-dashboard")}
          />
          <SidebarItem
            title="Home"
            active={pathname === "/terminal/home"}
            onClick={() => router.push("/terminal/home")}
          />
          <SidebarItem
            title="Trade & Portfolio"
            active={pathname === "/terminal/trade"}
            onClick={() => router.push("/terminal/trade")}
          />
        </div>

        {/* INSIGHTS */}
        <SidebarSection title="INSIGHTS">
          <SidebarItem
            title="News"
            active={pathname === "/terminal/news"}
            onClick={() => router.push("/terminal/news")}
          />
          <SidebarItem
            title="Staking"
            active={pathname === "/terminal/staking"}
            onClick={() => router.push("/terminal/staking")}
          />
          <SidebarItem
            title="Wallet Tracker"
            active={pathname === "/terminal/wallet"}
            onClick={() => router.push("/terminal/wallet")}
          />
        </SidebarSection>

        {/* ADVANCED */}
        <SidebarSection title="ADVANCED">
          <SidebarItem
            title="Market Microstructure"
            active={pathname === "/terminal/market-intelligence"}
            onClick={() => router.push("/terminal/market-intelligence")}
          />
          <SidebarItem
            title="Transfer"
            active={pathname === "/terminal/transfer"}
            onClick={() => router.push("/terminal/transfer")}
          />
          <SidebarItem
            title="Reporting"
            active={pathname === "/terminal/reporting"}
            onClick={() => router.push("/terminal/reporting")}
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
      <div className="px-2 text-[10px] xl:text-[10.5px] 2xl:text-[11px] tracking-widest font-bold text-white/40">
        {title}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function SidebarItem({ title, onClick, active }: { title: string; onClick: () => void; active?: boolean; }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-lg px-3 py-2 text-[13px] xl:text-[13.5px] 2xl:text-sm transition border cursor-pointer ${active ? "bg-teal-400/15 border-teal-400/40 text-teal-300" : "bg-white/5 border-white/10 text-white/80 hover:bg-teal-400/10"}`}
    >
      {title}
    </button>
  );
}