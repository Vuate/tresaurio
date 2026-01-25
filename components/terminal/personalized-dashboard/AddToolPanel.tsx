"use client";

import { moduleRegistry } from "@/lib/personalized-dashboard/moduleRegistry";
import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";
import type { ModuleCategory } from "@/lib/personalized-dashboard/types";
import type { ModuleDefinition } from "@/lib/personalized-dashboard/moduleRegistry";
import { useDashboardNotificationStore } from "@/store/dashboardNotificationStore";
import { useEffect, useRef } from "react";


export default function AddToolPanel() {
  const {
    addToolOpen,
    toggleAddTool,
    addModuleByType,
    panX,
    panY,
    zoom,
  } = usePersonalizedDashboardStore();

    const panelRef = useRef<HTMLDivElement>(null); 

useEffect(() => {
  if (!addToolOpen) return;

  const handleClickOutside = (e: MouseEvent) => {
    if (
      panelRef.current &&
      !panelRef.current.contains(e.target as Node)
    ) {
      toggleAddTool();
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [addToolOpen, toggleAddTool]);

if (!addToolOpen) return null;

  const grouped = Object.values(moduleRegistry).reduce((acc, mod) => {
    const category = mod.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(mod);
    return acc;
  }, {} as Record<ModuleCategory, ModuleDefinition[]>);

  // ✅ ASIL ÇALIŞAN SPAWN MANTIĞI
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
  className="
    fixed left-4 top-20 z-40
    w-[260px] max-h-[80vh]
    bg-[#041F20]/95 backdrop-blur
    border border-white/10 rounded-xl
    shadow-[0_12px_40px_rgba(0,0,0,0.45)]

    overflow-y-auto

    select-none

    [&::-webkit-scrollbar]:w-2
    [&::-webkit-scrollbar-track]:bg-transparent
    [&::-webkit-scrollbar-thumb]:bg-teal-400/40
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-thumb:hover]:bg-teal-400/70

    scrollbar-thin
    scrollbar-thumb-teal-400/40
    scrollbar-track-transparent
  "
>

      {/* HEADER */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-white/10 select-none">
        <div className="text-[13px] font-semibold text-white">Add Tool</div>
        <button
          onClick={toggleAddTool}
          className="text-white/50 hover:text-white transition cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* CONTENT */}
<div
  className="
    p-3 space-y-4
    max-h-[calc(80vh-56px)]
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
  onWheel={(e) => {
    e.stopPropagation();
  }}
>
        {Object.entries(grouped).map(([category, mods]) => (
          <div key={category}>
            <div className="px-1 py-1 text-[10px] uppercase text-white/40 font-bold">
              {category.replace("-", " ")}
            </div>

            <div className="space-y-1">
              {mods.map((m) => (
                <button
                  key={m.type}
                  onClick={() => addAtCurrentView(m.type)}
                  className="
                    w-full text-left rounded-lg
                    px-3 py-2
                    bg-white/5 hover:bg-teal-400/10
                    border border-white/10
                    transition cursor-pointer
                  "
                >
                  <div className="text-[13px] font-semibold text-white">
                    {m.title}
                  </div>
                  <div className="text-[11px] text-white/50 leading-tight">
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
