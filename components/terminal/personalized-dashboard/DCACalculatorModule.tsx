"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Plus, X, Calculator } from "lucide-react";
import { usePriceStore } from "@/store/priceStore";


interface Trade {
  id: string;
  quantity: number;
  price: number;
}

interface DCAStats {
  totalQuantity: number;
  totalCost: number;
  averagePrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  breakEvenPrice: number;
}

const SYMBOLS = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT"];

interface Props {
  instanceId: string;
}

export default function DCACalculatorModule({ instanceId }: Props) {
  const prices = usePriceStore((s) => s.prices);
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
  const [symbolOpen, setSymbolOpen] = useState(false);

  const [trades, setTrades] = useState<Trade[]>([
    { id: "1", quantity: 0.5, price: 90000 },
  ]);
  const [newQty, setNewQty] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const symbolRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  function handleClickOutside(e: MouseEvent) {
    if (
      symbolRef.current &&
      !symbolRef.current.contains(e.target as Node)
    ) {
      setSymbolOpen(false);
    }
  }

  if (symbolOpen) {
document.addEventListener("pointerdown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [symbolOpen]);


  const currentPrice = prices[selectedSymbol] || 0;

  const stats = useMemo((): DCAStats => {
    const totalQuantity = trades.reduce((sum, t) => sum + t.quantity, 0);
    const totalCost = trades.reduce((sum, t) => sum + t.quantity * t.price, 0);
    const averagePrice = totalQuantity > 0 ? totalCost / totalQuantity : 0;
    const currentValue = totalQuantity * currentPrice;
    const unrealizedPnL = currentValue - totalCost;
    const unrealizedPnLPercent =
      totalCost > 0 ? (unrealizedPnL / totalCost) * 100 : 0;
    const breakEvenPrice = averagePrice;


    
    return {
      totalQuantity,
      totalCost,
      averagePrice,
      currentPrice,
      unrealizedPnL,
      unrealizedPnLPercent,
      breakEvenPrice,
    };
  }, [trades, currentPrice]);

  const addTrade = () => {
    const qty = parseFloat(newQty);
    const price = parseFloat(newPrice);

    if (!qty || !price || qty <= 0 || price <= 0) {
      alert("Please enter valid quantity and price");
      return;
    }

    setTrades([
      ...trades,
      {
        id: Date.now().toString(),
        quantity: qty,
        price: price,
      },
    ]);

    setNewQty("");
    setNewPrice("");
  };

  const removeTrade = (id: string) => {
    setTrades(trades.filter((t) => t.id !== id));
  };

  const clearAll = () => {
    setTrades([]);
    setNewQty("");
    setNewPrice("");
  };

  const simulateNextDCA = (nextPrice: number) => {
    if (!nextPrice || nextPrice <= 0) return null;

    const avgQty =
      trades.length > 0
        ? trades.reduce((sum, t) => sum + t.quantity, 0) / trades.length
        : 0.1;

    const newTotalQty = stats.totalQuantity + avgQty;
    const newTotalCost = stats.totalCost + avgQty * nextPrice;
    const newAvgPrice = newTotalCost / newTotalQty;
    const change =
      ((newAvgPrice - stats.averagePrice) / stats.averagePrice) * 100;

    return {
      newAvgPrice,
      change,
      quantity: avgQty,
    };
  };

  const nextDCAat88k = simulateNextDCA(88000);
  const nextDCAat92k = simulateNextDCA(92000);

  return (
    <div className="space-y-3 text-xs">
      <div>
        <label className="block text-white/50 mb-1 text-[10px] font-semibold">
          Symbol
        </label>
<div ref={symbolRef} className="relative">
  <button
    onClick={() => setSymbolOpen((v) => !v)}
    className="
      w-full
      flex items-center justify-between
      bg-white/5
      border border-white/10
      rounded-md
      px-3 py-2
      text-white text-xs
      cursor-pointer
      hover:bg-white/8
      transition-colors
    "
  >
    <span className="truncate">{selectedSymbol}</span>
    <span
  className={`
    text-white/40
    transition-transform
    duration-200
    ${symbolOpen ? "rotate-180" : ""}
  `}
>
  ▾
</span>

  </button>

{symbolOpen && (
  <div
    className="
      absolute z-50 mt-1
      w-full
    bg-[#1E2025]
border border-white/10
      rounded-md

    "
  >
    {SYMBOLS.map((s) => (
      <button
        key={s}
        onClick={() => {
          setSelectedSymbol(s);
          setSymbolOpen(false);
        }}
          className="
            w-full
            text-left
            px-3 py-2
            text-xs
            text-white
            transition-colors
          hover:text-[#1A73E8]/65

            cursor-pointer
          "
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          </div>
                </div>

        <div className="bg-white/5 border border-white/10 rounded p-2">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <span className="text-white/50 text-[10px]">
              Current Price (Live)
            </span>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold break-all">
                ${currentPrice.toLocaleString()}
              </span>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            </div>
          </div>
        </div>

          <div className="bg-white/5 border border-white/10 rounded p-3 space-y-2">
            <div className="flex items-center gap-2 text-white/70 font-semibold mb-2">
              <Plus className="w-3 h-3" />
              <span>Add Trade</span>
            </div>

              <div
                className="
                  grid
                  gap-2
                    grid-cols-1

                "
              >
          <div>
            <label className="block text-white/40 text-[10px] mb-1">
              Quantity
            </label>
            <input
              type="number"
              value={newQty}
              onChange={(e) => setNewQty(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs"
              placeholder="0.5"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-white/40 text-[10px] mb-1">
              Price
            </label>
            <input
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs"
              placeholder="90000"
              step="100"
            />
          </div>
        </div>

        <button
          onClick={addTrade}
                className="
                  w-full
                  bg-emerald-500/80
                  hover:bg-emerald-500
                  text-black
                  py-1.5
                  rounded-md
                  transition
                  text-xs
                  font-semibold cursor-pointer
                "        >
          Add Trade
        </button>
      </div>

      {trades.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-white/40 text-[10px] mb-1">
            <span>Trades ({trades.length})</span>
          <button
            onClick={clearAll}
            className="
              text-red-400
              hover:text-red-400
              transition-colors
              cursor-pointer
              
            "
          >
            Clear All
          </button>
          </div>

{trades.map((trade, idx) => (
  <div
    key={trade.id}
    className="bg-white/5 border border-white/10 rounded p-2 flex items-center justify-between gap-2 overflow-hidden"
  >
    <div className="flex-1 min-w-0">
      <span className="text-white/30 text-[10px]">#{idx + 1}</span>
      <div className="text-white/70 truncate">
        {trade.quantity} @ ${trade.price.toLocaleString()}
      </div>
      <div className="text-white/40 text-[10px] truncate">
        = ${(trade.quantity * trade.price).toLocaleString()}
      </div>
    </div>
    
    <button
      onClick={() => removeTrade(trade.id)}
      className="
        text-white/40
        cursor-pointer
        transition-all
        p-1
        hover:text-red-400
        hover:scale-110
        hover:drop-shadow-[0_0_6px_rgba(248,113,113,0.6)]
        shrink-0
      "
    >
      <X className="w-3 h-3" />
    </button>
  </div>
))}

        </div>
      )}

      {trades.length > 0 && (
        <>
          <div className="border-t border-white/10 pt-3 space-y-2">
            <div className="flex items-center gap-2 text-white/70 font-semibold mb-2">
              <Calculator className="w-3 h-3" />
              <span>DCA Summary</span>
            </div>

            <Row label="Total Quantity">
              {stats.totalQuantity.toFixed(4)}{" "}
              {selectedSymbol.replace("USDT", "")}
            </Row>
            <Row label="Total Cost">${stats.totalCost.toLocaleString()}</Row>
            <Row label="Average Price">
              <span className="text-blue-400 font-semibold">
                ${stats.averagePrice.toLocaleString()}
              </span>
            </Row>
            <Row label="Current Price (Live)">
              <span className="flex items-center gap-1">
                ${stats.currentPrice.toLocaleString()}
                <span className="text-[8px] text-emerald-400">●</span>
              </span>
            </Row>
            <Row label="Unrealized PnL">
              <span
                className={`font-semibold ${
                  stats.unrealizedPnL >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {stats.unrealizedPnL >= 0 ? "+" : ""}$
                {stats.unrealizedPnL.toLocaleString()} (
                {stats.unrealizedPnLPercent >= 0 ? "+" : ""}
                {stats.unrealizedPnLPercent.toFixed(2)}%)
              </span>
            </Row>
            <Row label="Break Even">
              ${stats.breakEvenPrice.toLocaleString()}
            </Row>
          </div>

          {nextDCAat88k && nextDCAat92k && (
            <div className="bg-white/5 border border-white/10 rounded p-3 space-y-2">
              <div className="text-white/50 text-[10px] mb-2">
                Next DCA Simulation:
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px]">
                  <span className="text-white/40">If buy @ $88,000:</span>
                  <span className="text-white/70">
                    New Avg: ${nextDCAat88k.newAvgPrice.toLocaleString()}{" "}
                    <span
                      className={
                        nextDCAat88k.change < 0
                          ? "text-emerald-400"
                          : "text-red-400"
                      }
                    >
                      ({nextDCAat88k.change.toFixed(2)}%)
                    </span>
                  </span>
                </div>

                <div className="flex justify-between text-[10px]">
                  <span className="text-white/40">If buy @ $92,000:</span>
                  <span className="text-white/70">
                    New Avg: ${nextDCAat92k.newAvgPrice.toLocaleString()}{" "}
                    <span
                      className={
                        nextDCAat92k.change < 0
                          ? "text-emerald-400"
                          : "text-red-400"
                      }
                    >
                      ({nextDCAat92k.change.toFixed(2)}%)
                    </span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {trades.length === 0 && (
        <div className="text-center text-white/40 py-4 text-[10px]">
          Add your first trade to start DCA calculation
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap justify-between items-start gap-2">
      <span className="text-white/50">{label}</span>
      <span className="text-right break-all">{children}</span>
    </div>
  );
}