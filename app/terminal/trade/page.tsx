import TradeHero from "@/components/terminal/trade/TradeHero";
import TradeFeatures from "@/components/terminal/trade/TradeFeatures";
import TradeVisualExamples from "@/components/terminal/trade/TradeVisualExamples";
import TradeHowItWorks from "@/components/terminal/trade/TradeHowItWorks";
import TradeCTA from "@/components/terminal/trade/TradeCTA";

export default function TradePage() {
  return (
    <div className="min-h-screen bg-[#031A1C] text-white">
      {/* Hero Section */}
      <TradeHero />

            {/* Main Container */}
      <div className="max-w-9xl mx-auto px-6 py-16">
      <TradeFeatures />
      <TradeVisualExamples />
      <TradeHowItWorks />
      <TradeCTA />

      </div>
      </div>
    );
}
