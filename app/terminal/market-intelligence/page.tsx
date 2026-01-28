import MarketIntelligenceHero from "@/components/terminal/market-intelligence/MarketIntelligenceHero";
import MarketIntelligenceFeatures from "@/components/terminal/market-intelligence/MarketIntelligenceFeatures";
import MarketIntelligenceCostBreakdown from "@/components/terminal/market-intelligence/MarketIntelligenceCostBreakdown";
import MarketIntelligenceComparison from "@/components/terminal/market-intelligence/MarketIntelligenceComparison";
import MarketIntelligenceHowItWorks from "@/components/terminal/market-intelligence/MarketIntelligenceHowItWorks";
import MarketIntelligenceCTA from "@/components/terminal/market-intelligence/MarketIntelligenceCTA";

export default function MarketIntelligencePage() {
  return (
    <div className="min-h-screen bg-[#031A1C] text-white">
      {/* Hero Section */}
      <MarketIntelligenceHero />

      {/* Main Container - Fully Responsive */}
      <div className="
        w-full 
        max-w-screen-sm sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl xl:max-w-screen-2xl
        mx-auto 
        px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12
        py-6 sm:py-8 lg:py-10 xl:py-12 2xl:py-14
      ">
        {/* Ana Özellikler */}
        <MarketIntelligenceFeatures />

        {/* All-in Cost Örneği */}
        <MarketIntelligenceCostBreakdown />

        {/* Exchange Karşılaştırması */}
        <MarketIntelligenceComparison />

        {/* Nasıl Çalışır */}
        <MarketIntelligenceHowItWorks />

        {/* CTA */}
        <MarketIntelligenceCTA />
      </div>
    </div>
  );
}
