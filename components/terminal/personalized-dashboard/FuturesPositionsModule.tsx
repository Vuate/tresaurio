// components/terminal/personalized-dashboard/FuturesPositionsModule.tsx
"use client";

import { useState, useMemo } from "react";
import { Plus, Trash2, AlertTriangle } from "lucide-react";
import { usePortfolioStore } from "@/store/portfolioStore";
import { usePriceStore } from "@/store/priceStore";

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
];

export default function FuturesPositionsModule() {
  const { futuresPositions, addFuturesPosition, removeFuturesPosition } =
    usePortfolioStore();
  const prices = usePriceStore((s) => s.prices);

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    exchange: "",
    baseAsset: "",
    quoteAsset: "",
    side: "long" as "long" | "short",
    entryPrice: "",
    quantity: "",
    leverage: "10",
    entryDate: new Date().toISOString().split("T")[0],
    fundingRate: "0.01",
    notes: "",
  });

  const portfolio = useMemo(() => {
    const totalPositionSize = futuresPositions.reduce((sum, p) => {
      const markPrice = prices[p.symbol] || p.markPrice;
      return sum + p.quantity * markPrice;
    }, 0);

    const totalUnrealizedPnL = futuresPositions.reduce((sum, p) => {
      const markPrice = prices[p.symbol] || p.markPrice;
      const pnl =
        p.side === "long"
          ? (markPrice - p.entryPrice) * p.quantity
          : (p.entryPrice - markPrice) * p.quantity;
      return sum + pnl;
    }, 0);

    const avgLeverage =
      futuresPositions.length > 0
        ? futuresPositions.reduce((sum, p) => sum + p.leverage, 0) /
          futuresPositions.length
        : 0;

    return { totalPositionSize, totalUnrealizedPnL, avgLeverage };
  }, [futuresPositions, prices]);

  const calculateLiquidation = (
    entryPrice: number,
    leverage: number,
    side: "long" | "short"
  ) => {
    const maintenanceMargin = 0.005;
    const liquidationDistance = 1 / leverage - maintenanceMargin;
    return side === "long"
      ? entryPrice * (1 - liquidationDistance)
      : entryPrice * (1 + liquidationDistance);
  };

  const addPosition = () => {
    const {
      exchange,
      baseAsset,
      quoteAsset,
      side,
      entryPrice,
      quantity,
      leverage,
      entryDate,
      fundingRate,
      notes,
    } = formData;

    if (
      !exchange ||
      !baseAsset ||
      !quoteAsset ||
      !entryPrice ||
      !quantity ||
      !leverage
    ) {
      alert("Please fill all required fields");
      return;
    }

    const base = baseAsset.toUpperCase().trim();
    const quote = quoteAsset.toUpperCase().trim();
    const price = parseFloat(entryPrice);
    const qty = parseFloat(quantity);
    const lev = parseFloat(leverage);
    const funding = parseFloat(fundingRate);

    if (
      isNaN(price) ||
      isNaN(qty) ||
      isNaN(lev) ||
      price <= 0 ||
      qty <= 0 ||
      lev <= 0
    ) {
      alert("Please enter valid values");
      return;
    }

    const formattedPair =
      EXCHANGE_FORMATS[exchange]?.(base, quote) || `${base}${quote}`;
    const liquidationPrice = calculateLiquidation(price, lev, side);

    addFuturesPosition({
      exchange,
      baseAsset: base,
      quoteAsset: quote,
      pair: `${base}/${quote}`,
      formattedPair,
      symbol: `${base}${quote}`,
      side,
      quantity: qty,
      entryPrice: price,
      markPrice: price,
      leverage: lev,
      liquidationPrice,
      totalCost: (price * qty) / lev,
      entryDate,
      fundingRate: funding,
      notes: notes.trim(),
    });

    setShowAddModal(false);
    setFormData({
      exchange: "",
      baseAsset: "",
      quoteAsset: "",
      side: "long",
      entryPrice: "",
      quantity: "",
      leverage: "10",
      entryDate: new Date().toISOString().split("T")[0],
      fundingRate: "0.01",
      notes: "",
    });
  };

  const calculatePnL = (pos: (typeof futuresPositions)[0]) => {
    const markPrice = prices[pos.symbol] || pos.markPrice;
    const priceDiff =
      pos.side === "long"
        ? markPrice - pos.entryPrice
        : pos.entryPrice - markPrice;
    const pnl = priceDiff * pos.quantity;
    const roe = (pnl / pos.totalCost) * 100;
    const margin = pos.totalCost;
    const liquidationDistance =
      Math.abs((markPrice - pos.liquidationPrice) / markPrice) * 100;
    const priceChange = markPrice - pos.markPrice;

    return { pnl, roe, margin, liquidationDistance, markPrice, priceChange };
  };

  const notional = useMemo(() => {
    const price = parseFloat(formData.entryPrice) || 0;
    const qty = parseFloat(formData.quantity) || 0;
    return (price * qty).toFixed(2);
  }, [formData.entryPrice, formData.quantity]);

  const margin = useMemo(() => {
    const price = parseFloat(formData.entryPrice) || 0;
    const qty = parseFloat(formData.quantity) || 0;
    const lev = parseFloat(formData.leverage) || 1;
    return ((price * qty) / lev).toFixed(2);
  }, [formData.entryPrice, formData.quantity, formData.leverage]);

  return (
    <div className="relative space-y-3 text-xs h-full flex flex-col">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white/5 border border-white/10 rounded p-2">
          <div className="text-white/40 text-[10px] mb-1">Position Size</div>
          <div className="text-white font-semibold">
            $
            {portfolio.totalPositionSize.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded p-2">
          <div className="text-white/40 text-[10px] mb-1">Unrealized PnL</div>
          <div
            className={`font-semibold ${
              portfolio.totalUnrealizedPnL >= 0
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            {portfolio.totalUnrealizedPnL >= 0 ? "+" : ""}$
            {Math.abs(portfolio.totalUnrealizedPnL).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded p-2">
          <div className="text-white/40 text-[10px] mb-1">Avg Leverage</div>
          <div className="text-white font-semibold">
            {portfolio.avgLeverage.toFixed(1)}x
          </div>
        </div>
      </div>

      {/* Add Position Button */}
      {!showAddModal && (
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full bg-white/10 hover:bg-white/15 text-white py-2 rounded transition-colors flex items-center justify-center gap-2 font-semibold border border-white/20"
        >
          <Plus className="w-4 h-4" />
          Add Position
        </button>
      )}

      {/* Positions List */}
      {!showAddModal && (
        <div className="flex-1 overflow-y-auto space-y-2">
          {futuresPositions.length === 0 ? (
            <div className="text-center py-8 text-white/40 text-[10px]">
              No positions yet. Click "Add Position" to start tracking.
            </div>
          ) : (
            futuresPositions.map((position) => {
              const {
                pnl,
                roe,
                margin,
                liquidationDistance,
                markPrice,
                priceChange,
              } = calculatePnL(position);
              const isLongProfit = position.side === "long" && pnl >= 0;
              const isShortProfit = position.side === "short" && pnl >= 0;
              const isProfitable = isLongProfit || isShortProfit;

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
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] uppercase font-semibold ${
                            position.side === "long"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {position.side} {position.leverage}x
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
                          removeFuturesPosition(position.id);
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
                    <Row label="Mark Price">
                      <span className="flex items-center gap-1">
                        $
                        {markPrice.toLocaleString(undefined, {
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
                    <Row label="Margin">
                      $
                      {margin.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Row>
                    <Row label="Unrealized PnL">
                      <span
                        className={
                          isProfitable ? "text-emerald-400" : "text-red-400"
                        }
                      >
                        {pnl >= 0 ? "+" : ""}${Math.abs(pnl).toFixed(2)}
                      </span>
                    </Row>
                    <Row label="ROE">
                      <span
                        className={
                          isProfitable ? "text-emerald-400" : "text-red-400"
                        }
                      >
                        {roe >= 0 ? "+" : ""}
                        {roe.toFixed(2)}%
                      </span>
                    </Row>
                  </div>

                  <div
                    className={`flex items-center gap-2 text-[9px] pt-2 border-t border-white/5 ${
                      liquidationDistance < 10
                        ? "text-red-400"
                        : "text-white/40"
                    }`}
                  >
                    {liquidationDistance < 10 && (
                      <AlertTriangle className="w-3 h-3" />
                    )}
                    <span>
                      Liquidation: ${position.liquidationPrice.toFixed(2)}
                    </span>
                    <span>({liquidationDistance.toFixed(1)}% away)</span>
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

      {/* 🔥 ADD POSITION MODAL - TAM KOD */}
      {showAddModal && (
        <div className="absolute inset-0 bg-[#0a0e1a] z-50 flex flex-col rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-3 border-b border-white/10 bg-white/5">
            <h3 className="text-white font-semibold text-sm">
              Add Futures Position
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

            <div>
              <label className="block text-white/50 mb-1 text-[10px]">
                Side
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setFormData({ ...formData, side: "long" })}
                  className={`py-1.5 rounded text-xs font-semibold transition-colors ${
                    formData.side === "long"
                      ? "bg-emerald-500 text-white"
                      : "bg-white/5 text-white/50 hover:bg-white/10"
                  }`}
                >
                  LONG
                </button>
                <button
                  onClick={() => setFormData({ ...formData, side: "short" })}
                  className={`py-1.5 rounded text-xs font-semibold transition-colors ${
                    formData.side === "short"
                      ? "bg-red-500 text-white"
                      : "bg-white/5 text-white/50 hover:bg-white/10"
                  }`}
                >
                  SHORT
                </button>
              </div>
            </div>

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
                Leverage: {formData.leverage}x
              </label>
              <input
                type="range"
                min="1"
                max="125"
                value={formData.leverage}
                onChange={(e) =>
                  setFormData({ ...formData, leverage: e.target.value })
                }
                className="w-full"
              />
              <div className="flex justify-between text-[9px] text-white/30 mt-1">
                <span>1x</span>
                <span>25x</span>
                <span>50x</span>
                <span>100x</span>
                <span>125x</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-white/50 mb-1 text-[10px]">
                  Notional
                </label>
                <div className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white/70 text-xs">
                  ${notional}
                </div>
              </div>
              <div>
                <label className="block text-white/50 mb-1 text-[10px]">
                  Margin
                </label>
                <div className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white/70 text-xs">
                  ${margin}
                </div>
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
                Funding Rate (%)
              </label>
              <input
                type="number"
                value={formData.fundingRate}
                onChange={(e) =>
                  setFormData({ ...formData, fundingRate: e.target.value })
                }
                placeholder="0.01"
                step="0.001"
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
    <div className="flex justify-between">
      <span className="text-white/50">{label}</span>
      <span>{children}</span>
    </div>
  );
}
