import TradeHero from "@/components/terminal/trade/TradeHero";
import TradeFeatures from "@/components/terminal/trade/TradeFeatures";
import TradeVisualExamples from "@/components/terminal/trade/TradeVisualExamples";
import TradeHowItWorks from "@/components/terminal/trade/TradeHowItWorks";
import TradeCTA from "@/components/terminal/trade/TradeCTA";

export default function TradePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TradeHero />

      <div className="w-full mx-auto px-6 py-8">
        <TradeFeatures />
        <TradeVisualExamples />
        <TradeHowItWorks />
        <TradeCTA />
      </div>
    </div>
  );
}