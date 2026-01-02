"use client";

import { useEffect, useState } from "react";
import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";

const CANVAS_SIZE = 10000;
const MAP_SIZE = 180;
const SCALE = MAP_SIZE / CANVAS_SIZE;

export default function WorkspaceControls() {
  const { zoom, panX, panY, setZoom, setPan, resetView, modules, notesOpen } =
    usePersonalizedDashboardStore();

  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        w: window.innerWidth,
        h: window.innerHeight - 60, // Top bar height
      });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const handleZoom = (delta: number) => {
    const newZoom = Math.max(0.1, Math.min(2, zoom + delta));

    // Viewport merkezini hesapla
    const centerX = viewport.w / 2;
    const centerY = viewport.h / 2;

    // Zoom oranını hesapla
    const zoomRatio = newZoom / zoom;

    // Yeni pan değerlerini hesapla (merkezi sabit tut)
    const newPanX = centerX - (centerX - panX) * zoomRatio;
    const newPanY = centerY - (centerY - panY) * zoomRatio;

    setZoom(newZoom);
    setPan(newPanX, newPanY);
  };

  const viewportWidth = (viewport.w / zoom) * SCALE;
  const viewportHeight = (viewport.h / zoom) * SCALE;
  const viewportX = (-panX / zoom) * SCALE;
  const viewportY = (-panY / zoom) * SCALE;

  const bottomOffset = notesOpen ? 260 + 24 : 48 + 24;

  return (
    <div
      className="fixed right-6 z-50 transition-all duration-300 ease-in-out flex items-end gap-4"
      style={{ bottom: bottomOffset }}
    >
      {/* MINIMAP */}
      <div
        className="relative w-[180px] h-[180px]
          rounded-xl border border-white/10
          bg-[#031A1C]/95 backdrop-blur-xl
          shadow-[0_12px_40px_rgba(0,0,0,0.45)]
          overflow-hidden"
      >
        <div
          className="absolute top-0 left-0 right-0 h-8 
          border-b border-white/10 bg-white/[0.02]
          flex items-center px-3"
        >
          <span className="text-[11px] text-white/40 font-bold uppercase tracking-wider">
            Map
          </span>
        </div>

        <div className="absolute inset-0 top-8 bg-white/[0.02]">
          {/* Modules on minimap */}
          {modules.map((m) => (
            <div
              key={m.id}
              className="absolute bg-teal-400/30 border border-teal-400 rounded-[2px]
                pointer-events-none"
              style={{
                left: m.x * SCALE,
                top: m.y * SCALE,
                width: m.width * SCALE,
                height: m.height * SCALE,
              }}
            />
          ))}

          {/* Viewport indicator */}
          <div
            className="absolute border-2 border-teal-400 bg-teal-400/10 
              pointer-events-none"
            style={{
              left: viewportX,
              top: viewportY,
              width: viewportWidth,
              height: viewportHeight,
            }}
          />
        </div>
      </div>

      {/* ZOOM CONTROLS */}
      <div className="flex flex-col gap-2">
        <ZoomBtn onClick={() => handleZoom(0.1)} title="Zoom In">
          +
        </ZoomBtn>

        <div
          className="w-10 h-10 rounded-lg
            bg-[#031A1C]/95 backdrop-blur-xl
            border border-white/10
            text-[11px] font-bold text-teal-400
            flex items-center justify-center"
        >
          {Math.round(zoom * 100)}%
        </div>

        <ZoomBtn onClick={() => handleZoom(-0.1)} title="Zoom Out">
          −
        </ZoomBtn>

        <ZoomBtn onClick={resetView} title="Reset View">
          ◎
        </ZoomBtn>
      </div>
    </div>
  );
}

function ZoomBtn({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-10 h-10 rounded-lg
        bg-[#031A1C]/95 backdrop-blur-xl
        border border-white/10
        text-white text-lg
        hover:bg-teal-400/20 hover:border-teal-400/50
        transition-all duration-200
        flex items-center justify-center"
    >
      {children}
    </button>
  );
}
