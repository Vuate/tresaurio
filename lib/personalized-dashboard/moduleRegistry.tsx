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
  "live-prices": {
    type: "live-prices",
    title: "Live Prices",
    description: "Real-time cryptocurrency prices",
    category: "temel-veri",
    defaultSize: { width: 380, height: 240 },
    render: () => <LivePrices />,
  },

  "spot-positions": {
    type: "spot-positions",
    title: "Spot Positions",
    description: "Your active spot positions",
    category: "trader-portfoy",
    defaultSize: { width: 420, height: 300 },
    render: () => <SpotPositionsModule />,
  },

  "exchange-flow": {
    type: "exchange-flow",
    title: "Exchange Flow",
    description: "Deposit / Withdraw tracking",
    category: "dw-flow",
    defaultSize: { width: 460, height: 280 },
    render: () => <div>Exchange Flow Content</div>,
  },

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

  "pnl-overview": {
    type: "pnl-overview",
    title: "PnL Overview",
    description: "Profit & Loss summary",
    category: "trader-portfoy",
    defaultSize: { width: 360, height: 220 },
    render: () => <PnLOverviewModule />,
  },

  "futures-positions": {
    type: "futures-positions",
    title: "Futures Positions",
    description: "Active futures contracts",
    category: "trader-portfoy",
    defaultSize: { width: 420, height: 340 },
    render: () => <FuturesPositionsModule />,
  },

  "risk-calculator": {
    type: "risk-calculator",
    title: "Risk Calculator",
    description: "Calculate position risk & size",
    category: "risk",
    defaultSize: { width: 360, height: 320 },
    render: () => <RiskCalculatorModule />,
  },
};
