import { Icon } from "@iconify/react";

const patterns = [
  { icon: "material-symbols:trending-up-rounded", name: "Accumulation" },
  { icon: "material-symbols:trending-down-rounded", name: "Distribution" },
  { icon: "lucide:crosshair", name: "Whale Buy" },
  { icon: "lucide:circle-dollar-sign", name: "Whale Sell" },
  { icon: "lucide:building-2", name: "Exchange Dump" },
  { icon: "material-symbols:swap-horiz-rounded", name: "CEX↔DEX Flow" },
  { icon: "lucide:zap", name: "Flash Accumulation" },
  { icon: "lucide:rocket", name: "Pump Setup" },
  { icon: "lucide:line-chart", name: "Smart Money Entry" },
  { icon: "lucide:log-out", name: "Smart Money Exit" },
  { icon: "lucide:eye", name: "Insider Trading" },
  { icon: "lucide:waves", name: "Whale Wash Trade" },
  { icon: "lucide:shuffle", name: "Manipulation" },
  { icon: "lucide:repeat", name: "Fake Volume" },
  { icon: "lucide:gem", name: "Diamond Hands" },
  { icon: "lucide:brain-circuit", name: "Strategic Hold" },
];

export default function WalletPatterns() {
  return (
    <section className="mb-12 lg:mb-16 rounded-xl bg-surface border border-border-sub py-12 lg:py-14 px-6 lg:px-10">
      <div className="text-center mb-10">
        <span
          className="font-bold uppercase text-[#2563EB]"
          style={{ fontSize: "0.68rem", letterSpacing: "0.16em" }}
        >
          Detection Engine
        </span>
        <h2
          className="font-extrabold text-foreground mt-2 mb-3"
          style={{ fontSize: "clamp(1.75rem, 3.8vw, 2.7rem)", letterSpacing: "-0.025em", lineHeight: 1.15 }}
        >
          16 Smart Money Patterns
        </h2>
        <p className="text-[#71717A] max-w-xl mx-auto text-[0.875rem] leading-[1.7]">
          Automatically detected smart money behavioral patterns
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {patterns.map((pattern, i) => (
          <div
            key={i}
            className="group rounded-xl border border-border-sub bg-card p-4 text-center transition-all duration-250 hover:-translate-y-0.5 hover:border-[#2563EB]/25 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
          >
            <Icon
              icon={pattern.icon}
              className="text-2xl text-[#2563EB] mx-auto mb-2 group-hover:scale-110 transition-transform duration-250"
            />
            <div
              className="font-semibold text-[#71717A] leading-tight group-hover:text-foreground transition-colors duration-250"
              style={{ fontSize: "0.68rem" }}
            >
              {pattern.name}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
