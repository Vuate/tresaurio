"use client";

import { useRef } from "react";
import { moduleRegistry } from "@/lib/personalized-dashboard/moduleRegistry";
import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";
import type { ModuleInstance } from "@/lib/personalized-dashboard/types";
import { useDashboardNotificationStore } from "@/store/dashboardNotificationStore";

type ResizeDir = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export default function ModuleWindow({ module }: { module: ModuleInstance }) {
  const ref = useRef<HTMLDivElement>(null);

  const { 
    updateModule, 
    setActiveModule, 
    activeModuleId, 
    removeModule, 
    zoom,
    setPan,
    panX,
    panY
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
    const startModuleX = module.x;
    const startModuleY = module.y;
    const startPanX = panX;
    const startPanY = panY;

    // Yukarı ve aşağı için ÇOOK daha agresif
    const edgeThresholdHorizontal = 150; 
    const edgeThresholdTop = 120; // Üst için BÜYÜK
    const edgeThresholdBottom = 100; // Alt için BÜYÜK
    const scrollSpeedHorizontal = 3;
    const scrollSpeedVertical = 5; // Dikey için DAHA HIZLI

    let currentMouseX = e.clientX;
    let currentMouseY = e.clientY;
    let animationFrameId: number | null = null;
    let isDragging = true;

    const animate = () => {
      if (!isDragging) return;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let scrollDeltaX = 0;
      let scrollDeltaY = 0;

      // Yatay scroll
      if (currentMouseX < edgeThresholdHorizontal) {
        const intensity = (edgeThresholdHorizontal - currentMouseX) / edgeThresholdHorizontal;
        scrollDeltaX = scrollSpeedHorizontal * intensity;
      } else if (currentMouseX > viewportWidth - edgeThresholdHorizontal) {
        const intensity = (currentMouseX - (viewportWidth - edgeThresholdHorizontal)) / edgeThresholdHorizontal;
        scrollDeltaX = -scrollSpeedHorizontal * intensity;
      }

      // Dikey scroll - ÇOK DAHA AGRESIF
      // ÜST: Ekranın üst 120px'ine gelince başla
      if (currentMouseY < edgeThresholdTop) {
        const intensity = (edgeThresholdTop - currentMouseY) / edgeThresholdTop;
        scrollDeltaY = scrollSpeedVertical * intensity * 1.5; // Ekstra hız
      } 
      // ALT: Ekranın alt 100px'ine gelince başla
      else if (currentMouseY > viewportHeight - edgeThresholdBottom) {
        const intensity = (currentMouseY - (viewportHeight - edgeThresholdBottom)) / edgeThresholdBottom;
        scrollDeltaY = -scrollSpeedVertical * intensity * 1.5; // Ekstra hız
      }

      const store = usePersonalizedDashboardStore.getState();

      // Canvas'ı kaydır
      if (scrollDeltaX !== 0 || scrollDeltaY !== 0) {
        store.setPan(store.panX + scrollDeltaX, store.panY + scrollDeltaY);
      }

      // HER FRAME'DE modül pozisyonunu güncelle
      const mouseDeltaX = currentMouseX - startX;
      const mouseDeltaY = currentMouseY - startY;
      const panDeltaX = store.panX - startPanX;
      const panDeltaY = store.panY - startPanY;

      const newX = startModuleX + (mouseDeltaX / zoom) - panDeltaX;
      const newY = startModuleY + (mouseDeltaY / zoom) - panDeltaY;

      store.updateModule(module.id, {
        x: newX,
        y: newY,
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const onMove = (ev: MouseEvent) => {
      ev.preventDefault();
      currentMouseX = ev.clientX;
      currentMouseY = ev.clientY;
    };

    const onUp = () => {
      isDragging = false;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    
    animationFrameId = requestAnimationFrame(animate);
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
    const startPanX = panX;
    const startPanY = panY;

    const edgeThresholdHorizontal = 150;
    const edgeThresholdTop = 120;
    const edgeThresholdBottom = 100;
    const scrollSpeedHorizontal = 3;
    const scrollSpeedVertical = 5;

    let currentMouseX = e.clientX;
    let currentMouseY = e.clientY;
    let animationFrameId: number | null = null;
    let isResizing = true;

    const animate = () => {
      if (!isResizing) return;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let scrollDeltaX = 0;
      let scrollDeltaY = 0;

      if (currentMouseX < edgeThresholdHorizontal) {
        const intensity = (edgeThresholdHorizontal - currentMouseX) / edgeThresholdHorizontal;
        scrollDeltaX = scrollSpeedHorizontal * intensity;
      } else if (currentMouseX > viewportWidth - edgeThresholdHorizontal) {
        const intensity = (currentMouseX - (viewportWidth - edgeThresholdHorizontal)) / edgeThresholdHorizontal;
        scrollDeltaX = -scrollSpeedHorizontal * intensity;
      }

      if (currentMouseY < edgeThresholdTop) {
        const intensity = (edgeThresholdTop - currentMouseY) / edgeThresholdTop;
        scrollDeltaY = scrollSpeedVertical * intensity * 1.5;
      } else if (currentMouseY > viewportHeight - edgeThresholdBottom) {
        const intensity = (currentMouseY - (viewportHeight - edgeThresholdBottom)) / edgeThresholdBottom;
        scrollDeltaY = -scrollSpeedVertical * intensity * 1.5;
      }

      const store = usePersonalizedDashboardStore.getState();

      if (scrollDeltaX !== 0 || scrollDeltaY !== 0) {
        store.setPan(store.panX + scrollDeltaX, store.panY + scrollDeltaY);
      }

      const dx = (currentMouseX - startX) / zoom;
      const dy = (currentMouseY - startY) / zoom;
      const panDeltaX = store.panX - startPanX;
      const panDeltaY = store.panY - startPanY;

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

      newX -= panDeltaX;
      newY -= panDeltaY;

      store.updateModule(module.id, {
        x: newX,
        y: newY,
        width: Math.max(300, newWidth),
        height: Math.max(200, newHeight),
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const onMove = (ev: MouseEvent) => {
      ev.preventDefault();
      currentMouseX = ev.clientX;
      currentMouseY = ev.clientY;
    };

    const onUp = () => {
      isResizing = false;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    
    animationFrameId = requestAnimationFrame(animate);
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
  onClick={() => {
    removeModule(module.id);

    useDashboardNotificationStore.getState().push({
      type: "success",
      title: "Module Removed",
      description: `${module.title} removed from dashboard`,
    });
  }}
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
  text-white/80 leading-relaxed

  [&_*]:select-none
  [&_input]:select-text
  [&_textarea]:select-text
  [&_select]:select-text

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
          <div
            onMouseDown={(e) => onResizeMouseDown(e, "top-left")}
            className="absolute top-0 left-0 w-6 h-6 cursor-nwse-resize"
          />
          <div
            onMouseDown={(e) => onResizeMouseDown(e, "top-right")}
            className="absolute top-0 right-0 w-6 h-6 cursor-nesw-resize"
          />
          <div
            onMouseDown={(e) => onResizeMouseDown(e, "bottom-left")}
            className="absolute bottom-0 left-0 w-6 h-6 cursor-nesw-resize"
          />
          <div
            onMouseDown={(e) => onResizeMouseDown(e, "bottom-right")}
            className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize"
          />
        </>
      )}
    </div>
  );
}