"use client";

import { useEffect, useState, useRef } from "react";
import { Map, Crosshair } from "lucide-react";

import { usePersonalizedDashboardStore, MAX_ZOOM, WORLD_WIDTH, WORLD_HEIGHT, calculateMinZoom }
from "@/store/personalizedDashboardStore";

// Returns map and button sizes based on the current viewport width for responsive layout.
const getResponsiveSize = () => {
  const w = window.innerWidth;
  return {
    mapSize: w >= 1536 ? 180 : w >= 1280 ? 160 : 140,      
    buttonSize: w >= 1536 ? 32 : w >= 1280 ? 28 : 24     
  };
};


export default function WorkspaceControls() {
  const {
    zoom,
    panX,
    panY,
    setZoom,
    setPan,
    modules,
    activeModuleId,
    topBarHeight, 
    notesBarHeight,
    uiBlocked,
  } = usePersonalizedDashboardStore();

  const [sizes, setSizes] = useState(getResponsiveSize());
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const [mapOpen, setMapOpen] = useState(false);
  const [minimapHeaderHeight, setMinimapHeaderHeight] = useState(32);
  const headerRef = useRef<HTMLDivElement>(null);
  const justOpenedRef = useRef(false);


  // Updates responsive sizes whenever the browser window is resized.
    useEffect(() => {
    const handleResize = () => setSizes(getResponsiveSize());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scale factors used to convert world coordinates to minimap pixel positions.
  const MAP_SCALE_X = sizes.mapSize / WORLD_WIDTH;
  const MAP_SCALE_Y = sizes.mapSize / WORLD_HEIGHT;

// Tracks the usable viewport dimensions, accounting for the top bar and notes bar heights.
  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        w: window.innerWidth,
        h: window.innerHeight - topBarHeight - notesBarHeight,
      });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, [topBarHeight, notesBarHeight]);

  // Measures the minimap header height so the map canvas area is correctly offset below it.
  useEffect(() => {
    if (mapOpen && headerRef.current) {
      const rect = headerRef.current.getBoundingClientRect();
      setMinimapHeaderHeight(rect.height);
    }
  }, [mapOpen]);

  
// Closes the minimap when the user taps anywhere outside of it on touch devices.
useEffect(() => {
  if (!mapOpen) return;
  const close = (e: TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-minimap]')) return;
    setMapOpen(false);
  };
  window.addEventListener("touchstart", close, true);
  return () => window.removeEventListener("touchstart", close, true);
}, [mapOpen]);


// Zooms in or out centered on the viewport midpoint and clamps pan to keep the world in bounds.
const handleZoom = (delta: number) => {
    if (usePersonalizedDashboardStore.getState().uiBlocked) return;
    const minZoom = calculateMinZoom(viewport.w, viewport.h);
    const newZoom = Math.max(minZoom, Math.min(MAX_ZOOM, zoom + delta));
    
    const cx = viewport.w / 2;
    const cy = viewport.h / 2;
    const ratio = newZoom / zoom;

    let newPanX = cx - (cx - panX) * ratio;
    let newPanY = cy - (cy - panY) * ratio;

    const scaledWorldW = WORLD_WIDTH * newZoom;
    const scaledWorldH = WORLD_HEIGHT * newZoom;

    const minPanX = viewport.w - scaledWorldW;
    const minPanY = viewport.h - scaledWorldH;

    newPanX = Math.min(0, Math.max(minPanX, newPanX));
    newPanY = Math.min(0, Math.max(minPanY, newPanY));

    if (scaledWorldW < viewport.w) {
      newPanX = (viewport.w - scaledWorldW) / 2;
    }
    if (scaledWorldH < viewport.h) {
      newPanY = (viewport.h - scaledWorldH) / 2;
    }

    setPan(newPanX, newPanY);
    setZoom(newZoom);
  };

// Pans the viewport to center the currently active module, clamped to world boundaries.
const alignToActiveWindow = () => {
    if (usePersonalizedDashboardStore.getState().uiBlocked) return;
    const active = modules.find(m => m.id === activeModuleId);

    if (!active) return;

    let newPanX = viewport.w / 2 - (active.x + active.width / 2) * zoom;
    let newPanY = viewport.h / 2 - (active.y + active.height / 2) * zoom;

    const scaledWorldW = WORLD_WIDTH * zoom;
    const scaledWorldH = WORLD_HEIGHT * zoom;

    const minPanX = viewport.w - scaledWorldW;
    const minPanY = viewport.h - scaledWorldH;

    newPanX = Math.min(0, Math.max(minPanX, newPanX));
    newPanY = Math.min(0, Math.max(minPanY, newPanY));

    if (scaledWorldW < viewport.w) {
      newPanX = (viewport.w - scaledWorldW) / 2;
    }
    if (scaledWorldH < viewport.h) {
      newPanY = (viewport.h - scaledWorldH) / 2;
    }

    setPan(newPanX, newPanY);
  };

// Converts a click on the minimap to world coordinates and pans the canvas to that position.
const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
  if (usePersonalizedDashboardStore.getState().uiBlocked) return;
  if (justOpenedRef.current) { justOpenedRef.current = false; return; }
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top; 

  const canvasX = (x / sizes.mapSize) * WORLD_WIDTH;
  const canvasY = (y / actualMapHeight) * WORLD_HEIGHT; 

  let newPanX = viewport.w / 2 - canvasX * zoom;
  let newPanY = viewport.h / 2 - canvasY * zoom;

  const scaledWorldW = WORLD_WIDTH * zoom;
  const scaledWorldH = WORLD_HEIGHT * zoom;

  const minPanX = viewport.w - scaledWorldW;
  const minPanY = viewport.h - scaledWorldH;

  newPanX = Math.min(0, Math.max(minPanX, newPanX));
  newPanY = Math.min(0, Math.max(minPanY, newPanY));

  if (scaledWorldW < viewport.w) {
    newPanX = (viewport.w - scaledWorldW) / 2;
  }
  if (scaledWorldH < viewport.h) {
    newPanY = (viewport.h - scaledWorldH) / 2;
  }

  setPan(newPanX, newPanY);
};

// Derived map dimensions that subtract the minimap header from the total drawable area.
const actualMapHeight = sizes.mapSize - minimapHeaderHeight;
const actualMapScaleY = actualMapHeight / WORLD_HEIGHT;

// Maps the current pan and zoom to minimap coordinates for the viewport indicator rectangle.
const viewportX = (-panX / zoom) * MAP_SCALE_X;
const viewportY = (-panY / zoom) * actualMapScaleY;

const viewportW = (viewport.w / zoom) * MAP_SCALE_X;
const viewportH = (viewport.h / zoom) * actualMapScaleY;

// Calculates the bottom spacing for the controls panel, accounting for the notes bar and screen size.
const bottomOffset = notesBarHeight + (window.innerWidth >= 1536 ? 24 : window.innerWidth >= 1280 ? 20 : 16);

  return (
<div
data-minimap
className={`fixed right-3 xl:right-4 2xl:right-6 z-50 ${uiBlocked ? "pointer-events-none" : ""}`}
      style={{ bottom: bottomOffset }}
     onPointerEnter={(e) => { if (e.pointerType !== 'mouse') return; if (usePersonalizedDashboardStore.getState().uiBlocked) return; setMapOpen(true); }}
onPointerLeave={(e) => { if (e.pointerType !== 'mouse') return; if (usePersonalizedDashboardStore.getState().uiBlocked) return; setMapOpen(false); }}

      onTouchStart={(e) => { 
        if (usePersonalizedDashboardStore.getState().uiBlocked) return;
        e.stopPropagation();
        if (!mapOpen) {
          justOpenedRef.current = true;
          setMapOpen(true);
        }
      }}
    >
<div className="flex items-end gap-4 xl:gap-5 2xl:gap-6">
<div
className="relative rounded-xl border border-white/10 bg-[#0C0E12] overflow-hidden transition-all duration-300 ease-out"  style={{
    width: mapOpen ? sizes.mapSize : sizes.buttonSize,
    height: mapOpen ? sizes.mapSize : sizes.buttonSize,
  }}
>
          {!mapOpen && (
            <div
              className="
                absolute inset-0
                flex items-center justify-center
              text-white text-sm xl:text-base 2xl:text-lg leading-none
                select-none
                pointer-events-none
              "
              onMouseDown={(e) => e.preventDefault()}
            >
              <Map className="w-3.5 h-3.5" />
            </div>
          )}

          <div
            className={`
              absolute inset-0 transition-opacity duration-200
              ${mapOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
            `}
          >
            <div 
              ref={headerRef}
              className="absolute top-0 left-0 right-0 h-8 border-b border-white/10 flex items-center px-3"
            >
<span className="text-[11px] xl:text-xs 2xl:text-sm text-white/80 font-bold uppercase select-none pointer-events-none">
                Map
              </span>
            </div>
        <div
          className="absolute cursor-pointer"
          style={{
            top: minimapHeaderHeight,
            left: 0,
            right: 0,
            bottom: 0,
          }}

      
      onClick={handleMapClick}
      onTouchEnd={(e) => {
        e.stopPropagation();
        e.preventDefault();
        if (justOpenedRef.current) { justOpenedRef.current = false; return; }
        const touch = e.changedTouches[0];
        const rect = e.currentTarget.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        const canvasX = (x / sizes.mapSize) * WORLD_WIDTH;
        const canvasY = (y / actualMapHeight) * WORLD_HEIGHT;
        let newPanX = viewport.w / 2 - canvasX * zoom;
        let newPanY = viewport.h / 2 - canvasY * zoom;
        const scaledWorldW = WORLD_WIDTH * zoom;
        const scaledWorldH = WORLD_HEIGHT * zoom;
        const minPanX = viewport.w - scaledWorldW;
        const minPanY = viewport.h - scaledWorldH;
        newPanX = Math.min(0, Math.max(minPanX, newPanX));
        newPanY = Math.min(0, Math.max(minPanY, newPanY));
        if (scaledWorldW < viewport.w) newPanX = (viewport.w - scaledWorldW) / 2;
        if (scaledWorldH < viewport.h) newPanY = (viewport.h - scaledWorldH) / 2;
        setPan(newPanX, newPanY);
      }}
        >
              {modules.map(m => {
                const moduleMapScaleY = actualMapHeight / WORLD_HEIGHT;
                
                return (
                  <div
                    key={m.id}
            className={`absolute bg-[#1A73E8]/20 border border-[#1A73E8]/60 rounded-[2px]
              ${m.id === activeModuleId ? 'border-2 bg-[#1A73E8]/40' : ''}`}
                  style={{
                    left: m.x * MAP_SCALE_X,
                          top: m.y * actualMapScaleY,  
                    width: m.width * MAP_SCALE_X,
                    height: m.height * actualMapScaleY,
                  }}
                  />
                );
              })}

            <div
              className="absolute border-2 border-white bg-white/5 rounded-[2px]"
              style={{
                left: Math.max(0, Math.min(sizes.mapSize - viewportW, viewportX)),
                top: Math.max(
                  0, 
                  Math.min(
                    actualMapHeight - viewportH, 
                    viewportY
                  )
                ),
                width: Math.min(sizes.mapSize, viewportW),
                height: Math.min(actualMapHeight, viewportH),
              }}
            />
            </div>
          </div>
        </div>

        <div
className="flex flex-col gap-2 xl:gap-2.5 2xl:gap-3 select-none"
          onMouseDown={(e) => e.preventDefault()}
        >
<ZoomBtn onClick={() => { if (usePersonalizedDashboardStore.getState().uiBlocked) return; handleZoom(0.1); }} size={sizes.buttonSize}>+</ZoomBtn>

<div
className="rounded-lg bg-[#0C0E12] border border-white/10 text-[10px] xl:text-[11px] 2xl:text-xs font-bold text-white flex items-center justify-center select-none pointer-events-none cursor-default"  style={{ 
    width: sizes.buttonSize, 
    height: sizes.buttonSize 
  }}
>
            {Math.round(zoom * 100)}%
          </div>

<ZoomBtn onClick={() => { if (usePersonalizedDashboardStore.getState().uiBlocked) return; handleZoom(-0.1); }} size={sizes.buttonSize}>−</ZoomBtn>
<ZoomBtn onClick={() => { if (usePersonalizedDashboardStore.getState().uiBlocked) return; alignToActiveWindow(); }} size={sizes.buttonSize}><Crosshair className="w-3.5 h-3.5 xl:w-4 xl:h-4 2xl:w-4.5 2xl:h-4.5 " /></ZoomBtn>
        </div>
      </div>
    </div>
  );
}

// Reusable button used by zoom controls — consistent dark style with a dynamic size prop.
    function ZoomBtn({
      children,
      onClick,
      size,
    }: {
      children: React.ReactNode;
      onClick: () => void;
        size: number; 
    }) {
      return (
        <button
          onClick={onClick}
          onMouseDown={(e) => e.preventDefault()}
    className="
      rounded-lg
    bg-[#0C0E12]
        border border-white/10
      text-white text-sm xl:text-base 2xl:text-lg
        hover:bg-white/10
        transition
        select-none
        cursor-pointer
        flex items-center justify-center
    "
                style={{ width: size, height: size }}
        >
          {children}
        </button>
      );
    }