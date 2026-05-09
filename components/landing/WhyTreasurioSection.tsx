import { FadeUp } from "@/components/landing/ui/FadeUp";

const items = [
  {
    title: "Institutional Data, Individual Access",
    description: "The data quality used by hedge funds, now accessible to individual traders at an affordable price.",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    title: "All Exchanges, One Screen",
    description: "End the tab chaos. All major exchanges unified in Treasurio.",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    title: "Real-Time, Zero Delay",
    description: "Millisecond-latency data streams. Being late is no longer an option.",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    title: "AI-Driven, No Manual Burden",
    description: "Automatic signals instead of hourly monitoring. Leave the analysis to us, make the call yourself.",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
  },
  {
    title: "Your Interface, Your Rules",
    description: "Arrange the dashboard to fit your workflow. Every trader is different — Treasurio knows that.",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
];

export function WhyTreasurioSection() {
  return (
    <section id="why-treasurio" className="py-[100px] bg-surface">
      <div className="max-w-[1200px] mx-auto px-7">
        <FadeUp>
          <div className="max-w-[720px]">
            <span className="text-xs font-bold tracking-[0.18em] uppercase text-brand block mb-3">
              Why Us
            </span>
            <h2 className="text-[clamp(1.75rem,3.8vw,2.7rem)] font-extrabold leading-[1.15] tracking-[-0.025em] text-foreground mb-3">
              Why Treasurio?
            </h2>
            <p className="text-base text-muted-foreground leading-[1.7] mb-10">
              The tools professional traders need, now accessible to everyone.
            </p>

            <div className="flex flex-col gap-7">
              {items.map((item) => (
                <div key={item.title} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-brand/10 text-brand flex items-center justify-center mt-0.5">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
