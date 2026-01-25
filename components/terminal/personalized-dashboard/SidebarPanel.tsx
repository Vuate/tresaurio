"use client";

import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function SidebarPanel() {
  const { sidebarOpen, toggleSidebar } =
    usePersonalizedDashboardStore();

  const router = useRouter();
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
  if (!sidebarOpen) return;

  const handleClickOutside = (e: MouseEvent) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(e.target as Node)
    ) {
      toggleSidebar();
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [sidebarOpen, toggleSidebar]);

if (!sidebarOpen) return null;

  return (
<div
  ref={sidebarRef}
  data-ui-panel 
    onWheelCapture={(e) => e.stopPropagation()}   // 🔥 EN KRİTİK SATIR
  onMouseDownCapture={(e) => e.stopPropagation()}
  onPointerDownCapture={(e) => e.stopPropagation()}
  className="
    fixed left-4 top-20 z-40
    w-[260px] max-h-[80vh]
        overflow-hidden
    bg-[#041F20]/95 backdrop-blur
    border border-white/10 rounded-xl
    shadow-[0_12px_40px_rgba(0,0,0,0.45)]
  "
>

      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white">Sidebar</span>
        </div>

        <button
          onClick={toggleSidebar}
          className="text-white/40 hover:text-white transition cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* CONTENT */}
<div
  className="
    p-3 space-y-4
    max-h-[calc(80vh-64px)]
    overflow-y-auto

    [&::-webkit-scrollbar]:w-2
    [&::-webkit-scrollbar-track]:bg-transparent
    [&::-webkit-scrollbar-thumb]:bg-teal-400/40
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-thumb:hover]:bg-teal-400/70

    scrollbar-thin
    scrollbar-thumb-teal-400/40
    scrollbar-track-transparent
  "
  onWheel={(e) => {e.stopPropagation();}}
  onMouseDown={(e) => e.stopPropagation()}
  onPointerDownCapture={(e) => e.stopPropagation()}
>

        {/* TOP NAV */}
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
            title="Dashboard"
            active={pathname === "/terminal/dashboard"}
            onClick={() => router.push("/terminal/dashboard")}
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

/* ---------------- SUB COMPONENTS ---------------- */

function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="px-2 text-[10px] tracking-widest font-bold text-white/40">
        {title}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function SidebarItem({
  title,
  onClick,
  active,
}: {
  title: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left rounded-lg
        px-3 py-2
        text-[13px]
        transition
        border
        cursor-pointer
        ${
          active
            ? "bg-teal-400/15 border-teal-400/40 text-teal-300"
            : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
        }
      `}
    >
      {title}
    </button>
  );
}

