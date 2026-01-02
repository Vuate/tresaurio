"use client";

import { useEffect } from "react";
import { useExchangeFlowStore } from "@/store/exchangeFlowStore";
import { generateMockFlow } from "@/lib/personalized-dashboard/mockExchangeFlow";

export default function ExchangeFlowModule() {
  const { events, addEvent } = useExchangeFlowStore();

  useEffect(() => {
    const id = setInterval(() => {
      addEvent(generateMockFlow());
    }, 5000);

    return () => clearInterval(id);
  }, [addEvent]);

  if (events.length === 0) {
    return <div className="text-xs text-white/40">No flow data</div>;
  }

  return (
    <div className="space-y-2">
      {events.map((e) => {
        const isIn = e.direction === "deposit";
        const color = isIn ? "text-red-400" : "text-emerald-400";

        return (
          <div
            key={e.id}
            className="px-3 py-2 rounded-lg
              bg-white/5 border border-white/10"
          >
            <div className={`text-xs font-semibold ${color}`}>
              {e.symbol.replace("USDT", "")} {isIn ? "Deposit" : "Withdraw"}
            </div>

            <div className="text-[11px] text-white/50">
              {e.amount} BTC · ${e.usdValue.toLocaleString()}
            </div>

            <div className="text-[10px] text-white/30">{e.exchange}</div>
          </div>
        );
      })}
    </div>
  );
}
