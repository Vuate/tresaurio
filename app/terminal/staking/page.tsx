import StakingHero from "@/components/terminal/staking/StakingHero";
import StakingFeatures from "@/components/terminal/staking/StakingFeatures";
import StakingExamples from "@/components/terminal/staking/StakingExamples";
import StakingHowItWorks from "@/components/terminal/staking/StakingHowItWorks";
import StakingCTA from "@/components/terminal/staking/StakingCTA";

export default function StakingPage() {
  return (
    <div className="min-h-screen bg-[#031A1C] text-white">
      {/* Hero Section */}
      <StakingHero />

      <div className="w-full mx-auto px-6 py-8">
        {/* Ana Özellikler */}
        <StakingFeatures />

        {/* Örnek Pano Görünümü */}
        <StakingExamples />

        {/* Nasıl Çalışır */}
        <StakingHowItWorks />

        {/* CTA */}
        <StakingCTA />
      </div>
    </div>
  );
}
