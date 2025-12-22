"use client";

import StakingHeader from "@/components/terminal/staking/StakingHeader";
import StatsGrid from "@/components/terminal/staking/StatsGrid";
import StakingTabs from "@/components/terminal/staking/StakingTabs";

export default function StakingPage() {
  return (
    <>
      <StakingHeader />
      <StatsGrid />
      <StakingTabs />
    </>
  );
}
