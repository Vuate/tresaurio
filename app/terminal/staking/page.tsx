import StakingHero from "@/components/terminal/staking/StakingHero";
import StakingFeatures from "@/components/terminal/staking/StakingFeatures";
import StakingExamples from "@/components/terminal/staking/StakingExamples";
import StakingHowItWorks from "@/components/terminal/staking/StakingHowItWorks";
import StakingCTA from "@/components/terminal/staking/StakingCTA";

export default function StakingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <StakingHero />

      <div className="w-full mx-auto px-6 py-8">
        <StakingFeatures />
        <StakingExamples />
        <StakingHowItWorks />
        <StakingCTA />
      </div>
    </div>
  );
}
