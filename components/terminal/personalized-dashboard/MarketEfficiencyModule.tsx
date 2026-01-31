// components/terminal/personalized-dashboard/MarketEfficiencyModule.tsx

import { useState, useMemo, useEffect, useCallback } from "react";
import { RefreshCw, AlertTriangle, Plus, X } from "lucide-react";
import { useOrderBook, useTicker } from "@/hooks";
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

interface EfficiencyData {
  symbol: string;
  score: number;
  spread: number;
  spreadPercent: number;
  depth: number;
  volume24h: number;
  volatility: number;
  loading: boolean;
  error?: string | null;
}

const DEFAULT_SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "ADAUSDT",
];

const MAX_SYMBOLS = 10;

// Component for tracking a single symbol's efficiency
function SymbolEfficiencyTracker({
  symbol,
  marketType,
  exchange,
}: {
  symbol: string;
  marketType: "spot" | "futures";
  exchange: Exchange;
}): EfficiencyData | null {
  // Get order book data with multi-exchange support
  // Use limit: 20 for Binance compatibility (max supported)
  const { bids, asks, spread, spreadPercent, midPrice, loading: obLoading, error: obError } = useOrderBook({
    symbol,
    marketType,
    exchange,
    limit: 20, // Binance max is 20 for WebSocket
    timeoutMs: 30000,
  });

  // Get ticker data with multi-exchange support
  const { data: ticker, loading: tickerLoading, error: tickerError } = useTicker({
    symbol,
    marketType,
    exchange,
    timeoutMs: 30000,
  });

  const loading = obLoading || tickerLoading;
  const error = obError || tickerError;

  // Calculate efficiency metrics
  const efficiency = useMemo(() => {
    // Return error state if there's an error
    if (error) {
      return {
        symbol,
        score: 0,
        spread: 0,
        spreadPercent: 0,
        depth: 0,
        volume24h: 0,
        volatility: 0,
        loading: false,
        error: error as string,
      };
    }

    if (loading || !bids || !asks || !ticker || bids.length === 0 || asks.length === 0) {
      return null;
    }

    // Calculate depth (total value within ±1% of mid price)
    const range1Pct = midPrice * 0.01;
    const depth =
      bids.filter(b => midPrice - b.price <= range1Pct).reduce((sum, l) => sum + l.price * l.quantity, 0) +
      asks.filter(a => a.price - midPrice <= range1Pct).reduce((sum, l) => sum + l.price * l.quantity, 0);

    // Calculate volatility (24h high-low range as % of current price)
    const volatility = ticker.lastPrice > 0
      ? ((ticker.highPrice - ticker.lowPrice) / ticker.lastPrice) * 100
      : 0;

    // Calculate efficiency score (0-100)
    // Factors: tight spread (30%), high depth (30%), high volume (20%), low volatility (20%)
    const spreadScore = Math.max(0, 100 - (spreadPercent * 1000)); // Tight spread = high score
    const depthScore = Math.min(100, (depth / 10000000) * 100); // $10M depth = 100 score
    const volumeScore = Math.min(100, (ticker.quoteVolume / 1000000000) * 50); // $1B volume = 50 score
    const volatilityScore = Math.max(0, 100 - (volatility * 10)); // Low volatility = high score

    const score = Math.round(
      spreadScore * 0.3 +
      depthScore * 0.3 +
      volumeScore * 0.2 +
      volatilityScore * 0.2
    );

    return {
      symbol,
      score,
      spread,
      spreadPercent,
      depth,
      volume24h: ticker.quoteVolume,
      volatility,
      loading: false,
    };
  }, [symbol, bids, asks, ticker, midPrice, spread, spreadPercent, loading, error]);

  return efficiency;
}

export default function MarketEfficiencyModule({ instanceId }: Props) {
  const storageKey = `market-efficiency-${instanceId}`;

  const [sortBy, setSortBy] = useState<"score" | "spread" | "volume">("score");
  const [marketType, setMarketType] = useState<"spot" | "futures">("spot");
  const [exchange, setExchange] = useState<Exchange>("binance");
  const [symbols, setSymbols] = useState<string[]>(DEFAULT_SYMBOLS);
  const [newSymbol, setNewSymbol] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Load settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const settings = JSON.parse(saved);
          if (settings.marketType) setMarketType(settings.marketType);
          if (settings.sortBy) setSortBy(settings.sortBy);
          if (settings.exchange) setExchange(settings.exchange);
          if (settings.symbols && Array.isArray(settings.symbols)) setSymbols(settings.symbols);
        } catch (err) {
          console.error("[MarketEfficiency] Failed to load settings:", err);
        }
      }
    }
  }, [instanceId, storageKey]);

  // Save settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify({ marketType, sortBy, exchange, symbols }));
    }
  }, [marketType, sortBy, exchange, symbols, storageKey]);

  const addSymbol = useCallback(() => {
    const symbol = newSymbol.toUpperCase().trim();
    if (!symbol) return;

    // Add USDT if not present
    const finalSymbol = symbol.endsWith("USDT") ? symbol : `${symbol}USDT`;

    if (symbols.includes(finalSymbol)) {
      alert("Symbol already exists");
      return;
    }

    if (symbols.length >= MAX_SYMBOLS) {
      alert(`Maximum ${MAX_SYMBOLS} symbols allowed`);
      return;
    }

    setSymbols(prev => [...prev, finalSymbol]);
    setNewSymbol("");
    setShowAddForm(false);
  }, [newSymbol, symbols]);

  const removeSymbol = useCallback((symbolToRemove: string) => {
    setSymbols(prev => prev.filter(s => s !== symbolToRemove));
  }, []);

  // Track all symbols with multi-exchange support (fixed slots for hooks)
  const slot0 = SymbolEfficiencyTracker({ symbol: symbols[0] || "BTCUSDT", marketType, exchange });
  const slot1 = SymbolEfficiencyTracker({ symbol: symbols[1] || "ETHUSDT", marketType, exchange });
  const slot2 = SymbolEfficiencyTracker({ symbol: symbols[2] || "SOLUSDT", marketType, exchange });
  const slot3 = SymbolEfficiencyTracker({ symbol: symbols[3] || "BNBUSDT", marketType, exchange });
  const slot4 = SymbolEfficiencyTracker({ symbol: symbols[4] || "XRPUSDT", marketType, exchange });
  const slot5 = SymbolEfficiencyTracker({ symbol: symbols[5] || "ADAUSDT", marketType, exchange });
  const slot6 = SymbolEfficiencyTracker({ symbol: symbols[6] || "DOGEUSDT", marketType, exchange });
  const slot7 = SymbolEfficiencyTracker({ symbol: symbols[7] || "AVAXUSDT", marketType, exchange });
  const slot8 = SymbolEfficiencyTracker({ symbol: symbols[8] || "DOTUSDT", marketType, exchange });
  const slot9 = SymbolEfficiencyTracker({ symbol: symbols[9] || "LINKUSDT", marketType, exchange });

  const allSlots = [slot0, slot1, slot2, slot3, slot4, slot5, slot6, slot7, slot8, slot9];

  const allData = useMemo(() => {
    // Only include slots that match our symbols list
    return allSlots
      .slice(0, symbols.length)
      .filter((d): d is EfficiencyData => d !== null);
  }, [allSlots, symbols.length]);

  const sortedData = useMemo(() => {
    // Filter out error items for display
    return [...allData]
      .filter(d => !d.error)
      .sort((a, b) => {
        switch (sortBy) {
          case "score":
            return b.score - a.score;
          case "spread":
            return a.spreadPercent - b.spreadPercent;
          case "volume":
            return b.volume24h - a.volume24h;
          default:
            return 0;
        }
      });
  }, [allData, sortBy]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 70) return "text-blue-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Fair";
    return "Poor";
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0b0f] rounded-lg border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="text-xl">⚡</div>
          <h3 className="font-semibold">Market Efficiency</h3>
        </div>

        <div className="flex gap-2">
          {/* Exchange Selector */}
          <select
            value={exchange}
            onChange={(e) => setExchange(e.target.value as Exchange)}
            className="px-2 py-1 rounded text-xs font-medium bg-white/5 text-white/80 border border-white/10 outline-none cursor-pointer hover:bg-white/10"
          >
            {EXCHANGES.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>

          {/* Market Type Toggle */}
          <div className="flex gap-1">
            <button
              onClick={() => setMarketType("spot")}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                marketType === "spot"
                  ? "bg-blue-500 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              Spot
            </button>
            <button
              onClick={() => setMarketType("futures")}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                marketType === "futures"
                  ? "bg-blue-500 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              Futures
            </button>
          </div>
        </div>
      </div>

      {/* Sort Options + Add Button */}
      <div className="flex items-center justify-between gap-1 p-2 border-b border-white/10">
        <div className="flex gap-1">
          {(["score", "spread", "volume"] as const).map((sort) => (
            <button
              key={sort}
              onClick={() => setSortBy(sort)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                sortBy === sort
                  ? "bg-blue-500 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {sort.charAt(0).toUpperCase() + sort.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          disabled={symbols.length >= MAX_SYMBOLS}
          className="p-1.5 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Add symbol"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {/* Add Symbol Form */}
      {showAddForm && (
        <div className="p-2 border-b border-white/10 bg-white/5">
          <div className="flex gap-2">
            <input
              type="text"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && addSymbol()}
              placeholder="BTC, ETH, SOL..."
              className="flex-1 px-2 py-1.5 rounded text-xs bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-blue-500"
            />
            <button
              onClick={addSymbol}
              className="px-3 py-1.5 rounded text-xs font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => { setShowAddForm(false); setNewSymbol(""); }}
              className="px-2 py-1.5 rounded text-xs bg-white/10 text-white/60 hover:bg-white/20 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="text-[10px] text-white/40 mt-1">
            {symbols.length}/{MAX_SYMBOLS} symbols
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {/* Check if all data has errors */}
        {allData.length > 0 && allData.every(d => d.error) ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <div className="text-xs text-red-400 mb-2">Failed to load market data</div>
              <div className="text-[10px] text-white/40">
                {exchange.toUpperCase()} connection error
              </div>
            </div>
          </div>
        ) : sortedData.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
              <div className="text-xs text-white/60">Loading market data...</div>
              <div className="text-[10px] text-white/40 mt-1">
                Connecting to {exchange.toUpperCase()}...
              </div>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {sortedData.map((data) => (
              <div
                key={data.symbol}
                className="p-3 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">
                      {data.symbol.replace("USDT", "")}/USDT
                    </span>
                    {symbols.length > 1 && (
                      <button
                        onClick={() => removeSymbol(data.symbol)}
                        className="p-0.5 rounded text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Remove symbol"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-2xl font-bold ${getScoreColor(data.score)}`}
                    >
                      {data.score}
                    </span>
                    <span className="text-xs text-white/60">
                      {getScoreLabel(data.score)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-white/60">Spread:</span>
                    <span className="text-white ml-1 font-medium">
                      {data.spreadPercent.toFixed(3)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-white/60">Depth:</span>
                    <span className="text-white ml-1 font-medium">
                      ${(data.depth / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div>
                    <span className="text-white/60">Volume:</span>
                    <span className="text-white ml-1 font-medium">
                      ${(data.volume24h / 1000000000).toFixed(2)}B
                    </span>
                  </div>
                  <div>
                    <span className="text-white/60">Volatility:</span>
                    <span className="text-white ml-1 font-medium">
                      {data.volatility.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Score Bar */}
                <div className="mt-3">
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        data.score >= 90
                          ? "bg-emerald-500"
                          : data.score >= 70
                            ? "bg-blue-500"
                            : data.score >= 50
                              ? "bg-yellow-500"
                              : "bg-red-500"
                      } transition-all`}
                      style={{ width: `${data.score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}