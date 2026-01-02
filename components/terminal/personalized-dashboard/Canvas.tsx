"use client";

import { useEffect, useRef } from "react";
import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";
import ModuleWindow from "./ModuleWindow";

export default function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const isPanningRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0 });

  const { zoom, panX, panY, setZoom, setPan, modules } =
    usePersonalizedDashboardStore();

  /* ---------------- PAN ---------------- */
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const onMouseDown = (e: MouseEvent) => {
      // Sadece container veya canvas'a tıklanırsa pan yap
      if (e.target !== container && e.target !== canvas) return;

      isPanningRef.current = true;
      startRef.current = {
        x: e.clientX - panX,
        y: e.clientY - panY,
      };

      container.style.cursor = "grabbing";
      e.preventDefault(); // Text seçimini engelle
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isPanningRef.current) return;
      setPan(e.clientX - startRef.current.x, e.clientY - startRef.current.y);
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
  }, [panX, panY, setPan]);

  /* ---------------- ZOOM (MOUSE WHEEL) ---------------- */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      const rect = el.getBoundingClientRect();

      // Mouse pozisyonunu container'a göre hesapla
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Zoom delta
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newZoom = Math.max(0.1, Math.min(2, zoom + delta));

      // Zoom oranı
      const zoomRatio = newZoom / zoom;

      // Mouse pozisyonunu sabit tutacak şekilde pan değerlerini ayarla
      const newPanX = mouseX - (mouseX - panX) * zoomRatio;
      const newPanY = mouseY - (mouseY - panY) * zoomRatio;

      setZoom(newZoom);
      setPan(newPanX, newPanY);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoom, panX, panY, setZoom, setPan]);

  return (
    <div
      ref={containerRef}
      className="fixed top-14 left-0 right-0 bottom-0 overflow-hidden z-0"
      style={{ cursor: "grab" }}
    >
      <div
        ref={canvasRef}
        className="relative"
        style={{
          width: 10000,
          height: 10000,
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          transformOrigin: "0 0",
          transition: "transform 0.1s ease-out",
        }}
      >
        {/* Grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(25, 216, 208, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(25, 216, 208, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {modules.map((m) => (
          <ModuleWindow key={m.id} module={m} />
        ))}
      </div>
    </div>
  );
}
