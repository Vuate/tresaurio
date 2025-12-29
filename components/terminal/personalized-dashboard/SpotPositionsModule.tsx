"use client";

type SpotPosition = {
  symbol: string;
  amount: number;
  entryPrice: number;
  markPrice: number;
};

const MOCK_POSITIONS: SpotPosition[] = [
  {
    symbol: "BTCUSDT",
    amount: 0.42,
    entryPrice: 81200,
    markPrice: 87529,
  },
  {
    symbol: "ETHUSDT",
    amount: 5.1,
    entryPrice: 2650,
    markPrice: 2926,
  },
  {
    symbol: "SOLUSDT",
    amount: 38,
    entryPrice: 98,
    markPrice: 123,
  },
];

export default function SpotPositionsModule() {
  return (
    <div className="space-y-2">
      {MOCK_POSITIONS.map((p) => {
        const pnl = (p.markPrice - p.entryPrice) * p.amount;

        const pnlPct = ((p.markPrice - p.entryPrice) / p.entryPrice) * 100;

        const positive = pnl >= 0;

        return (
          <div
            key={p.symbol}
            className="flex items-center justify-between
              rounded-lg px-3 py-2
              bg-white/5 border border-white/10"
          >
            {/* LEFT */}
            <div>
              <div className="text-sm font-semibold text-white">
                {p.symbol.replace("USDT", "")}
              </div>
              <div className="text-[11px] text-white/50">
                {p.amount} @ ${p.entryPrice.toLocaleString()}
              </div>
            </div>

            {/* RIGHT */}
            <div className="text-right">
              <div
                className={`text-sm font-semibold ${
                  positive ? "text-teal-400" : "text-red-400"
                }`}
              >
                {positive ? "+" : ""}
                {pnl.toFixed(2)} $
              </div>
              <div
                className={`text-[11px] ${
                  positive ? "text-teal-400/70" : "text-red-400/70"
                }`}
              >
                {positive ? "+" : ""}
                {pnlPct.toFixed(2)}%
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
