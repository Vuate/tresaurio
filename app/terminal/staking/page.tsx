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

      {/* Main Container - Fully Responsive */}
      <div className="
        w-full 
        max-w-screen-sm sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl xl:max-w-screen-2xl 
        mx-auto 
        px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12
        py-6 sm:py-8 lg:py-10 xl:py-12 2xl:py-14
      ">
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
