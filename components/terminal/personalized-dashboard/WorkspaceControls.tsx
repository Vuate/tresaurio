"use client";

import { useEffect, useState } from "react";
import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";

const CANVAS_SIZE = 10000;
const MAP_SIZE = 180;
const SCALE = MAP_SIZE / CANVAS_SIZE;

export default function WorkspaceControls() {
  const { zoom, panX, panY, setZoom, resetView, modules, notesOpen } =
    usePersonalizedDashboardStore();

  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  useEffect(() => {
    setViewport({
      w: window.innerWidth,
      h: window.innerHeight,
    });
  }, []);

  const viewportWidth = (viewport.w / zoom) * SCALE;
  const viewportHeight = (viewport.h / zoom) * SCALE;
  const viewportX = (-panX / zoom) * SCALE;
  const viewportY = (-panY / zoom) * SCALE;

  const bottomOffset = notesOpen ? 260 + 24 : 48 + 24;

  return (
    <div
      className="fixed right-15 z-50 transition-all duration-300 ease-in-out"
      style={{ bottom: bottomOffset }}
    >
      <div className="relative">
        {/* MINIMAP */}
        <div
          className="relative w-[180px] h-[180px]
            rounded-xl border border-white/10
            bg-[#031A1C]/95 backdrop-blur
            shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
        >
          <div className="absolute top-2 left-3 text-[10px] text-white/40 font-bold">
            MAP
          </div>

          {modules.map((m) => (
            <div
              key={m.id}
              className="absolute bg-teal-400/40 border border-teal-400 rounded-[2px]"
              style={{
                left: m.x * SCALE,
                top: m.y * SCALE,
                width: m.width * SCALE,
                height: m.height * SCALE,
              }}
            />
          ))}

          <div
            className="absolute border-2 border-teal-400 bg-teal-400/10 pointer-events-none"
            style={{
              left: viewportX,
              top: viewportY,
              width: viewportWidth,
              height: viewportHeight,
            }}
          />
        </div>

        {/* CONTROLS */}
        <div className="absolute top-0 -right-12 flex flex-col gap-2">
          <Btn onClick={() => setZoom(zoom + 0.1)}>+</Btn>

          <div
            className="w-10 h-10 rounded-lg
              bg-[#031A1C]/90 border border-white/10
              text-[11px] font-bold text-teal-400
              flex items-center justify-center"
          >
            {Math.round(zoom * 100)}%
          </div>

          <Btn onClick={() => setZoom(zoom - 0.1)}>−</Btn>
          <Btn onClick={resetView}>◎</Btn>
        </div>
      </div>
    </div>
  );
}

function Btn({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 rounded-lg
        bg-[#031A1C]/90 border border-white/10
        text-white hover:bg-teal-400/20 transition"
    >
      {children}
    </button>
  );
}
