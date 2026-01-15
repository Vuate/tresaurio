// components/terminal/personalized-dashboard/FuturesPositionsModule.tsx
"use client";

import { useEffect, useState } from "react";
import { useFuturesPositionStore } from "@/store/futuresPositionStore";
import { TrendingUp, TrendingDown, X, RefreshCw } from "lucide-react";
import { usePriceStore } from "@/store/priceStore";

interface Props {
  instanceId: string;
}

type FundingRate = {
  symbol: string;
  fundingRate: number;
  fundingTime: number;
  lastUpdate: number;
};

export default function FuturesPositionsModule({ instanceId }: Props) {
  const storageKey = `futures-positions-${instanceId}`;

  const positions = useFuturesPositionStore((s) => s.positions);
  const removePosition = useFuturesPositionStore((s) => s.removePosition);
  const prices = usePriceStore((s) => s.prices);

  const [symbol, setSymbol] = useState("");
  const [side, setSide] = useState<"long" | "short">("long");
  const [entry, setEntry] = useState("");
  const [size, setSize] = useState("");
  const [leverage, setLeverage] = useState(10);
  const [leverageInput, setLeverageInput] = useState("10"); // 🔥 YENİ: Input field için

  // 🔥 YENİ: Funding rates state
  const [fundingRates, setFundingRates] = useState<Record<string, FundingRate>>(
    {}
  );
  const [loadingFunding, setLoadingFunding] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          // Could restore positions here if needed
        } catch (e) {
          console.warn("Failed to parse saved positions");
        }
      }
    }
  }, [storageKey]);

  useEffect(() => {
    if (typeof window !== "undefined" && positions.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(positions));
    }
  }, [positions, storageKey]);

  // 🔥 YENİ: Fetch funding rates for all positions
  useEffect(() => {
    if (positions.length === 0) return;

    const fetchFundingRates = async () => {
      setLoadingFunding(true);

      try {
        const symbols = [...new Set(positions.map((p) => p.symbol))];

        // Fetch funding rates for all symbols
        const requests = symbols.map(async (symbol) => {
          try {
            const response = await fetch(
              `https://fapi.binance.com/fapi/v1/fundingRate?symbol=${symbol}&limit=1`
            );

            if (!response.ok) throw new Error("API failed");

            const data = await response.json();

            if (data && data.length > 0) {
              return {
                symbol,
                fundingRate: parseFloat(data[0].fundingRate) * 100, // Convert to percentage
                fundingTime: data[0].fundingTime,
                lastUpdate: Date.now(),
              };
            }
            return null;
          } catch (error) {
            console.error(`Failed to fetch funding rate for ${symbol}:`, error);
            return null;
          }
        });

        const results = await Promise.all(requests);

        const newRates: Record<string, FundingRate> = {};
        results.forEach((result) => {
          if (result) {
            newRates[result.symbol] = result;
          }
        });

        setFundingRates(newRates);
      } catch (error) {
        console.error("Failed to fetch funding rates:", error);
      } finally {
        setLoadingFunding(false);
      }
    };

    fetchFundingRates();

    // Update funding rates every 5 minutes
    const interval = setInterval(fetchFundingRates, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [positions]);

  // 🔥 YENİ: Sync slider and input
  const handleLeverageSliderChange = (value: number) => {
    setLeverage(value);
    setLeverageInput(value.toString());
  };

  const handleLeverageInputChange = (value: string) => {
    setLeverageInput(value);

    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 125) {
      setLeverage(numValue);
    }
  };

  const handleLeverageInputBlur = () => {
    const numValue = parseInt(leverageInput);
    if (isNaN(numValue) || numValue < 1) {
      setLeverage(1);
      setLeverageInput("1");
    } else if (numValue > 125) {
      setLeverage(125);
      setLeverageInput("125");
    }
  };

  const addPosition = () => {
    if (!symbol || !entry || !size) {
      alert("Please fill all fields");
      return;
    }

    const entryPrice = parseFloat(entry);
    const posSize = parseFloat(size);

    if (entryPrice <= 0 || posSize <= 0) {
      alert("Invalid entry or size");
      return;
    }

    useFuturesPositionStore.getState().addPosition({
      symbol: symbol.toUpperCase(),
      side,
      entryPrice,
      size: posSize,
      leverage,
    });

    setSymbol("");
    setEntry("");
    setSize("");
  };

  const refreshFundingRate = async (symbol: string) => {
    try {
      const response = await fetch(
        `https://fapi.binance.com/fapi/v1/fundingRate?symbol=${symbol}&limit=1`
      );

      if (!response.ok) throw new Error("API failed");

      const data = await response.json();

      if (data && data.length > 0) {
        setFundingRates((prev) => ({
          ...prev,
          [symbol]: {
            symbol,
            fundingRate: parseFloat(data[0].fundingRate) * 100,
            fundingTime: data[0].fundingTime,
            lastUpdate: Date.now(),
          },
        }));
      }
    } catch (error) {
      console.error(`Failed to refresh funding rate for ${symbol}:`, error);
    }
  };

  if (positions.length === 0) {
    return (
      <div className="space-y-3 text-xs">
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Symbol (e.g. BTCUSDT)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-xs outline-none"
          />

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSide("long")}
              className={`py-2 rounded text-xs transition ${
                side === "long"
                  ? "bg-emerald-500 text-white"
                  : "bg-white/5 text-white/50"
              }`}
            >
              Long
            </button>
            <button
              onClick={() => setSide("short")}
              className={`py-2 rounded text-xs transition ${
                side === "short"
                  ? "bg-red-500 text-white"
                  : "bg-white/5 text-white/50"
              }`}
            >
              Short
            </button>
          </div>

          <input
            type="number"
            placeholder="Entry Price"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-xs outline-none"
          />

          <input
            type="number"
            placeholder="Size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-xs outline-none"
          />

          {/* 🔥 YENİ: Leverage with both slider and input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-white/50 text-[10px]">Leverage</label>
              <input
                type="number"
                min="1"
                max="125"
                value={leverageInput}
                onChange={(e) => handleLeverageInputChange(e.target.value)}
                onBlur={handleLeverageInputBlur}
                className="w-16 bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-xs outline-none text-right"
              />
            </div>
            <input
              type="range"
              min="1"
              max="125"
              value={leverage}
              onChange={(e) =>
                handleLeverageSliderChange(parseInt(e.target.value))
              }
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-[9px] text-white/30 mt-1">
              <span>1x</span>
              <span>25x</span>
              <span>50x</span>
              <span>75x</span>
              <span>100x</span>
              <span>125x</span>
            </div>
          </div>

          <button
            onClick={addPosition}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition text-xs font-semibold"
          >
            Add Position
          </button>
        </div>

        <div className="text-center text-white/40 text-[10px]">
          No futures positions
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {positions.map((pos) => {
        const currentPrice = prices[pos.symbol] || pos.entryPrice;
        const pnl =
          pos.side === "long"
            ? (currentPrice - pos.entryPrice) * pos.size
            : (pos.entryPrice - currentPrice) * pos.size;

        const pnlPercent =
          (pnl / (pos.entryPrice * pos.size)) * 100 * pos.leverage;
        const isProfit = pnl >= 0;

        // 🔥 YENİ: Get funding rate
        const fundingRate = fundingRates[pos.symbol];
        const fundingCost = fundingRate
          ? pos.entryPrice * pos.size * (fundingRate.fundingRate / 100)
          : null;

        return (
          <div
            key={pos.id}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                {pos.side === "long" ? (
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-400" />
                )}
                <span className="text-sm font-semibold text-white">
                  {pos.symbol.replace("USDT", "")}
                </span>
                <span className="text-[10px] text-white/40">
                  {pos.leverage}x
                </span>
              </div>

              <button
                onClick={() => removePosition(pos.id)}
                className="text-white/40 hover:text-red-400"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            <div className="text-[11px] space-y-0.5">
              <div className="flex justify-between text-white/50">
                <span>Entry</span>
                <span>${pos.entryPrice.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-white/50">
                <span>Current</span>
                <span>${currentPrice.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-white/50">
                <span>Size</span>
                <span>{pos.size}</span>
              </div>

              {/* 🔥 YENİ: Funding Rate Display */}
              {fundingRate && (
                <div className="flex justify-between items-center text-white/50 pt-1 border-t border-white/10">
                  <div className="flex items-center gap-1">
                    <span>Funding Rate</span>
                    <button
                      onClick={() => refreshFundingRate(pos.symbol)}
                      className="text-white/30 hover:text-white/60 transition-colors"
                      title="Refresh funding rate"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-right">
                    <div
                      className={
                        fundingRate.fundingRate >= 0
                          ? "text-red-400"
                          : "text-emerald-400"
                      }
                    >
                      {fundingRate.fundingRate >= 0 ? "+" : ""}
                      {fundingRate.fundingRate.toFixed(4)}%
                    </div>
                    {fundingCost !== null && (
                      <div className="text-[9px] text-white/30">
                        ~${Math.abs(fundingCost).toFixed(2)}/8h
                      </div>
                    )}
                  </div>
                </div>
              )}

              {loadingFunding && !fundingRate && (
                <div className="flex justify-between text-white/30 text-[10px] pt-1 border-t border-white/10">
                  <span>Funding Rate</span>
                  <span>Loading...</span>
                </div>
              )}

              <div className="flex justify-between font-semibold pt-1 border-t border-white/10">
                <span className="text-white/70">PnL</span>
                <span
                  className={isProfit ? "text-emerald-400" : "text-red-400"}
                >
                  {isProfit ? "+" : ""}${pnl.toFixed(2)} ({isProfit ? "+" : ""}
                  {pnlPercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
