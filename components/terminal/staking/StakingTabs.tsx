"use client";

import { useState } from "react";
import ComparisonSection from "./ComparisonSection";
import OpportunitiesSection from "./OpportunitiesSection";
import PortfolioSection from "./PortfolioSection";
import RewardCalendarSection from "./RewardCalendarSection";
import TradFiSection from "./TradFiSection";
import AnalyticsSection from "./AnalyticsSection";

const tabs = [
  { id: "comparison", label: "🔍 Karşılaştırma" },
  { id: "opportunities", label: "🚀 Fırsatlar" },
  { id: "portfolio", label: "💼 Portföyüm" },
  { id: "calendar", label: "📅 Reward Takvimi" },
  { id: "tradfi", label: "🏦 TradFi Karşılaştırma" },
  { id: "analytics", label: "📊 Analitik" },
];

export default function StakingTabs() {
  const [active, setActive] = useState("comparison");

  return (
    <>
      {/* TABS */}
      <div className="flex gap-2 border-b border-white/10 mb-6 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
              active === t.id
                ? "text-teal-300 border-teal-300"
                : "text-gray-400 border-transparent hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {active === "comparison" && <ComparisonSection />}
      {active === "opportunities" && <OpportunitiesSection />}
      {active === "portfolio" && <PortfolioSection />}
      {active === "calendar" && <RewardCalendarSection />}
      {active === "tradfi" && <TradFiSection />}
      {active === "analytics" && <AnalyticsSection />}
    </>
  );
}
