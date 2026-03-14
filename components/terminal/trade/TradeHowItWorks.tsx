export default function TradeHowItWorks() {
  return (
    <section className="mb-10 sm:mb-12 lg:mb-14 xl:mb-16 2xl:mb-18">
      <div className="section-header mb-6 sm:mb-7 lg:mb-8 xl:mb-9 2xl:mb-10 text-center">
        <h2 className="section-title text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-extrabold text-white">
          How It Works?
        </h2>
        <p className="section-description mt-1.5 sm:mt-2 lg:mt-2.5 xl:mt-3 text-gray-400 max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto text-xs sm:text-sm lg:text-base xl:text-lg px-4">
          4 steps to start using Trade &amp; Portfolio Management
        </p>
      </div>

      {/* Steps */}
      <div className="steps grid gap-3 sm:gap-4 lg:gap-5 xl:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {/* STEP 1 */}
        <div className="step rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 lg:p-6 xl:p-7 backdrop-blur">
          <div className="step-number mb-2 sm:mb-3 lg:mb-4 flex h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 xl:h-11 xl:w-11 items-center justify-center rounded-full bg-teal-400/10 text-sm sm:text-base lg:text-lg xl:text-xl font-extrabold text-white">
            1
          </div>
          <h3 className="step-title text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-white">
            Exchange Connection
                      </h3>
          <p className="step-description mt-1.5 sm:mt-2 lg:mt-2.5 text-xs sm:text-sm lg:text-base text-gray-400 leading-relaxed">
            Connect your exchanges (Binance, OKX, Bybit, etc.) via API
            or manually enter your positions.
          </p>
        </div>

        {/* STEP 2 */}
        <div className="step rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 lg:p-6 xl:p-7 backdrop-blur">
          <div className="step-number mb-2 sm:mb-3 lg:mb-4 flex h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 xl:h-11 xl:w-11 items-center justify-center rounded-full bg-teal-400/10 text-sm sm:text-base lg:text-lg xl:text-xl font-extrabold text-white">
            2
          </div>
          <h3 className="step-title text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-white">
            Position Tracking
          </h3>
          <p className="step-description mt-1.5 sm:mt-2 lg:mt-2.5 text-xs sm:text-sm lg:text-base text-gray-400 leading-relaxed">
            All your spot and futures positions are automatically loaded to the dashboard.
            Real-time prices and PnL calculations are updated instantly.
          </p>
        </div>

        {/* STEP 3 */}
        <div className="step rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 lg:p-6 xl:p-7 backdrop-blur">
          <div className="step-number mb-2 sm:mb-3 lg:mb-4 flex h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 xl:h-11 xl:w-11 items-center justify-center rounded-full bg-teal-400/10 text-sm sm:text-base lg:text-lg xl:text-xl font-extrabold text-white">
            3
          </div>
          <h3 className="step-title text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-white">
            Analysis &amp; Insights
          </h3>
          <p className="step-description mt-1.5 sm:mt-2 lg:mt-2.5 text-xs sm:text-sm lg:text-base text-gray-400 leading-relaxed">
            Analyze your portfolio performance. View your most profitable / losing
            positions, risk level, and diversification status.
          </p>
        </div>

        {/* STEP 4 */}
        <div className="step rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 lg:p-6 xl:p-7 backdrop-blur">
          <div className="step-number mb-2 sm:mb-3 lg:mb-4 flex h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 xl:h-11 xl:w-11 items-center justify-center rounded-full bg-teal-400/10 text-sm sm:text-base lg:text-lg xl:text-xl font-extrabold text-white">
            4
          </div>
          <h3 className="step-title text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-white">
            Optimization
          </h3>
          <p className="step-description mt-1.5 sm:mt-2 lg:mt-2.5 text-xs sm:text-sm lg:text-base text-gray-400 leading-relaxed">
            Apply risk management recommendations, set stop-loss levels,
            and optimize your portfolio allocation.
          </p>
        </div>
      </div>
    </section>
  );
}
