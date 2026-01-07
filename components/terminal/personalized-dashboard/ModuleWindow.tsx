"use client";

import { useRef } from "react";
import { moduleRegistry } from "@/lib/personalized-dashboard/moduleRegistry";
import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";
import type { ModuleInstance } from "@/lib/personalized-dashboard/types";

type ResizeDir =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export default function ModuleWindow({ module }: { module: ModuleInstance }) {
  const ref = useRef<HTMLDivElement>(null);

  const {
    updateModule,
    setActiveModule,
    activeModuleId,
    removeModule,
    zoom,
  } = usePersonalizedDashboardStore();

  const def = moduleRegistry[module.type];
  const isActive = activeModuleId === module.id;

  /* ---------------- DRAG ---------------- */
  const onDragMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    setActiveModule(module.id);

    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = module.x;
    const startTop = module.y;

    const onMove = (ev: MouseEvent) => {
      ev.preventDefault();

      updateModule(module.id, {
        x: startLeft + (ev.clientX - startX) / zoom,
        y: startTop + (ev.clientY - startY) / zoom,
      });
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  /* ---------------- RESIZE ---------------- */
  const onResizeMouseDown = (e: React.MouseEvent, dir: ResizeDir) => {
    e.stopPropagation();
    e.preventDefault();

    setActiveModule(module.id);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = module.width;
    const startHeight = module.height;
    const startLeft = module.x;
    const startTop = module.y;

    const onMove = (ev: MouseEvent) => {
      ev.preventDefault();

      const dx = (ev.clientX - startX) / zoom;
      const dy = (ev.clientY - startY) / zoom;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startLeft;
      let newY = startTop;

      if (dir.includes("right")) newWidth += dx;
      if (dir.includes("left")) {
        newWidth -= dx;
        newX += dx;
      }

      if (dir.includes("bottom")) newHeight += dy;
      if (dir.includes("top")) {
        newHeight -= dy;
        newY += dy;
      }

      updateModule(module.id, {
        x: newX,
        y: newY,
        width: Math.max(300, newWidth),
        height: Math.max(200, newHeight),
      });
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div
      ref={ref}
      className={`absolute rounded-2xl border bg-[#041F20]/95 backdrop-blur
        select-none overflow-hidden
        ${isActive ? "border-teal-400" : "border-white/10"}`}
      style={{
        left: module.x,
        top: module.y,
        width: module.width,
        height: module.minimized ? 42 : module.height,
        zIndex: isActive ? 50 : 10,
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        transform: "translateZ(0)",
      }}
      onMouseDown={() => setActiveModule(module.id)}
      onWheelCapture={(e) => {
        if (!isActive) return;
        if (ref.current?.contains(e.target as Node)) {
          e.stopPropagation();
        }
      }}
    >
      {/* HEADER */}
      <div
        onMouseDown={onDragMouseDown}
        className="flex items-center justify-between px-4 py-2
          border-b border-white/10 cursor-move"
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.35)]" />
          <div className="text-[12px] font-semibold text-white/90">
            {module.title}
          </div>
        </div>

        <div className="flex gap-1">
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() =>
              updateModule(module.id, { minimized: !module.minimized })
            }
            className="h-6 w-6 rounded-md border border-white/10 bg-white/5
              text-white/70 hover:bg-white/10"
          >
            {module.minimized ? "□" : "—"}
          </button>

          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => removeModule(module.id)}
            className="h-6 w-6 rounded-md border border-white/10 bg-white/5
              hover:bg-red-500/80"
          >
            ×
          </button>
        </div>
      </div>

      {/* CONTENT */}
      {!module.minimized && (
        <div className="h-[calc(100%-40px)] overflow-hidden">
          <div
            className="
              h-full overflow-auto p-4
              text-white/80 leading-relaxed select-text

              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-teal-400/40
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb:hover]:bg-teal-400/65

              scrollbar-thin
              scrollbar-thumb-teal-400/40
              scrollbar-track-transparent
            "
            style={{
              fontSize: `clamp(11px, ${12 / zoom}px, 14px)`,
            }}
            onWheel={(e) => e.stopPropagation()}
          >
            {def?.render?.()}
          </div>
        </div>
      )}

      {/* RESIZE HANDLES */}
      {!module.minimized && (
        <>
          <div onMouseDown={(e) => onResizeMouseDown(e, "top-left")} className="absolute top-0 left-0 w-6 h-6 cursor-nwse-resize" />
          <div onMouseDown={(e) => onResizeMouseDown(e, "top-right")} className="absolute top-0 right-0 w-6 h-6 cursor-nesw-resize" />
          <div onMouseDown={(e) => onResizeMouseDown(e, "bottom-left")} className="absolute bottom-0 left-0 w-6 h-6 cursor-nesw-resize" />
          <div onMouseDown={(e) => onResizeMouseDown(e, "bottom-right")} className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize" />
        </>
      )}
    </div>
  );
}
