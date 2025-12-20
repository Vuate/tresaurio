import Header from "@/components/terminal/market-intelligence/Header";
import TopMetrics from "@/components/terminal/market-intelligence/TopMetrics";
import FeeAnalysis from "@/components/terminal/market-intelligence/FeeAnalysis";
import FundingAnalysis from "@/components/terminal/market-intelligence/FundingAnalysis";
import SpreadSlippage from "@/components/terminal/market-intelligence/SpreadSlippage";
import OrderbookDepth from "@/components/terminal/market-intelligence/OrderbookDepth";
import OpenInterest from "@/components/terminal/market-intelligence/OpenInterest";
import LongShort from "@/components/terminal/market-intelligence/LongShort";
import DecimalTick from "@/components/terminal/market-intelligence/DecimalTick";
import CostComparison from "@/components/terminal/market-intelligence/CostComparison";
import EfficiencyBreakdown from "@/components/terminal/market-intelligence/EfficiencyBreakdown";
import ActiveAlerts from "@/components/terminal/market-intelligence/ActiveAlerts";

export default function MarketIntelligencePage() {
  return (
    <div className="space-y-6">
      <Header />

      <TopMetrics />

      <div className="grid grid-cols-2 gap-6">
        <FeeAnalysis />
        <FundingAnalysis />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <SpreadSlippage />
        <OrderbookDepth />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <OpenInterest />
        <LongShort />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <DecimalTick />
        <CostComparison />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <EfficiencyBreakdown />
        <ActiveAlerts />
      </div>
    </div>
  );
}
