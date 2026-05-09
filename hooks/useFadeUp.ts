"use client";

import { useEffect, useRef } from "react";

export function useFadeUp<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("visible");
      return;
    }

    if (location.hash) {
      try {
        const target = document.querySelector(location.hash);
        if (target && target.contains(el)) {
          el.classList.add("visible");
          return;
        }
      } catch {}
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) el.classList.add("visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -36px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return ref;
}
