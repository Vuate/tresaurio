"use client";

import { useEffect, useRef, useState } from "react";

export function useCounter(
  target: number,
  dec = 0,
  durationMs = 1500,
  start = false
) {
  const startedRef = useRef(false);
  const [value, setValue] = useState(dec > 0 ? (0).toFixed(dec) : "0");

  useEffect(() => {
    if (!start || startedRef.current) return;
    startedRef.current = true;

    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - t0) / durationMs, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = eased * target;
      setValue(dec > 0 ? v.toFixed(dec) : Math.floor(v).toString());
      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        setValue(dec > 0 ? target.toFixed(dec) : target.toString());
      }
    };
    requestAnimationFrame(step);
  }, [start, target, dec, durationMs]);

  return value;
}
