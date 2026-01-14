// components/terminal/personalized-dashboard/SpotPositionsModule.tsx
"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { usePortfolioStore } from "@/store/portfolioStore";
import { usePriceStore } from "@/store/priceStore";

interface Props {
  instanceId: string;
}

const EXCHANGE_FORMATS: Record<
  string,
  (base: string, quote: string) => string
> = {
  binance: (base, quote) => `${base}${quote}`,
  okx: (base, quote) => `${base}-${quote}`,
  bybit: (base, quote) => `${base}${quote}`,
  coinbase: (base, quote) => `${base}-${quote}`,
  kraken: (base, quote) => `${base}${quote}`,
  kucoin: (base, quote) => `${base}-${quote}`,
  gateio: (base, quote) => `${base}_${quote}`,
  huobi: (base, quote) => `${base}${quote}`.toLowerCase(),
  bitfinex: (base, quote) => `${base}${quote}`,
  mexc: (base, quote) => `${base}${quote}`,
  bitget: (base, quote) => `${base}${quote}`,
  "crypto.com": (base, quote) => `${base}_${quote}`,
  bingx: (base, quote) => `${base}-${quote}`,
  phemex: (base, quote) => `${base}${quote}`,
  bitstamp: (base, quote) => `${base}${quote}`.toLowerCase(),
  gemini: (base, quote) => `${base}${quote}`.toLowerCase(),
  poloniex: (base, quote) => `${base}_${quote}`,
  bitmart: (base, quote) => `${base}_${quote}`,
  lbank: (base, quote) => `${base}_${quote}`.toLowerCase(),
  ascendex: (base, quote) => `${base}/${quote}`,
};

const EXCHANGES = [
  "binance",
  "okx",
  "bybit",
  "coinbase",
  "kraken",
  "kucoin",
  "gateio",
  "huobi",
  "bitfinex",
  "mexc",
  "bitget",
  "crypto.com",
  "bingx",
  "phemex",
  "bitstamp",
  "gemini",
  "poloniex",
  "bitmart",
  "lbank",
  "ascendex",
];

export default function SpotPositionsModule({ instanceId }: Props) {
  const { spotPositions, addSpotPosition, removeSpotPosition } =
    usePortfolioStore();
  const prices = usePriceStore((s) => s.prices);

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    exchange: "",
    baseAsset: "",
    quoteAsset: "",
    entryPrice: "",
    quantity: "",
    entryDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const portfolio = useMemo(() => {
    const totalInvestment = spotPositions.reduce(
      (sum, p) => sum + p.totalCost,
      0
    );
    const currentValue = spotPositions.reduce((sum, p) => {
      const currentPrice = prices[p.symbol] || p.currentPrice;
      return sum + p.quantity * currentPrice;
    }, 0);
    const totalPnL = currentValue - totalInvestment;
    const totalPnLPercent =
      totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;
    return { totalInvestment, currentValue, totalPnL, totalPnLPercent };
  }, [spotPositions, prices]);

  const addPosition = () => {
    const {
      exchange,
      baseAsset,
      quoteAsset,
      entryPrice,
      quantity,
      entryDate,
      notes,
    } = formData;

    if (!exchange || !baseAsset || !quoteAsset || !entryPrice || !quantity) {
      alert("Please fill all required fields");
      return;
    }

    const base = baseAsset.toUpperCase().trim();
    const quote = quoteAsset.toUpperCase().trim();
    const price = parseFloat(entryPrice);
    const qty = parseFloat(quantity);

    if (isNaN(price) || isNaN(qty) || price <= 0 || qty <= 0) {
      alert("Please enter valid price and quantity");
      return;
    }

    const formattedPair =
      EXCHANGE_FORMATS[exchange]?.(base, quote) || `${base}${quote}`;

    addSpotPosition({
      exchange,
      baseAsset: base,
      quoteAsset: quote,
      pair: `${base}/${quote}`,
      formattedPair,
      symbol: `${base}${quote}`,
      quantity: qty,
      entryPrice: price,
      currentPrice: price,
      totalCost: price * qty,
      entryDate,
      notes: notes.trim(),
    });

    setShowAddModal(false);
    setFormData({
      exchange: "",
      baseAsset: "",
      quoteAsset: "",
      entryPrice: "",
      quantity: "",
      entryDate: new Date().toISOString().split("T")[0],
      notes: "",
    });
  };

  const calculatePnL = (position: (typeof spotPositions)[0]) => {
    const currentPrice = prices[position.symbol] || position.currentPrice;
    const currentValue = position.quantity * currentPrice;
    const pnl = currentValue - position.totalCost;
    const pnlPercent = (pnl / position.totalCost) * 100;
    const priceChange = currentPrice - position.currentPrice;
    return { currentValue, pnl, pnlPercent, currentPrice, priceChange };
  };

  const totalCost = useMemo(() => {
    const price = parseFloat(formData.entryPrice) || 0;
    const qty = parseFloat(formData.quantity) || 0;
    return (price * qty).toFixed(2);
  }, [formData.entryPrice, formData.quantity]);

  return (
    <div className="relative space-y-3 text-xs h-full flex flex-col">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white/5 border border-white/10 rounded p-2">
          <div className="text-white/40 text-[10px] mb-1">Total Investment</div>
          <div className="text-white font-semibold">
            $
            {portfolio.totalInvestment.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded p-2">
          <div className="text-white/40 text-[10px] mb-1">Current Value</div>
          <div className="text-white font-semibold">
            $
            {portfolio.currentValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded p-2">
          <div className="text-white/40 text-[10px] mb-1">Total P&L</div>
          <div
            className={`font-semibold ${
              portfolio.totalPnL >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {portfolio.totalPnL >= 0 ? "+" : ""}$
            {Math.abs(portfolio.totalPnL).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded p-2">
          <div className="text-white/40 text-[10px] mb-1">P&L %</div>
          <div
            className={`font-semibold ${
              portfolio.totalPnLPercent >= 0
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            {portfolio.totalPnLPercent >= 0 ? "+" : ""}
            {portfolio.totalPnLPercent.toFixed(2)}%
          </div>
        </div>
      </div>

      {!showAddModal && (
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full bg-white/10 hover:bg-white/15 text-white py-2 rounded transition-colors flex items-center justify-center gap-2 font-semibold border border-white/20 select-none"
        >
          <Plus className="w-4 h-4" />
          Add Position
        </button>
      )}

      {!showAddModal && (
        <div className="flex-1 overflow-y-auto space-y-2">
          {spotPositions.length === 0 ? (
            <div className="text-center py-8 text-white/40 text-[10px]">
              No positions yet. Click "Add Position" to start tracking.
            </div>
          ) : (
            spotPositions.map((position) => {
              const {
                currentValue,
                pnl,
                pnlPercent,
                currentPrice,
                priceChange,
              } = calculatePnL(position);
              return (
                <div
                  key={position.id}
                  className="bg-white/5 border border-white/10 rounded p-3 space-y-2 hover:bg-white/8 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold text-sm">
                          {position.pair}
                        </span>
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-[9px] uppercase font-semibold">
                          {position.exchange}
                        </span>
                      </div>
                      <div className="text-white/30 text-[9px] mt-0.5">
                        {position.formattedPair}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm("Delete this position?")) {
                          removeSpotPosition(position.id);
                        }
                      }}
                      className="text-red-400 hover:text-red-300 p-1 transition-colors"
                      title="Delete position"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <Row label="Entry Price">
                      ${position.entryPrice.toLocaleString()}
                    </Row>
                    <Row label="Current Price">
                      <span className="flex items-center gap-1">
                        $
                        {currentPrice.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 6,
                        })}
                        {priceChange !== 0 && (
                          <span
                            className={`text-[8px] ${
                              priceChange > 0
                                ? "text-emerald-400"
                                : "text-red-400"
                            }`}
                          >
                            {priceChange > 0 ? "↑" : "↓"}
                          </span>
                        )}
                      </span>
                    </Row>
                    <Row label="Quantity">
                      {position.quantity.toLocaleString(undefined, {
                        minimumFractionDigits: 4,
                        maximumFractionDigits: 8,
                      })}
                    </Row>
                    <Row label="Total Cost">
                      $
                      {position.totalCost.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Row>
                    <Row label="Current Value">
                      $
                      {currentValue.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Row>
                    <Row label="P&L">
                      <span
                        className={
                          pnl >= 0 ? "text-emerald-400" : "text-red-400"
                        }
                      >
                        {pnl >= 0 ? "+" : ""}${Math.abs(pnl).toFixed(2)} (
                        {pnlPercent >= 0 ? "+" : ""}
                        {pnlPercent.toFixed(2)}%)
                      </span>
                    </Row>
                  </div>

                  <div className="text-white/30 text-[9px] pt-1 border-t border-white/5">
                    Entry: {new Date(position.entryDate).toLocaleDateString()}
                  </div>

                  {position.notes && (
                    <div className="text-white/40 text-[9px] pt-1 border-t border-white/5">
                      📝 {position.notes}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {showAddModal && (
        <div className="absolute inset-0 bg-[#0a0e1a] z-50 flex flex-col rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-3 border-b border-white/10 bg-white/5">
            <h3 className="text-white font-semibold text-sm">
              Add Spot Position
            </h3>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-white/50 hover:text-white text-xl leading-none"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <div>
              <label className="block text-white/50 mb-1 text-[10px]">
                Exchange
              </label>
              <select
                value={formData.exchange}
                onChange={(e) =>
                  setFormData({ ...formData, exchange: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs"
              >
                <option value="">Select Exchange</option>
                {EXCHANGES.map((ex) => (
                  <option key={ex} value={ex}>
                    {ex.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-white/50 mb-1 text-[10px]">
                  Base Asset
                </label>
                <input
                  type="text"
                  value={formData.baseAsset}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      baseAsset: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="BTC"
                  className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-white/50 mb-1 text-[10px]">
                  Quote Asset
                </label>
                <input
                  type="text"
                  value={formData.quoteAsset}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quoteAsset: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="USDT"
                  className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs"
                />
              </div>
            </div>

            {formData.exchange && formData.baseAsset && formData.quoteAsset && (
              <div className="text-[9px] text-white/40">
                Format:{" "}
                {EXCHANGE_FORMATS[formData.exchange]?.(
                  formData.baseAsset,
                  formData.quoteAsset
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-white/50 mb-1 text-[10px]">
                  Entry Price
                </label>
                <input
                  type="number"
                  value={formData.entryPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, entryPrice: e.target.value })
                  }
                  placeholder="0.00"
                  step="0.01"
                  className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-white/50 mb-1 text-[10px]">
                  Quantity
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  placeholder="0.00"
                  step="0.00000001"
                  className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/50 mb-1 text-[10px]">
                Total Cost
              </label>
              <div className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white/70 text-xs">
                ${totalCost}
              </div>
            </div>

            <div>
              <label className="block text-white/50 mb-1 text-[10px]">
                Entry Date
              </label>
              <input
                type="date"
                value={formData.entryDate}
                onChange={(e) =>
                  setFormData({ ...formData, entryDate: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-white/50 mb-1 text-[10px]">
                Notes (Optional)
              </label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Any notes..."
                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs"
              />
            </div>
          </div>

          <div className="p-3 border-t border-white/10">
            <button
              onClick={addPosition}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded font-semibold text-xs"
            >
              Add Position
            </button>
          </div>
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
    <div className="flex justify-between select-none">
      <span className="text-white/50">{label}</span>
      <span>{children}</span>
    </div>
  );
}
