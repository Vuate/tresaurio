// components/terminal/personalized-dashboard/SpreadMonitorModule.tsx
"use client";

import { useState, useEffect } from "react";
import { Activity, Plus, X } from "lucide-react";

const DEFAULT_SYMBOLS = ["BTCUSDT", "ETHUSDT"];

interface SpreadData {
  symbol: string;
  bid: number;
  ask: number;
  spread: number;
  spreadPercent: number;
}

const MOCK_SPREADS: Record<string, SpreadData> = {
  BTCUSDT: {
    symbol: "BTCUSDT",
    bid: 95000.5,
    ask: 95001.0,
    spread: 0.5,
    spreadPercent: 0.0005,
  },
  ETHUSDT: {
    symbol: "ETHUSDT",
    bid: 2185.25,
    ask: 2185.5,
    spread: 0.25,
    spreadPercent: 0.0011,
  },
  BNBUSDT: {
    symbol: "BNBUSDT",
    bid: 615.3,
    ask: 615.4,
    spread: 0.1,
    spreadPercent: 0.0016,
  },
};

interface Props {
  instanceId: string;
}

export default function SpreadMonitorModule({ instanceId }: Props) {
  const storageKey = `spread-monitor-${instanceId}-symbols`;

  const [symbols, setSymbols] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return DEFAULT_SYMBOLS;
        }
      }
    }
    return DEFAULT_SYMBOLS;
  });

  const [newSymbol, setNewSymbol] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [spreads, setSpreads] = useState<Record<string, SpreadData>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(symbols));
    }
  }, [symbols, storageKey]);

  useEffect(() => {
    const data: Record<string, SpreadData> = {};
    symbols.forEach((sym) => {
      data[sym] = MOCK_SPREADS[sym] || {
        symbol: sym,
        bid: 0,
        ask: 0,
        spread: 0,
        spreadPercent: 0,
      };
    });
    setSpreads(data);
  }, [symbols]);

  const addSymbol = () => {
    const sym = newSymbol.toUpperCase().trim();
    if (!sym) return;
    if (symbols.includes(sym)) {
      alert("Symbol already added");
      return;
    }
    setSymbols([...symbols, sym]);
    setNewSymbol("");
    setShowAdd(false);
  };

  const removeSymbol = (sym: string) => {
    setSymbols(symbols.filter((s) => s !== sym));
  };

  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/70 font-semibold">
          <Activity className="w-3 h-3" />
          <span>Spread Monitor</span>
        </div>

        <button
          onClick={() => setShowAdd(!showAdd)}
          className="text-white/60 hover:text-teal-400 transition"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {showAdd && (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="SYMBOL"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSymbol()}
            className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-1.5 text-white text-xs outline-none"
          />
          <button
            onClick={addSymbol}
            className="px-3 py-1.5 bg-teal-400/20 border border-teal-400/40 text-teal-300 rounded text-xs hover:bg-teal-400/30 transition"
          >
            Add
          </button>
        </div>
      )}

      <div className="space-y-1.5">
        {symbols.map((sym) => {
          const data = spreads[sym];
          if (!data) return null;

          return (
            <div
              key={sym}
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-white">
                  {sym.replace("USDT", "")}
                </span>

                <button
                  onClick={() => removeSymbol(sym)}
                  className="text-white/30 hover:text-red-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-0.5 text-[10px]">
                <div className="flex justify-between text-white/50">
                  <span>Bid</span>
                  <span className="text-emerald-400">
                    {data.bid.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-white/50">
                  <span>Ask</span>
                  <span className="text-red-400">
                    {data.ask.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between pt-0.5 border-t border-white/10">
                  <span className="text-white/70">Spread</span>
                  <span className="text-white font-semibold">
                    ${data.spread.toFixed(2)} ({data.spreadPercent.toFixed(4)}%)
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {symbols.length === 0 && (
        <div className="text-center text-white/40 py-4 text-[10px]">
          No symbols monitored
        </div>
      )}
    </div>
  );
}
