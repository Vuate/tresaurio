import Head from "next/head";
import { Icon } from "@iconify/react";

export default function WalletHero() {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Track whale movements and smart money flows in real-time. Capture large transfers, exchange in/out flows, and market manipulation signals."
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
            On-Chain Intelligence Platform
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div className="w-17 h-17 flex items-center justify-center rounded-[18px] bg-[#2563EB]/10 border border-[#2563EB]/25">
              <Icon icon="lucide:wallet" className="text-3xl text-[#2563EB]" />
            </div>
          </div>

          {/* Title */}
          <h1
            className="font-black leading-[1.08] tracking-[-0.035em] mb-5"
            style={{ fontSize: "clamp(1.75rem, 9vw, 5rem)" }}
          >
            <span className="text-foreground">Market Wallet </span>
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #2563EB 0%, #00C8FF 100%)" }}
            >
              Tracker
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-[1.05rem] text-[#71717A] leading-[1.75] mb-9 max-w-140 mx-auto px-4">
            Track whale movements and smart money flows in real-time. Capture large transfers,
            exchange in/out flows, and market manipulation signals.
          </p>

          {/* Stats row */}
          <div className="flex gap-6 sm:gap-10 justify-center mb-8">
            {[
              { value: "16", label: "Pattern Types" },
              { value: ">$1M", label: "Whale Alerts" },
              { value: "Real-Time", label: "Tracking" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl sm:text-2xl font-black text-[#2563EB]">{stat.value}</div>
                <div className="text-xs text-[#71717A] mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Feature badges */}
          <div className="flex gap-2 sm:gap-3 justify-center flex-wrap px-4">
            {["Real-Time Tracking", "Whale Alerts", "Smart Money Analysis", "16 Pattern Detection"].map((badge) => (
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
