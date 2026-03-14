import { Icon } from "@iconify/react";

export default function TradeFeatures() {
  return (
    <section className="mb-10 sm:mb-12 lg:mb-14 xl:mb-16 2xl:mb-18">
      <div className="section-header mb-6 sm:mb-7 lg:mb-8 xl:mb-9 2xl:mb-10 text-center">
        <h2 className="section-title text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-extrabold text-white">
          Key Features
        </h2>
        <p className="section-description mt-1.5 sm:mt-2 lg:mt-2.5 xl:mt-3 text-gray-400 max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto text-xs sm:text-sm lg:text-base xl:text-lg px-4">
          All your trading and portfolio management tools in one place
        </p>
      </div>

      <div className="features-grid grid gap-3 sm:gap-4 lg:gap-5 xl:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
        {/* CARD 1 */}
<div className="feature-card rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/10 bg-[#041F20]/95 p-4 sm:p-5 lg:p-6 xl:p-7 transition-all duration-300 hover:border-teal-400 hover:shadow-[0_8px_32px_rgba(25,216,208,0.2)] hover:-translate-y-1">      
    <span className="feature-icon text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-[#1A73E8]/65">
            <Icon icon="mdi:briefcase-variant-outline" />
          </span>
          <h3 className="feature-title mt-2 sm:mt-3 lg:mt-4 text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-white">
            Spot Positions
          </h3>
          <p className="feature-description mt-1.5 sm:mt-2 lg:mt-2.5 text-xs sm:text-sm lg:text-base text-gray-400 leading-relaxed">
            View all your spot holdings. Track entry prices, current value, and
            unrealized PnL in real-time.
          </p>
          <ul className="feature-list mt-2.5 sm:mt-3 lg:mt-4 space-y-1 sm:space-y-1.5 lg:space-y-2 text-xs sm:text-sm lg:text-base text-gray-300
            [&>li]:relative [&>li]:pl-4 sm:[&>li]:pl-5 lg:[&>li]:pl-6
            [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-0
            [&>li]:before:content-['✓'] [&>li]:before:text-[#1A73E8]
            [&>li]:before:font-bold [&>li]:before:inline-block
            [&>li]:before:w-3 sm:[&>li]:before:w-4 lg:[&>li]:before:w-5 [&>li]:before:text-center">
            <li>Multi-exchange support</li>
            <li>Real-time price updates</li>
            <li>Unrealized PnL calculation</li>
            <li>Portfolio allocation view</li>
          </ul>
        </div>

        {/* CARD 2 */}
<div className="feature-card rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/10 bg-[#041F20]/95 p-4 sm:p-5 lg:p-6 xl:p-7 transition-all duration-300 hover:border-teal-400 hover:shadow-[0_8px_32px_rgba(25,216,208,0.2)] hover:-translate-y-1">        
  <span className="feature-icon text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-[#1A73E8]/65">
            <Icon icon="mdi:flash-outline" />
          </span>
          <h3 className="feature-title mt-2 sm:mt-3 lg:mt-4 text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-white">
            Futures Positions
          </h3>
          <p className="feature-description mt-1.5 sm:mt-2 lg:mt-2.5 text-xs sm:text-sm lg:text-base text-gray-400 leading-relaxed">
            Monitor your open futures positions. View leverage, margin, and
            liquidation levels.
          </p>
          <ul className="feature-list mt-2.5 sm:mt-3 lg:mt-4 space-y-1 sm:space-y-1.5 lg:space-y-2 text-xs sm:text-sm lg:text-base text-gray-300
            [&>li]:relative [&>li]:pl-4 sm:[&>li]:pl-5 lg:[&>li]:pl-6
            [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-0
            [&>li]:before:content-['✓'] [&>li]:before:text-[#1A73E8]
            [&>li]:before:font-bold [&>li]:before:inline-block
            [&>li]:before:w-3 sm:[&>li]:before:w-4 lg:[&>li]:before:w-5 [&>li]:before:text-center">
            <li>Long/Short position tracking</li>
            <li>Leverage and margin view</li>
            <li>Liquidation price calculation</li>
            <li>Funding rate impact</li>
          </ul>
        </div>

        {/* CARD 3 */}
<div className="feature-card rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/10 bg-[#041F20]/95 p-4 sm:p-5 lg:p-6 xl:p-7 transition-all duration-300 hover:border-teal-400 hover:shadow-[0_8px_32px_rgba(25,216,208,0.2)] hover:-translate-y-1">     
     <span className="feature-icon text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-[#1A73E8]/65">
            <Icon icon="mdi:cash-multiple" />
          </span>
          <h3 className="feature-title mt-2 sm:mt-3 lg:mt-4 text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-white">
            PnL Analysis
          </h3>
          <p className="feature-description mt-1.5 sm:mt-2 lg:mt-2.5 text-xs sm:text-sm lg:text-base text-gray-400 leading-relaxed">
            View your realized and unrealized PnL in detail. Analyze by coin, exchange, or
            total portfolio returns.
          </p>
          <ul className="feature-list mt-2.5 sm:mt-3 lg:mt-4 space-y-1 sm:space-y-1.5 lg:space-y-2 text-xs sm:text-sm lg:text-base text-gray-300
            [&>li]:relative [&>li]:pl-4 sm:[&>li]:pl-5 lg:[&>li]:pl-6
            [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-0
            [&>li]:before:content-['✓'] [&>li]:before:text-[#1A73E8]
            [&>li]:before:font-bold [&>li]:before:inline-block
            [&>li]:before:w-3 sm:[&>li]:before:w-4 lg:[&>li]:before:w-5 [&>li]:before:text-center">
            <li>Realized PnL breakdown</li>
            <li>Unrealized PnL tracking</li>
            <li>Coin-based performance</li>
            <li>Historical return charts</li>
          </ul>
        </div>

        {/* CARD 4 */}
<div className="feature-card rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/10 bg-[#041F20]/95 p-4 sm:p-5 lg:p-6 xl:p-7 transition-all duration-300 hover:border-teal-400 hover:shadow-[0_8px_32px_rgba(25,216,208,0.2)] hover:-translate-y-1">    
      <span className="feature-icon text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-[#1A73E8]/65">
            <Icon icon="mdi:target-account" />
          </span>
          <h3 className="feature-title mt-2 sm:mt-3 lg:mt-4 text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-white">
            DCA Calculation
          </h3>
          <p className="feature-description mt-1.5 sm:mt-2 lg:mt-2.5 text-xs sm:text-sm lg:text-base text-gray-400 leading-relaxed">
         Combine purchases made at different times to calculate your average
            entry price.
          </p>
          <ul className="feature-list mt-2.5 sm:mt-3 lg:mt-4 space-y-1 sm:space-y-1.5 lg:space-y-2 text-xs sm:text-sm lg:text-base text-gray-300
            [&>li]:relative [&>li]:pl-4 sm:[&>li]:pl-5 lg:[&>li]:pl-6
            [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-0
            [&>li]:before:content-['✓'] [&>li]:before:text-[#1A73E8]
            [&>li]:before:font-bold [&>li]:before:inline-block
            [&>li]:before:w-3 sm:[&>li]:before:w-4 lg:[&>li]:before:w-5 [&>li]:before:text-center">
            <li>Automatic DCA calculation</li>
            <li>Manual purchase entry</li>
            <li>Average price view</li>
            <li>Break-even analysis</li>
          </ul>
        </div>

        {/* CARD 5 */}
<div className="feature-card rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/10 bg-[#041F20]/95 p-4 sm:p-5 lg:p-6 xl:p-7 transition-all duration-300 hover:border-teal-400 hover:shadow-[0_8px_32px_rgba(25,216,208,0.2)] hover:-translate-y-1">      
    <span className="feature-icon text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-[#1A73E8]/65">
            <Icon icon="mdi:shield-alert-outline" />
          </span>
          <h3 className="feature-title mt-2 sm:mt-3 lg:mt-4 text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-white">
            Risk Management
          </h3>
          <p className="feature-description mt-1.5 sm:mt-2 lg:mt-2.5 text-xs sm:text-sm lg:text-base text-gray-400 leading-relaxed">
            Measure your portfolio risk level. Get stop-loss recommendations and
            optimize position sizing. 
          </p>
          <ul className="feature-list mt-2.5 sm:mt-3 lg:mt-4 space-y-1 sm:space-y-1.5 lg:space-y-2 text-xs sm:text-sm lg:text-base text-gray-300
            [&>li]:relative [&>li]:pl-4 sm:[&>li]:pl-5 lg:[&>li]:pl-6
            [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-0
            [&>li]:before:content-['✓'] [&>li]:before:text-[#1A73E8]
            [&>li]:before:font-bold [&>li]:before:inline-block
            [&>li]:before:w-3 sm:[&>li]:before:w-4 lg:[&>li]:before:w-5 [&>li]:before:text-center">
            <li>Risk level scoring</li>
            <li>Stop-loss recommendations</li>
            <li>Position sizing calculation</li>
            <li>Diversification analysis</li>
          </ul>
        </div>

        {/* CARD 6 */}
<div className="feature-card rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/10 bg-[#041F20]/95 p-4 sm:p-5 lg:p-6 xl:p-7 transition-all duration-300 hover:border-teal-400 hover:shadow-[0_8px_32px_rgba(25,216,208,0.2)] hover:-translate-y-1">       
   <span className="feature-icon text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-[#1A73E8]/65">
            <Icon icon="mdi:chart-line-variant" />
          </span>
          <h3 className="feature-title mt-2 sm:mt-3 lg:mt-4 text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-white">
            Performance Statistics
          </h3>
          <p className="feature-description mt-1.5 sm:mt-2 lg:mt-2.5 text-xs sm:text-sm lg:text-base text-gray-400 leading-relaxed">
            Analyze your historical trading performance. View win rate, average returns, and
            most profitable coins.
          </p>
          <ul className="feature-list mt-2.5 sm:mt-3 lg:mt-4 space-y-1 sm:space-y-1.5 lg:space-y-2 text-xs sm:text-sm lg:text-base text-gray-300
            [&>li]:relative [&>li]:pl-4 sm:[&>li]:pl-5 lg:[&>li]:pl-6
            [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-0
            [&>li]:before:content-['✓'] [&>li]:before:text-[#1A73E8]
            [&>li]:before:font-bold [&>li]:before:inline-block
            [&>li]:before:w-3 sm:[&>li]:before:w-4 lg:[&>li]:before:w-5 [&>li]:before:text-center">
            <li>Win / Loss ratio</li>
            <li>Average gain / loss</li>
            <li>Most profitable / losing trades</li>
            <li>Monthly performance report</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
