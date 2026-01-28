"use client";

import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react"; 

export default function TopBar() {
  const topBarRef = useRef<HTMLDivElement>(null);
  const toggleAddTool = usePersonalizedDashboardStore((s) => s.toggleAddTool);
  const toggleSidebar = usePersonalizedDashboardStore((s) => s.toggleSidebar);
  const setTopBarHeight = usePersonalizedDashboardStore((s) => s.setTopBarHeight); 
  const router = useRouter();

  /* Yükseklik ölçümü */
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

  
  return (
    <div
      ref={topBarRef} 
      onMouseDown={(e) => e.preventDefault()}
      className="fixed top-0 left-0 right-0 z-50 h-14
        flex items-center justify-between px-6
        bg-[#031A1C]/95 backdrop-blur
        border-b border-white/10 select-none"
    >
      {/* SOL TARAF */}
      <div className="flex items-center gap-3">
        {/* BACK BUTTON */}
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center
            w-9 h-9 rounded-lg
            border border-white/10
            bg-[#041F20]/90
            text-teal-300
            hover:bg-teal-400/10
            transition"
          title="Geri"
        >
          ←
        </button>

        {/* LOGO + TEXT */}
        <div className="flex items-center gap-2">
          <img
            src="/treasurio.png"
            alt="Treasurio Logo"
            className="h-9 w-auto select-none"
            draggable={false}
          />
          <span className="text-lg font-extrabold text-teal-400 leading-none">
            Treasurio
          </span>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-3 ml-4">
          <button
            onClick={toggleSidebar}
            className="px-4 py-1.5 rounded-lg
              bg-[#041F20]/90
              border border-white/10
              text-teal-300 text-sm font-semibold
              hover:bg-teal-400/10 transition cursor-pointer"
          >
            Sidebar
          </button>

          <button
            onClick={toggleAddTool}
            className="px-4 py-1.5 rounded-lg
              bg-teal-400/10 border border-teal-400/30
              text-teal-300 text-sm font-semibold
              hover:bg-teal-400/20 transition cursor-pointer"
          >
            + Add Tool
          </button>
        </div>
      </div>

      {/* SAĞ TARAF */}
      <div />
    </div>
  );
}