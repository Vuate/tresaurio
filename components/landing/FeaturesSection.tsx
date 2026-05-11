import { FadeUp } from "@/components/landing/ui/FadeUp";
import { SectionHead } from "@/components/landing/ui/SectionHead";

type FeatVariant = "blue" | "teal" | "green" | "none";
type IconVariant = "blue" | "teal" | "green";

interface Feature {
  title: string;
  description: string;
  variant: FeatVariant;
  iconVariant: IconVariant;
  wide?: boolean;
  fadeDelay?: "d1" | "d2";
  icon: React.ReactNode;
}

const features: Feature[] = [
  {
    title: "Deep Liquidity Analysis",
    description: "Real-time orderbook depth, spread analysis and market depth visualization across Binance, Bybit, OKX and 50+ exchanges.",
    variant: "blue",
    iconVariant: "blue",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        <path d="M8 12h8M12 8v8" />
      </svg>
    ),
  },
  {
    title: "Exchange Flow Tracking",
    description: "Instantly detect cross-exchange fund flows, whale movements and large transfers. Spot market manipulation with smart algorithms.",
    variant: "teal",
    iconVariant: "teal",
    fadeDelay: "d1",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    ),
  },
  {
    title: "Advanced Risk Management",
    description: "Slippage calculation, market impact analysis, optimized execution strategies and portfolio risk metrics.",
    variant: "none",
    iconVariant: "blue",
    fadeDelay: "d2",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "AI-Powered Analytics",
    description: "Trade cost estimation, price trend analysis, anomaly detection and automated signal generation — all powered by machine learning.",
    variant: "green",
    iconVariant: "green",
    wide: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
  },
  {
    title: "Ultra-Low Latency",
    description: "Millisecond-precision data streams via WebSocket. Co-location support for minimum latency.",
    variant: "none",
    iconVariant: "teal",
    fadeDelay: "d1",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    title: "RESTful & WebSocket API",
    description: "Power your own bots and strategies with the Treasurio API. Comprehensive documentation and SDKs included.",
    variant: "none",
    iconVariant: "blue",
    fadeDelay: "d2",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="12" y1="2" x2="12" y2="22" />
      </svg>
    ),
  },
  {
    title: "Customizable Dashboard",
    description: "Build your own workspace with drag & drop. Multi-monitor support, saved layouts and shareable views.",
    variant: "none",
    iconVariant: "green",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    title: "Enterprise Security",
    description: "End-to-end encryption, 2FA, API key management and IP whitelist. SOC 2 Type II compliant infrastructure.",
    variant: "blue",
    iconVariant: "blue",
    fadeDelay: "d1",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    title: "Multi-Platform",
    description: "Web, Desktop (Windows/Mac/Linux) and mobile apps. Synchronized experience across all your devices.",
    variant: "none",
    iconVariant: "teal",
    fadeDelay: "d2",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
];

const cardCls: Record<FeatVariant, string> = {
  blue: "feat-card feat-card-blue",
  teal: "feat-card feat-card-teal",
  green: "feat-card feat-card-green",
  none: "feat-card",
};

const iconCls: Record<IconVariant, string> = {
  blue: "w-11 h-11 rounded-[10px] flex items-center justify-center mb-[18px] bg-brand/10 text-brand",
  teal: "w-11 h-11 rounded-[10px] flex items-center justify-center mb-[18px] feat-icon-teal",
  green: "w-11 h-11 rounded-[10px] flex items-center justify-center mb-[18px] bg-green-500/10 text-green-500",
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-[100px] bg-background">
      <div className="max-w-[1200px] mx-auto px-7">
        <FadeUp>
          <SectionHead
            label="Features"
            title="Everything You Need"
            sub="Everything professional traders need, one platform."
          />
        </FadeUp>

        <div className="grid grid-cols-3 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1 gap-5">
          {features.map((f) => (
            <FadeUp
              key={f.title}
              delay={f.fadeDelay}
              className={[
                f.wide ? "col-span-2 max-[560px]:col-span-1" : "",
              ].join(" ")}
            >
              <div className={cardCls[f.variant]}>
                <div className={iconCls[f.iconVariant]}>{f.icon}</div>
                <h3 className="text-[0.95rem] font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
