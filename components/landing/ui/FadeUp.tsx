"use client";

import { useFadeUp } from "@/hooks/useFadeUp";

interface FadeUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: "d1" | "d2" | "d3" | "d4";
}

export function FadeUp({ children, className = "", delay }: FadeUpProps) {
  const ref = useFadeUp<HTMLDivElement>();
  const cls = ["fade-up", delay, className].filter(Boolean).join(" ");
  return (
    <div ref={ref} className={cls}>
      {children}
    </div>
  );
}
