import Hero from "@/components/learn/Hero";
import FeatureGrid from "@/components/learn/FeatureSection";
import AnalyticsModules from "@/components/learn/AnalyticsModules";
import CTA from "@/components/learn/CTA";
import AdvancedFeatures from "@/components/learn/AdvancedFeatures";
import Footer from "@/components/learn/Footer";
import KeyBenefitsHeader from "@/components/learn/KeyBenefitsHeader";
import UseCasesSection from "@/components/learn/UseCasesSection";
import ComparisonHeader from "@/components/learn/ComparisonHeader";
import TreasurioComparison from "@/components/learn/TreasurioComparison";
import ExchangeComparison from "@/components/learn/ExchangeComparison";
import KeyBenefitsList from "@/components/learn/KeyBenefitsList";

export default function LearnPage() {
  return (
    <>
      <Hero />

      <main className="mx-auto max-w-[1400px] px-6 py-16 space-y-24">
        <FeatureGrid />
        <AdvancedFeatures />
        <AnalyticsModules />

        <ComparisonHeader />

        <div className="grid gap-8 md:grid-cols-2">
          <TreasurioComparison />
          <ExchangeComparison />
        </div>

        <UseCasesSection />
        <KeyBenefitsHeader />
        <KeyBenefitsList />
        <CTA />
        <Footer />
      </main>
    </>
  );
}
