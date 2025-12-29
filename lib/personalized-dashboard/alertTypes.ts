export type AlertCondition = "above" | "below";

export type PriceAlert = {
  id: string;
  symbol: string; // BTCUSDT
  condition: AlertCondition;
  target: number;
  triggered: boolean;
  createdAt: number;
};
