export type ModuleId = string;

export type ModuleCategory =
  | "temel-veri"
  | "trader-portfoy"
  | "dw-flow"
  | "likidite"
  | "alert"
  | "risk";

export type ModuleInstance = {
  id: ModuleId;
  type: string; // registry key: "live-prices" gibi
  title: string;
  category: ModuleCategory;

  x: number;
  y: number;
  width: number;
  height: number;

  minimized?: boolean;
};

export type NoteItem = {
  id: string;
  text: string;
  createdAt: number;
};

export type AlertCondition = "above" | "below";

export type AlertItem = {
  id: string;
  symbol: string; // BTCUSDT
  condition: AlertCondition;
  price: number;
  active: boolean;
};

export type SpotPosition = {
  id: string;
  symbol: string; // BTCUSDT
  qty: number; // 0.25
  entryPrice: number; // 42000
  currentPrice: number;
};

export type FuturesSide = "long" | "short";

export type FuturesPosition = {
  id: string;
  symbol: string; // BTCUSDT
  side: FuturesSide; // long / short
  qty: number; // contracts
  entryPrice: number;
  markPrice: number;
  leverage: number;
  liquidationPrice: number;
};

export type WhaleTransfer = {
  id: string;
  symbol: string; // BTC
  amount: number; // 117.32
  usdValue: number; // 5_044_760
  direction: "in" | "out"; // exchange -> wallet | wallet -> exchange
  exchange: string; // Binance
  timestamp: number;
};

export type ExchangeFlowEvent = {
  id: string;
  symbol: string; // BTCUSDT
  exchange: string; // Binance
  direction: "deposit" | "withdraw";
  amount: number; // BTC
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
