import type { ExchangeFlowEvent } from "./types";

export function generateMockFlow(): ExchangeFlowEvent {
  const isDeposit = Math.random() > 0.5;
  const amount = Number((Math.random() * 200 + 20).toFixed(2));
  const price = 43000;

  return {
    id: crypto.randomUUID(),
    symbol: "BTCUSDT",
    exchange: "Binance",
    direction: isDeposit ? "deposit" : "withdraw",
    amount,
    usdValue: amount * price,
    timestamp: Date.now(),
  };
}
