"use client";

import { useFadeUp } from "@/hooks/useFadeUp";

interface FadeUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: "d1" | "d2" | "d3" | "d4";
  as?: keyof React.JSX.IntrinsicElements;
}

export function FadeUp({ children, className = "", delay, as: Tag = "div" }: FadeUpProps) {
  const ref = useFadeUp<HTMLElement>();
  const cls = ["fade-up", delay, className].filter(Boolean).join(" ");
  const Component = Tag as React.ElementType;
  return (
    <Component ref={ref} className={cls}>
      {children}
    </Component>
  );
}
