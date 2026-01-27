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

      {/* Main Container - Fully Responsive */}
      <div className="
        w-full 
        max-w-screen-sm sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl xl:max-w-screen-2xl 
        mx-auto 
        px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12
        py-6 sm:py-8 lg:py-10 xl:py-12 2xl:py-14
      ">
        <TradeFeatures />
        <TradeVisualExamples />
        <TradeHowItWorks />
        <TradeCTA />
      </div>
    </div>
  );
}
