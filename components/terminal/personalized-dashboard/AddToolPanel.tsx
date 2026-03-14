"use client";

import { moduleRegistry } from "@/lib/personalized-dashboard/moduleRegistry";
import { usePersonalizedDashboardStore, WORLD_WIDTH, WORLD_HEIGHT } from "@/store/personalizedDashboardStore";
import type { ModuleCategory } from "@/lib/personalized-dashboard/types";
import type { ModuleDefinition } from "@/lib/personalized-dashboard/moduleRegistry";
import { useDashboardNotificationStore } from "@/store/dashboardNotificationStore";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Search, Star } from "lucide-react";
import { useSession } from "next-auth/react";


const MAX_SELECT = 10;
const CASCADE_OFFSET = 40;

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
    favorites,
    toggleFavorite,
    clearFavorites,
    lastResetAt,
  } = usePersonalizedDashboardStore();

  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const panelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const addingRef = useRef(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const savedScrollNormal = useRef(0);
  const savedScrollFavorites = useRef(0);

  const [headerHeight, setHeaderHeight] = useState(56);
  const [search, setSearch] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

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
    }
  }, [addToolOpen]);

  useEffect(() => {
    if (addToolOpen && scrollRef.current) {
      scrollRef.current.scrollTop = showFavorites
        ? savedScrollFavorites.current
        : savedScrollNormal.current;
    }
  }, [addToolOpen]);

    useEffect(() => {
    if (!lastResetAt) return;
    setSearch("");
    setSelectMode(false);
    setSelectedTypes([]);
    setConfirmClear(false);
    savedScrollNormal.current = 0;
    savedScrollFavorites.current = 0;
  }, [lastResetAt]);

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
      if (e.key === "Escape") toggleAddTool();
    };

    const handleTouchOutside = (e: TouchEvent) => {
      if (e.touches.length > 1) return;
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      const topBar = document.querySelector('[data-topbar]');
      if (topBar?.contains(target)) return;
      toggleAddTool();
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

  const toggleSelect = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      if (selectedTypes.length >= MAX_SELECT) return;
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const addMultiple = () => {
    if (selectedTypes.length === 0) {
      setSelectMode(false);
      return;
    }
    if (usePersonalizedDashboardStore.getState().uiBlocked) return;
    const { panX: px, panY: py, zoom: z } = usePersonalizedDashboardStore.getState();
    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;
    const canvasCenterX = (viewportCenterX - px) / z;
    const canvasCenterY = (viewportCenterY - py) / z;

    selectedTypes.forEach((type, i) => {
      const def = moduleRegistry[type];
      if (!def) return;
      const x = Math.max(0, Math.min(
        canvasCenterX - def.defaultSize.width / 2 + i * CASCADE_OFFSET,
        WORLD_WIDTH - def.defaultSize.width
      ));
      const y = Math.max(0, Math.min(
        canvasCenterY - def.defaultSize.height / 2 + i * CASCADE_OFFSET,
        WORLD_HEIGHT - def.defaultSize.height
      ));
      addModuleByType(type, x, y);
    });

    useDashboardNotificationStore.getState().push({
      type: "success",
      title: "Tools Added",
      description: `${selectedTypes.length} tool${selectedTypes.length > 1 ? "s" : ""} added to dashboard`,
    });

    setSelectMode(false);
    setSelectedTypes([]);
    toggleAddTool();
  };

  const atLimit = selectedTypes.length >= MAX_SELECT;

  const selectButtonLabel = !selectMode
    ? "Select multiple"
    : selectedTypes.length === 0
    ? "Cancel"
    : `Add selected (${selectedTypes.length}/${MAX_SELECT})`;

  const getCardClass = (type: string) => {
    const isSelected = selectMode && selectedTypes.includes(type);
    const isDisabled = selectMode && atLimit && !isSelected;
    if (isDisabled) return "w-full text-left rounded-lg px-3 py-2.5 pr-9 border transition opacity-40 cursor-not-allowed bg-white/[0.03] border-white/[0.06]";
    if (isSelected) return "w-full text-left rounded-lg px-3 py-2.5 pr-9 border transition cursor-pointer bg-[#1A73E8]/20 border-[#1A73E8]/50";
    return "w-full text-left rounded-lg px-3 py-2.5 pr-9 border transition cursor-pointer bg-white/[0.03] hover:bg-[#1A73E8]/10 border-white/[0.06] hover:border-[#1A73E8]/25";
  };

  const renderCardActions = (type: string, inFav: boolean) => {
    if (selectMode) {
      if (!selectedTypes.includes(type)) return null;
      return (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#1A73E8] flex items-center justify-center pointer-events-none">
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    }
    if (!isLoggedIn) return null;
    return (
      <button
        onClick={(e) => { e.stopPropagation(); toggleFavorite(type); }}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded cursor-pointer transition text-yellow-400 hover:text-yellow-300"
        title={inFav ? "Remove from favorites" : "Add to favorites"}
      >
        <Star className="w-4 h-4" fill={inFav ? "currentColor" : "none"} strokeWidth={1.8} />
      </button>
    );
  };


  return (
    <div
      ref={panelRef}
      style={{ top: topBarHeight + 16, maxHeight: availableHeight }}
      className="fixed left-4 z-40 w-[260px] xl:w-[280px] 2xl:w-[320px] bg-[#0C0E12] border border-white/[0.06] rounded-xl shadow-[0_12px_48px_rgba(0,0,0,0.6)] overflow-hidden select-none"
    >
      <div
        ref={headerRef}
        className="flex items-center justify-between px-3 py-3 border-b border-white/[0.06] select-none bg-[#0C0E12] relative z-10"
      >
        <div className="text-[13px] xl:text-[13.5px] 2xl:text-sm font-semibold text-white">Add Tool</div>
        <button
          onClick={() => {
            const next = !showFavorites;
            setShowFavorites(next);
            setConfirmClear(false);
            const target = next ? savedScrollFavorites.current : savedScrollNormal.current;
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                if (scrollRef.current) scrollRef.current.scrollTop = target;
              });
            });
          }}
          className={`text-[11px] xl:text-[11.5px] 2xl:text-xs font-semibold px-2.5 py-1 rounded-md border transition cursor-pointer ${
            showFavorites
              ? "bg-yellow-400/15 border-yellow-400/40 text-yellow-300"
              : "bg-white/[0.04] border-white/[0.08] text-white/50 hover:text-white"
          }`}
        >
          Favorites{favorites.length > 0 ? ` (${favorites.length})` : ""}
        </button>
      </div>

      <div
        ref={scrollRef}
        style={{ height: `calc(${availableHeight}px - ${headerHeight}px)` }}
        className="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:cursor-pointer [&::-webkit-scrollbar-thumb:hover]:bg-white/40 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
        onScroll={(e) => {
          const top = (e.currentTarget as HTMLDivElement).scrollTop;
          if (showFavorites) savedScrollFavorites.current = top;
          else savedScrollNormal.current = top;
        }}
        onWheel={(e) => { e.stopPropagation(); }}
      >
        <div className="sticky top-0 z-20 px-3 pt-3 pb-2 bg-[#0C0E12] border-b border-white/[0.06]">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 pointer-events-none" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tools..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-7 pr-7 py-1.5 text-[12px] xl:text-[12.5px] 2xl:text-xs text-white placeholder-white/30 outline-none focus:border-[#1A73E8] transition"
            />
            {search && (
              <button
                onClick={() => { setSearch(""); searchRef.current?.focus(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-white/30 hover:text-white/70 transition cursor-pointer leading-none"
              >
                ✕
              </button>
            )}
          </div>
          <div className="mt-2 flex gap-1.5">
            <button
              onClick={() => {
                if (!selectMode) {
                  setSelectMode(true);
                } else {
                  addMultiple();
                }
              }}
              className={`flex-1 text-[11px] xl:text-[11.5px] 2xl:text-xs font-semibold py-1.5 rounded-lg border transition cursor-pointer ${
                !selectMode
                  ? "bg-white/[0.04] border-white/[0.08] text-white/50 hover:text-white"
                  : selectedTypes.length === 0
                  ? "bg-white/[0.04] border-white/[0.08] text-white/50 hover:text-white"
                  : "bg-[#1A73E8]/20 border-[#1A73E8]/50 text-[#4A9EFF] hover:bg-[#1A73E8]/30"
              }`}
            >
              {selectButtonLabel}
            </button>
            {selectMode && selectedTypes.length > 0 && (
              <button
                onClick={() => setSelectedTypes([])}
                className="px-2.5 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] text-white/40 hover:text-white/70 hover:bg-white/[0.08] transition cursor-pointer text-[11px]"
                title="Clear selection"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="p-3 pt-1 space-y-4">
          {showFavorites ? (
            <>
              {!isLoggedIn ? (
                <div className="px-1 py-10 text-center text-sm text-white/50">
                  Sign in to use favorites
                </div>
              ) : (
                <>
                  {favorites.length > 0 && (
                    <div className="mb-2">
                      {confirmClear ? (
                        <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2">
                          <span className="flex-1 text-[13px] text-white/60">Remove all favorites?</span>
                          <button
                            onClick={() => { clearFavorites(); setConfirmClear(false); }}
                            className="text-[11px] font-semibold px-2 py-0.5 rounded bg-red-500/80 hover:bg-red-500 text-white transition cursor-pointer"                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setConfirmClear(false)}
                            className="text-[11px] font-semibold px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-white/50 hover:text-white/80 transition cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmClear(true)}
                          className="w-full text-left text-[14px] text-white/40 hover:text-red-400 transition cursor-pointer px-1"
                        >
                          Clear all favorites
                        </button>
                      )}
                    </div>
                  )}
                  {favorites.filter((f) =>
                    !search ||
                    moduleRegistry[f.type]?.title.toLowerCase().includes(search.toLowerCase()) ||
                    moduleRegistry[f.type]?.description?.toLowerCase().includes(search.toLowerCase())
                  ).length === 0 ? (
                    <div className="px-1 py-6 text-center text-sm text-white/60">
                      {favorites.length === 0 ? "No favorites yet" : "No tools found"}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {favorites
                        .filter((f) =>
                          !search ||
                          moduleRegistry[f.type]?.title.toLowerCase().includes(search.toLowerCase()) ||
                          moduleRegistry[f.type]?.description?.toLowerCase().includes(search.toLowerCase())
                        )
                        .map((f) => {
                          const m = moduleRegistry[f.type];
                          if (!m) return null;
                          const isDisabled = selectMode && atLimit && !selectedTypes.includes(m.type);
                          return (
                            <div key={m.type} className="relative">
                              <button
                                onClick={() => {
                                  if (isDisabled) return;
                                  selectMode ? toggleSelect(m.type) : addAtCurrentView(m.type);
                                }}
                                disabled={isDisabled}
                                className={getCardClass(m.type)}
                              >
                                <div className="text-[13.5px] xl:text-[14px] 2xl:text-sm font-semibold text-white relative z-10">
                                  {m.title}
                                </div>
                                <div className="text-[10px] text-white/35 mt-0.5 relative z-10">
                                  {new Date(f.favoritedAt).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </div>
                              </button>
                              {renderCardActions(m.type, true)}
                            </div>
                          );
                        })}
                    </div>
                  )}
                </>
              )}
            </>
          ) : (

            <>
              {Object.entries(grouped).length === 0 && (
                <div className="px-1 py-6 text-center text-sm text-white/60">
                  No tools found
                </div>
              )}
              {Object.entries(grouped).map(([category, mods]) => (
                <div key={category}>
                  <div className="px-1 py-1 text-[10px] xl:text-[10.5px] 2xl:text-[11px] uppercase text-white/50 font-bold tracking-wider">
                    {category.replace("-", " ")}
                  </div>
                  <div className="space-y-1">
                    {mods.map((m) => {
                      const isDisabled = selectMode && atLimit && !selectedTypes.includes(m.type);
                      return (
                        <div key={m.type} className="relative">
                          <button
                            onClick={() => {
                              if (isDisabled) return;
                              selectMode ? toggleSelect(m.type) : addAtCurrentView(m.type);
                            }}
                            disabled={isDisabled}
                            className={getCardClass(m.type)}
                          >
                            <div className="text-[13.5px] xl:text-[14px] 2xl:text-sm font-semibold text-white relative z-10">
                              {m.title}
                            </div>
                            <div className="text-[11.5px] xl:text-[12px] 2xl:text-sm text-white/50 leading-tight relative z-10">
                              {m.description}
                            </div>
                          </button>
                          {renderCardActions(m.type, favorites.some((f) => f.type === m.type))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
