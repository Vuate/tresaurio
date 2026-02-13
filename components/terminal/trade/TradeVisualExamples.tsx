export default function TradeVisualExamples() {
  return (
    <section className="mb-10 sm:mb-12 lg:mb-14 xl:mb-16 2xl:mb-18">
      <div className="section-header mb-6 sm:mb-7 lg:mb-8 xl:mb-9 2xl:mb-10 text-center">
        <h2 className="section-title text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-extrabold text-white">
          Sample Dashboard View
        </h2>
        <p className="section-description mt-1.5 sm:mt-2 lg:mt-2.5 xl:mt-3 text-gray-400 max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto text-xs sm:text-sm lg:text-base xl:text-lg px-4">
          Examples of how you can view your portfolio tools
        </p>
      </div>

      <div className="visual-example">
        <h3 className="mb-4 sm:mb-5 lg:mb-6 text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-white">
          Spot Portfolio Summary
        </h3>

        <div className="example-grid grid gap-3 sm:gap-4 lg:gap-5 xl:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="example-card rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-4 lg:p-5 xl:p-6">
            <div className="example-label text-[10px] sm:text-xs lg:text-sm text-gray-400">
              Total Value
            </div>
            <div className="example-value mt-1 sm:mt-1.5 lg:mt-2 text-lg sm:text-xl lg:text-2xl xl:text-3xl font-extrabold text-white">
              $124,567
            </div>
            <div className="example-subvalue mt-0.5 sm:mt-1 text-[10px] sm:text-xs lg:text-sm text-gray-500">
              ≈ 2.83 BTC
            </div>
          </div>

          <div className="example-card rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-4 lg:p-5 xl:p-6">
            <div className="example-label text-[10px] sm:text-xs lg:text-sm text-gray-400">
              Unrealized PnL
            </div>
            <div className="example-value mt-1 sm:mt-1.5 lg:mt-2 text-lg sm:text-xl lg:text-2xl xl:text-3xl font-extrabold text-emerald-400">
              +$12,890
            </div>
            <div className="example-subvalue mt-0.5 sm:mt-1 text-[10px] sm:text-xs lg:text-sm text-gray-500">
              +11.5% return
            </div>
          </div>

          <div className="example-card rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-4 lg:p-5 xl:p-6">
            <div className="example-label text-[10px] sm:text-xs lg:text-sm text-gray-400">
              Best Performance
            </div>
            <div className="example-value mt-1 sm:mt-1.5 lg:mt-2 text-lg sm:text-xl lg:text-2xl xl:text-3xl font-extrabold text-white">
              SOL
            </div>
            <div className="example-subvalue mt-0.5 sm:mt-1 text-[10px] sm:text-xs lg:text-sm text-gray-500">
              +42.3% return
            </div>
          </div>

          <div className="example-card rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-4 lg:p-5 xl:p-6">
            <div className="example-label text-[10px] sm:text-xs lg:text-sm text-gray-400">
              Total Coins
            </div>
            <div className="example-value mt-1 sm:mt-1.5 lg:mt-2 text-lg sm:text-xl lg:text-2xl xl:text-3xl font-extrabold text-white">
              12
            </div>
            <div className="example-subvalue mt-0.5 sm:mt-1 text-[10px] sm:text-xs lg:text-sm text-gray-500">
              across 5 exchanges
            </div>
          </div>
        </div>
      </div>

      <div className="visual-example mt-5 sm:mt-6 lg:mt-7 xl:mt-8">
        <h3 className="mb-4 sm:mb-5 lg:mb-6 text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-white">
          Futures Positions
        </h3>

        <div className="example-grid grid gap-3 sm:gap-4 lg:gap-5 xl:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="example-card rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-4 lg:p-5 xl:p-6">
            <div className="example-label text-[10px] sm:text-xs lg:text-sm text-gray-400">
              Open Positions
            </div>
            <div className="example-value mt-1 sm:mt-1.5 lg:mt-2 text-lg sm:text-xl lg:text-2xl xl:text-3xl font-extrabold text-white">
              3
            </div>
            <div className="example-subvalue mt-0.5 sm:mt-1 text-[10px] sm:text-xs lg:text-sm text-gray-500">
              2 Long, 1 Short
            </div>
          </div>

          <div className="example-card rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-4 lg:p-5 xl:p-6">
            <div className="example-label text-[10px] sm:text-xs lg:text-sm text-gray-400">
              Total Margin
            </div>
            <div className="example-value mt-1 sm:mt-1.5 lg:mt-2 text-lg sm:text-xl lg:text-2xl xl:text-3xl font-extrabold text-white">
              $8,450
            </div>
            <div className="example-subvalue mt-0.5 sm:mt-1 text-[10px] sm:text-xs lg:text-sm text-gray-500">
              Average 5x leverage
            </div>
          </div>

          <div className="example-card rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-4 lg:p-5 xl:p-6">
            <div className="example-label text-[10px] sm:text-xs lg:text-sm text-gray-400">
              Unrealized PnL
            </div>
            <div className="example-value mt-1 sm:mt-1.5 lg:mt-2 text-lg sm:text-xl lg:text-2xl xl:text-3xl font-extrabold text-emerald-400">
              +$1,234
            </div>
            <div className="example-subvalue mt-0.5 sm:mt-1 text-[10px] sm:text-xs lg:text-sm text-gray-500">
              +14.6% gain
            </div>
          </div>

          <div className="example-card rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-4 lg:p-5 xl:p-6">
            <div className="example-label text-[10px] sm:text-xs lg:text-sm text-gray-400">
              Liquidation Risk
            </div>
            <div className="example-value mt-1 sm:mt-1.5 lg:mt-2 text-lg sm:text-xl lg:text-2xl xl:text-3xl font-extrabold text-emerald-400">
              Low
            </div>
            <div className="example-subvalue mt-0.5 sm:mt-1 text-[10px] sm:text-xs lg:text-sm text-gray-500">
              Nearest: -18%
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
