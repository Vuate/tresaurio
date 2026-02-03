"use client";

import { moduleRegistry } from "@/lib/personalized-dashboard/moduleRegistry";
import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";
import type { ModuleCategory } from "@/lib/personalized-dashboard/types";
import type { ModuleDefinition } from "@/lib/personalized-dashboard/moduleRegistry";
import { useDashboardNotificationStore } from "@/store/dashboardNotificationStore";
import { useEffect, useRef, useState } from "react";

export default function AddToolPanel() {
  const {
    addToolOpen,
    toggleAddTool,
    addModuleByType,
    panX,
    panY,
    zoom,
    topBarHeight,  
    notesBarHeight, 
    notesOpen,  
  } = usePersonalizedDashboardStore();
  
  const panelRef = useRef<HTMLDivElement>(null); 
  const headerRef = useRef<HTMLDivElement>(null); // 🔥 EKLE
  
  const [headerHeight, setHeaderHeight] = useState(56); // 🔥 EKLE

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

  // 🔥 HEADER HEIGHT ÖLÇÜMÜ
  useEffect(() => {
    if (addToolOpen && headerRef.current) {
      const height = headerRef.current.getBoundingClientRect().height;
      setHeaderHeight(height);
    }
  }, [addToolOpen]);

  useEffect(() => {
    if (!addToolOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        toggleAddTool();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        toggleAddTool();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [addToolOpen, toggleAddTool]);

  if (!addToolOpen) return null;

  const grouped = Object.values(moduleRegistry).reduce((acc, mod) => {
    const category = mod.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(mod);
    return acc;
  }, {} as Record<ModuleCategory, ModuleDefinition[]>);

  const addAtCurrentView = (type: string) => {
    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;

    const canvasX = (viewportCenterX - panX) / zoom;
    const canvasY = (viewportCenterY - panY) / zoom;

    addModuleByType(type, canvasX, canvasY);
    useDashboardNotificationStore.getState().push({
      type: "success",
      title: "Tool Added",
      description: `${type} added to dashboard`,
    });

    toggleAddTool();
  };

  return (
    <div
      ref={panelRef}
      style={{
        top: topBarHeight + 16,
        maxHeight: availableHeight
      }}
      className="fixed left-4 z-40 w-[260px] xl:w-[280px] 2xl:w-[320px] bg-[#041F20]/95 backdrop-blur border border-white/10 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.45)] overflow-hidden select-none"
    >
      {/* HEADER */}
      <div 
        ref={headerRef} // 🔥 EKLE
        className="flex items-center justify-between px-3 py-3 border-b border-white/10 select-none bg-[#041F20]/95"
      >
        <div className="text-[13px] xl:text-[13.5px] 2xl:text-sm font-semibold text-white">Add Tool</div>
        <button
          onClick={toggleAddTool}
          className="text-white/50 hover:text-white transition cursor-pointer xl:text-lg 2xl:text-xl"
        >
          ✕
        </button>
      </div>

      {/* CONTENT */}
      <div
        style={{
          height: `calc(${availableHeight}px - ${headerHeight}px)`, // ✅ DİNAMİK
        }}
        className="p-3 space-y-4 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-teal-400/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-teal-400/70 scrollbar-thin scrollbar-thumb-teal-400/40 scrollbar-track-transparent"
        onWheel={(e) => {
          e.stopPropagation();
        }}
      >
        {Object.entries(grouped).map(([category, mods]) => (
          <div key={category}>
            <div className="px-1 py-1 text-[10px] xl:text-[10.5px] 2xl:text-[11px] uppercase text-white/40 font-bold">
              {category.replace("-", " ")}
            </div>

            <div className="space-y-1">
              {mods.map((m) => (
                <button
                  key={m.type}
                  onClick={() => addAtCurrentView(m.type)}
                  className="w-full text-left rounded-lg px-3 py-2 bg-white/5 hover:bg-teal-400/10 border border-white/10 transition cursor-pointer"
                >
                  <div className="text-[13px] xl:text-[13.5px] 2xl:text-sm font-semibold text-white">
                    {m.title}
                  </div>
                  <div className="text-[11px] xl:text-[11.5px] 2xl:text-xs text-white/50 leading-tight">
                    {m.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}