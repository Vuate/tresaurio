"use client";

import { useRef, useState, useCallback, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { ZoomIn, ZoomOut, RotateCcw, ArrowLeftRight, Minus, Maximize2, X } from "lucide-react";
import { Lock, Unlock, Copy, Scaling } from "lucide-react";
import { moduleRegistry } from "@/lib/personalized-dashboard/moduleRegistry";
import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";
import type { ModuleInstance } from "@/lib/personalized-dashboard/types";
import { useDashboardNotificationStore } from "@/store/dashboardNotificationStore";
import { WORLD_WIDTH, WORLD_HEIGHT } from "@/store/personalizedDashboardStore";



type ResizeDir = "top-left" | "top-right" | "bottom-left" | "bottom-right";

function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export default function ModuleWindow({ module }: { module: ModuleInstance }) {
const ref = useRef<HTMLDivElement>(null);
const [isDraggingWindow, setIsDraggingWindow] = useState(false);
const [headerHeight, setHeaderHeight] = useState(42);


  const { 
    updateModule, 
    setActiveModule, 
    activeModuleId, 
    removeModule, 
    addModule,
    zoom,
    setPan,
    panX,
    panY,
    topBarHeight,
    notesBarHeight,  
    toggleModuleLock,
    lockedModules,
    swapSourceId,
    setSwapSource,
    swapModules,
    sizeSourceId,
    setSizeSource,
    applySizeFromSource,
  } = usePersonalizedDashboardStore();

    const isLocked = lockedModules.has(module.id);

  const def = moduleRegistry[module.type];
  const isActive = activeModuleId === module.id;

const [moduleZoom, setModuleZoom] = useState(module.contentZoom ?? 100);
useEffect(() => {
  setModuleZoom(module.contentZoom ?? 100);
}, [module.contentZoom]);

const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

const zoomIn = useCallback(() => {
  const next = Math.min(200, moduleZoom + 10);
  setModuleZoom(next);
  updateModule(module.id, { contentZoom: next });
}, [module.id, moduleZoom, updateModule]);
const zoomOut = useCallback(() => {
  const next = Math.max(50, moduleZoom - 10);
  setModuleZoom(next);
  updateModule(module.id, { contentZoom: next });
}, [module.id, moduleZoom, updateModule]);
const resetZoom = useCallback(() => {
  setModuleZoom(100);
  updateModule(module.id, { contentZoom: 100 });
}, [module.id, updateModule]);

useEffect(() => {
  const el = ref.current;
  if (!el) return;
  const handler = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };
  el.addEventListener("contextmenu", handler);
  return () => el.removeEventListener("contextmenu", handler);
}, []);

useEffect(() => {
  if (!contextMenu) return;
  const close = (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-context-menu]')) return;
    setContextMenu(null);
  };
  window.addEventListener("mousedown", close, true);
  window.addEventListener("wheel", close, true);
  return () => {
    window.removeEventListener("mousedown", close, true);
    window.removeEventListener("wheel", close, true);
  };
}, [contextMenu]);




  const minSizes = useMemo(() => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 768;
    
    return {
      width: vw < 768 ? 200 : vw < 1024 ? 250 : 300,
      height: vh < 768 ? 150 : vh < 1024 ? 175 : 200,
    };
  }, []);

  const updateModuleThrottled = useMemo(
    () => throttle((id: string, updates: Partial<ModuleInstance>) => {
      updateModule(id, updates);
    }, 16), // 60fps
    [updateModule]
  );

const onDragMouseDown = useCallback((e: React.MouseEvent) => {
      if (isLocked || usePersonalizedDashboardStore.getState().uiBlocked) return;
    e.stopPropagation();
    e.preventDefault();

    setActiveModule(module.id);
    setIsDraggingWindow(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startModuleX = module.x;
    const startModuleY = module.y;
    let startPanX = panX;
    let startPanY = panY;

    let currentMouseX = e.clientX;
    let currentMouseY = e.clientY;
    let animationFrameId: number | null = null;
    let isDragging = true;

    const animate = () => {
      if (!isDragging) return;

      const store = usePersonalizedDashboardStore.getState();

      const vw = window.innerWidth;
      const vh = window.innerHeight - topBarHeight - notesBarHeight; 
      const worldW = WORLD_WIDTH * zoom;
      const worldH = WORLD_HEIGHT * zoom;

      const canPanHorizontally = worldW > vw;
      const canPanVertically = worldH > vh;

      const maxPanX = 0;
      const minPanX = vw - worldW;
      const maxPanY = 0;
      const minPanY = vh - worldH;

      const mouseDeltaX = currentMouseX - startX;
      const mouseDeltaY = currentMouseY - startY;
      const totalPanDeltaX = store.panX - startPanX;
      const totalPanDeltaY = store.panY - startPanY;

      const worldDeltaX = (mouseDeltaX - totalPanDeltaX) / zoom;
      const worldDeltaY = (mouseDeltaY - totalPanDeltaY) / zoom;
                        
      let desiredX = startModuleX + worldDeltaX;
      let desiredY = startModuleY + worldDeltaY;

      const EDGE_THRESHOLD = 30;
      const mouseNearLeftEdge = currentMouseX < EDGE_THRESHOLD;
      const mouseNearRightEdge = currentMouseX > vw - EDGE_THRESHOLD;
      const mouseNearTopEdge = currentMouseY < topBarHeight + EDGE_THRESHOLD;
const viewportHeight = window.innerHeight - topBarHeight - notesBarHeight;
const mouseNearBottomEdge = currentMouseY > topBarHeight + viewportHeight - EDGE_THRESHOLD;
      const hitLeftWorldEdge = desiredX <= 0;
      const hitRightWorldEdge = desiredX >= WORLD_WIDTH - module.width;
      const hitTopWorldEdge = desiredY <= 0;
      const hitBottomWorldEdge = desiredY >= WORLD_HEIGHT - module.height;

      const canPanLeft = canPanHorizontally && store.panX < maxPanX;
      const canPanRight = canPanHorizontally && store.panX > minPanX;
      const canPanUp = canPanVertically && store.panY < maxPanY;
      const canPanDown = canPanVertically && store.panY > minPanY;

      let panSpeedX = 0;
      let panSpeedY = 0;

      if (mouseNearLeftEdge && !hitLeftWorldEdge && canPanLeft) {
        panSpeedX = 10;
      }
      else if (mouseNearRightEdge && !hitRightWorldEdge && canPanRight) {
        panSpeedX = -10;
      }

      if (mouseNearTopEdge && !hitTopWorldEdge && canPanUp) {
        panSpeedY = 10;
      }
      else if (mouseNearBottomEdge && !hitBottomWorldEdge && canPanDown) {
        panSpeedY = -10;
      }

      if (panSpeedX !== 0 || panSpeedY !== 0) {
        const nextPanX = store.panX + panSpeedX;
        const nextPanY = store.panY + panSpeedY;
        
        const clampedPanX = Math.min(maxPanX, Math.max(minPanX, nextPanX));
        const clampedPanY = Math.min(maxPanY, Math.max(minPanY, nextPanY));
        
        store.setPan(clampedPanX, clampedPanY);
      }



      const totalPanDeltaXNow = store.panX - startPanX;
      const totalPanDeltaYNow = store.panY - startPanY;
      
      const DRAG_SPEED_MULTIPLIER = 1.0;
      
      const finalWorldDeltaX = ((mouseDeltaX - totalPanDeltaXNow) * DRAG_SPEED_MULTIPLIER) / zoom;
      const finalWorldDeltaY = ((mouseDeltaY - totalPanDeltaYNow) * DRAG_SPEED_MULTIPLIER) / zoom;
      
      let newX = startModuleX + finalWorldDeltaX;
      let newY = startModuleY + finalWorldDeltaY;

      newX = Math.max(0, Math.min(WORLD_WIDTH - module.width, newX));
      newY = Math.max(0, Math.min(WORLD_HEIGHT - module.height, newY));

      updateModuleThrottled(module.id, { x: newX, y: newY });

      animationFrameId = requestAnimationFrame(animate);
    };

    const onMove = (ev: MouseEvent) => {
      ev.preventDefault();
      currentMouseX = ev.clientX;
      currentMouseY = ev.clientY;
    };

    const onUp = () => {
      isDragging = false; 
      setIsDraggingWindow(false);

      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    
    animationFrameId = requestAnimationFrame(animate);
  }, [module.id, module.x, module.y, module.width, module.height, panX, panY, zoom, topBarHeight, 
    notesBarHeight, setActiveModule, updateModuleThrottled, isLocked ]);

const onResizeMouseDown = useCallback((e: React.MouseEvent, dir: ResizeDir) => {
    if (isLocked || usePersonalizedDashboardStore.getState().uiBlocked) return;
    e.stopPropagation();  
    e.preventDefault();

    setActiveModule(module.id);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = module.width;
    const startHeight = module.height;
    const startLeft = module.x;
    const startTop = module.y;
    let startPanX = panX;
    let startPanY = panY;

    let currentMouseX = e.clientX;
    let currentMouseY = e.clientY;
    let animationFrameId: number | null = null;
    let isResizing = true;

    const animate = () => {
      if (!isResizing) return;

      const store = usePersonalizedDashboardStore.getState();

      const vw = window.innerWidth;
      const vh = window.innerHeight - topBarHeight - notesBarHeight;
      const worldW = WORLD_WIDTH * zoom;
      const worldH = WORLD_HEIGHT * zoom;

      const canPanHorizontally = worldW > vw;
      const canPanVertically = worldH > vh;

      const maxPanX = 0;
      const minPanX = vw - worldW;
      const maxPanY = 0;
      const minPanY = vh - worldH;

      const panDeltaX = store.panX - startPanX;
      const panDeltaY = store.panY - startPanY;

      const mouseDeltaX = currentMouseX - startX;
      const mouseDeltaY = currentMouseY - startY;

      const worldDeltaX = (mouseDeltaX - panDeltaX) / zoom;
      const worldDeltaY = (mouseDeltaY - panDeltaY) / zoom;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startLeft;
      let newY = startTop;

      if (dir.includes("right")) newWidth = startWidth + worldDeltaX;
      if (dir.includes("left")) {
        newWidth = startWidth - worldDeltaX;
        newX = startLeft + worldDeltaX;
      }
      if (dir.includes("bottom")) newHeight = startHeight + worldDeltaY;
      if (dir.includes("top")) {
        newHeight = startHeight - worldDeltaY;
        newY = startTop + worldDeltaY;
      }

      if (newWidth < minSizes.width) {
        newWidth = minSizes.width;
        if (dir.includes("left")) newX = startLeft + startWidth - minSizes.width;
      }
      if (newHeight < minSizes.height) {
        newHeight = minSizes.height;
        if (dir.includes("top")) newY = startTop + startHeight - minSizes.height;
      }

      if (newX < 0) { newWidth += newX; newX = 0; }
      if (newY < 0) { newHeight += newY; newY = 0; }
      if (newX + newWidth > WORLD_WIDTH) newWidth = WORLD_WIDTH - newX;
      if (newY + newHeight > WORLD_HEIGHT) newHeight = WORLD_HEIGHT - newY;

      const EDGE_THRESHOLD = 30;
      const mouseNearLeftEdge = currentMouseX < EDGE_THRESHOLD;
      const mouseNearRightEdge = currentMouseX > vw - EDGE_THRESHOLD;
      const mouseNearTopEdge = currentMouseY < topBarHeight + EDGE_THRESHOLD;
const viewportHeight = window.innerHeight - topBarHeight - notesBarHeight;
const mouseNearBottomEdge = currentMouseY > topBarHeight + viewportHeight - EDGE_THRESHOLD;
      const hitLeftWorldEdge = dir.includes("left") && newX === 0;
      const hitRightWorldEdge = dir.includes("right") && (newX + newWidth) === WORLD_WIDTH;
      const hitTopWorldEdge = dir.includes("top") && newY === 0;
      const hitBottomWorldEdge = dir.includes("bottom") && (newY + newHeight) === WORLD_HEIGHT;

      const canPanLeft = canPanHorizontally && store.panX < maxPanX;
      const canPanRight = canPanHorizontally && store.panX > minPanX;
      const canPanUp = canPanVertically && store.panY < maxPanY;
      const canPanDown = canPanVertically && store.panY > minPanY;

      let panSpeedX = 0;
      let panSpeedY = 0;

      if (mouseNearLeftEdge && !hitLeftWorldEdge && canPanLeft) {
        panSpeedX = 10;
      }
      else if (mouseNearRightEdge && !hitRightWorldEdge && canPanRight) {
        panSpeedX = -10;
      }

      if (mouseNearTopEdge && !hitTopWorldEdge && canPanUp) {
        panSpeedY = 10;
      }
      else if (mouseNearBottomEdge && !hitBottomWorldEdge && canPanDown) {
        panSpeedY = -10;
      }

      if (panSpeedX !== 0 || panSpeedY !== 0) {
        const nextPanX = store.panX + panSpeedX;
        const nextPanY = store.panY + panSpeedY;
        
        const clampedPanX = Math.min(maxPanX, Math.max(minPanX, nextPanX));
        const clampedPanY = Math.min(maxPanY, Math.max(minPanY, nextPanY));
        
        store.setPan(clampedPanX, clampedPanY);
      }



      updateModuleThrottled(module.id, {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
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
        animationFrameId = null;
      }
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    animationFrameId = requestAnimationFrame(animate);
  }, [module.id, module.width, module.height, module.x, module.y, panX, panY, zoom, topBarHeight, 
    notesBarHeight, minSizes, setActiveModule, updateModuleThrottled, isLocked]);

  const responsiveFontSize = useMemo(() => {
    const combinedZoom = zoom * (moduleZoom / 100);
    const baseFontSize = 12;
    const calculatedSize = baseFontSize / combinedZoom;
    return `clamp(10px, ${calculatedSize}px, 16px)`;
  }, [zoom, moduleZoom]);

  return (
    <div
      ref={ref}
      data-module-window 
      className={`absolute rounded-2xl border backdrop-blur
        select-none overflow-hidden
${isLocked 
  ? "border-amber-500/30 bg-[#041F20]/98" 
  : swapSourceId === module.id
    ? "border-blue-400 bg-[#041F20]/95"
    : sizeSourceId === module.id
      ? "border-yellow-400 bg-[#041F20]/95"
      : isActive 
        ? "border-teal-400 bg-[#041F20]/95"
        : "border-white/10 bg-[#041F20]/95"
}`}
      style={{
        left: module.x,
        top: module.y,
        width: module.width,
height: module.minimized ? headerHeight : module.height,
        zIndex: isDraggingWindow ? 99999 : (isActive ? 50 : 10),
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        transform: "translateZ(0)",
      }}
     onMouseDown={() => { setActiveModule(module.id); }}
    >

<div
  data-module-header
  ref={(el) => {
    if (el && el.offsetHeight !== headerHeight) {
      setHeaderHeight(el.offsetHeight);
    }
  }}
  onMouseDown={onDragMouseDown}
className={`flex items-center justify-between px-4 py-2
  border-b border-white/10 ${isLocked ? "cursor-default" : "cursor-move"}`}
>

<div className="flex items-center gap-2 min-w-0 flex-1">
<span className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.35)] flex-shrink-0" />
  <div className="text-[12px] font-semibold text-white/90 truncate">
    {module.title}
  </div>
</div>

<div className="flex gap-2 items-center flex-shrink-0">
    <button
onClick={(e) => {
      e.stopPropagation();
      if (usePersonalizedDashboardStore.getState().uiBlocked) return;
      toggleModuleLock(module.id);
    }}

    className={`h-6 w-6 rounded-md border transition-all cursor-pointer flex items-center justify-center
      ${isLocked 
        ? "bg-amber-500/20 border-amber-500/50 text-amber-400" 
        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
      }`}
    title={isLocked ? "Unlock Module" : "Lock Module"}
  >
    {isLocked ? (
      <Lock className="w-3 h-3" />
    ) : (
      <Unlock className="w-3 h-3" />
    )}
  </button>

  <div className="flex items-center gap-1 bg-[#0b1f1f] border border-white/10 rounded-md px-2 py-1">


    <button
      onClick={() => { if (usePersonalizedDashboardStore.getState().uiBlocked) return; zoomOut(); }}
      className="p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
      title="Zoom Out"
    >
      <ZoomOut className="w-3 h-3 text-white/60 hover:text-white" />
    </button>
    <span className="text-white/60 font-mono text-[9px] min-w-[2rem] text-center">
      {moduleZoom}%
    </span>
    <button
      onClick={() => { if (usePersonalizedDashboardStore.getState().uiBlocked) return; zoomIn(); }}
      className="p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
      title="Zoom In"
    >
      <ZoomIn className="w-3 h-3 text-white/60 hover:text-white" />
    </button>
    <button
      onClick={() => { if (usePersonalizedDashboardStore.getState().uiBlocked) return; resetZoom(); }}
      className="p-1 hover:bg-white/10 rounded transition-colors cursor-pointer ml-1 border-l border-white/10 pl-1.5"
      title="Reset Zoom"
    >
      <RotateCcw className="w-3 h-3 text-white/60 hover:text-white" />
    </button>
  </div>

<div className="flex gap-1">
  <button
    onClick={() => {
      if (usePersonalizedDashboardStore.getState().uiBlocked) return;
      updateModule(module.id, { minimized: !module.minimized });
    }}
className="h-6 w-6 rounded-md border border-white/10 bg-white/5
  text-white/70 hover:bg-white/10 cursor-pointer flex items-center justify-center"
title={module.minimized ? "Restore" : "Minimize"}
  >
    {module.minimized ? <Maximize2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
  </button>

  <button
    onClick={() => {
      if (usePersonalizedDashboardStore.getState().uiBlocked) return;
      removeModule(module.id);
      useDashboardNotificationStore.getState().push({
        type: "success",
        title: "Module Removed",
        description: `${module.title} removed from dashboard`,
      });
    }}
className="h-6 w-6 rounded-md border border-white/10 bg-white/5
  hover:bg-red-500/80 cursor-pointer flex items-center justify-center"
  title="Remove Module"
  >
    <X className="w-3 h-3 text-white/70" />
  </button>
</div>

          
        </div>
      </div>

{(swapSourceId === module.id || sizeSourceId === module.id) && (
<div className="absolute inset-x-0 bottom-0 z-50 flex flex-col items-center justify-center gap-2 pointer-events-none"
  style={{
    top: headerHeight,
    background: swapSourceId === module.id && sizeSourceId === module.id
      ? "color-mix(in srgb, rgb(59 130 246 / 0.1), rgb(234 179 8 / 0.1))"
      : swapSourceId === module.id
        ? "rgb(59 130 246 / 0.1)"
        : "rgb(234 179 8 / 0.1)"
  }}
>
    {swapSourceId === module.id && (
      <span className="text-blue-300 text-xs font-semibold bg-blue-500/20 px-3 py-1.5 rounded-lg border border-blue-400/30">
        Click another module to swap
      </span>
    )}
    {sizeSourceId === module.id && (
      <span className="text-yellow-300 text-xs font-semibold bg-yellow-500/20 px-3 py-1.5 rounded-lg border border-yellow-400/30">
        Click another module to apply size
      </span>
    )}
  </div>
)}



           {!module.minimized && (
<div className="overflow-hidden relative" style={{ height: `calc(100% - ${headerHeight}px)` }}>
       <div 
         onWheel={(e) => e.stopPropagation()}
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
              fontSize: responsiveFontSize,
              transform: `scale(${moduleZoom / 100})`,
              transformOrigin: "top left",
              width: `${(100 / moduleZoom) * 100}%`,
              height: `${(100 / moduleZoom) * 100}%`,
            }}
          >
            {def?.render?.(module.id)}
          </div>
        </div>
      )}

      {!module.minimized && !isLocked && (
        <>
          <div
            data-module-resize
            onMouseDown={(e) => onResizeMouseDown(e, "top-left")}
            className="absolute top-0 left-0 w-6 h-6 cursor-nwse-resize"
          />
          <div
            data-module-resize
            onMouseDown={(e) => onResizeMouseDown(e, "top-right")}
            className="absolute top-0 right-0 w-6 h-6 cursor-nesw-resize"
          />
          <div
            data-module-resize
            onMouseDown={(e) => onResizeMouseDown(e, "bottom-left")}
            className="absolute bottom-0 left-0 w-6 h-6 cursor-nesw-resize"
          />
          <div
            data-module-resize
            onMouseDown={(e) => onResizeMouseDown(e, "bottom-right")}
            className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize"
          />
        </>
      )}

      {contextMenu && createPortal(
        <div
          data-context-menu
style={{
  position: "fixed",
  top: Math.max(8, Math.min(contextMenu.y, window.innerHeight - 160 - 8)),
  left: Math.max(8, Math.min(contextMenu.x, window.innerWidth - 160 - 8)),
  zIndex: 99999,
}}
          className="bg-[#041F20] border border-white/10 rounded-xl shadow-xl p-1.5 flex flex-col gap-1 min-w-[160px]"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setContextMenu(null);
              if (usePersonalizedDashboardStore.getState().uiBlocked) return;
              if (!swapSourceId) { setSwapSource(module.id); return; }
              if (swapSourceId === module.id) { setSwapSource(null); return; }
              swapModules(swapSourceId, module.id);
            }}
            className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer
              ${swapSourceId === module.id
                ? "bg-teal-400/25 text-teal-300"
                : "text-white/70 hover:bg-white/10"
              }`}
          >
            <ArrowLeftRight className="w-3 h-3" />
            {swapSourceId === module.id ? "Cancel Swap" : swapSourceId ? "Swap with this" : "Swap Position"}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setContextMenu(null);
              if (usePersonalizedDashboardStore.getState().uiBlocked) return;
              const { panX: px, panY: py, zoom: z, topBarHeight: tbh, notesBarHeight: nbh } = usePersonalizedDashboardStore.getState();
              const vw = window.innerWidth;
              const vh = window.innerHeight - tbh - nbh;
              const worldCenterX = (-px + vw / 2) / z;
              const worldCenterY = (-py + vh / 2) / z;
              const newX = Math.max(0, Math.min(worldCenterX - module.width / 2, WORLD_WIDTH - module.width));
              const newY = Math.max(0, Math.min(worldCenterY - module.height / 2, WORLD_HEIGHT - module.height));
              const newId = crypto.randomUUID();
              addModule({ id: newId, type: module.type, title: module.title, category: module.category, x: newX, y: newY, width: module.width, height: module.height, contentZoom: moduleZoom });
              if (isLocked) toggleModuleLock(newId);
              useDashboardNotificationStore.getState().push({ type: "success", title: "Module Duplicated", description: `${module.title} duplicated` });
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] text-white/70 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Copy className="w-3 h-3" />
            Duplicate Module
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setContextMenu(null);
              if (usePersonalizedDashboardStore.getState().uiBlocked) return;
              if (!sizeSourceId) { setSizeSource(module.id); return; }
              if (sizeSourceId === module.id) { setSizeSource(null); return; }
              applySizeFromSource(sizeSourceId, module.id);
            }}
            className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer
              ${sizeSourceId === module.id
                ? "bg-teal-400/25 text-teal-300"
                : "text-white/70 hover:bg-white/10"
              }`}
          >
            <Scaling className="w-3 h-3" />
            {sizeSourceId === module.id ? "Cancel Size Copy" : sizeSourceId ? "Apply size here" : "Copy Size"}
          </button>
        </div>,
        document.body
      )}


    </div>

  );
}