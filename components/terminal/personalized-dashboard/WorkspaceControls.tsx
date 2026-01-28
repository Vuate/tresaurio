"use client";

import { useEffect, useState, useRef } from "react";

import { usePersonalizedDashboardStore, MAX_ZOOM, WORLD_WIDTH, WORLD_HEIGHT, calculateMinZoom } from "@/store/personalizedDashboardStore";


const MAP_SIZE = 180;

export default function WorkspaceControls() {
  const {
    zoom,
    panX,
    panY,
    setZoom,
    setPan,
    modules,
    notesOpen,
    notesHeight,
    activeModuleId,
    topBarHeight, 
    notesBarHeight,
  } = usePersonalizedDashboardStore();

  const effectiveCanvasHeight = WORLD_HEIGHT;
  const effectiveCanvasWidth = WORLD_WIDTH;

  const MAP_SCALE_X = MAP_SIZE / effectiveCanvasWidth;
  const MAP_SCALE_Y = MAP_SIZE / effectiveCanvasHeight;

  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const [mapOpen, setMapOpen] = useState(false);
  
  // 🔥 DİNAMİK HEADER HEIGHT
  const [minimapHeaderHeight, setMinimapHeaderHeight] = useState(32);
  const headerRef = useRef<HTMLDivElement>(null);

  /* ---------------- VIEWPORT ---------------- */
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

  /* ---------------- DİNAMİK HEADER ÖLÇÜMÜ ---------------- */
  useEffect(() => {
    if (mapOpen && headerRef.current) {
      const rect = headerRef.current.getBoundingClientRect();
      setMinimapHeaderHeight(rect.height);
    }
  }, [mapOpen]);

  /* ---------------- ZOOM ---------------- */
  const handleZoom = (delta: number) => {
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

  /* ---------------- ALIGN ACTIVE ---------------- */
  const alignToActiveWindow = () => {
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

/* ---------------- MAP CLICK ---------------- */
const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top; //  Header offset burada DEĞİL

  // 🔥 DOĞRU: Actual map area içindeki koordinatlar
  const canvasX = (x / MAP_SIZE) * WORLD_WIDTH;
  const canvasY = (y / actualMapHeight) * WORLD_HEIGHT; // 🔥 actualMapHeight kullan

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

// 🔥 ACTUAL MAP AREA için dinamik scale
const actualMapHeight = MAP_SIZE - minimapHeaderHeight;
const actualMapScaleY = actualMapHeight / WORLD_HEIGHT;


const viewportX = (-panX / zoom) * MAP_SCALE_X;
const viewportY = (-panY / zoom) * actualMapScaleY;

const viewportW = (viewport.w / zoom) * MAP_SCALE_X;
const viewportH = (viewport.h / zoom) * actualMapScaleY;

// 🔥 DEBUG - BURAYA EKLE ↓↓↓
console.log("=== MINIMAP DEBUG ===");
console.log("panX:", panX, "panY:", panY);
console.log("zoom:", zoom);
console.log("viewport.h:", viewport.h);
console.log("minimapHeaderHeight:", minimapHeaderHeight);
console.log("actualMapHeight:", actualMapHeight);
console.log("actualMapScaleY:", actualMapScaleY);
console.log("viewportY:", viewportY);
console.log("viewportH:", viewportH);
console.log("calculated top:", Math.max(
  minimapHeaderHeight, 
  Math.min(
    minimapHeaderHeight + actualMapHeight - viewportH,
    minimapHeaderHeight + viewportY
  )
));
console.log("max possible top:", minimapHeaderHeight + actualMapHeight - viewportH);

const bottomOffset = notesBarHeight + (window.innerWidth >= 1536 ? 24 : window.innerWidth >= 1280 ? 20 : 16);

  return (
    <div
className="fixed right-6 xl:right-8 2xl:right-12 z-50"
      style={{ bottom: bottomOffset }}
      onMouseEnter={() => setMapOpen(true)}
      onMouseLeave={() => setMapOpen(false)}
    >
<div className="flex items-end gap-4 xl:gap-5 2xl:gap-6">
        {/* MAP */}
        <div
          className={`
            relative rounded-xl border border-white/10 bg-[#031A1C]/95
            overflow-hidden transition-all duration-300 ease-out
            ${mapOpen ? "w-[180px] h-[180px]" : "w-8 h-8"}
          `}
        >
          {!mapOpen && (
            <div
              className="
                absolute inset-0
                flex items-center justify-center
text-teal-400 text-sm xl:text-base 2xl:text-lg leading-none
                select-none
                pointer-events-none
              "
              onMouseDown={(e) => e.preventDefault()}
            >
              ⛶
            </div>
          )}

          <div
            className={`
              absolute inset-0 transition-opacity duration-200
              ${mapOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
            `}
          >
            {/* 🔥 HEADER REF */}
            <div 
              ref={headerRef}
              className="absolute top-0 left-0 right-0 h-8 border-b border-white/10 flex items-center px-3"
            >
<span className="text-[11px] xl:text-xs 2xl:text-sm text-white/40 font-bold uppercase select-none pointer-events-none">
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
>
              {/* MODULES */}
              {modules.map(m => {
                // 🔥 DİNAMİK SCALE (header'sız alan için)
                const moduleMapScaleY = actualMapHeight / WORLD_HEIGHT;
                
                return (
                  <div
                    key={m.id}
                    className={`absolute bg-teal-400/30 border border-teal-400 rounded-[2px]
                      ${m.id === activeModuleId ? 'border-2 bg-teal-400/50' : ''}`}
      style={{
        left: m.x * MAP_SCALE_X,
              top: m.y * actualMapScaleY,  
        width: m.width * MAP_SCALE_X,
        height: m.height * actualMapScaleY,
      }}
                  />
                );
              })}

              {/* VIEWPORT */}
<div
  className="absolute border-2 border-white bg-white/5 rounded-[2px]"
  style={{
    left: Math.max(0, Math.min(MAP_SIZE - viewportW, viewportX)),
    top: Math.max(
      0, // ✅ Container zaten minimapHeaderHeight'ta başlıyor
      Math.min(
        actualMapHeight - viewportH, // ✅ Maksimum bottom
        viewportY
      )
    ),
    width: Math.min(MAP_SIZE, viewportW),
    height: Math.min(actualMapHeight, viewportH),
  }}
/>
            </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div
className="flex flex-col gap-2 xl:gap-2.5 2xl:gap-3 select-none"
          onMouseDown={(e) => e.preventDefault()}
        >
          <ZoomBtn onClick={() => handleZoom(0.1)}>+</ZoomBtn>

          <div
            className="
              w-8 h-8 rounded-lg
              bg-[#031A1C]/95
              border border-white/10
text-[10px] xl:text-[11px] 2xl:text-xs font-bold text-teal-400
              flex items-center justify-center
              select-none
              pointer-events-none cursor-default
            "
          >
            {Math.round(zoom * 100)}%
          </div>

          <ZoomBtn onClick={() => handleZoom(-0.1)}>−</ZoomBtn>
          <ZoomBtn onClick={alignToActiveWindow}>◎</ZoomBtn>
        </div>
      </div>
    </div>
  );
}

function ZoomBtn({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
      className="
        w-8 h-8 rounded-lg
        bg-[#031A1C]/95
        border border-white/10
       text-white text-sm xl:text-base 2xl:text-lg
        hover:bg-teal-400/20
        transition
        select-none
        cursor-pointer
      "
    >
      {children}
    </button>
  );
}
