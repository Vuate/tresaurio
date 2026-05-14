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
// Limits how often a function can fire — at most once per limit ms. Used to cap drag and resize update frequency.
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

//  Syncs local content zoom state with the persisted module.contentZoom value whenever it changes externally.
const [moduleZoom, setModuleZoom] = useState(module.contentZoom ?? 100);
useEffect(() => {
  setModuleZoom(module.contentZoom ?? 100);
}, [module.contentZoom]);

const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
const closeButtonRef = useRef<HTMLButtonElement>(null);
const wasTouchRef = useRef(false);

useEffect(() => {
  const onTouch = () => { wasTouchRef.current = true; };
  window.addEventListener('touchstart', onTouch, { once: true });
  return () => window.removeEventListener('touchstart', onTouch);
}, []);

useEffect(() => {
  const btn = closeButtonRef.current;
  if (!btn) return;
  const onTouch = (e: TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (usePersonalizedDashboardStore.getState().uiBlocked) return;
    removeModule(module.id);
    useDashboardNotificationStore.getState().push({
      type: "info",
      title: "Module Removed",
      description: `${module.title} removed from dashboard`,
    });
  };
  btn.addEventListener('touchend', onTouch, { passive: false });
  return () => btn.removeEventListener('touchend', onTouch);
}, [module.id, module.title, removeModule]);

// Returns inline styles for header buttons — hovered button scales up, others scale down and fade.
const btnScale = (id: string) => ({
  transform: (!wasTouchRef.current && hoveredBtn === id)
    ? 'scale(1.80)'
    : (!wasTouchRef.current && hoveredBtn !== null)
      ? 'scale(0.7)'
      : 'scale(1)',
  opacity: (!wasTouchRef.current && hoveredBtn !== null && hoveredBtn !== id) ? 0.35 : 1,
  filter: (!wasTouchRef.current && hoveredBtn === id) ? 'brightness(1.4)' : 'none',
  transition: 'transform 0.18s ease, opacity 0.18s ease, filter 0.18s ease',
  zIndex: (!wasTouchRef.current && hoveredBtn === id) ? 999 : 'auto',
  position: 'relative' as const,
});



// Content zoom controls — clamp between 50% and 200%, then persist the new value to the store.
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

// Attaches a right-click listener to the module window to open the context menu at the cursor position.
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

// Closes the context menu when the user clicks outside it or scrolls the canvas.
useEffect(() => {
  if (!contextMenu) return;
  const close = (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-context-menu]')) return;
    setContextMenu(null);
  };
  window.addEventListener("mousedown", close, true);
  window.addEventListener("wheel", close, true);
    window.addEventListener("touchstart", close, true);

  return () => {
    window.removeEventListener("mousedown", close, true);
    window.removeEventListener("wheel", close, true);
        window.removeEventListener("touchstart", close, true);

  };
}, [contextMenu]);

  const minSizes = useMemo(() => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 768;
    
    return {
      width: 300,
      height: 200,
    };
  }, []);

  // Throttled wrapper around updateModule — limits store writes to 60fps during drag and resize.
  const updateModuleThrottled = useMemo(
    () => throttle((id: string, updates: Partial<ModuleInstance>) => {
      updateModule(id, updates);
    }, 16), // 60fps
    [updateModule]
  );

// Touch drag handler — moves the module and auto-pans the canvas when dragged near screen edges.
const onDragTouchStart = useCallback((e: React.TouchEvent) => {
  if (isLocked || usePersonalizedDashboardStore.getState().uiBlocked) return;
  if (e.touches.length !== 1) return;
  const target = e.target as HTMLElement;
  if (target.closest('button, input, textarea, select, [contenteditable]')) return;
  e.stopPropagation();

  // long press'i iptal et — drag başladı
  if (longPressTimerRef.current) { clearTimeout(longPressTimerRef.current); longPressTimerRef.current = null; }

  setActiveModule(module.id);
  setIsDraggingWindow(true);

  const touch = e.touches[0];
  const startX = touch.clientX;
  const startY = touch.clientY;
  const startModuleX = module.x;
  const startModuleY = module.y;
  let startPanX = panX;
  let startPanY = panY;

  let currentTouchX = touch.clientX;
  let currentTouchY = touch.clientY;
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
    const maxPanX = 0; const minPanX = vw - worldW;
    const maxPanY = 0; const minPanY = vh - worldH;
    const mouseDeltaX = currentTouchX - startX;
    const mouseDeltaY = currentTouchY - startY;
    const totalPanDeltaX = store.panX - startPanX;
    const totalPanDeltaY = store.panY - startPanY;
    const EDGE_THRESHOLD = 30;
    const canPanLeft = canPanHorizontally && store.panX < maxPanX;
    const canPanRight = canPanHorizontally && store.panX > minPanX;
    const canPanUp = canPanVertically && store.panY < maxPanY;
    const canPanDown = canPanVertically && store.panY > minPanY;
    const finalWorldDeltaX = (mouseDeltaX - totalPanDeltaX) / zoom;
    const finalWorldDeltaY = (mouseDeltaY - totalPanDeltaY) / zoom;
    let newX = Math.max(0, Math.min(WORLD_WIDTH - module.width, startModuleX + finalWorldDeltaX));
    let newY = Math.max(0, Math.min(WORLD_HEIGHT - module.height, startModuleY + finalWorldDeltaY));
    let panSpeedX = 0; let panSpeedY = 0;
    if (currentTouchX < EDGE_THRESHOLD && newX > 0 && canPanLeft) panSpeedX = 10;
    else if (currentTouchX > vw - EDGE_THRESHOLD && newX < WORLD_WIDTH - module.width && canPanRight) panSpeedX = -10;
    if (currentTouchY < topBarHeight + EDGE_THRESHOLD && newY > 0 && canPanUp) panSpeedY = 10;
    else if (currentTouchY > topBarHeight + vh - EDGE_THRESHOLD && newY < WORLD_HEIGHT - module.height && canPanDown) panSpeedY = -10;
    if (panSpeedX !== 0 || panSpeedY !== 0) {
      store.setPan(
        Math.min(maxPanX, Math.max(minPanX, store.panX + panSpeedX)),
        Math.min(maxPanY, Math.max(minPanY, store.panY + panSpeedY)),
      );
    }
    updateModuleThrottled(module.id, { x: newX, y: newY });
    animationFrameId = requestAnimationFrame(animate);
  };

  const onMove = (ev: TouchEvent) => {
    ev.preventDefault();
    if (ev.touches.length === 1) {
      currentTouchX = ev.touches[0].clientX;
      currentTouchY = ev.touches[0].clientY;
    }
  };

  const onEnd = () => {
    isDragging = false;
    setIsDraggingWindow(false);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    window.removeEventListener("touchmove", onMove);
    window.removeEventListener("touchend", onEnd);
  };

  window.addEventListener("touchmove", onMove, { passive: false });
  window.addEventListener("touchend", onEnd);
  animationFrameId = requestAnimationFrame(animate);
}, [module.id, module.x, module.y, module.width, module.height, panX, panY, zoom,
  topBarHeight, notesBarHeight, setActiveModule, updateModuleThrottled, isLocked]);

  // Touch resize handler for all four corners. Enforces min size and auto-pans near screen edges.
  const onResizeTouchStart = useCallback((e: React.TouchEvent, dir: ResizeDir) => {
  if (isLocked || usePersonalizedDashboardStore.getState().uiBlocked) return;
  if (e.touches.length !== 1) return;
  e.stopPropagation();

  setActiveModule(module.id);

  const touch = e.touches[0];
  const startX = touch.clientX;
  const startY = touch.clientY;
  const startWidth = module.width;
  const startHeight = module.height;
  const startLeft = module.x;
  const startTop = module.y;
  let startPanX = panX;
  let startPanY = panY;

  let currentTouchX = touch.clientX;
  let currentTouchY = touch.clientY;
  let animationFrameId: number | null = null;
  let isResizing = true;

  const animate = () => {
    if (!isResizing) return;
    const store = usePersonalizedDashboardStore.getState();
    const vw = window.innerWidth;
    const vh = window.innerHeight - topBarHeight - notesBarHeight;
    const worldW = WORLD_WIDTH * zoom; const worldH = WORLD_HEIGHT * zoom;
    const canPanHorizontally = worldW > vw; const canPanVertically = worldH > vh;
    const maxPanX = 0; const minPanX = vw - worldW;
    const maxPanY = 0; const minPanY = vh - worldH;
    const panDeltaX = store.panX - startPanX;
    const panDeltaY = store.panY - startPanY;
    const worldDeltaX = (currentTouchX - startX - panDeltaX) / zoom;
    const worldDeltaY = (currentTouchY - startY - panDeltaY) / zoom;
    let newWidth = startWidth; let newHeight = startHeight;
    let newX = startLeft; let newY = startTop;
    if (dir.includes("right")) newWidth = startWidth + worldDeltaX;
    if (dir.includes("left")) { newWidth = startWidth - worldDeltaX; newX = startLeft + worldDeltaX; }
    if (dir.includes("bottom")) newHeight = startHeight + worldDeltaY;
    if (dir.includes("top")) { newHeight = startHeight - worldDeltaY; newY = startTop + worldDeltaY; }
    if (newWidth < minSizes.width) { newWidth = minSizes.width; if (dir.includes("left")) newX = startLeft + startWidth - minSizes.width; }
    if (newHeight < minSizes.height) { newHeight = minSizes.height; if (dir.includes("top")) newY = startTop + startHeight - minSizes.height; }
    if (newX < 0) { newWidth += newX; newX = 0; }
    if (newY < 0) { newHeight += newY; newY = 0; }
    if (newX + newWidth > WORLD_WIDTH) newWidth = WORLD_WIDTH - newX;
    if (newY + newHeight > WORLD_HEIGHT) newHeight = WORLD_HEIGHT - newY;
    const EDGE_THRESHOLD = 30;
    const canPanLeft = canPanHorizontally && store.panX < maxPanX;
    const canPanRight = canPanHorizontally && store.panX > minPanX;
    const canPanUp = canPanVertically && store.panY < maxPanY;
    const canPanDown = canPanVertically && store.panY > minPanY;
    let panSpeedX = 0; let panSpeedY = 0;
    if (currentTouchX < EDGE_THRESHOLD && canPanLeft) panSpeedX = 10;
    else if (currentTouchX > vw - EDGE_THRESHOLD && canPanRight) panSpeedX = -10;
    if (currentTouchY < topBarHeight + EDGE_THRESHOLD && canPanUp) panSpeedY = 10;
    else if (currentTouchY > topBarHeight + vh - EDGE_THRESHOLD && canPanDown) panSpeedY = -10;
    if (panSpeedX !== 0 || panSpeedY !== 0) {
      store.setPan(
        Math.min(maxPanX, Math.max(minPanX, store.panX + panSpeedX)),
        Math.min(maxPanY, Math.max(minPanY, store.panY + panSpeedY)),
      );
    }
    updateModuleThrottled(module.id, { x: newX, y: newY, width: newWidth, height: newHeight });
    animationFrameId = requestAnimationFrame(animate);
  };

  const onMove = (ev: TouchEvent) => {
    ev.preventDefault();
    if (ev.touches.length === 1) {
      currentTouchX = ev.touches[0].clientX;
      currentTouchY = ev.touches[0].clientY;
    }
  };

  const onEnd = () => {
    isResizing = false;
    if (animationFrameId !== null) { cancelAnimationFrame(animationFrameId); animationFrameId = null; }
    window.removeEventListener("touchmove", onMove);
    window.removeEventListener("touchend", onEnd);
  };

  window.addEventListener("touchmove", onMove, { passive: false });
  window.addEventListener("touchend", onEnd);
  animationFrameId = requestAnimationFrame(animate);
}, [module.id, module.width, module.height, module.x, module.y, panX, panY, zoom,
  topBarHeight, notesBarHeight, minSizes, setActiveModule, updateModuleThrottled, isLocked]);
  

// Handles drag-to-move using a rAF animation loop. Auto-pans the viewport when dragged near screen edges.
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

// Handles corner resize for all four handles. Enforces min size constraints and auto-pans near screen edges.
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

  // Computes a CSS clamp font-size that counteracts the combined canvas zoom and module content zoom.
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
      data-module
      className={`absolute rounded-2xl border backdrop-blur
        select-none overflow-hidden
            ${isLocked
      ? "border-amber-500/30 bg-card"
      : swapSourceId === module.id
        ? "border-blue-500 dark:border-blue-400 bg-card"
        : sizeSourceId === module.id
          ? "border-emerald-500 dark:border-emerald-400 bg-card"
          : isActive
            ? "border-[#1A73E8]/70 bg-card"
            : "border-border bg-card"

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
onTouchStart={(e) => {
  setActiveModule(module.id);
  if (e.touches.length !== 1) return;
  const touch = e.touches[0];
  longPressTimerRef.current = setTimeout(() => {
    setContextMenu({ x: touch.clientX, y: touch.clientY });
  }, 500);
  (longPressTimerRef as any)._startX = touch.clientX;
  (longPressTimerRef as any)._startY = touch.clientY;
}}
onTouchMove={(e) => {
  if (!longPressTimerRef.current) return;
  const touch = e.touches[0];
  const dx = touch.clientX - (longPressTimerRef as any)._startX;
  const dy = touch.clientY - (longPressTimerRef as any)._startY;
  if (Math.hypot(dx, dy) > 10) {
    clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = null;
  }
}}
onTouchEnd={() => { if (longPressTimerRef.current) { clearTimeout(longPressTimerRef.current); longPressTimerRef.current = null; } }}


>

<div
  data-module-header
  ref={(el) => {
    if (el && el.offsetHeight !== headerHeight) {
      setHeaderHeight(el.offsetHeight);
    }
  }}
  onMouseDown={onDragMouseDown}
  onTouchStart={onDragTouchStart}
className={`flex items-center justify-between px-4 py-2
  border-b border-border ${isLocked ? "cursor-default" : "cursor-move"}`}
>

<div className="flex items-center gap-2 min-w-0 flex-1">
<span className="w-2 h-2 rounded-full bg-[#1A73E8] shadow-[0_0_10px_rgba(26,115,232,0.35)] flex-shrink-0" />
  <div className="text-[12px] font-semibold text-foreground truncate">
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
  className={`h-6 w-6 rounded-md border cursor-pointer flex items-center justify-center
    ${isLocked
      ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
      : "bg-input border-border text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10"
    }`}
  style={btnScale('lock')}
  onMouseEnter={() => setHoveredBtn('lock')}
  onMouseLeave={() => setHoveredBtn(null)}
  title={isLocked ? "Unlock Module" : "Lock Module"}
>
    {isLocked ? (
      <Lock className="w-3 h-3" />
    ) : (
      <Unlock className="w-3 h-3" />
    )}
  </button>

  <div className="flex items-center gap-1 bg-input border border-border rounded-md px-2 py-1">


<button
  onClick={() => { if (usePersonalizedDashboardStore.getState().uiBlocked) return; zoomOut(); }}
  className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded cursor-pointer"
  style={btnScale('zoomout')}
  onMouseEnter={() => setHoveredBtn('zoomout')}
  onMouseLeave={() => setHoveredBtn(null)}
  title="Zoom Out"
>
      <ZoomOut className="w-3 h-3 text-muted-foreground hover:text-foreground" />
    </button>
    <span className="text-muted-foreground font-mono text-[9px] min-w-[2rem] text-center">
      {moduleZoom}%
    </span>
<button
  onClick={() => { if (usePersonalizedDashboardStore.getState().uiBlocked) return; zoomIn(); }}
  className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded cursor-pointer"
  style={btnScale('zoomin')}
  onMouseEnter={() => setHoveredBtn('zoomin')}
  onMouseLeave={() => setHoveredBtn(null)}
  title="Zoom In"
>
      <ZoomIn className="w-3 h-3 text-muted-foreground hover:text-foreground" />
    </button>
<button
  onClick={() => { if (usePersonalizedDashboardStore.getState().uiBlocked) return; resetZoom(); }}
  className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded cursor-pointer ml-1 border-l border-border pl-1.5"
  style={btnScale('reset')}
  onMouseEnter={() => setHoveredBtn('reset')}
  onMouseLeave={() => setHoveredBtn(null)}
  title="Reset Zoom"
>
      <RotateCcw className="w-3 h-3 text-muted-foreground hover:text-foreground" />
    </button>
  </div>

<div className="flex gap-1">
  <button
    onClick={() => {
      if (usePersonalizedDashboardStore.getState().uiBlocked) return;
      updateModule(module.id, { minimized: !module.minimized });
    }}
className="h-6 w-6 rounded-md border border-border bg-input
  text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer flex items-center justify-center"
style={btnScale('minimize')}
onMouseEnter={() => setHoveredBtn('minimize')}
onMouseLeave={() => setHoveredBtn(null)}
title={module.minimized ? "Restore" : "Minimize"}
  >
    {module.minimized ? <Maximize2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
  </button>

<button
  ref={closeButtonRef}
  onClick={() => {
    if (usePersonalizedDashboardStore.getState().uiBlocked) return;
    removeModule(module.id);
    useDashboardNotificationStore.getState().push({
      type: "info",
      title: "Module Removed",
      description: `${module.title} removed from dashboard`,
    });
  }}

className="h-6 w-6 rounded-md border border-border bg-input
  hover:bg-red-500/80 cursor-pointer flex items-center justify-center"
style={btnScale('close')}
onMouseEnter={() => setHoveredBtn('close')}
onMouseLeave={() => setHoveredBtn(null)}
title="Remove Module"
  >
    <X className="w-3 h-3 text-muted-foreground" />
  </button>
</div>
          
        </div>
      </div>

    {(swapSourceId === module.id || sizeSourceId === module.id) && (
    <div className="absolute inset-x-0 bottom-0 z-50 flex flex-col items-center justify-center gap-2 pointer-events-none"
      style={{
        top: headerHeight,
        background: swapSourceId === module.id && sizeSourceId === module.id
          ? "color-mix(in srgb, rgb(59 130 246 / 0.08), rgb(16 185 129 / 0.08))"
          : swapSourceId === module.id
            ? "rgb(59 130 246 / 0.08)"
            : "rgb(16 185 129 / 0.08)"
      }}
    >
    {swapSourceId === module.id && (
      <span className="text-blue-600 dark:text-blue-300 text-xs font-semibold bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 dark:border-blue-400/30">
        Click another module to swap
      </span>
    )}
    {sizeSourceId === module.id && (
      <span className="text-emerald-600 dark:text-emerald-300 text-xs font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 dark:border-emerald-400/30">
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
              text-foreground leading-relaxed

              [&_*]:select-none
              [&_input]:select-text
              [&_textarea]:select-text
              [&_select]:select-text

              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:bg-transparent
[&::-webkit-scrollbar-thumb]:bg-black/20 dark:[&::-webkit-scrollbar-thumb]:bg-white/20
              [&::-webkit-scrollbar-thumb]:rounded-full
[&::-webkit-scrollbar-thumb:hover]:bg-black/30 dark:[&::-webkit-scrollbar-thumb:hover]:bg-white/40
              scrollbar-thin
              scrollbar-thumb-[#1A73E8]/30
              scrollbar-track-transparent [scrollbar-color:rgba(0,0,0,0.5)_transparent] dark:[scrollbar-color:rgba(255,255,255,0.5)_transparent]
            "
            style={{
              touchAction: 'pan-y',
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
            onTouchStart={(e) => onResizeTouchStart(e, "top-left")}
            className="absolute top-0 left-0 w-6 h-6 md:w-6 md:h-6 cursor-nwse-resize"
          />
          <div
            data-module-resize
            onMouseDown={(e) => onResizeMouseDown(e, "top-right")}
            onTouchStart={(e) => onResizeTouchStart(e, "top-right")}
            className="absolute top-0 right-0 w-6 h-6 md:w-6 md:h-6 cursor-nesw-resize"
          />
          <div
            data-module-resize
            onMouseDown={(e) => onResizeMouseDown(e, "bottom-left")}
            onTouchStart={(e) => onResizeTouchStart(e, "bottom-left")}
            className="absolute bottom-0 left-0 w-6 h-6 md:w-6 md:h-6 cursor-nesw-resize"
          />
          <div
            data-module-resize
            onMouseDown={(e) => onResizeMouseDown(e, "bottom-right")}
            onTouchStart={(e) => onResizeTouchStart(e, "bottom-right")}
            className="absolute bottom-0 right-0 w-6 h-6 md:w-6 md:h-6 cursor-nwse-resize"
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
          className="bg-background border border-border rounded-xl shadow-xl p-1.5 flex flex-col gap-1 min-w-[160px]"
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
                ? "bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300"
                : "text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10"
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
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
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
                ? "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300"
                : "text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10"
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