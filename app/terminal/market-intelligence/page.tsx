import MarketIntelligenceHero from "@/components/terminal/market-intelligence/MarketIntelligenceHero";
import MarketIntelligenceFeatures from "@/components/terminal/market-intelligence/MarketIntelligenceFeatures";
import MarketIntelligenceCostBreakdown from "@/components/terminal/market-intelligence/MarketIntelligenceCostBreakdown";
import MarketIntelligenceComparison from "@/components/terminal/market-intelligence/MarketIntelligenceComparison";
import MarketIntelligenceHowItWorks from "@/components/terminal/market-intelligence/MarketIntelligenceHowItWorks";
import MarketIntelligenceCTA from "@/components/terminal/market-intelligence/MarketIntelligenceCTA";


export default function MarketIntelligencePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketIntelligenceHero />

      <div className="w-full mx-auto px-6 py-8">

        <MarketIntelligenceFeatures />
        <MarketIntelligenceCostBreakdown />
        <MarketIntelligenceComparison />
        <MarketIntelligenceHowItWorks />
        <MarketIntelligenceCTA />
      </div>
    </div>
  );
}
