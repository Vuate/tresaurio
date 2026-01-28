"use client";

import { useRef, useState } from "react";
import { moduleRegistry } from "@/lib/personalized-dashboard/moduleRegistry";
import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";
import type { ModuleInstance } from "@/lib/personalized-dashboard/types";
import { useDashboardNotificationStore } from "@/store/dashboardNotificationStore";

export const WORLD_WIDTH = 4000;
export const WORLD_HEIGHT = 2250;


type ResizeDir = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export default function ModuleWindow({ module }: { module: ModuleInstance }) {
const ref = useRef<HTMLDivElement>(null);
const [isDraggingWindow, setIsDraggingWindow] = useState(false); 


const { 
  updateModule, 
  setActiveModule, 
  activeModuleId, 
  removeModule, 
  zoom,
  setPan,
  panX,
  panY,
  topBarHeight,
  notesBarHeight,  
} = usePersonalizedDashboardStore();

const def = moduleRegistry[module.type];
const isActive = activeModuleId === module.id;

/* ---------------- DRAG ---------------- */
const onDragMouseDown = (e: React.MouseEvent) => {
  e.stopPropagation();
  e.preventDefault();

  setActiveModule(module.id);
  setIsDraggingWindow(true); // 🔥 EKLE

const startX = e.clientX;
const startY = e.clientY;
const startModuleX = module.x;
const startModuleY = module.y;
let startPanX = panX; // 🔥 const → let
let startPanY = panY; // 🔥 const → let

  // Yukarı ve aşağı için ÇOOK daha agresif
  const edgeThresholdHorizontal = 150; 
  const edgeThresholdTop = 120; // Üst için BÜYÜK
  const edgeThresholdBottom = 100; // Alt için BÜYÜK
  const scrollSpeedHorizontal = 7;  // 🔥 Yatay hız
  const scrollSpeedVertical = 7; // Dikey için DAHA HIZLI

  let currentMouseX = e.clientX;
  let currentMouseY = e.clientY;
  let animationFrameId: number | null = null;
  let isDragging = true;

const animate = () => {
  if (!isDragging) return;

  const store = usePersonalizedDashboardStore.getState();

  // === VIEWPORT BOYUTLARI ===
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

  // === MOUSE & PAN DELTA ===
  const mouseDeltaX = currentMouseX - startX;
  const mouseDeltaY = currentMouseY - startY;
  const totalPanDeltaX = store.panX - startPanX;
  const totalPanDeltaY = store.panY - startPanY;

  // === DÜNYA DELTA ===
  const worldDeltaX = (mouseDeltaX - totalPanDeltaX) / zoom;
  const worldDeltaY = (mouseDeltaY - totalPanDeltaY) / zoom;

  // === İSTENEN POZİSYON (sınırsız) ===
  let desiredX = startModuleX + worldDeltaX;
  let desiredY = startModuleY + worldDeltaY;

  // 🔥 AUTO-PAN KONTROLÜ - Mouse ekranın kenarında mı?
  const EDGE_THRESHOLD = 30;
  const mouseNearLeftEdge = currentMouseX < EDGE_THRESHOLD;
  const mouseNearRightEdge = currentMouseX > vw - EDGE_THRESHOLD;
  const mouseNearTopEdge = currentMouseY < topBarHeight + EDGE_THRESHOLD;
  const mouseNearBottomEdge = currentMouseY > window.innerHeight - notesBarHeight - EDGE_THRESHOLD; 

  // 🔥 Dünya sınırlarını kontrol et
  const hitLeftWorldEdge = desiredX <= 0;
  const hitRightWorldEdge = desiredX >= WORLD_WIDTH - module.width;
  const hitTopWorldEdge = desiredY <= 0;
  const hitBottomWorldEdge = desiredY >= WORLD_HEIGHT - module.height;

  // 🔥 Pan yapılabilir mi kontrol et
  const canPanLeft = canPanHorizontally && store.panX < maxPanX;
  const canPanRight = canPanHorizontally && store.panX > minPanX;
  const canPanUp = canPanVertically && store.panY < maxPanY;
  const canPanDown = canPanVertically && store.panY > minPanY;

  // === AUTO-PAN HESAPLA ===
  let panSpeedX = 0;
  let panSpeedY = 0;

  // Sola pan (mouse sol kenarda VE dünya sol sınırında değil VE pan yapılabilir)
  if (mouseNearLeftEdge && !hitLeftWorldEdge && canPanLeft) {
    panSpeedX = 10;
  }
  // Sağa pan
  else if (mouseNearRightEdge && !hitRightWorldEdge && canPanRight) {
    panSpeedX = -10;
  }

  // Yukarı pan
  if (mouseNearTopEdge && !hitTopWorldEdge && canPanUp) {
    panSpeedY = 10;
  }
  // Aşağı pan
  else if (mouseNearBottomEdge && !hitBottomWorldEdge && canPanDown) {
    panSpeedY = -10;
  }

// === PAN UYGULA ===
  if (panSpeedX !== 0 || panSpeedY !== 0) {
    const nextPanX = store.panX + panSpeedX;
    const nextPanY = store.panY + panSpeedY;
    
    const clampedPanX = Math.min(maxPanX, Math.max(minPanX, nextPanX));
    const clampedPanY = Math.min(maxPanY, Math.max(minPanY, nextPanY));
    
    store.setPan(clampedPanX, clampedPanY);
  }

// === WINDOW POZİSYONUNU HESAPLA ===
  // Her zaman orijinal startPan'den hesapla
  const totalPanDeltaXNow = store.panX - startPanX;
  const totalPanDeltaYNow = store.panY - startPanY;
  
  // 🚀 HIZLANDIRMA FAKTÖRÜ (1.0 = normal, 1.5 = %50 daha hızlı, 2.0 = 2x hızlı)
  const DRAG_SPEED_MULTIPLIER = 1.0;
  
  const finalWorldDeltaX = ((mouseDeltaX - totalPanDeltaXNow) * DRAG_SPEED_MULTIPLIER) / zoom;
  const finalWorldDeltaY = ((mouseDeltaY - totalPanDeltaYNow) * DRAG_SPEED_MULTIPLIER) / zoom;
  
  let newX = startModuleX + finalWorldDeltaX;
  let newY = startModuleY + finalWorldDeltaY;
  // === DÜNYA SINIRLARI İLE CLAMP ===
  newX = Math.max(0, Math.min(WORLD_WIDTH - module.width, newX));
  newY = Math.max(0, Math.min(WORLD_HEIGHT - module.height, newY));

  // === MODULE GÜNCELLE ===
  store.updateModule(module.id, { x: newX, y: newY });

  animationFrameId = requestAnimationFrame(animate);
};



  const onMove = (ev: MouseEvent) => {
    ev.preventDefault();
    currentMouseX = ev.clientX;
    currentMouseY = ev.clientY;
  };

const onUp = () => {
    isDragging = false; 
    setIsDraggingWindow(false); // 🔥 EKLE

if (animationFrameId) cancelAnimationFrame(animationFrameId);
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
  let startPanX = panX;  // 🔥 Pan tracking
  let startPanY = panY;  // 🔥 Pan tracking

  let currentMouseX = e.clientX;
  let currentMouseY = e.clientY;
  let animationFrameId: number | null = null;
  let isResizing = true;

  const animate = () => {
  if (!isResizing) return;

  const store = usePersonalizedDashboardStore.getState();

  // === VIEWPORT BOYUTLARI ===
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

  // === PAN DEĞİŞİKLİĞİ ===
  const panDeltaX = store.panX - startPanX;
  const panDeltaY = store.panY - startPanY;

  // === MOUSE DELTA ===
  const mouseDeltaX = currentMouseX - startX;
  const mouseDeltaY = currentMouseY - startY;

  // === DÜNYA DELTA ===
  const worldDeltaX = (mouseDeltaX - panDeltaX) / zoom;
  const worldDeltaY = (mouseDeltaY - panDeltaY) / zoom;

  // === YENİ BOYUT/POZİSYON ===
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

  // === MINIMUM BOYUT ===
  if (newWidth < 300) {
    newWidth = 300;
    if (dir.includes("left")) newX = startLeft + startWidth - 300;
  }
  if (newHeight < 200) {
    newHeight = 200;
    if (dir.includes("top")) newY = startTop + startHeight - 200;
  }

  // === HARITA SINIRLARI ===
  if (newX < 0) { newWidth += newX; newX = 0; }
  if (newY < 0) { newHeight += newY; newY = 0; }
  if (newX + newWidth > WORLD_WIDTH) newWidth = WORLD_WIDTH - newX;
  if (newY + newHeight > WORLD_HEIGHT) newHeight = WORLD_HEIGHT - newY;

  // 🔥 AUTO-PAN KONTROLÜ - Mouse ekranın kenarında mı?
  const EDGE_THRESHOLD = 30;
  const mouseNearLeftEdge = currentMouseX < EDGE_THRESHOLD;
  const mouseNearRightEdge = currentMouseX > vw - EDGE_THRESHOLD;
  const mouseNearTopEdge = currentMouseY < topBarHeight + EDGE_THRESHOLD;
  const mouseNearBottomEdge = currentMouseY > window.innerHeight - notesBarHeight - EDGE_THRESHOLD;

  // 🔥 Dünya sınırlarını kontrol et
  const hitLeftWorldEdge = dir.includes("left") && newX === 0;
  const hitRightWorldEdge = dir.includes("right") && (newX + newWidth) === WORLD_WIDTH;
  const hitTopWorldEdge = dir.includes("top") && newY === 0;
  const hitBottomWorldEdge = dir.includes("bottom") && (newY + newHeight) === WORLD_HEIGHT;

  // 🔥 Pan yapılabilir mi kontrol et
  const canPanLeft = canPanHorizontally && store.panX < maxPanX;
  const canPanRight = canPanHorizontally && store.panX > minPanX;
  const canPanUp = canPanVertically && store.panY < maxPanY;
  const canPanDown = canPanVertically && store.panY > minPanY;

  // === AUTO-PAN HESAPLA ===
  let panSpeedX = 0;
  let panSpeedY = 0;

  // Sola pan (mouse sol kenarda VE dünya sol sınırında değil VE pan yapılabilir)
  if (mouseNearLeftEdge && !hitLeftWorldEdge && canPanLeft) {
    panSpeedX = 10;
  }
  // Sağa pan
  else if (mouseNearRightEdge && !hitRightWorldEdge && canPanRight) {
    panSpeedX = -10;
  }

  // Yukarı pan
  if (mouseNearTopEdge && !hitTopWorldEdge && canPanUp) {
    panSpeedY = 10;
  }
  // Aşağı pan
  else if (mouseNearBottomEdge && !hitBottomWorldEdge && canPanDown) {
    panSpeedY = -10;
  }

  // === PAN UYGULA ===
  if (panSpeedX !== 0 || panSpeedY !== 0) {
    const nextPanX = store.panX + panSpeedX;
    const nextPanY = store.panY + panSpeedY;
    
    const clampedPanX = Math.min(maxPanX, Math.max(minPanX, nextPanX));
    const clampedPanY = Math.min(maxPanY, Math.max(minPanY, nextPanY));
    
    store.setPan(clampedPanX, clampedPanY);
    // 🔥 startPan'i GÜNCELLEME! (drag mantığıyla aynı)
  }

  // === MODULE GÜNCELLE ===
  updateModule(module.id, {
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
};


return (
  <div
    ref={ref}
        data-module-window 
    className={`absolute rounded-2xl border bg-[#041F20]/95 backdrop-blur
      select-none overflow-hidden
      ${isActive ? "border-teal-400" : "border-white/10"}`}
    style={{
      left: module.x,
      top: module.y,
      width: module.width,
      height: module.minimized ? 42 : module.height,
  zIndex: isDraggingWindow ? 99999 : (isActive ? 50 : 10), // 🔥 DEĞİŞTİR
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
          {def?.render?.(module.id)}
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
