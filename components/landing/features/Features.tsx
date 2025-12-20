"use client";

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
          <span className="bg-gradient-to-r from-[#19d8d0] to-[#238c7c] bg-clip-text text-transparent">
            Treasurio?
          </span>
        </h2>

        {/* GRID */}
        <div className="grid grid-cols-4 gap-12">
          {/* CARD */}
          <div className="relative min-h-[340px] rounded-[28px] p-[55px] text-center transition-all duration-300">
            <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-[#19d8d0]/10 via-transparent to-[#238c7c]/10 blur-[0.5px]" />
            <div className="absolute inset-0 rounded-[28px] bg-[#041f20]/90" />

            <div className="relative z-10">
              <div className="mb-8 text-[64px]">📊</div>
              <h3 className="mb-4 text-[22px] font-semibold text-white">
                Real-Time Analytics
              </h3>
              <p className="text-[15px] leading-relaxed text-slate-300">
                Advanced charts, liquidity analysis, and risk metrics. Make
                data-driven decisions with institutional-grade tools.
              </p>
            </div>
          </div>

          {/* CARD */}
          <div className="relative min-h-[340px] rounded-[28px] p-[55px] text-center transition-all duration-300">
            <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-[#19d8d0]/10 via-transparent to-[#238c7c]/10" />
            <div className="absolute inset-0 rounded-[28px] bg-[#041f20]/90" />

            <div className="relative z-10">
              <div className="mb-8 text-[64px]">💼</div>
              <h3 className="mb-4 text-[22px] font-semibold text-white">
                Portfolio Management
              </h3>
              <p className="text-[15px] leading-relaxed text-slate-300">
                Track spot and futures positions, monitor PnL in real-time, and
                optimize your portfolio with scenario analysis.
              </p>
            </div>
          </div>

          {/* CARD */}
          <div className="relative min-h-[340px] rounded-[28px] p-[55px] text-center transition-all duration-300">
            <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-[#19d8d0]/10 via-transparent to-[#238c7c]/10" />
            <div className="absolute inset-0 rounded-[28px] bg-[#041f20]/90" />

            <div className="relative z-10">
              <div className="mb-8 text-[64px]">⚡</div>
              <h3 className="mb-4 text-[22px] font-semibold text-white">
                Lightning Fast
              </h3>
              <p className="text-[15px] leading-relaxed text-slate-300">
                High-performance terminal built for professional traders.
                Execute trades in milliseconds without lag.
              </p>
            </div>
          </div>

          {/* CARD */}
          <div className="relative min-h-[340px] rounded-[28px] p-[55px] text-center transition-all duration-300">
            <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-[#19d8d0]/10 via-transparent to-[#238c7c]/10" />
            <div className="absolute inset-0 rounded-[28px] bg-[#041f20]/90" />

            <div className="relative z-10">
              <div className="mb-8 text-[64px]">🔗</div>
              <h3 className="mb-4 text-[22px] font-semibold text-white">
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
