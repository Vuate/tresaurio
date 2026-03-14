import Head from "next/head";
import { Icon } from "@iconify/react";

export default function TradeHero() {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Manage your spot and futures trades on a single dashboard. Track your open positions, calculate PnL, and analyze your portfolio performance."
        />
      </Head>

      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 pb-5 sm:pb-7 lg:pb-9 text-center bg-gradient-to-b from-teal-500/5 to-transparent border-b border-white/10">
        <div className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-3 sm:mb-4 lg:mb-5 inline-block animate-float text-[#1A73E8]/65">
          <Icon icon="mdi:briefcase-variant-outline" />
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black mb-2 sm:mb-3 lg:mb-4 text-white">
          Trade & Portfolio Management
        </h1>

        <p className="text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-gray-300 max-w-xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mx-auto mb-4 sm:mb-5 lg:mb-6 leading-relaxed px-4">
          Manage your spot and futures trades on a single dashboard. Track your open positions, 
          calculate PnL, and analyze your portfolio performance.
        </p>

        <div className="flex gap-2 sm:gap-2.5 lg:gap-3 justify-center flex-wrap px-4">
          <span className="px-2.5 sm:px-3 lg:px-3.5 xl:px-4 py-1 sm:py-1.5 lg:py-2 bg-white/5 border border-white/20 rounded-full text-[10px] sm:text-xs lg:text-sm font-semibold text-white">
            Spot & Futures
          </span>
          <span className="px-2.5 sm:px-3 lg:px-3.5 xl:px-4 py-1 sm:py-1.5 lg:py-2 bg-white/5 border border-white/20 rounded-full text-[10px] sm:text-xs lg:text-sm font-semibold text-white">
            Multi-Exchange
          </span>
          <span className="px-2.5 sm:px-3 lg:px-3.5 xl:px-4 py-1 sm:py-1.5 lg:py-2 bg-white/5 border border-white/20 rounded-full text-[10px] sm:text-xs lg:text-sm font-semibold text-white">
            PnL Tracking
          </span>
          <span className="px-2.5 sm:px-3 lg:px-3.5 xl:px-4 py-1 sm:py-1.5 lg:py-2 bg-white/5 border border-white/20 rounded-full text-[10px] sm:text-xs lg:text-sm font-semibold text-white">
            Risk Management
          </span>
        </div>
      </div>
    </>
  );
}
