"use client";

import { useRef } from "react";
import { moduleRegistry } from "@/lib/personalized-dashboard/moduleRegistry";
import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";
import type { ModuleInstance } from "@/lib/personalized-dashboard/types";

export default function ModuleWindow({ module }: { module: ModuleInstance }) {
  const ref = useRef<HTMLDivElement>(null);

  const { updateModule, setActiveModule, activeModuleId, removeModule } =
    usePersonalizedDashboardStore();

  const def = moduleRegistry[module.type];
  const isActive = activeModuleId === module.id;

  /* ---------------- DRAG (header only) ---------------- */
  const onDragMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveModule(module.id);

    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = module.x;
    const startTop = module.y;

    const onMove = (ev: MouseEvent) => {
      updateModule(module.id, {
        x: startLeft + (ev.clientX - startX),
        y: startTop + (ev.clientY - startY),
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
  const onResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveModule(module.id);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = module.width;
    const startHeight = module.height;

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      updateModule(module.id, {
        width: Math.max(300, startWidth + dx),
        height: Math.max(200, startHeight + dy),
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
        shadow-[0_12px_40px_rgba(0,0,0,0.45)]
        ${isActive ? "border-teal-400" : "border-white/10"}`}
      style={{
        left: module.x,
        top: module.y,
        width: module.width,
        height: module.minimized ? 42 : module.height, // 🔥 MINIMIZE
        zIndex: isActive ? 50 : 10,
      }}
      onMouseDown={() => setActiveModule(module.id)}
    >
      {/* HEADER */}
      <div
        onMouseDown={onDragMouseDown}
        className="flex items-center justify-between px-4 py-2
          border-b border-white/10 select-none cursor-move"
      >
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.35)]" />
          <div className="text-[12px] font-semibold text-white/90">
            {module.title}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* MINIMIZE */}
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() =>
              updateModule(module.id, {
                minimized: !module.minimized,
              })
            }
            className="h-6 w-6 rounded-md border border-white/10 bg-white/5
              text-white/70 hover:text-white hover:bg-white/10 transition"
            title={module.minimized ? "Expand" : "Minimize"}
          >
            {module.minimized ? "□" : "—"}
          </button>

          {/* CLOSE */}
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => removeModule(module.id)}
            className="h-6 w-6 rounded-md border border-white/10 bg-white/5
              text-white/70 hover:text-white hover:bg-red-500/80 hover:border-red-400/60
              transition"
            title="Close"
          >
            ×
          </button>
        </div>
      </div>

      {/* CONTENT */}
      {!module.minimized && (
        <div className="h-[calc(100%-40px)] overflow-auto p-4 text-xs text-white/70">
          {def?.render?.()}
        </div>
      )}

      {/* RESIZE HANDLE */}
      {!module.minimized && (
        <div
          onMouseDown={onResizeMouseDown}
          className="absolute bottom-1 right-1 w-4 h-4
            cursor-nwse-resize opacity-40 hover:opacity-100 transition"
          title="Resize"
        >
          <div className="w-full h-full border-r-2 border-b-2 border-teal-400/70" />
        </div>
      )}
    </div>
  );
}
