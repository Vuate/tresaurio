import Head from "next/head";
import { Icon } from "@iconify/react";

export default function MarketIntelligenceHero() {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Calculate your real trading costs. Combine fee, spread, slippage, and funding into a single all-in cost. Compare exchanges and find the cheapest option."
        />
      </Head>

      <div className="relative px-6 py-16 lg:py-20 text-center overflow-hidden border-b border-border-sub">
        {/* Grid background */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage:
              "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.12)_0%,transparent_65%)] pointer-events-none z-0" />

        <div className="relative z-10">
          {/* Hero badge */}
          <div className="inline-flex items-center px-4.5 py-1.75 mb-7 bg-surface-overlay border border-border-overlay rounded-full text-[0.78rem] font-medium text-[#71717A]">
            Market Microstructure Intelligence
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div className="w-17 h-17 flex items-center justify-center rounded-[18px] bg-[#2563EB]/10 border border-[#2563EB]/25">
              <Icon icon="mdi:chart-box-outline" className="text-3xl text-[#2563EB]" />
            </div>
          </div>

          {/* Title */}
          <h1
            className="font-black leading-[1.08] tracking-[-0.035em] mb-5"
            style={{ fontSize: "clamp(1.75rem, 9vw, 5rem)" }}
          >
            <span className="text-foreground">Market Microstructure </span>
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #2563EB 0%, #00C8FF 100%)" }}
            >
              &amp; Cost Intelligence
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-[1.05rem] text-[#71717A] leading-[1.75] mb-9 max-w-140 mx-auto px-4">
            Calculate your real trading costs. Combine fee, spread, slippage, and funding into a single all-in cost.
            Compare exchanges and find the cheapest option.
          </p>

          {/* Stats row */}
          <div className="flex gap-6 sm:gap-10 justify-center mb-8">
            {[
              { value: "$22K+", label: "Annual Savings" },
              { value: "4-in-1", label: "Cost Analysis" },
              { value: "Real-Time", label: "Data" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl sm:text-2xl font-black text-[#2563EB]">{stat.value}</div>
                <div className="text-xs text-[#71717A] mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Feature badges */}
          <div className="flex gap-2 sm:gap-3 justify-center flex-wrap px-4">
            {["Total Cost Calculator", "Exchange Comparison", "Market Efficiency", "Execution Quality"].map((badge) => (
              <span
                key={badge}
                className="px-3 py-1.5 bg-surface-overlay border border-border-overlay rounded-full text-xs font-medium text-[#71717A]"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
