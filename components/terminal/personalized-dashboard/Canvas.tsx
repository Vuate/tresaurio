"use client";

import { useEffect, useRef } from "react";

import { usePersonalizedDashboardStore, MAX_ZOOM, WORLD_WIDTH, WORLD_HEIGHT, calculateMinZoom } 
from "@/store/personalizedDashboardStore";

import ModuleWindow from "./ModuleWindow";
import SidebarPanel from "./SidebarPanel";
import DashboardNotifications from "./DashboardNotifications";


export default function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
const didInitRef = useRef(false);

  // Panning state refs — isPanningRef tracks whether a drag is active, startRef stores the initial pointer offset for computing delta movement.
  const isPanningRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0 });
  const {
    zoom,
    panX,
    panY,
    setZoom,
    setPan,
    modules,
    topBarHeight,
    notesBarHeight, 
  } = usePersonalizedDashboardStore();

// Mirrors panX/panY state to refs so drag event listeners always read the latest value without stale closures.
const panXRef = useRef(panX);
const panYRef = useRef(panY);
const zoomRef = useRef(zoom);
const lastPinchDistRef = useRef<number | null>(null);
useEffect(() => { panXRef.current = panX; }, [panX]);
useEffect(() => { panYRef.current = panY; }, [panY]);
useEffect(() => { zoomRef.current = zoom; }, [zoom]);


// Blocks browser zoom (Ctrl+scroll or trackpad pinch) across the entire page.
useEffect(() => {
  const preventBrowserZoom = (e: WheelEvent) => {
    if (e.ctrlKey) e.preventDefault();
  };
  window.addEventListener("wheel", preventBrowserZoom, { passive: false, capture: true });
  return () => window.removeEventListener("wheel", preventBrowserZoom, { capture: true });
}, []);

// Touch: single finger pan, two finger pinch zoom
useEffect(() => {
  const container = containerRef.current;
  if (!container) return;

  const onTouchStart = (e: TouchEvent) => {
    const target = e.target as HTMLElement;
if (target.closest('[data-minimap]')) return;
    if (usePersonalizedDashboardStore.getState().uiBlocked) return;
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const target = touch.target as HTMLElement;
      if (
        target.closest('[data-module-header]') ||
        target.closest('[data-module-resize]') ||
        target.closest('[data-module]') ||
        target.closest('input, textarea, select, button, [contenteditable], a[href], [data-notification]')
      ) return;
      isPanningRef.current = true;
      startRef.current = {
        x: touch.clientX - panXRef.current,
        y: touch.clientY - panYRef.current,
      };
      e.preventDefault();
    } else if (e.touches.length === 2) {
      if ((e.target as HTMLElement).closest('[data-module]')) return;
      isPanningRef.current = false;
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      lastPinchDistRef.current = Math.hypot(dx, dy);
      e.preventDefault();
    }
  };

  const onTouchMove = (e: TouchEvent) => {
    if (usePersonalizedDashboardStore.getState().uiBlocked) return;
    if ((e.target as HTMLElement).closest('[data-module]')) return;
    e.preventDefault();

    if (e.touches.length === 1 && isPanningRef.current) {
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      const currentZoom = zoomRef.current;
      let x = touch.clientX - startRef.current.x;
      let y = touch.clientY - startRef.current.y;
      const minPanX = rect.width - WORLD_WIDTH * currentZoom;
      const minPanY = rect.height - WORLD_HEIGHT * currentZoom;
      x = Math.min(0, Math.max(minPanX, x));
      y = Math.min(0, Math.max(minPanY, y));
      setPan(x, y);

    } else if (e.touches.length === 2 && lastPinchDistRef.current !== null) {
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      const newDist = Math.hypot(dx, dy);
      const scale = newDist / lastPinchDistRef.current;

      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

      const rect = container.getBoundingClientRect();
      const currentZoom = zoomRef.current;
      const currentPanX = panXRef.current;
      const currentPanY = panYRef.current;
      const minZoom = calculateMinZoom(rect.width, rect.height);

      const newZoom = Math.max(minZoom, Math.min(MAX_ZOOM, currentZoom * scale));
      const zoomRatio = newZoom / currentZoom;

      const mouseX = midX - rect.left;
      const mouseY = midY - rect.top;

      let newPanX = mouseX - (mouseX - currentPanX) * zoomRatio;
      let newPanY = mouseY - (mouseY - currentPanY) * zoomRatio;

      const scaledWorldW = WORLD_WIDTH * newZoom;
      const scaledWorldH = WORLD_HEIGHT * newZoom;
      const minPanX = rect.width - scaledWorldW;
      const minPanY = rect.height - scaledWorldH;

      newPanX = Math.min(0, Math.max(minPanX, newPanX));
      newPanY = Math.min(0, Math.max(minPanY, newPanY));
      if (scaledWorldW < rect.width) newPanX = (rect.width - scaledWorldW) / 2;
      if (scaledWorldH < rect.height) newPanY = (rect.height - scaledWorldH) / 2;

      lastPinchDistRef.current = newDist;
      setZoom(newZoom);
      setPan(newPanX, newPanY);
    }
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (e.touches.length < 2) lastPinchDistRef.current = null;
    if (e.touches.length === 0) isPanningRef.current = false;
  };

  container.addEventListener("touchstart", onTouchStart, { passive: false });
  container.addEventListener("touchmove", onTouchMove, { passive: false });
  container.addEventListener("touchend", onTouchEnd);
  return () => {
    container.removeEventListener("touchstart", onTouchStart);
    container.removeEventListener("touchmove", onTouchMove);
    container.removeEventListener("touchend", onTouchEnd);
  };
}, [setPan, setZoom]);


// Enables drag-to-pan the canvas. Ignores drags that start on module headers, resize handles, or interactive elements.
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

const onMouseDown = (e: MouseEvent) => {
    if (usePersonalizedDashboardStore.getState().uiBlocked) return;
    if (e.button !== 0) return;

  const target = e.target as HTMLElement;
  if (
    target.closest('[data-module-header]') || 
    target.closest('[data-module-resize]') ||
    target.closest('input, textarea, select, button, [contenteditable]')
  ) {
    return; 
  }


  isPanningRef.current = true;
startRef.current = {
  x: e.clientX - panXRef.current,
  y: e.clientY - panYRef.current,
};

  container.style.cursor = "grabbing";
  e.preventDefault();
};


const onMouseMove = (e: MouseEvent) => {
if (usePersonalizedDashboardStore.getState().uiBlocked) return;
  if (!isPanningRef.current) return;
  if (!containerRef.current) return;

  const rect = containerRef.current.getBoundingClientRect();

  let x = e.clientX - startRef.current.x;
  let y = e.clientY - startRef.current.y;

  const maxPanX = 0;
  const maxPanY = 0;

  const minPanX = rect.width - WORLD_WIDTH * zoom;
  const minPanY = rect.height - WORLD_HEIGHT  * zoom;

x = Math.min(maxPanX, Math.max(minPanX, x));
y = Math.min(maxPanY, Math.max(minPanY, y));

setPan(x, y);

};

    const onMouseUp = () => {
      isPanningRef.current = false;
      if (container) container.style.cursor = "grab";
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [panX, panY, zoom, setPan]);

    // Handles mouse wheel zoom centered on the cursor. Skips events that originate inside a module window.
    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;

    const ZOOM_SENSITIVITY = 0.003;
    const onWheel = (e: WheelEvent) => {
      if (usePersonalizedDashboardStore.getState().uiBlocked) return;
    const target = e.target as HTMLElement;

    if (!target.closest("[data-canvas-container]")) {
      return;
    }

    if (target.closest("[data-module-window]")) {
      return;
}

    e.preventDefault();

    if (!el) return;

const rect = el.getBoundingClientRect();
const mouseX = e.clientX - rect.left;
const mouseY = e.clientY - rect.top;

const minZoom = calculateMinZoom(rect.width, rect.height);

    const delta = -e.deltaY;
    const zoomFactor = 1 + delta * ZOOM_SENSITIVITY;
    const newZoom = Math.max(
      minZoom,
      Math.min(MAX_ZOOM, zoom * zoomFactor)
    );

    const zoomRatio = newZoom / zoom;
    let newPanX = mouseX - (mouseX - panX) * zoomRatio;
    let newPanY = mouseY - (mouseY - panY) * zoomRatio;

    const scaledWorldW = WORLD_WIDTH * newZoom;
    const scaledWorldH = WORLD_HEIGHT * newZoom;

    const minPanX = rect.width - scaledWorldW;
    const minPanY = rect.height - scaledWorldH;

    newPanX = Math.min(0, Math.max(minPanX, newPanX));
    newPanY = Math.min(0, Math.max(minPanY, newPanY));

    if (scaledWorldW < rect.width) {
      newPanX = (rect.width - scaledWorldW) / 2;
    }

    if (scaledWorldH < rect.height) {
      newPanY = (rect.height - scaledWorldH) / 2;
    }

    setZoom(newZoom);
    setPan(newPanX, newPanY);
  };

  el.addEventListener("wheel", onWheel, { passive: false });
  return () => el.removeEventListener("wheel", onWheel);
}, [zoom, panX, panY, setZoom, setPan, topBarHeight, notesBarHeight]);

// Blurs the active input when Escape is pressed — prevents keyboard shortcuts from firing while the user is typing.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        (document.activeElement as HTMLElement)?.blur();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

    // Runs once on mount to restore saved zoom and pan, clamped to valid bounds.
    useEffect(() => {
      if (!containerRef.current) return;

      requestAnimationFrame(() => {
        if (!containerRef.current) return;

       const rect = containerRef.current.getBoundingClientRect();
       const minZoom = calculateMinZoom(rect.width, rect.height);
       const { zoom: savedZoom, panX: savedPanX, panY: savedPanY } = usePersonalizedDashboardStore.getState();
       const initialZoom = Math.max(minZoom, savedZoom);

       const minPanX = rect.width - WORLD_WIDTH * initialZoom;
       const minPanY = rect.height - WORLD_HEIGHT * initialZoom;

       const initialPanX = Math.min(0, Math.max(minPanX, savedPanX));
       const initialPanY = Math.min(0, Math.max(minPanY, savedPanY));

       setZoom(initialZoom);
       setPan(initialPanX, initialPanY);

        didInitRef.current = true;
      });
    }, []);


/* ZOOM - PAN CLAMP WHEN THE NOTES PANEL CHANGES */
useEffect(() => {
  if (!containerRef.current) return;
  if (!didInitRef.current) return; 

  const rect = containerRef.current.getBoundingClientRect();
  const minZoom = calculateMinZoom(rect.width, rect.height);

  const currentZoom = zoom < minZoom ? minZoom : zoom;
  const zoomChanged = currentZoom !== zoom;

  const scaledWorldW = WORLD_WIDTH * currentZoom;
  const scaledWorldH = WORLD_HEIGHT * currentZoom;

  const minPanX = rect.width - scaledWorldW;
  const minPanY = rect.height - scaledWorldH;

  let newPanX = panX;
  let newPanY = panY;

  if (zoomChanged) {
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const ratio = currentZoom / zoom;

    newPanX = cx - (cx - panX) * ratio;
    newPanY = cy - (cy - panY) * ratio;
  }

  newPanX = Math.min(0, Math.max(minPanX, newPanX));
  newPanY = Math.min(0, Math.max(minPanY, newPanY));

  if (scaledWorldW < rect.width) {
    newPanX = (rect.width - scaledWorldW) / 2;
  }
  if (scaledWorldH < rect.height) {
    newPanY = (rect.height - scaledWorldH) / 2;
  }

  if (zoomChanged || newPanX !== panX || newPanY !== panY) {
    if (zoomChanged) setZoom(currentZoom);
    setPan(newPanX, newPanY);
  }
}, [ topBarHeight, notesBarHeight, setZoom, setPan]);

  return (
    <div
      ref={containerRef}
      data-canvas-container
      tabIndex={-1}
      className="
         fixed left-0 right-0 overflow-hidden z-0  
        select-none
        focus:outline-none focus-visible:outline-none
      "
    style={{
        top: topBarHeight || 0,
        bottom: notesBarHeight || 0,
      cursor: "grab",
      backgroundColor: "var(--background)",
      backgroundImage: `
        linear-gradient(var(--grid-line) 1px, transparent 1px),
        linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)
      `,
      backgroundSize: "30px 30px",
    }}
    >
      {/* SIDEBAR */}
      <SidebarPanel />

    <DashboardNotifications />

      <div className="absolute inset-0 overflow-hidden">
      <div
        ref={canvasRef}
        className="relative"
        style={{
        width: WORLD_WIDTH,
        height: WORLD_HEIGHT,
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          transformOrigin: "0 0",

          backgroundColor: "transparent",

        }}
      >
        {modules.map((m) => (
          <ModuleWindow key={m.id} module={m} />
        ))}
      </div>
    </div>
    </div>
  );
  
}