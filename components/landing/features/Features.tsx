"use client";

import { Icon } from "@iconify/react";

export default function Features() {
  return (
    <section className="bg-[#031a1c] py-[90px] text-gray-200">
      <div
        className="
          mx-auto max-w-[1400px] px-6

          /* LAPTOP OPTİK DENGE – MİKRO FIX */
          min-[1280px]:pr-12
          min-[1536px]:pr-6
        "
      >
        <h2 className="mb-[90px] text-center text-[60px] font-semibold">
          Why{" "}
          <span className="text-[#1A73E8]/65">
            Treasurio?
          </span>
        </h2>

          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-8
            xl:gap-12
          ">       

          <div className="relative min-h-[340px] rounded-[28px] p-8
          lg:p-12 text-center transition-all duration-300">
            <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-[#19d8d0]/10 via-transparent to-[#238c7c]/10 blur-[0.5px]" />
            <div className="absolute inset-0 rounded-[28px] bg-[#041f20]/90" />

            <div className="relative z-10">
          <div className="mb-8 flex justify-center">
            <Icon
              icon="mdi:chart-bar"
          className="
            w-12 h-12
            lg:w-14 lg:h-14
            xl:w-16 xl:h-16
          text-[#1A73E8]/65
          "  />
          </div>
              <h3 className="mb-4 text-lg
          lg:text-[22px] font-semibold text-white">
                Real-Time Analytics
              </h3>
              <p className="text-[15px] leading-relaxed text-slate-300">
                Advanced charts, liquidity analysis, and risk metrics. Make
                data-driven decisions with institutional-grade tools.
              </p>
            </div>
          </div>

          <div className="relative min-h-[340px] rounded-[28px] p-8
        lg:p-12 text-center transition-all duration-300">
            <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-[#19d8d0]/10 via-transparent to-[#238c7c]/10" />
            <div className="absolute inset-0 rounded-[28px] bg-[#041f20]/90" />

            <div className="relative z-10">
          <div className="mb-8 flex justify-center">
            <Icon
              icon="mdi:briefcase-variant"
          className="
            w-12 h-12
            lg:w-14 lg:h-14
            xl:w-16 xl:h-16
text-[#1A73E8]/65
          "  />
          </div>          
              <h3 className="mb-4 text-lg
          lg:text-[22px] font-semibold text-white">
                Portfolio Management
              </h3>
              <p className="text-[15px] leading-relaxed text-slate-300">
                Track spot and futures positions, monitor PnL in real-time, and
                optimize your portfolio with scenario analysis.
              </p>
            </div>
          </div>

          <div className="relative min-h-[340px] rounded-[28px] p-8
        lg:p-12 text-center transition-all duration-300">
            <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-[#19d8d0]/10 via-transparent to-[#238c7c]/10" />
            <div className="absolute inset-0 rounded-[28px] bg-[#041f20]/90" />

            <div className="relative z-10">
          <div className="mb-8 flex justify-center">
            <Icon
              icon="mdi:lightning-bolt"
          className="
            w-12 h-12
            lg:w-14 lg:h-14
            xl:w-16 xl:h-16
           text-[#1A73E8]/65
          "  />
          </div>              <h3 className="mb-4 text-lg
          lg:text-[22px] font-semibold text-white">
                Lightning Fast
              </h3>
              <p className="text-[15px] leading-relaxed text-slate-300">
                High-performance terminal built for professional traders.
                Execute trades in milliseconds without lag.
              </p>
            </div>
          </div>

          <div className="relative min-h-[340px] rounded-[28px] p-8
          lg:p-12 text-center transition-all duration-300">
            <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-[#19d8d0]/10 via-transparent to-[#238c7c]/10" />
            <div className="absolute inset-0 rounded-[28px] bg-[#041f20]/90" />

            <div className="relative z-10">
            <div className="mb-8 flex justify-center">
              <Icon
                icon="mdi:link-variant"
            className="
              w-12 h-12
              lg:w-14 lg:h-14
              xl:w-16 xl:h-16
             text-[#1A73E8]/65
            "  />
            </div>              
            <h3 className="mb-4 text-lg
            lg:text-[22px] font-semibold text-white">
                Multi-Exchange Connectivity
              </h3>
              <p className="text-[15px] leading-relaxed text-slate-300">
                Connect your wallets and API keys from Binance, OKX, Coinbase,
                and 20+ exchanges. Manage everything from one place.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
