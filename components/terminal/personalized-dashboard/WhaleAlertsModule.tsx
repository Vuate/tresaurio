"use client";

import { useEffect, useState } from "react";
import type { WhaleTransfer } from "@/lib/personalized-dashboard/types";

const MOCK_DATA: WhaleTransfer[] = [
  {
    id: "w1",
    symbol: "BTC",
    amount: 117.32,
    usdValue: 5044760,
    direction: "in",
    exchange: "Binance",
    timestamp: Date.now() - 1000 * 60 * 3,
  },
  {
    id: "w2",
    symbol: "BTC",
    amount: 85.05,
    usdValue: 3657150,
    direction: "out",
    exchange: "Binance",
    timestamp: Date.now() - 1000 * 60 * 8,
  },
  {
    id: "w3",
    symbol: "ETH",
    amount: 4200,
    usdValue: 9120000,
    direction: "out",
    exchange: "OKX",
    timestamp: Date.now() - 1000 * 60 * 12,
  },
];

export default function WhaleAlertsModule() {
  const [data, setData] = useState<WhaleTransfer[]>([]);

  useEffect(() => {
    // ileride burası API / WS olacak
    setData(MOCK_DATA);
  }, []);

  return (
    <div className="space-y-2">
      {data.map((t) => {
        const isIn = t.direction === "in";

        return (
          <div
            key={t.id}
            className="flex items-center justify-between
              px-3 py-2 rounded-lg
              bg-white/5 border border-white/10"
          >
            {/* LEFT */}
            <div className="space-y-0.5">
              <div
                className={`text-sm font-semibold ${
                  isIn ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {t.symbol} {isIn ? "Deposit" : "Withdraw"}
              </div>

              <div className="text-[11px] text-white/40">{t.exchange}</div>
            </div>

            {/* RIGHT */}
            <div className="text-right">
              <div className="text-sm font-mono text-white">
                {t.amount.toLocaleString()} {t.symbol}
              </div>
              <div className="text-[11px] text-white/50">
                ${t.usdValue.toLocaleString()}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
