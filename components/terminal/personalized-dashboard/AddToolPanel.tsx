"use client";

import { moduleRegistry } from "@/lib/personalized-dashboard/moduleRegistry";
import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";
import type { ModuleCategory } from "@/lib/personalized-dashboard/types";
import type { ModuleDefinition } from "@/lib/personalized-dashboard/moduleRegistry";
import { useDashboardNotificationStore } from "@/store/dashboardNotificationStore";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

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
  const headerRef = useRef<HTMLDivElement>(null);
  const addingRef = useRef(false);
const searchRef = useRef<HTMLInputElement>(null);

  const [headerHeight, setHeaderHeight] = useState(56);
const [search, setSearch] = useState("");

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
  if (addToolOpen && headerRef.current) {
    const height = headerRef.current.getBoundingClientRect().height;
    setHeaderHeight(height);
  }
  if (addToolOpen) {
    setTimeout(() => searchRef.current?.focus(), 50);
  } else {
    setSearch("");
  }
}, [addToolOpen]);


  useEffect(() => {
    if (!addToolOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      
      if (panelRef.current?.contains(target)) return;
      
      const topBar = document.querySelector('[data-topbar]');
      if (topBar?.contains(target)) return;
      
      toggleAddTool();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        toggleAddTool();
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
  }, [addToolOpen, toggleAddTool]);

  if (!addToolOpen) return null;

const filtered = Object.values(moduleRegistry).filter(
  (mod) =>
    mod.title.toLowerCase().includes(search.toLowerCase()) ||
    mod.description?.toLowerCase().includes(search.toLowerCase())
);

const grouped = filtered.reduce((acc, mod) => {
  const category = mod.category;
  if (!acc[category]) acc[category] = [];
  acc[category].push(mod);
  return acc;
}, {} as Record<ModuleCategory, ModuleDefinition[]>);


const addAtCurrentView = (type: string) => {
    if (addingRef.current) return;
    if (usePersonalizedDashboardStore.getState().uiBlocked) return;
    addingRef.current = true;
    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;

    const canvasX = (viewportCenterX - panX) / zoom;
    const canvasY = (viewportCenterY - panY) / zoom;

    addModuleByType(type, canvasX, canvasY);
    useDashboardNotificationStore.getState().push({
      type: "success",
      title: "Tool Added",
      description: `${moduleRegistry[type]?.title ?? type} added to dashboard`,
    });

        toggleAddTool();
    addingRef.current = false;

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
      <div 
        ref={headerRef}
        className="flex items-center justify-between px-3 py-3 border-b border-white/10 select-none bg-[#041F20]/95"
      >
        <div className="text-[13px] xl:text-[13.5px] 2xl:text-sm font-semibold text-white">Add Tool</div>
      </div>

<div
  style={{
    height: `calc(${availableHeight}px - ${headerHeight}px)`,
  }}
  className="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-teal-400/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:cursor-pointer [&::-webkit-scrollbar-thumb:hover]:bg-teal-400/70 scrollbar-thin scrollbar-thumb-teal-400/40 scrollbar-track-transparent"
  onWheel={(e) => {
    e.stopPropagation();
  }}
>
  <div className="sticky top-0 z-10 px-3 pt-3 pb-2 bg-[#041F20]/95">
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 pointer-events-none" />
      <input
        ref={searchRef}
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tools..."
        className="w-full bg-white/5 border border-white/10 rounded-lg pl-7 pr-3 py-1.5 text-[12px] xl:text-[12.5px] 2xl:text-xs text-white placeholder-white/30 outline-none focus:border-teal-400/50 transition"
      />
    </div>
  </div>
  <div className="p-3 pt-1 space-y-4">
  {Object.entries(grouped).length === 0 && (
    <div className="px-1 py-6 text-center text-[12px] text-white/30">
      No tools found
    </div>
  )}
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
    </div>
  );
}