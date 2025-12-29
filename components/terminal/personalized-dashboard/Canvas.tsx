"use client";

import { useEffect, useRef } from "react";
import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";
import ModuleWindow from "./ModuleWindow";

export default function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  const isPanningRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0 });

  const { zoom, panX, panY, setZoom, setPan, modules } =
    usePersonalizedDashboardStore();

  /* ---------------- PAN ---------------- */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMouseDown = (e: MouseEvent) => {
      // sadece boş canvas alanı
      if (e.target !== el) return;

      isPanningRef.current = true;
      startRef.current = {
        x: e.clientX - panX,
        y: e.clientY - panY,
      };

      el.style.cursor = "grabbing";
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isPanningRef.current) return;
      setPan(e.clientX - startRef.current.x, e.clientY - startRef.current.y);
    };

    const onMouseUp = () => {
      isPanningRef.current = false;
      el.style.cursor = "grab";
    };

    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [panX, panY, setPan]);

  /* ---------------- ZOOM ---------------- */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(zoom + delta);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoom, setZoom]);

  return (
    <div
      ref={containerRef}
      className="fixed top-14 left-0 right-0 bottom-0 overflow-hidden z-0"
      style={{ cursor: "grab" }}
    >
      <div
        className="relative"
        style={{
          width: 10000,
          height: 10000,
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          transformOrigin: "0 0",
        }}
      >
        {modules.map((m) => (
          <ModuleWindow key={m.id} module={m} />
        ))}
      </div>
    </div>
  );
}
