// lib/personalized-dashboard/moduleRegistry.tsx
import type { ModuleCategory } from "./types";
import type { ReactNode } from "react";

import LivePrices from "@/components/terminal/personalized-dashboard/LivePricesModule";
import SpotPositionsModule from "@/components/terminal/personalized-dashboard/SpotPositionsModule";
import OrderBookModule from "@/components/terminal/personalized-dashboard/OrderBookModule";
import ExchangeComparisonModule from "@/components/terminal/personalized-dashboard/ExchangeComparisonModule";
import CreateAlertModule from "@/components/terminal/personalized-dashboard/CreateAlertModule";
import ActiveAlertsModule from "@/components/terminal/personalized-dashboard/ActiveAlertsModule";
import PnLOverviewModule from "@/components/terminal/personalized-dashboard/PnLOverviewModule";
import FuturesPositionsModule from "@/components/terminal/personalized-dashboard/FuturesPositionsModule";
import RiskCalculatorModule from "@/components/terminal/personalized-dashboard/RiskCalculatorModule";
import WhaleAlertsModule from "@/components/terminal/personalized-dashboard/WhaleAlertsModule";
import ExchangeFlowModule from "@/components/terminal/personalized-dashboard/ExchangeFlowModule";
import LiquidityAnalysisModule from "@/components/terminal/personalized-dashboard/LiquidityAnalysisModule";
import SpreadMonitorModule from "@/components/terminal/personalized-dashboard/SpreadMonitorModule";
import FundingRateModule from "@/components/terminal/personalized-dashboard/FundingRateModule";
import DCACalculatorModule from "@/components/terminal/personalized-dashboard/DCACalculatorModule";
import AllInCostCalculatorModule from "@/components/terminal/personalized-dashboard/AllInCostCalculatorModule";
import FeeStructureAnalyzerModule from "@/components/terminal/personalized-dashboard/FeeStructureAnalyzerModule";

export type ModuleDefinition = {
  type: string;
  title: string;
  description: string;
  category: ModuleCategory;
  defaultSize: {
    width: number;
    height: number;
  };
  render: () => ReactNode;
};

export const moduleRegistry: Record<string, ModuleDefinition> = {
  /* ---------------- TEMEL VERİ ---------------- */
  "live-prices": {
    type: "live-prices",
    title: "Live Prices",
    description: "Real-time cryptocurrency prices",
    category: "temel-veri",
    defaultSize: { width: 380, height: 240 },
    render: () => <LivePrices />,
  },

  /* ---------------- PORTFÖY ---------------- */
  "spot-positions": {
    type: "spot-positions",
    title: "Spot Positions",
    description: "Your active spot positions",
    category: "trader-portfoy",
    defaultSize: { width: 420, height: 300 },
    render: () => <SpotPositionsModule />,
  },

  "futures-positions": {
    type: "futures-positions",
    title: "Futures Positions",
    description: "Active futures contracts",
    category: "trader-portfoy",
    defaultSize: { width: 420, height: 340 },
    render: () => <FuturesPositionsModule />,
  },

  "pnl-overview": {
    type: "pnl-overview",
    title: "PnL Overview",
    description: "Profit & Loss summary",
    category: "trader-portfoy",
    defaultSize: { width: 360, height: 220 },
    render: () => <PnLOverviewModule />,
  },

  /* ---------------- DW / FLOW ---------------- */
  "exchange-flow": {
    type: "exchange-flow",
    title: "Exchange Flow",
    description: "Deposit / Withdraw tracking",
    category: "dw-flow",
    defaultSize: { width: 420, height: 300 },
    render: () => <ExchangeFlowModule />,
  },

  "whale-alerts": {
    type: "whale-alerts",
    title: "Whale Alerts",
    description: "Large on-chain / exchange transfers",
    category: "dw-flow",
    defaultSize: { width: 380, height: 260 },
    render: () => <WhaleAlertsModule />,
  },

  /* ---------------- LİKİDİTE ---------------- */
  "order-book": {
    type: "order-book",
    title: "Order Book",
    description: "Live order book depth (lite)",
    category: "likidite",
    defaultSize: { width: 420, height: 380 },
    render: () => <OrderBookModule />,
  },

  "exchange-comparison": {
    type: "exchange-comparison",
    title: "Exchange Comparison",
    description: "Binance vs KuCoin price difference",
    category: "likidite",
    defaultSize: { width: 320, height: 200 },
    render: () => <ExchangeComparisonModule />,
  },

  "liquidity-analysis": {
    type: "liquidity-analysis",
    title: "Liquidity Analysis",
    description: "Bid / Ask imbalance & market pressure",
    category: "likidite",
    defaultSize: { width: 360, height: 260 },
    render: () => <LiquidityAnalysisModule />,
  },

  "spread-monitor": {
    // 👈 YENİ MODÜL
    type: "spread-monitor",
    title: "Spread Monitor",
    description: "Real-time bid-ask spread & volume imbalance",
    category: "likidite",
    defaultSize: { width: 320, height: 400 },
    render: () => <SpreadMonitorModule />,
  },

  /* ---------------- ALERT ---------------- */
  "create-alert": {
    type: "create-alert",
    title: "Create Alert",
    description: "Set up new price alert",
    category: "alert",
    defaultSize: { width: 360, height: 260 },
    render: () => <CreateAlertModule />,
  },

  "active-alerts": {
    type: "active-alerts",
    title: "Active Alerts",
    description: "Your configured price alerts",
    category: "alert",
    defaultSize: { width: 360, height: 260 },
    render: () => <ActiveAlertsModule />,
  },

  /* ---------------- RISK ---------------- */
  "risk-calculator": {
    type: "risk-calculator",
    title: "Risk Calculator",
    description: "Calculate position risk & size",
    category: "risk",
    defaultSize: { width: 360, height: 320 },
    render: () => <RiskCalculatorModule />,
  },
  "funding-rate": {
    type: "funding-rate",
    title: "Funding Rate Tracker",
    description: "8-hour funding rate takibi ve trend analizi",
    category: "likidite",
    defaultSize: { width: 320, height: 400 },
    render: () => <FundingRateModule />,
  },
  "dca-calculator": {
    type: "dca-calculator",
    title: "DCA Calculator",
    description: "Calculate average entry price and simulate next DCA",
    category: "trader-portfoy",
    defaultSize: { width: 360, height: 600 },
    render: () => <DCACalculatorModule />,
  },
  "all-in-cost": {
    type: "all-in-cost",
    title: "All-in Cost Calculator",
    description:
      "Calculate total trading costs including fees, slippage, and funding",
    category: "likidite",
    defaultSize: { width: 360, height: 700 },
    render: () => <AllInCostCalculatorModule />,
  },
  "fee-structure": {
    type: "fee-structure",
    title: "Fee Structure Analyzer",
    description: "Analyze fee tiers and optimize trading costs",
    category: "likidite",
    defaultSize: { width: 360, height: 650 },
    render: () => <FeeStructureAnalyzerModule />,
  },
};
