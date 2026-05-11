import { FadeUp } from "@/components/landing/ui/FadeUp";
import { SectionHead } from "@/components/landing/ui/SectionHead";

const steps = [
  {
    num: "Step 01",
    title: "Sign Up & Connect",
    description: "Create your account and integrate your preferred exchanges. Setup completes in minutes.",
    color: "c1" as const,
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    num: "Step 02",
    title: "Analyze",
    description: "Track real-time orderbook depth, whale movements, and exchange flow data — all in one screen.",
    color: "c2" as const,
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
        <path d="M2 20h20" />
      </svg>
    ),
  },
  {
    num: "Step 03",
    title: "Decide",
    description: "Make informed, fast trading decisions with AI-powered signals, risk metrics, and liquidity analysis.",
    color: "c3" as const,
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
] as const;

const iconClass: Record<"c1" | "c2" | "c3", string> = {
  c1: "w-[60px] h-[60px] rounded-xl flex items-center justify-center mb-5 bg-brand/10 text-brand",
  c2: "w-[60px] h-[60px] rounded-xl flex items-center justify-center mb-5 how-icon-c2",
  c3: "w-[60px] h-[60px] rounded-xl flex items-center justify-center mb-5 bg-brand/10 text-brand",
};

const stepDelay: Record<string, "d1" | "d2" | "d3"> = {
  "0": "d1",
  "1": "d2",
  "2": "d3",
};

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-[100px] bg-surface">
      <div className="max-w-[1200px] mx-auto px-7">
        <FadeUp>
          <SectionHead
            label="Process"
            title="How It Works"
            sub="Turn market data into action in three steps."
          />
        </FadeUp>

        <div className="how-grid">
          {steps.map((step, i) => (
            <>
              <FadeUp key={step.num} delay={stepDelay[i.toString()]}>
                <div className="flex flex-col pt-2">
                  <div className={iconClass[step.color]}>{step.icon}</div>
                  <div className="text-xs font-bold tracking-[0.15em] uppercase text-muted-foreground mb-2">
                    {step.num}
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </FadeUp>

              {i < steps.length - 1 && (
                <FadeUp key={`arrow-${i}`} delay={stepDelay[(i + 1).toString()]}>
                  <div className="how-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </FadeUp>
              )}
            </>
          ))}
        </div>
      </div>
    </section>
  );
}
