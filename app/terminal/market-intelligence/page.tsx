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

      {/* Main Container */}
   <div className="max-w-9xl mx-auto px-6 py-16">
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