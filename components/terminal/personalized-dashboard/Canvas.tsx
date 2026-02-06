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



  /* PAN */
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;


const onMouseDown = (e: MouseEvent) => {
  if (usePersonalizedDashboardStore.getState().uiBlocked) return;
  if (e.button !== 0) return;

  const target = e.target as HTMLElement;
  if (target.closest('[data-module-window]')) {
    return; 
  }

  isPanningRef.current = true;
  startRef.current = {
    x: e.clientX - panX,
    y: e.clientY - panY,
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

/* ZOOM */
useEffect(() => {
  const el = containerRef.current;
  if (!el) return;

  const ZOOM_SENSITIVITY = 0.003;
  const onWheel = (e: WheelEvent) => {
    const target = e.target as HTMLElement;

    if (!target.closest("[data-canvas-container]")) {
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

  /* ESC = FOCUS RESET  */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        (document.activeElement as HTMLElement)?.blur();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

/* DEFAULT CENTER */
useEffect(() => {
  if (!containerRef.current) return;

  requestAnimationFrame(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const initialZoom = calculateMinZoom(rect.width, rect.height);

    const centerPanX = (rect.width - WORLD_WIDTH * initialZoom) / 2;
    const centerPanY = (rect.height - WORLD_HEIGHT * initialZoom) / 2;

    setZoom(initialZoom);
    setPan(centerPanX, centerPanY);

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

    backgroundColor: "#041F20",
    backgroundImage: `
      linear-gradient(rgba(25,216,208,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(25,216,208,0.03) 1px, transparent 1px),
      radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)
    `,
    backgroundSize: "50px 50px",
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