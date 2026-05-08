"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Plus, Trash2, RefreshCw, Key, AlertCircle, X, Pencil } from "lucide-react";
import { usePortfolioStore } from "@/store/portfolioStore";
import { usePriceStore } from "@/store/priceStore";
import { wsService } from "@/services/WebSocketService";
import { useSession } from "next-auth/react";
import AuthModal from "@/components/auth/AuthModal";
import SelectConnectionModal from "./SelectConnectionModal";
import { useExchangeKeys } from "@/hooks/useExchangeKeys";

interface Props {
  instanceId: string;
}

interface SpotBalance {
  asset: string;
  free: number;
  locked: number;
  total: number;
  usdValue?: number;
}

const EXCHANGE_FORMATS: Record<
  string,
  (base: string, quote: string) => string
> = {
  binance: (base, quote) => `${base}${quote}`,
  okx: (base, quote) => `${base}-${quote}`,
  bybit: (base, quote) => `${base}${quote}`,
  coinbase: (base, quote) => `${base}-${quote}`,
};

const SUPPORTED_EXCHANGES = ["binance", "binance-tr", "okx", "bybit", "coinbase","hyperliquid"];

const ALL_EXCHANGES = [
  "binance",
  "binance-tr",
  "okx",
  "bybit",
  "coinbase",
  "kraken",
  "kucoin",
  "gateio",
  "huobi",
  "bitfinex",
  "mexc",
  "hyperliquid",
];


// Smart dollar formatter: $193 for large, $0.26 for small, $0.0012 for tiny
function formatUSD(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 100) return amount.toLocaleString(undefined, { maximumFractionDigits: 0 });
  if (abs >= 0.01) return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return amount.toFixed(4);
}

export default function SpotPositionsModule({ instanceId }: Props) {
  const spotPositions = usePortfolioStore((s) => s.spotPositions);
  const addSpotPosition = usePortfolioStore((s) => s.addSpotPosition);
  const removeSpotPosition = usePortfolioStore((s) => s.removeSpotPosition);
  const clearSpotPositionsByExchange = usePortfolioStore((s) => s.clearSpotPositionsByExchange);
  const updateSpotPosition = usePortfolioStore((s) => s.updateSpotPosition);
  const prices = usePriceStore((s) => s.prices);
  const { data: session } = useSession();


  const { keys: apiKeys, loading: keysLoading, hasKeyForExchange, refetch: refetchKeys } = useExchangeKeys();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const storageKey = `spot-connection-${instanceId}`;
  const [selectedExchange, setSelectedExchange] = useState<string>(() => {
    if (typeof window === "undefined") return "binance";
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.exchange || "binance";
      }
    } catch {}
    return "binance";
  });
  const [selectedKeyId, setSelectedKeyId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.keyId || null;
      }
    } catch {}
    return null;
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ exchange: selectedExchange, keyId: selectedKeyId }));
    } catch {}
  }, [selectedExchange, selectedKeyId, storageKey]);
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [realizedPnl, setRealizedPnl] = useState<number | null>(null);
  const [loadingRealized, setLoadingRealized] = useState(false);

  const exchangeRef = useRef<HTMLDivElement>(null);
  const exchangeModalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [editingEntryPriceId, setEditingEntryPriceId] = useState<string | null>(null);
  const [editingEntryPriceValue, setEditingEntryPriceValue] = useState<string>("");

  const [formData, setFormData] = useState({
    exchange: "",
    baseAsset: "",
    quoteAsset: "",
    entryPrice: "",
    quantity: "",
    entryDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const fetchSpotRealizedPnl = async (symbols: string[]) => {
    if (!symbols.length) return;
    setLoadingRealized(true);
    try {
      const response = await fetch(
        `/api/exchange/spot-realized-pnl?exchange=${selectedExchange}&symbols=${symbols.join(",")}`
      );
      const data = await response.json();
      if (data.success) setRealizedPnl(data.data);
    } catch (error) {
      console.error("Failed to fetch spot realized PnL:", error);
    } finally {
      setLoadingRealized(false);
    }
  };

  const hasApiKey = useCallback(
    (exchange: string) => hasKeyForExchange(exchange),
    [hasKeyForExchange]
  );

  // WebSocket subscriptions - ref-based to prevent reconnect loops
  const wsSymbolsRef = useRef<string>("");
  const wsUnsubscribesRef = useRef<(() => void)[]>([]);

  useEffect(() => {
    const symbols = [...new Set(spotPositions.map((p) => p.symbol))].sort();
    const newKey = symbols.join(",");

    // Only re-subscribe if symbol list actually changed
    if (newKey === wsSymbolsRef.current) return;

    wsUnsubscribesRef.current.forEach((unsub) => unsub());
    wsSymbolsRef.current = newKey;

    if (!newKey) {
      wsUnsubscribesRef.current = [];
      return;
    }

    wsUnsubscribesRef.current = symbols.map((symbol) => {
      const stream = `${symbol.toLowerCase()}@ticker`;
      return wsService.subscribe(
        stream,
        (rawData: any) => {
          const price = parseFloat(rawData.c || "0");
          if (price > 0) {
            usePriceStore.getState().updatePrice(symbol, price);
          }
        },
        "spot",
        "binance"
      );
    });
  }, [spotPositions]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      wsUnsubscribesRef.current.forEach((unsub) => unsub());
      wsUnsubscribesRef.current = [];
      wsSymbolsRef.current = "";
    };
  }, []);


  // Close exchange dropdown on outside click
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

  // Close exchange modal dropdown on outside click
  useEffect(() => {
    if (!exchangeModalOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        exchangeModalRef.current &&
        !exchangeModalRef.current.contains(e.target as Node)
      ) {
        setExchangeModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [exchangeModalOpen]);

  useEffect(() => {
    if (showAddModal || showSelectModal) {
      document.body.style.overflow = "hidden";

      if (contentRef.current) {
        const scrollTop = contentRef.current.scrollTop;
        contentRef.current.style.overflow = "hidden";
        contentRef.current.scrollTop = scrollTop;
      }
    }

    return () => {
      document.body.style.overflow = "";
      if (contentRef.current) {
        contentRef.current.style.overflow = "";
      }
    };
  }, [showAddModal, showSelectModal]);

  const syncFromExchange = async () => {
    if (!hasApiKey(selectedExchange)) {
      setSyncError("No API key configured for this exchange");
      return;
    }

    setSyncing(true);
    setSyncError(null);

    try {
      const response = await fetch(
        `/api/exchange/account?exchange=${selectedExchange}`,
      );
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch balances");
      }

      const balances: SpotBalance[] = data.data;

      const filteredBalances = balances.filter(
        (b) => b.total > 0 && b.asset !== "USDT" && b.asset !== "USDC"
      );

      // Fetch current prices and avg entry prices in parallel
      const enrichedData = await Promise.all(
        filteredBalances.map(async (balance) => {
          const symbol = `${balance.asset}USDT`;
          let currentPrice = 0;
          let avgEntryPrice: number | null = null;

          // Current price
          try {
            const priceRes = await fetch(
              `/api/v2/binance/price?symbol=${symbol}`,
            );
            if (priceRes.ok) {
              const priceData = await priceRes.json();
              if (priceData.success) {
                currentPrice = parseFloat(priceData.price || 0);
              }
            }
          } catch {}

          // Avg entry price from trade history
          try {
            const avgRes = await fetch(
              `/api/exchange/avg-entry?exchange=${selectedExchange}&symbol=${symbol}`,
            );
            if (avgRes.ok) {
              const avgData = await avgRes.json();
              if (avgData.success && avgData.avgEntryPrice) {
                avgEntryPrice = avgData.avgEntryPrice;
              }
            }
          } catch {}

          return { balance, currentPrice, avgEntryPrice };
        })
      );

      for (const { balance, currentPrice, avgEntryPrice } of enrichedData) {
        const existingPosition = spotPositions.find(
          (p) =>
            p.exchange === selectedExchange && p.baseAsset === balance.asset,
        );

        if (!existingPosition && currentPrice > 0) {
          const entryPrice = avgEntryPrice ?? currentPrice;
          addSpotPosition({
            exchange: selectedExchange,
            baseAsset: balance.asset,
            quoteAsset: "USDT",
            pair: `${balance.asset}/USDT`,
            formattedPair:
              EXCHANGE_FORMATS[selectedExchange]?.(balance.asset, "USDT") ||
              `${balance.asset}USDT`,
            symbol: `${balance.asset}USDT`,
            quantity: balance.total,
            entryPrice,
            currentPrice,
            totalCost: entryPrice * balance.total,
            entryDate: new Date().toISOString().split("T")[0],
            notes: "Synced from exchange",
          });
        }
      }

      setLastSync(new Date());

      // Fetch realized PnL for synced symbols
      const symbols = filteredBalances.map((b) => `${b.asset}USDT`);
      fetchSpotRealizedPnl(symbols);
    } catch (error) {
      console.error("Sync error:", error);
      setSyncError(error instanceof Error ? error.message : "Failed to sync");
    } finally {
      setSyncing(false);
    }
  };


  const portfolio = useMemo(() => {
    const totalInvestment = spotPositions.reduce(
      (sum, p) => sum + (p.manualEntryPrice ?? p.entryPrice) * p.quantity,
      0,
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

  const saveEntryPrice = (positionId: string) => {
    const parsed = parseFloat(editingEntryPriceValue);
    if (!isNaN(parsed) && parsed > 0) {
      updateSpotPosition(positionId, { manualEntryPrice: parsed });
    } else {
      updateSpotPosition(positionId, { manualEntryPrice: undefined });
    }
    setEditingEntryPriceId(null);
    setEditingEntryPriceValue("");
  };

  const calculatePnL = (position: (typeof spotPositions)[0]) => {
    const effectiveEntryPrice = position.manualEntryPrice ?? position.entryPrice;
    const effectiveCost = effectiveEntryPrice * position.quantity;
    const currentPrice = prices[position.symbol] || position.currentPrice;
    const currentValue = position.quantity * currentPrice;
    const pnl = currentValue - effectiveCost;
    const pnlPercent = (pnl / effectiveCost) * 100;
    const priceChange = currentPrice - effectiveEntryPrice;
    return { currentValue, pnl, pnlPercent, currentPrice, priceChange };
  };

  const totalCost = useMemo(() => {
    const price = parseFloat(formData.entryPrice) || 0;
    const qty = parseFloat(formData.quantity) || 0;
    return (price * qty).toFixed(2);
  }, [formData.entryPrice, formData.quantity]);


  return (
    <div
      className={`h-full flex flex-col relative ${showAddModal || showSelectModal ? "overflow-hidden" : ""}`}
    >
      {/* 🎯 Fully Responsive Header */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 flex-shrink-0">
        <span className="font-semibold text-foreground text-xs whitespace-nowrap">
          Spot Positions
        </span>
        <span className="text-muted-foreground text-xs">•</span>
        <span className="text-emerald-400 text-xs whitespace-nowrap">LIVE</span>

        <div className="flex-1 min-w-[20px]"></div>

        <div ref={exchangeRef} className="relative">
          <button
            onClick={() => setExchangeOpen((v) => !v)}
            className="
              h-7 px-3 rounded-md
             bg-card
              border border-border
              text-foreground text-xs
              flex items-center gap-1.5
              cursor-pointer
              transition-all
              whitespace-nowrap
            "
          >
            <span>{selectedExchange.toUpperCase()}</span>
            {hasApiKey(selectedExchange) && (
              <span className="text-emerald-400 text-[10px]">✓</span>
            )}
            <span
              className={`
                text-muted-foreground text-[10px]
                transition-transform duration-200
                ${exchangeOpen ? "rotate-180" : ""}
              `}
            >
              ▾
            </span>
          </button>

{exchangeOpen && (() => {
  const buttonRect = exchangeRef.current?.getBoundingClientRect();
  const shouldOpenLeft = buttonRect ? buttonRect.left > window.innerWidth / 2 : false;

  return (
    <div
      onWheel={(e) => e.stopPropagation()}
      className={`
        absolute mt-1 z-50
        w-[120px]
    bg-secondary border border-border
        rounded-md
        shadow-lg
        animate-in fade-in slide-in-from-top-2 duration-200

        ${shouldOpenLeft ? 'right-0' : 'left-0'}
      `}
    >
      {SUPPORTED_EXCHANGES.map((ex) => (
        <button
          key={ex}
          onClick={() => {
            clearSpotPositionsByExchange(selectedExchange);
            setSelectedExchange(ex);
            const keyForExchange = apiKeys.find((k) => k.exchange === ex && k.isActive);
            setSelectedKeyId(keyForExchange?.id || null);
            setRealizedPnl(null);
            setExchangeOpen(false);
          }}
          className="
            w-full px-3 py-2
            text-left text-xs
            bg-transparent cursor-pointer
            text-foreground
            transition-colors
      hover:text-[#1A73E8]/65
            flex items-center justify-between
          "
        >
          <span>{ex.toUpperCase()}</span>
          {hasApiKey(ex) && (
            <span className="text-emerald-400 text-[10px]">✓</span>
          )}
        </button>
      ))}
    </div>
  );
})()}

        </div>

        {hasApiKey(selectedExchange) ? (
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={syncFromExchange}
              disabled={syncing}
              className="
                h-7 px-3 rounded-md
                bg-emerald-500/20 border border-emerald-500/30
                text-emerald-400 text-xs
                hover:bg-emerald-500/30
                transition-all
                flex items-center gap-1.5
                cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
                whitespace-nowrap
              "
            >
              <RefreshCw
                className={`w-3 h-3 ${syncing ? "animate-spin" : ""}`}
              />
              <span>{syncing ? "Syncing..." : "Sync"}</span>
            </button>
            <button
              onClick={() => {
                if (!session) {
                  setShowAuthModal(true);
                  return;
                }
                setShowSelectModal(true);
              }}
              className="
                h-7 px-2 rounded-md
                bg-input border border-border
                text-muted-foreground text-xs
                hover:bg-black/10 dark:hover:bg-secondary
                transition-colors
                cursor-pointer
              "
              title="Change Connection"
            >
              <Key className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              if (!session) {
                setShowAuthModal(true);
                return;
              }
              setShowSelectModal(true);
            }}
            className="
              h-7 px-3 rounded-md
              bg-blue-500/20 border border-blue-500/30
              text-blue-400 text-xs
              hover:bg-blue-500/30
              transition-all
              flex items-center gap-1.5
              cursor-pointer
              whitespace-nowrap
            "
          >
            <Key className="w-3 h-3" />
            <span>Connect</span>
          </button>
        )}
      </div>

      {/* Error Message - Fixed, no scroll */}
      {syncError && (
        <div className="mx-3 mb-2 p-2 bg-red-500/10 border border-red-500/30 rounded-md text-red-400 text-xs flex items-start gap-2 flex-shrink-0">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span className="flex-1 min-w-0 break-words">{syncError}</span>
        </div>
      )}

      {/* Last Sync Info - Fixed, no scroll */}
      {lastSync && (
        <div className="mx-3 mb-2 text-muted-foreground text-xs flex-shrink-0">
          Last sync: {lastSync.toLocaleTimeString()}
        </div>
      )}

      {/* Portfolio Summary - Fixed, no scroll, fully responsive grid */}
      <div className="px-3 pb-2 flex-shrink-0">
        <div className="grid grid-cols-2 @md:grid-cols-4 gap-1.5">
          <div className="bg-input border border-border rounded-md p-2 min-w-0">
            <div className="text-muted-foreground text-[10px] mb-0.5 break-words leading-tight">
              Investment
            </div>
            <div className="text-foreground font-semibold text-xs break-words leading-tight">
              ${formatUSD(portfolio.totalInvestment)}
            </div>
          </div>
          <div className="bg-input border border-border rounded-md p-2 min-w-0">
            <div className="text-muted-foreground text-[10px] mb-0.5 break-words leading-tight">
              Value
            </div>
            <div className="text-foreground font-semibold text-xs break-words leading-tight">
              ${formatUSD(portfolio.currentValue)}
            </div>
          </div>
          <div className="bg-input border border-border rounded-md p-2 min-w-0">
            <div className="text-muted-foreground text-[10px] mb-0.5 break-words leading-tight">
              Float PnL
            </div>
            <div
              className={`font-semibold text-xs break-words leading-tight ${
                portfolio.totalPnL >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {portfolio.totalPnL >= 0 ? "+" : "-"}${formatUSD(Math.abs(portfolio.totalPnL))}
            </div>
          </div>
          <div className="bg-input border border-border rounded-md p-2 min-w-0">
            <div className="text-muted-foreground text-[10px] mb-0.5 break-words leading-tight">
              Realized PnL
            </div>
            <div
              className={`font-semibold text-xs break-words leading-tight ${
                realizedPnl === null ? "text-muted-foreground" : realizedPnl >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {realizedPnl === null
                ? (loadingRealized ? "..." : "—")
                : `${realizedPnl >= 0 ? "+" : "-"}$${formatUSD(Math.abs(realizedPnl))}`}
            </div>
          </div>
        </div>
      </div>

      {/* Add Position Button - Fixed, no scroll */}
      <div className="px-3 pb-2 flex-shrink-0">
        <button
          onClick={() => setShowAddModal(true)}
          className="
            w-full py-2 rounded-md
            bg-blue-500/20 border border-blue-500/30
            text-blue-300 text-xs font-medium
            hover:bg-blue-500/30
            transition-all
            flex items-center justify-center gap-1.5
            cursor-pointer
          "
        >
          <Plus className="w-3.5 h-3.5" />
          Add Position Manually
        </button>
      </div>

      {/* Positions List - Scrollable */}
      <div
        ref={contentRef}
        className="
          flex-1 min-h-0
          overflow-y-auto
          px-3 pb-3

          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-transparent
 [&::-webkit-scrollbar-thumb]:bg-black/20 dark:[&::-webkit-scrollbar-thumb]:bg-white/20          [&::-webkit-scrollbar-thumb]:rounded-full
[&::-webkit-scrollbar-thumb:hover]:bg-black/30 dark:[&::-webkit-scrollbar-thumb:hover]:bg-white/40
          scrollbar-thin
scrollbar-thumb-foreground/20          scrollbar-track-transparent
        "
      >
        {spotPositions.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center text-muted-foreground text-xs">
              No positions yet. Sync from exchange or add manually.
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {spotPositions.map((position) => {
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
                  className="p-2.5 rounded-md bg-input border border-border hover:bg-black/8 dark:hover:bg-white/8 transition-colors"
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2">
                    <span className="font-semibold text-foreground text-xs whitespace-nowrap">
                      {position.pair}
                    </span>
                    <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded text-[10px] uppercase font-semibold shrink-0">
                      {position.exchange}
                    </span>
                    <div className="flex-1 min-w-[10px]"></div>
                    <button
                      onClick={() => {
                        if (confirm("Delete this position?")) {
                          removeSpotPosition(position.id);
                        }
                      }}
                      className="p-1 rounded text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                      title="Remove"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Formatted Pair */}
                  <div className="text-muted-foreground text-[10px] mb-2 truncate">
                    {position.formattedPair}
                  </div>

                  {/* Metrics Grid - Fully responsive */}
                  <div className="grid grid-cols-2 gap-1.5 text-[10px] mb-2">
                   <div className="bg-input rounded px-2 py-1.5 min-w-0 overflow-hidden">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-muted-foreground leading-tight text-[9px]">Entry</span>
                        {editingEntryPriceId !== position.id && (
                          <button
                            onClick={() => {
                              setEditingEntryPriceId(position.id);
                              setEditingEntryPriceValue(
                                String(position.manualEntryPrice ?? position.entryPrice)
                              );
                            }}
                            className="text-muted-foreground hover:text-yellow-400 transition-colors cursor-pointer"
                          >
                            <Pencil className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                      {editingEntryPriceId === position.id ? (
                        <input
                          type="number"
                          autoFocus
                          value={editingEntryPriceValue}
                          onChange={(e) => setEditingEntryPriceValue(e.target.value)}
                          onBlur={() => saveEntryPrice(position.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEntryPrice(position.id);
                            if (e.key === "Escape") {
                              setEditingEntryPriceId(null);
                              setEditingEntryPriceValue("");
                            }
                          }}
                          className="w-full bg-secondary border border-yellow-400/50 rounded px-1 py-0.5 text-yellow-400 text-[10px] font-semibold outline-none"
                        />
                      ) : (
                        <div className="text-foreground font-semibold break-words leading-tight truncate text-[10px]">
                          ${(position.manualEntryPrice ?? position.entryPrice).toLocaleString()}
                          {position.manualEntryPrice && (
                            <span className="text-yellow-400/60 text-[8px] ml-1">✎</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="bg-input rounded px-2 py-1.5 min-w-0">
                      <div className="text-muted-foreground mb-0.5 break-words leading-tight text-[9px]">
                        Current
                      </div>
                      <div className="text-foreground font-semibold flex items-start gap-1 flex-wrap leading-tight">
                        <span className="break-words truncate">
                          $
                          {currentPrice.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 6,
                          })}
                        </span>
                        {priceChange !== 0 && (
                          <span
                            className={`text-[8px] shrink-0 ${
                              priceChange > 0
                                ? "text-emerald-400"
                                : "text-red-400"
                            }`}
                          >
                            {priceChange > 0 ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="bg-input rounded px-2 py-1.5 min-w-0">
                      <div className="text-muted-foreground mb-0.5 break-words leading-tight text-[9px]">
                        Qty
                      </div>
                      <div className="text-foreground font-semibold break-words leading-tight truncate">
                        {position.quantity.toLocaleString(undefined, {
                          minimumFractionDigits: 4,
                          maximumFractionDigits: 8,
                        })}
                      </div>
                    </div>
                    <div className="bg-input rounded px-2 py-1.5 min-w-0">
                      <div className="text-muted-foreground mb-0.5 break-words leading-tight text-[9px]">
                        Cost
                      </div>
                      <div className="text-foreground font-semibold break-words leading-tight truncate">
                        ${formatUSD(position.totalCost)}
                      </div>
                    </div>
                    <div className="bg-input rounded px-2 py-1.5 min-w-0">
                      <div className="text-muted-foreground mb-0.5 break-words leading-tight text-[9px]">
                        Value
                      </div>
                      <div className="text-foreground font-semibold break-words leading-tight truncate">
                        ${formatUSD(currentValue)}
                      </div>
                    </div>
                    <div className="bg-input rounded px-2 py-1.5 min-w-0 overflow-hidden">
                      <div className="text-muted-foreground mb-0.5 break-words leading-tight text-[9px]">
                        P&L
                      </div>
                      <div
                        className={`font-semibold break-words leading-tight ${
                          pnl >= 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        <div className="truncate">
                          {pnl >= 0 ? "+" : "-"}${formatUSD(Math.abs(pnl))}
                        </div>
                        <div className="truncate">
                          ({pnlPercent >= 0 ? "+" : ""}
                          {pnlPercent.toFixed(2)}%)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="text-muted-foreground text-[9px] pt-1.5 border-t border-border truncate">
                    Entry: {new Date(position.entryDate).toLocaleDateString()}
                  </div>

                  {position.notes && (
                    <div className="text-muted-foreground text-[9px] pt-1.5 border-t border-border mt-1.5 break-words">
                      📝 {position.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAddModal && (
        <div
          className="
            fixed inset-0
            bg-background z-[100]
            flex flex-col overflow-hidden
            animate-in fade-in slide-in-from-bottom-4 duration-200
          "
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: 0,
            padding: 0,
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 border-b border-border bg-input flex-shrink-0">
            <span className="text-foreground font-semibold text-xs whitespace-nowrap">
              Add Spot Position
            </span>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-muted-foreground hover:text-foreground leading-none cursor-pointer transition-colors text-xl ml-auto"
            >
              ×
            </button>
          </div>

          {/* Modal Content */}
          <div
            className="
              flex-1 min-h-0
              overflow-y-auto
              p-3

              [&::-webkit-scrollbar]:w-1.5
              [&::-webkit-scrollbar-track]:bg-transparent
 [&::-webkit-scrollbar-thumb]:bg-black/20 dark:[&::-webkit-scrollbar-thumb]:bg-white/20              [&::-webkit-scrollbar-thumb]:rounded-full
[&::-webkit-scrollbar-thumb:hover]:bg-black/30 dark:[&::-webkit-scrollbar-thumb:hover]:bg-white/40
              scrollbar-thin
scrollbar-thumb-foreground/20              scrollbar-track-transparent
            "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-3">
              {/* Exchange */}
              <div>
                <label className="block text-muted-foreground mb-1.5 text-[10px] font-medium">
                  Exchange
                </label>
                <div ref={exchangeModalRef} className="relative">
                  <button
                    onClick={() => setExchangeModalOpen((v) => !v)}
                    className="
                          w-full h-9
                          flex items-center justify-between
                          bg-input
                          border border-border
                          rounded-md px-3
                          text-foreground text-xs
                          cursor-pointer
                          hover:bg-black/8 dark:hover:bg-white/8
                          transition-colors
                        "
                  >
                    <span>
                      {formData.exchange
                        ? formData.exchange.toUpperCase()
                        : "Select Exchange"}
                    </span>
                    <span
                      className={`text-muted-foreground transition-transform ${exchangeModalOpen ? "rotate-180" : ""}`}
                    >
                      ▾
                    </span>
                  </button>

                  {exchangeModalOpen && (
                    <div
                      onWheel={(e) => e.stopPropagation()}
                      className="
                              absolute z-50 mt-1 w-full
                              max-h-[120px] overflow-y-auto
                              bg-background
                              border border-border
                              rounded-none
                              shadow-lg

                              [&::-webkit-scrollbar]:w-1.5
                              [&::-webkit-scrollbar-thumb]:bg-black/20 dark:[&::-webkit-scrollbar-thumb]:bg-white/20
                              [&::-webkit-scrollbar-thumb]:rounded-full
                              [&::-webkit-scrollbar-track]:bg-transparent
                            "
                    >
                      {ALL_EXCHANGES.map((ex) => (
                        <button
                          key={ex}
                          onClick={() => {
                            setFormData({ ...formData, exchange: ex });
                            setExchangeModalOpen(false);
                          }}
                      className="
                        w-full px-3 py-2
                        text-left text-xs
                        cursor-pointer
                        bg-transparent
                        text-foreground
                        transition-colors
                 hover:text-[#1A73E8]/65
                      "
                        >
                          {ex.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  )}

                  
                </div>

              </div>

              {/* Base & Quote Assets */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-muted-foreground mb-1.5 text-[10px] font-medium">
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
                    className="w-full bg-input border border-border rounded-md px-2.5 py-1.5 text-foreground text-xs outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1.5 text-[10px] font-medium">
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
                    className="w-full bg-input border border-border rounded-md px-2.5 py-1.5 text-foreground text-xs outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
              </div>

              {/* Entry Price & Quantity */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-muted-foreground mb-1.5 text-[10px] font-medium">
                    Entry Price
                  </label>
                  <input
                    type="number"
                    value={formData.entryPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, entryPrice: e.target.value })
                    }
                    placeholder="0.00"
                    className="w-full bg-input border border-border rounded-md px-2.5 py-1.5 text-foreground text-xs outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1.5 text-[10px] font-medium">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    placeholder="0.00"
                    className="w-full bg-input border border-border rounded-md px-2.5 py-1.5 text-foreground text-xs outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
              </div>

              {/* Total Cost */}
              <div>
                <label className="block text-muted-foreground mb-1.5 text-[10px] font-medium">
                  Total Cost
                </label>
                <div className="w-full bg-input border border-border rounded-md px-2.5 py-1.5 text-muted-foreground text-xs truncate">
                  ${totalCost}
                </div>
              </div>

              {/* Entry Date */}
              <div>
                <label className="block text-muted-foreground mb-1.5 text-[10px] font-medium">
                  Entry Date
                </label>
                <input
                  type="date"
                  value={formData.entryDate}
                  onChange={(e) =>
                    setFormData({ ...formData, entryDate: e.target.value })
                  }
                  className="w-full bg-input border border-border rounded-md px-2.5 py-1.5 text-foreground text-xs outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-muted-foreground mb-1.5 text-[10px] font-medium">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Any notes..."
                  className="w-full bg-input border border-border rounded-md px-2.5 py-1.5 text-foreground text-xs outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-3 border-t border-border flex-shrink-0">
            <button
              onClick={addPosition}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-foreground py-2 rounded-md font-semibold text-xs cursor-pointer transition-colors"
            >
              Add Position
            </button>
          </div>
        </div>
      )}

      {/* Select Connection Modal */}
      <SelectConnectionModal
        open={showSelectModal}
        onClose={() => setShowSelectModal(false)}
        keys={apiKeys}
        loading={keysLoading}
        onSelect={(key) => {
          const prevExchange = selectedExchange;
          if (key.exchange !== prevExchange) {
            clearSpotPositionsByExchange(prevExchange);
          }
          setSelectedExchange(key.exchange);
          setSelectedKeyId(key.id);
          setRealizedPnl(null);
          setShowSelectModal(false);
        }}
        selectedKeyId={selectedKeyId}
        title="Select Spot Connection"
      />


      {/* Auth Modal */}
      <AuthModal
        open={showAuthModal}
        mode={authMode}
        onClose={() => setShowAuthModal(false)}
        onChange={setAuthMode}
      />
    </div>
  );
}
