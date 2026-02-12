export type ModuleId = string;

export type ModuleCategory =
  | "market-data" // Market Data
  | "market-microstructure" // Market Microstructure (Likidite)
  | "flow" // Flow (Akış & Transfer)
  | "portfolio" // Trade & Portfolio
  | "alert" // Alerts
  | "news" //  News & Sentiment
  | "events" //  Events & Calendar
  | "analytics" //  Analytics & Metrics
  | "actions"; //  Trading Actions

export type ModuleType =
  // Existing
  | "live-prices"
  | "spot-positions"
  | "futures-positions"
  | "pnl-overview"
  | "order-book"
  | "liquidity-analysis"
  | "exchange-comparison"
  | "exchange-flow"
  | "whale-alerts"
  | "create-alert"
  | "active-alerts"
  | "risk-calculator"
  | "spread-monitor"
  | "funding-rate"
  | "dca-calculator"
  | "all-in-cost"
  | "fee-structure"
  | "pnl-analysis" // PnL Analysis Widget
  | "news-feed" // News
  | "token-flow" // Token Flow Analysis
  | "wallet-inspector" // Wallet Inspector
  | "stack-position-tracker" // Stack Position Tracker
  | "reward-calendar" // Reward Calendar
  | "slippage-monitor" // Slippage Monitor
  | "market-efficiency" // Market Efficiency Score
  | "spot-actions" // Spot Actions
  | "futures-actions" // Futures Actions
  | "last-orders" // Last Orders
  | "exchange-netflow" // Exchange Netflow Widget
  | "etf-flows" // ETF Flows
  | "rsi-heatmap" // RSI Heatmap
  | "token-unlock" // Token Unlock & Vesting
  | "ico-calendar" // ICO Calendar
  | "chart"; // Grafik

export type ModuleInstance = {
  id: ModuleId;
  type: string;
  title: string;
  category: ModuleCategory;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized?: boolean;
};

// ==================== EXISTING TYPES ====================

export type NoteItem = {
  id: string;
  text: string;
  createdAt: number;
};

export type AlertCondition = "above" | "below";

export type AlertItem = {
  id: string;
  symbol: string;
  condition: AlertCondition;
  price: number;
  active: boolean;
};

export type SpotPosition = {
  id: string;
  symbol: string;
  qty: number;
  entryPrice: number;
  currentPrice: number;
};

export type FuturesSide = "long" | "short";

export type FuturesPosition = {
  id: string;
  symbol: string;
  side: FuturesSide;
  qty: number;
  entryPrice: number;
  markPrice: number;
  leverage: number;
  liquidationPrice: number;
};

export type WhaleTransfer = {
  id: string;
  symbol: string;
  amount: number;
  usdValue: number;
  direction: "in" | "out";
  exchange: string;
  timestamp: number;
};

export type ExchangeFlowEvent = {
  id: string;
  symbol: string;
  exchange: string;
  direction: "deposit" | "withdraw";
  amount: number;
  usdValue: number;
  timestamp: number;
};

export type LiquidityMetrics = {
  spreadPct: number;
  bidDepth: number;
  askDepth: number;
  pressure: "buy" | "sell" | "neutral";
  score: number;
};

// === Analytics / PnL ===

export type PnLTrade = {
  price: number;
  qty: number;
  side: "buy" | "sell";
  fee?: number;
};

export type PnLRequest = {
  trades: PnLTrade[];
  current_price: number;
};

export type PnLResponse = {
  position: number;
  avg_price: number;
  realized_pnl: number;
  unrealized_pnl: number;
  net_pnl: number;
};

// ==================== 🔥 NEW TYPES ====================

// === PnL Analysis ===
export type PnLBreakdown = {
  realized: number;
  unrealized: number;
  fees: number;
  net: number;
  roi: number;
};

export type PnLTimeframe = "today" | "week" | "month" | "all";

export type PerformerData = {
  symbol: string;
  pnl: number;
  roi: number;
  rank: number;
};

// === News ===
export type NewsItem = {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: number;
  sentiment?: "positive" | "negative" | "neutral";
  impact?: "high" | "medium" | "low";
  category?: string[];
};

export type NewsSentiment = {
  positive: number;
  negative: number;
  neutral: number;
  score: number; // -100 to +100
};

// === Token Flow ===
export type TokenFlowEvent = {
  id: string;
  symbol: string;
  from: string;
  to: string;
  amount: number;
  usdValue: number;
  txHash: string;
  timestamp: number;
  type: "exchange-to-wallet" | "wallet-to-exchange" | "wallet-to-wallet";
};

export type FlowSummary = {
  totalIn: number;
  totalOut: number;
  netFlow: number;
  largestTx: number;
  avgTxSize: number;
};

// === Wallet Inspector ===
export type WalletData = {
  address: string;
  balance: number;
  totalValue: number;
  tokens: TokenBalance[];
  history: WalletTransaction[];
  labels?: string[];
  riskScore?: number;
};

export type TokenBalance = {
  symbol: string;
  balance: number;
  value: number;
  percentage: number;
};

export type WalletTransaction = {
  id: string;
  type: "send" | "receive";
  symbol: string;
  amount: number;
  from: string;
  to: string;
  timestamp: number;
  txHash: string;
};

// === Staking ===
export type StackPosition = {
  id: string;
  symbol: string;
  amount: number;
  apr: number;
  platform: string;
  startDate: number;
  lockPeriod: number; // days
  nextReward: number;
  totalEarned: number;
};

export type RewardEvent = {
  id: string;
  symbol: string;
  amount: number;
  platform: string;
  timestamp: number;
  claimed: boolean;
};

// === Slippage ===
export type SlippageData = {
  symbol: string;
  marketType: "spot" | "futures";
  expectedPrice: number;
  executedPrice: number;
  slippagePct: number;
  slippageUsd: number;
  timestamp: number;
};

export type SlippageStats = {
  avgSlippage: number;
  maxSlippage: number;
  totalLoss: number;
  tradeCount: number;
};

// === Market Efficiency ===
export type MarketEfficiencyMetrics = {
  score: number; // 0-100
  spreadQuality: number;
  depthQuality: number;
  volatilityScore: number;
  liquidityScore: number;
  timestamp: number;
};

// === Trading Actions ===
export type OrderSide = "buy" | "sell";
export type OrderType = "market" | "limit" | "stop-limit";

export type SpotOrder = {
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price?: number;
  stopPrice?: number;
};

export type FuturesOrder = {
  symbol: string;
  side: "long" | "short";
  type: OrderType;
  quantity: number;
  leverage: number;
  price?: number;
  stopLoss?: number;
  takeProfit?: number;
};

// === Last Orders ===
export type OrderHistory = {
  id: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price: number;
  executedPrice: number;
  status: "filled" | "partial" | "cancelled" | "pending";
  timestamp: number;
  fee: number;
  pnl?: number;
};

// === Exchange Netflow ===
export type ExchangeNetflow = {
  exchange: string;
  symbol: string;
  inflow: number;
  outflow: number;
  netflow: number;
  timestamp: number;
};

export type NetflowTrend = "accumulation" | "distribution" | "neutral";

// === ETF Flows ===
export type ETFFlow = {
  id: string;
  name: string;
  ticker: string;
  flow: number; // positive = inflow, negative = outflow
  aum: number;
  date: number;
};

export type ETFStats = {
  totalInflow: number;
  totalOutflow: number;
  netFlow: number;
  flowTrend: "bullish" | "bearish" | "neutral";
};

// === RSI Heatmap ===
export type RSIData = {
  symbol: string;
  rsi: number;
  timeframe: string;
  timestamp: number;
};

export type RSILevel = "oversold" | "normal" | "overbought";

// === Token Unlock & Vesting ===
export type TokenUnlock = {
  id: string;
  project: string;
  symbol: string;
  unlockDate: number;
  amount: number;
  percentage: number;
  category: "team" | "investor" | "community" | "treasury";
  status: "upcoming" | "completed";
};

export type VestingSchedule = {
  id: string;
  project: string;
  symbol: string;
  totalSupply: number;
  vestedSupply: number;
  schedule: VestingMilestone[];
};

export type VestingMilestone = {
  date: number;
  amount: number;
  percentage: number;
  recipient: string;
};

// === ICO Calendar ===
export type ICOEvent = {
  id: string;
  project: string;
  symbol: string;
  startDate: number;
  endDate: number;
  softCap: number;
  hardCap: number;
  currentRaised: number;
  tokenPrice: number;
  platform: string;
  status: "upcoming" | "active" | "completed" | "cancelled";
  website?: string;
  whitepaper?: string;
};
