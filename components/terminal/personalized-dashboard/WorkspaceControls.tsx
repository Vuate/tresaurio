"use client";

import { useEffect, useState, useMemo } from "react";
import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";

const MAP_SIZE = 180;
const MAP_PADDING = 1200; // 🔥 UÇ GÜVENLİK ALANI

export default function WorkspaceControls() {
  const {
    zoom,
    panX,
    panY,
    setZoom,
    setPan,
    modules,
    notesOpen,
    activeModuleId,
  } = usePersonalizedDashboardStore();

  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        w: window.innerWidth,
        h: window.innerHeight - 60,
      });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  /* ===================== 🔥 MAP BOUNDS (WINDOW + VIEWPORT) ===================== */
  const mapBounds = useMemo(() => {
    const windowMinX = Math.min(...modules.map(m => m.x), 0);
    const windowMinY = Math.min(...modules.map(m => m.y), 0);
    const windowMaxX = Math.max(...modules.map(m => m.x + m.width), 0);
    const windowMaxY = Math.max(...modules.map(m => m.y + m.height), 0);

    const viewportMinX = -panX / zoom;
    const viewportMinY = -panY / zoom;
    const viewportMaxX = viewportMinX + viewport.w / zoom;
    const viewportMaxY = viewportMinY + viewport.h / zoom;

    const minX = Math.min(windowMinX, viewportMinX) - MAP_PADDING;
    const minY = Math.min(windowMinY, viewportMinY) - MAP_PADDING;
    const maxX = Math.max(windowMaxX, viewportMaxX) + MAP_PADDING;
    const maxY = Math.max(windowMaxY, viewportMaxY) + MAP_PADDING;

    const width = Math.max(1, maxX - minX);
    const height = Math.max(1, maxY - minY);

    const scale = Math.min(MAP_SIZE / width, MAP_SIZE / height);

    return { minX, minY, scale };
  }, [modules, panX, panY, zoom, viewport]);

  /* ---------------- ZOOM ---------------- */
  const handleZoom = (delta: number) => {
    const newZoom = Math.max(0.1, Math.min(2, zoom + delta));
    const cx = viewport.w / 2;
    const cy = viewport.h / 2;
    const ratio = newZoom / zoom;

    setPan(
      cx - (cx - panX) * ratio,
      cy - (cy - panY) * ratio
    );
    setZoom(newZoom);
  };

  /* ---------------- ALIGN ACTIVE ---------------- */
  const alignToActiveWindow = () => {
    const active = modules.find(m => m.id === activeModuleId);
    if (!active) return;

    setPan(
      viewport.w / 2 - (active.x + active.width / 2) * zoom,
      viewport.h / 2 - (active.y + active.height / 2) * zoom
    );
  };

  /* ---------------- MAP CLICK ---------------- */
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const canvasX = x / mapBounds.scale + mapBounds.minX;
    const canvasY = y / mapBounds.scale + mapBounds.minY;

    setPan(
      viewport.w / 2 - canvasX * zoom,
      viewport.h / 2 - canvasY * zoom
    );
  };

  /* ---------------- VIEWPORT RECT ---------------- */
  const viewportW = (viewport.w / zoom) * mapBounds.scale;
  const viewportH = (viewport.h / zoom) * mapBounds.scale;

  const viewportX =
    ((-panX / zoom) - mapBounds.minX) * mapBounds.scale;
  const viewportY =
    ((-panY / zoom) - mapBounds.minY) * mapBounds.scale;

  const bottomOffset = notesOpen ? 284 : 72;

  return (
    <div
      className="fixed right-6 z-50 flex items-end gap-4"
      style={{ bottom: bottomOffset }}
    >
      {/* ===================== MAP ===================== */}
      <div className="relative w-[180px] h-[180px] rounded-xl border border-white/10 bg-[#031A1C]/95 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-8 border-b border-white/10 flex items-center px-3">
          <span className="text-[11px] text-white/40 font-bold uppercase">
            Map
          </span>
        </div>

        <div
          className="absolute inset-0 top-8 cursor-pointer"
          onClick={handleMapClick}
        >
          {modules.map(m => (
            <div
              key={m.id}
              className="absolute bg-teal-400/30 border border-teal-400 rounded-[2px]"
              style={{
                left: (m.x - mapBounds.minX) * mapBounds.scale,
                top: (m.y - mapBounds.minY) * mapBounds.scale,
                width: m.width * mapBounds.scale,
                height: m.height * mapBounds.scale,
              }}
            />
          ))}

          <div
            className="absolute border-2 border-teal-400 bg-teal-400/10"
            style={{
              left: viewportX,
              top: viewportY,
              width: viewportW,
              height: viewportH,
            }}
          />
        </div>
      </div>

      {/* ===================== CONTROLS ===================== */}
      <div className="flex flex-col gap-2">
        <ZoomBtn onClick={() => handleZoom(0.1)}>+</ZoomBtn>
        <div className="w-10 h-10 rounded-lg bg-[#031A1C]/95 border border-white/10 text-[11px] font-bold text-teal-400 flex items-center justify-center">
          {Math.round(zoom * 100)}%
        </div>
        <ZoomBtn onClick={() => handleZoom(-0.1)}>−</ZoomBtn>
        <ZoomBtn onClick={alignToActiveWindow}>◎</ZoomBtn>
      </div>
    </div>
  );
}

function ZoomBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 rounded-lg bg-[#031A1C]/95 border border-white/10 text-white text-lg hover:bg-teal-400/20 transition"
    >
      {children}
    </button>
  );
}
