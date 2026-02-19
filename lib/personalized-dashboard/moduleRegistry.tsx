
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
import NotesModule from "@/components/terminal/personalized-dashboard/NotesModule";
import PnLAnalysisModule from "@/components/terminal/personalized-dashboard/PnLAnalysisModule";
import NewsModule from "@/components/terminal/personalized-dashboard/NewsModule";
import LastOrdersModule from "@/components/terminal/personalized-dashboard/LastOrdersModule";
import SpotActionsModule from "@/components/terminal/personalized-dashboard/SpotActionsModule";
import FuturesActionsModule from "@/components/terminal/personalized-dashboard/FuturesActionsModule";
import RewardCalendarModule from "@/components/terminal/personalized-dashboard/RewardCalendarModule";
import ICOCalendarModule from "@/components/terminal/personalized-dashboard/ICOCalendarModule";
import TokenUnlockModule from "@/components/terminal/personalized-dashboard/TokenUnlockModule";
import SlippageMonitorModule from "@/components/terminal/personalized-dashboard/SlippageMonitorModule";
import RSIHeatmapModule from "@/components/terminal/personalized-dashboard/RSIHeatmapModule";
import MarketEfficiencyModule from "@/components/terminal/personalized-dashboard/MarketEfficiencyModule";
import ExchangeNetflowModule from "@/components/terminal/personalized-dashboard/ExchangeNetflowModule";
import ETFFlowsModule from "@/components/terminal/personalized-dashboard/ETFFlowsModule";
import StackPositionModule from "@/components/terminal/personalized-dashboard/StackPositionModule";
import WalletInspectorModule from "@/components/terminal/personalized-dashboard/WalletInspectorModule";
import TokenFlowModule from "@/components/terminal/personalized-dashboard/TokenFlowModule";
import ChartModule from "@/components/terminal/personalized-dashboard/ChartModule";

export type ModuleDefinition = {
  type: string;
  title: string;
  description: string;
  category: ModuleCategory;
  defaultSize: {
    width: number;
    height: number;
  };
  render: (instanceId: string) => ReactNode;
};

export const moduleRegistry: Record<string, ModuleDefinition> = {
  /* ---------------- 1. MARKET DATA ---------------- */
  "live-prices-spot": {
    type: "live-prices-spot",
    title: "Live Prices (Spot)",
    description: "Real-time spot market prices",
    category: "market-data",
    defaultSize: { width: 380, height: 240 },
    render: (instanceId: string) => (
      <LivePrices instanceId={instanceId} marketType="spot" />
    ),
  },

  "live-prices-futures": {
    type: "live-prices-futures",
    title: "Live Prices (Futures)",
    description: "Real-time futures market prices",
    category: "market-data",
    defaultSize: { width: 380, height: 240 },
    render: (instanceId: string) => (
      <LivePrices instanceId={instanceId} marketType="futures" />
    ),
  },

  notes: {
    type: "notes",
    title: "Notes",
    description: "Quick notes & reminders",
    category: "market-data",
    defaultSize: { width: 320, height: 260 },
    render: () => <NotesModule />,
  },

  /* ---------------- 2. MARKET MICROSTRUCTURE ---------------- */
  "order-book-spot": {
    type: "order-book-spot",
    title: "Order Book (Spot)",
    description: "Live spot order book depth",
    category: "market-microstructure",
    defaultSize: { width: 420, height: 380 },
    render: (instanceId: string) => (
      <OrderBookModule instanceId={instanceId} marketType="spot" />
    ),
  },

  "order-book-futures": {
    type: "order-book-futures",
    title: "Order Book (Futures)",
    description: "Live futures order book depth",
    category: "market-microstructure",
    defaultSize: { width: 420, height: 380 },
    render: (instanceId: string) => (
      <OrderBookModule instanceId={instanceId} marketType="futures" />
    ),
  },

  "liquidity-analysis": {
    type: "liquidity-analysis",
    title: "Liquidity Analysis",
    description: "Bid / Ask imbalance & market pressure",
    category: "market-microstructure",
    defaultSize: { width: 360, height: 260 },
    render: (instanceId: string) => (
      <LiquidityAnalysisModule instanceId={instanceId} />
    ),
  },

  "spread-monitor-spot": {
    type: "spread-monitor-spot",
    title: "Spread Monitor (Spot)",
    description: "Real-time spot bid-ask spread & volume imbalance",
    category: "market-microstructure",
    defaultSize: { width: 320, height: 400 },
    render: (instanceId: string) => (
      <SpreadMonitorModule instanceId={instanceId} marketType="spot" />
    ),
  },

  "spread-monitor-futures": {
    type: "spread-monitor-futures",
    title: "Spread Monitor (Futures)",
    description: "Real-time futures bid-ask spread & volume imbalance",
    category: "market-microstructure",
    defaultSize: { width: 320, height: 400 },
    render: (instanceId: string) => (
      <SpreadMonitorModule instanceId={instanceId} marketType="futures" />
    ),
  },

  "funding-rate": {
    type: "funding-rate",
    title: "Funding Rate Tracker",
description: "8-hour funding rate tracking and trend analysis",
    category: "market-microstructure",
    defaultSize: { width: 310, height: 400 },
    render: (instanceId: string) => (
      <FundingRateModule instanceId={instanceId} />
    ),
  },

  "all-in-cost": {
    type: "all-in-cost",
    title: "All-in Cost Calculator",
    description:
      "Calculate total trading costs including fees, slippage, and funding",
    category: "market-microstructure",
    defaultSize: { width: 320, height: 700 },
    render: (instanceId: string) => (
      <AllInCostCalculatorModule instanceId={instanceId} />
    ),
  },

  "fee-structure": {
    type: "fee-structure",
    title: "Fee Structure Analyzer",
    description: "Analyze fee tiers and optimize trading costs",
    category: "market-microstructure",
    defaultSize: { width: 360, height: 650 },
    render: (instanceId: string) => (
      <FeeStructureAnalyzerModule instanceId={instanceId} />
    ),
  },

  /* ---------------- 3. FLOW (Akış & Transfer) ---------------- */
  "exchange-flow": {
    type: "exchange-flow",
    title: "Exchange Flow",
    description: "Deposit / Withdraw tracking",
    category: "flow",
    defaultSize: { width: 420, height: 300 },
    render: (instanceId: string) => (
      <ExchangeFlowModule instanceId={instanceId} />
    ),
  },

  "whale-alerts": {
    type: "whale-alerts",
    title: "Whale Alerts",
    description: "Large on-chain / exchange transfers",
    category: "flow",
    defaultSize: { width: 380, height: 260 },
    render: (instanceId: string) => (
      <WhaleAlertsModule instanceId={instanceId} />
    ),
  },

  "exchange-comparison": {
    type: "exchange-comparison",
    title: "Exchange Comparison",
    description: "Binance vs KuCoin price difference",
    category: "flow",
    defaultSize: { width: 320, height: 300 },
    render: (instanceId: string) => (
      <ExchangeComparisonModule instanceId={instanceId} />
    ),
  },

  /* ---------------- 4. TRADE & PORTFOLIO ---------------- */
  "spot-positions": {
    type: "spot-positions",
    title: "Spot Positions",
    description: "Your active spot positions",
    category: "portfolio",
    defaultSize: { width: 420, height: 300 },
    render: (instanceId: string) => (
      <SpotPositionsModule instanceId={instanceId} />
    ),
  },

  "futures-positions": {
    type: "futures-positions",
    title: "Futures Positions",
    description: "Active futures contracts",
    category: "portfolio",
    defaultSize: { width: 420, height: 340 },
    render: (instanceId: string) => (
      <FuturesPositionsModule instanceId={instanceId} />
    ),
  },

  "pnl-overview": {
    type: "pnl-overview",
    title: "PnL Overview",
    description: "Profit & Loss summary",
    category: "portfolio",
    defaultSize: { width: 360, height: 220 },
    render: (instanceId: string) => (
      <PnLOverviewModule instanceId={instanceId} />
    ),
  },

  "dca-calculator": {
    type: "dca-calculator",
    title: "DCA Calculator",
    description: "Calculate average entry price and simulate next DCA",
    category: "portfolio",
    defaultSize: { width: 360, height: 600 },
    render: (instanceId: string) => (
      <DCACalculatorModule instanceId={instanceId} />
    ),
  },

  "risk-calculator": {
    type: "risk-calculator",
    title: "Risk Calculator",
    description: "Calculate position risk & size",
    category: "portfolio",
    defaultSize: { width: 360, height: 320 },
    render: (instanceId: string) => (
      <RiskCalculatorModule instanceId={instanceId} />
    ),
  },

  /* ---------------- 5. ALERTS ---------------- */
  "create-alert": {
    type: "create-alert",
    title: "Create Alert",
    description: "Set up new price alert",
    category: "alert",
    defaultSize: { width: 360, height: 260 },
    render: (instanceId: string) => (
      <CreateAlertModule instanceId={instanceId} />
    ),
  },

  "active-alerts": {
    type: "active-alerts",
    title: "Active Alerts",
    description: "Your configured price alerts",
    category: "alert",
    defaultSize: { width: 360, height: 260 },
    render: (instanceId: string) => (
      <ActiveAlertsModule instanceId={instanceId} />
    ),
  },
  "pnl-analysis": {
    type: "pnl-analysis",
    title: "PnL Analysis",
    description: "Detailed profit & loss breakdown with real-time tracking",
    category: "portfolio",
    defaultSize: { width: 380, height: 580 }, // Biraz daha uzun yaptım
    render: (instanceId: string) => (
      <PnLAnalysisModule instanceId={instanceId} />
    ),
  },
  news: {
    type: "news",
    title: "Crypto News",
    description: "Latest cryptocurrency news and updates",
    category: "market-data",
    defaultSize: { width: 400, height: 600 },
    render: (instanceId: string) => <NewsModule instanceId={instanceId} />,
  },
  "last-orders": {
    type: "last-orders",
    title: "Last Orders",
    description: "Recent trade history and order status",
    category: "portfolio",
    defaultSize: { width: 420, height: 600 },
    render: (instanceId: string) => (
      <LastOrdersModule instanceId={instanceId} />
    ),
  },
  "spot-actions": {
    type: "spot-actions",
    title: "Spot Actions",
    description: "Quick buy/sell spot positions",
    category: "portfolio",
    defaultSize: { width: 360, height: 620 },
    render: (instanceId: string) => (
      <SpotActionsModule instanceId={instanceId} />
    ),
  },
  "futures-actions": {
    type: "futures-actions",
    title: "Futures Actions",
    description: "Quick long/short futures positions with leverage",
    category: "portfolio",
    defaultSize: { width: 360, height: 700 },
    render: (instanceId: string) => (
      <FuturesActionsModule instanceId={instanceId} />
    ),
  },
  "reward-calendar": {
    type: "reward-calendar",
    title: "Reward Calendar",
    description: "Upcoming staking rewards and airdrops",
    category: "portfolio",
    defaultSize: { width: 360, height: 600 },
    render: (instanceId: string) => (
      <RewardCalendarModule instanceId={instanceId} />
    ),
  },

  "ico-calendar": {
    type: "ico-calendar",
    title: "ICO Calendar",
    description: "Upcoming token sales and ICOs",
    category: "market-data",
    defaultSize: { width: 380, height: 600 },
    render: (instanceId: string) => (
      <ICOCalendarModule instanceId={instanceId} />
    ),
  },

  "token-unlock": {
    type: "token-unlock",
    title: "Token Unlocks",
    description: "Token vesting schedule and unlock events",
    category: "market-data",
    defaultSize: { width: 360, height: 600 },
    render: (instanceId: string) => (
      <TokenUnlockModule instanceId={instanceId} />
    ),
  },
  "slippage-monitor": {
    type: "slippage-monitor",
    title: "Slippage Monitor",
    description: "Calculate order slippage and market impact",
    category: "market-microstructure",
    defaultSize: { width: 360, height: 600 },
    render: (instanceId: string) => (
      <SlippageMonitorModule instanceId={instanceId} />
    ),
  },

  "rsi-heatmap": {
    type: "rsi-heatmap",
    title: "RSI Heatmap",
    description: "Multi-asset RSI overview with heatmap",
    category: "market-data",
    defaultSize: { width: 380, height: 650 },
    render: (instanceId: string) => (
      <RSIHeatmapModule instanceId={instanceId} />
    ),
  },

  "market-efficiency": {
    type: "market-efficiency",
    title: "Market Efficiency",
    description: "Market quality score based on spread, depth & volume",
    category: "market-microstructure",
    defaultSize: { width: 380, height: 600 },
    render: (instanceId: string) => (
      <MarketEfficiencyModule instanceId={instanceId} />
    ),
  },

  "exchange-netflow": {
    type: "exchange-netflow",
    title: "Exchange Netflow",
    description: "Track inflow/outflow across exchanges",
    category: "flow",
    defaultSize: { width: 380, height: 600 },
    render: (instanceId: string) => (
      <ExchangeNetflowModule instanceId={instanceId} />
    ),
  },
  "etf-flows": {
    type: "etf-flows",
    title: "ETF Flows",
    description: "Bitcoin ETF inflow/outflow tracking",
    category: "flow",
    defaultSize: { width: 380, height: 600 },
    render: (instanceId: string) => <ETFFlowsModule instanceId={instanceId} />,
  },

  "stack-position": {
    type: "stack-position",
    title: "Stack Tracker",
    description: "Group and track token positions by category",
    category: "portfolio",
    defaultSize: { width: 380, height: 600 },
    render: (instanceId: string) => (
      <StackPositionModule instanceId={instanceId} />
    ),
  },

  "wallet-inspector": {
    type: "wallet-inspector",
    title: "Wallet Inspector",
    description: "Analyze any wallet's holdings and transactions",
    category: "flow",
    defaultSize: { width: 360, height: 650 },
    render: (instanceId: string) => (
      <WalletInspectorModule instanceId={instanceId} />
    ),
  },

  "token-flow": {
    type: "token-flow",
    title: "Token Flow Analysis",
    description: "Cross-chain token movement tracking",
    category: "flow",
    defaultSize: { width: 380, height: 650 },
    render: (instanceId: string) => <TokenFlowModule instanceId={instanceId} />,
  },

  /* ---------------- CHART (Grafik) ---------------- */
  chart: {
    type: "chart",
    title: "Chart",
    description: "Candlestick chart with technical indicators",
    category: "market-data",
    defaultSize: { width: 600, height: 450 },
    render: (instanceId: string) => <ChartModule instanceId={instanceId} />,
  },
};
