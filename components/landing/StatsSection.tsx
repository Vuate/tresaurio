"use client";

import { useInView } from "@/hooks/useInView";
import { useCounter } from "@/hooks/useCounter";
import { FadeUp } from "@/components/landing/ui/FadeUp";

const stats = [
  { target: 5,    dec: 0, suffix: "",    label: "Exchange Integrations" },
  { target: 50,   dec: 0, suffix: " TB", label: "Live Data Stream / Day" },
  { target: 99.9, dec: 1, suffix: "%",   label: "Uptime Guarantee" },
  { target: 1,    dec: 0, suffix: "",    label: "Active Users" },
];

const delays = [undefined, "d1", "d2", "d3"] as const;

function Counter({ target, dec, suffix, start }: { target: number; dec: number; suffix: string; start: boolean }) {
  const value = useCounter(target, dec, 1500, start);
  return <span>{value}{suffix}</span>;
}

export function StatsSection() {
  const { ref, inView } = useInView({ threshold: 0.5 });

  return (
    <section id="stats" className="py-[80px] bg-card border-y border-border">
      <div className="max-w-[1200px] mx-auto px-7">
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <FadeUp key={s.label} delay={delays[i]} className="text-center">
              <div className="text-[2.4rem] sm:text-[2.8rem] font-extrabold tracking-[-0.03em] text-brand leading-none mb-2">
                <Counter target={s.target} dec={s.dec} suffix={s.suffix} start={inView} />
              </div>
              <div className="text-sm text-muted-foreground font-medium">{s.label}</div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
