import { useState, useMemo, useEffect, useRef } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { useOrderBook } from "@/hooks";
import type { Exchange } from "@/services/WebSocketService";

interface Props {
  instanceId: string;
}

const EXCHANGES = [
  { id: "binance", name: "Binance" },
  { id: "okx", name: "OKX" },
  { id: "bybit", name: "Bybit" },
  { id: "coinbase", name: "Coinbase" },
];

export default function SlippageMonitorModule({ instanceId }: Props) {
  const [marketType, setMarketType] = useState<"spot" | "futures">("spot");
  const [exchange, setExchange] = useState<Exchange>("binance");
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [orderSize, setOrderSize] = useState("10000");
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [exchangeOpen, setExchangeOpen] = useState(false);

  const exchangeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { bids, asks, midPrice, loading, error, status, retry } = useOrderBook({
    symbol,
    marketType,
    exchange,
    limit: 100,
    timeoutMs: 30000,
  });

  useEffect(() => {
    const storageKey = `slippage-monitor-${instanceId}`;
    localStorage.setItem(
      storageKey,
      JSON.stringify({ symbol, marketType, exchange, orderSize, orderType })
    );
  }, [instanceId, symbol, marketType, exchange, orderSize, orderType]);

  useEffect(() => {
    const storageKey = `slippage-monitor-${instanceId}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        if (settings.symbol) setSymbol(settings.symbol);
        if (settings.marketType) setMarketType(settings.marketType);
        if (settings.exchange) setExchange(settings.exchange);
        if (settings.orderSize) setOrderSize(settings.orderSize);
        if (settings.orderType) setOrderType(settings.orderType);
      } catch (err) {
        console.error("[SlippageMonitor] Failed to load settings:", err);
      }
    }
  }, [instanceId]);

  useEffect(() => {
    if (!exchangeOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        exchangeRef.current &&
        !exchangeRef.current.contains(e.target as Node)
      ) {
        setExchangeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [exchangeOpen]);

  const slippageData = useMemo(() => {
    if (!bids || !asks || bids.length === 0 || asks.length === 0) {
      return null;
    }

    const orderSizeUSDT = parseFloat(orderSize) || 0;
    if (orderSizeUSDT <= 0) return null;

    const levels = orderType === "buy" ? asks : bids;
    const basePrice = orderType === "buy" ? asks[0].price : bids[0].price;

    let remainingUSDT = orderSizeUSDT;
    let totalQuantity = 0;
    let weightedPriceSum = 0;
    let liquidityDepth = 0;

    for (const level of levels) {
      const levelUSDT = level.price * level.quantity;
      liquidityDepth += levelUSDT;

      if (remainingUSDT <= 0) break;

      const usedUSDT = Math.min(remainingUSDT, levelUSDT);
      const usedQuantity = usedUSDT / level.price;

      totalQuantity += usedQuantity;
      weightedPriceSum += level.price * usedQuantity;
      remainingUSDT -= usedUSDT;
    }

    const effectivePrice = totalQuantity > 0 ? weightedPriceSum / totalQuantity : basePrice;
    const slippageAmount = Math.abs(effectivePrice - basePrice);
    const slippagePercent = (slippageAmount / basePrice) * 100;
    const totalCost = effectivePrice * totalQuantity;

    const impact = slippagePercent > 0.3 ? "high" : slippagePercent > 0.1 ? "medium" : "low";

    return {
      basePrice,
      slippagePercent,
      slippageAmount,
      effectivePrice,
      totalCost,
      liquidityDepth,
      impact,
      quantityFilled: totalQuantity,
      insufficientLiquidity: remainingUSDT > 0,
    };
  }, [bids, asks, orderSize, orderType]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      case "medium":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "low":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      default:
        return "text-white/60 bg-white/5 border-white/10";
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 flex-shrink-0">
        <span className="font-semibold text-white/90 text-xs whitespace-nowrap">
          Slippage Monitor
        </span>

        <span className="text-white/40 text-xs">•</span>

        {status && (
          <span
            className={`text-xs whitespace-nowrap ${
              status === "connected"
                ? "text-emerald-400"
                : status === "connecting"
                  ? "text-yellow-400 animate-pulse"
                  : status === "fallback"
                    ? "text-orange-400"
                    : "text-red-400"
            }`}
          >
            {status === "connected"
              ? "LIVE"
              : status === "connecting"
                ? "CONNECTING"
                : status === "fallback"
                  ? "FALLBACK"
                  : "ERROR"}
          </span>
        )}

        <div className="flex-1 min-w-[20px]"></div>

        <div className="flex gap-1.5">
          <button
            onClick={() => setMarketType("spot")}
            className={`h-7 px-3 rounded-md text-xs font-medium transition-all whitespace-nowrap cursor-pointer  ${
              marketType === "spot"
                ? "bg-blue-500 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            Spot
          </button>
          <button
            onClick={() => setMarketType("futures")}
            className={`h-7 px-3 rounded-md text-xs font-medium transition-all whitespace-nowrap cursor-pointer  ${
              marketType === "futures"
                ? "bg-blue-500 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            Futures
          </button>
        </div>

        <div ref={exchangeRef} className="relative">
          <button
            onClick={() => setExchangeOpen((v) => !v)}
            className="h-7 px-3 rounded-md bg-[#0b1f1f] border border-white/10 text-white text-xs flex items-center gap-1.5 cursor-pointer hover:bg-white/5 transition-all whitespace-nowrap"
          >
            <span>{EXCHANGES.find((e) => e.id === exchange)?.name}</span>
            <span
              className={`text-white/50 text-[10px] transition-transform duration-200 ${
                exchangeOpen ? "rotate-180" : ""
              }`}
            >
              ▾
            </span>
          </button>

          {exchangeOpen && (
            <div
              onWheel={(e) => e.stopPropagation()}
              className="absolute right-0 mt-1 z-50 w-[120px] max-h-[160px] overflow-y-auto bg-[#0b1f1f] border border-emerald-500/20 rounded-md shadow-lg animate-in fade-in slide-in-from-top-2 duration-200 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-emerald-500/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
            >
              {EXCHANGES.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => {
                    setExchange(ex.id as Exchange);
                    setExchangeOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs bg-transparent cursor-pointer text-white transition-colors hover:bg-emerald-500/10 hover:text-emerald-400"
                >
                  {ex.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        ref={contentRef}
        className="flex-1 min-h-0 px-3 pb-3 overflow-y-auto space-y-2.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-teal-400/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-teal-400/70 scrollbar-thin scrollbar-thumb-teal-400/40 scrollbar-track-transparent"
      >
        <div>
          <label className="text-[10px] text-white/50 mb-1 block">Symbol</label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="BTCUSDT"
            className="w-full bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 text-white text-xs outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>

        <div>
          <label className="text-[10px] text-white/50 mb-1 block">Order Type</label>
          <div className="flex gap-2">
            <button
              onClick={() => setOrderType("buy")}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer  ${
                orderType === "buy"
                  ? "bg-emerald-500 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setOrderType("sell")}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer  ${
                orderType === "sell"
                  ? "bg-red-500 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              Sell
            </button>
          </div>
        </div>

        <div>
          <label className="text-[10px] text-white/50 mb-1 block">Order Size (USDT)</label>
          <input
            type="number"
            value={orderSize}
            onChange={(e) => setOrderSize(e.target.value)}
            placeholder="10000"
            className="w-full bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 text-white text-xs outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-6 h-6 border-2 border-white/20 border-t-blue-400 rounded-full animate-spin mx-auto mb-2"></div>
              <div className="text-[10px] text-white/60">Loading order book...</div>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-md p-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <div className="text-[10px] text-red-400 flex-1 min-w-0 break-words">
                <strong>Error:</strong> {error}
              </div>
              <button
                onClick={retry}
                className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-md text-[10px] font-medium text-red-300 flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap"
              >
                <RefreshCw className="w-3 h-3" />
                Retry
              </button>
            </div>
          </div>
        )}

        {!loading && !error && slippageData && (
          <div className="space-y-2 pt-1">
            <div className="bg-white/5 rounded-md p-2 border border-white/10">
              <div className="text-[10px] text-white/50 mb-0.5 leading-tight">
                {orderType === "buy" ? "Best Ask" : "Best Bid"} Price
              </div>
              <div className="text-sm font-bold text-white leading-tight break-all">
                $
                {slippageData.basePrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>

            <div className={`rounded-md p-2 border ${getImpactColor(slippageData.impact)}`}>
              <div className="text-[10px] mb-0.5 opacity-80 leading-tight">
                Estimated Slippage
              </div>
              <div className="text-lg font-bold leading-tight">
                {slippageData.slippagePercent.toFixed(3)}%
              </div>
              <div className="text-[10px] mt-0.5 opacity-80 leading-tight break-all">
                ${slippageData.slippageAmount.toFixed(2)} per unit
              </div>
            </div>

            <div className="bg-white/5 rounded-md p-2 border border-white/10">
              <div className="text-[10px] text-white/50 mb-0.5 leading-tight">
                Effective Price
              </div>
              <div className="text-sm font-bold text-white leading-tight break-all">
                $
                {slippageData.effectivePrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>

            <div className="bg-blue-500/10 rounded-md p-2 border border-blue-500/20">
              <div className="text-[10px] text-blue-400 mb-0.5 leading-tight">
                Total Cost (incl. slippage)
              </div>
              <div className="text-sm font-bold text-blue-400 leading-tight break-all">
                $
                {slippageData.totalCost.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div className="text-[10px] text-blue-400/60 mt-0.5 leading-tight break-all">
                {slippageData.quantityFilled.toFixed(6)} {symbol.replace("USDT", "")}
              </div>
            </div>

            <div className="bg-white/5 rounded-md p-2 border border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                <span className="text-[10px] text-white/50 leading-tight">Market Impact</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-medium border ${getImpactColor(
                    slippageData.impact
                  )} whitespace-nowrap`}
                >
                  {slippageData.impact.toUpperCase()}
                </span>
              </div>
              <div className="text-[10px] text-white/50 leading-tight break-all">
                Liquidity: $
                {(slippageData.liquidityDepth / 1000000).toFixed(2)}M
              </div>
            </div>
          </div>
        )}

        {!loading && !error && slippageData && (
          <>
            {slippageData.impact === "high" && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-md p-2">
                <div className="flex items-start gap-2">
                  <span className="text-red-400 text-sm leading-none">⚠️</span>
                  <div className="text-[10px] text-red-400 leading-tight">
                    <strong>High slippage detected!</strong> Consider splitting your order or
                    using limit orders.
                  </div>
                </div>
              </div>
            )}

            {slippageData.insufficientLiquidity && (
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-md p-2">
                <div className="flex items-start gap-2">
                  <span className="text-orange-400 text-sm leading-none">⚠️</span>
                  <div className="text-[10px] text-orange-400 leading-tight">
                    <strong>Insufficient liquidity!</strong> Order cannot be fully filled at
                    current market depth.
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}