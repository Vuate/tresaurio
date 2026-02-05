// components/terminal/personalized-dashboard/SpotPositionsModule.tsx
"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Plus, Trash2, RefreshCw, Key, AlertCircle, X } from "lucide-react";
import { usePortfolioStore } from "@/store/portfolioStore";
import { usePriceStore } from "@/store/priceStore";

interface Props {
  instanceId: string;
}

interface ApiKeyInfo {
  id: string;
  exchange: string;
  label: string | null;
  isActive: boolean;
}

interface SpotBalance {
  asset: string;
  free: number;
  locked: number;
  total: number;
  usdValue?: number;
}

const EXCHANGE_FORMATS: Record<string, (base: string, quote: string) => string> = {
  binance: (base, quote) => `${base}${quote}`,
  okx: (base, quote) => `${base}-${quote}`,
  bybit: (base, quote) => `${base}${quote}`,
  coinbase: (base, quote) => `${base}-${quote}`,
};

const SUPPORTED_EXCHANGES = ["binance", "okx", "bybit", "coinbase"];

const ALL_EXCHANGES = [
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
];

// 🎯 Custom Hook: Window Size Check
function useWindowSizeCheck() {
  const [isTooSmall, setIsTooSmall] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsTooSmall(window.innerWidth < 400 || window.innerHeight < 300);
    };

    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  return isTooSmall;
}

export default function SpotPositionsModule({ instanceId }: Props) {
  const { spotPositions, addSpotPosition, removeSpotPosition } = usePortfolioStore();
  const prices = usePriceStore((s) => s.prices);

  const windowTooSmall = useWindowSizeCheck();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKeyInfo[]>([]);
  const [selectedExchange, setSelectedExchange] = useState<string>("binance");
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const exchangeRef = useRef<HTMLDivElement>(null);
  const exchangeModalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // API Key form
  const [apiKeyForm, setApiKeyForm] = useState({
    exchange: "binance",
    apiKey: "",
    apiSecret: "",
    passphrase: "",
    label: "",
  });
  const [savingKey, setSavingKey] = useState(false);

  const [formData, setFormData] = useState({
    exchange: "",
    baseAsset: "",
    quoteAsset: "",
    entryPrice: "",
    quantity: "",
    entryDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  // Fetch API keys on mount
  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch("/api/exchange/keys");
      const data = await response.json();
      if (data.success) {
        setApiKeys(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch API keys:", error);
    }
  };

  const hasApiKey = useCallback(
    (exchange: string) => {
      return apiKeys.some((k) => k.exchange === exchange && k.isActive);
    },
    [apiKeys]
  );

  // Close exchange dropdown on outside click
  useEffect(() => {
    if (!exchangeOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (exchangeRef.current && !exchangeRef.current.contains(e.target as Node)) {
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
      if (exchangeModalRef.current && !exchangeModalRef.current.contains(e.target as Node)) {
        setExchangeModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [exchangeModalOpen]);

  // 🔒 Modal açıkken arka plan scroll'unu kilitle
  useEffect(() => {
    if (showAddModal || showApiKeyModal) {
      document.body.style.overflow = 'hidden';
      
      if (contentRef.current) {
        const scrollTop = contentRef.current.scrollTop;
        contentRef.current.style.overflow = 'hidden';
        contentRef.current.scrollTop = scrollTop;
      }
    }

    return () => {
      document.body.style.overflow = '';
      if (contentRef.current) {
        contentRef.current.style.overflow = '';
      }
    };
  }, [showAddModal, showApiKeyModal]);

  const syncFromExchange = async () => {
    if (!hasApiKey(selectedExchange)) {
      setSyncError("No API key configured for this exchange");
      return;
    }

    setSyncing(true);
    setSyncError(null);

    try {
      const response = await fetch(`/api/exchange/account?exchange=${selectedExchange}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch balances");
      }

      const balances: SpotBalance[] = data.data;

      const pricePromises = balances
        .filter((b) => b.total > 0)
        .map(async (balance) => {
          const symbol = `${balance.asset}USDT`;
          try {
            const priceRes = await fetch(
              `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
            );
            if (priceRes.ok) {
              const priceData = await priceRes.json();
              return { asset: balance.asset, price: parseFloat(priceData.price) };
            }
          } catch {
            // Ignore price fetch errors
          }
          return { asset: balance.asset, price: 0 };
        });

      const pricesData = await Promise.all(pricePromises);
      const priceMap = Object.fromEntries(pricesData.map((p) => [p.asset, p.price]));

      balances
        .filter((b) => b.total > 0 && b.asset !== "USDT" && b.asset !== "USDC")
        .forEach((balance) => {
          const price = priceMap[balance.asset] || 0;
          const existingPosition = spotPositions.find(
            (p) => p.exchange === selectedExchange && p.baseAsset === balance.asset
          );

          if (!existingPosition && price > 0) {
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
              entryPrice: price,
              currentPrice: price,
              totalCost: price * balance.total,
              entryDate: new Date().toISOString().split("T")[0],
              notes: "Synced from exchange",
            });
          }
        });

      setLastSync(new Date());
    } catch (error) {
      console.error("Sync error:", error);
      setSyncError(error instanceof Error ? error.message : "Failed to sync");
    } finally {
      setSyncing(false);
    }
  };

  const saveApiKey = async () => {
    if (!apiKeyForm.apiKey || !apiKeyForm.apiSecret) {
      alert("API Key and Secret are required");
      return;
    }

    if (
      (apiKeyForm.exchange === "okx" || apiKeyForm.exchange === "coinbase") &&
      !apiKeyForm.passphrase
    ) {
      alert("Passphrase is required for this exchange");
      return;
    }

    setSavingKey(true);

    try {
      const response = await fetch("/api/exchange/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exchange: apiKeyForm.exchange,
          apiKey: apiKeyForm.apiKey,
          apiSecret: apiKeyForm.apiSecret,
          passphrase: apiKeyForm.passphrase || undefined,
          label: apiKeyForm.label || undefined,
          permissions: ["spot"],
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to save API key");
      }

      await fetchApiKeys();
      setShowApiKeyModal(false);
      setApiKeyForm({
        exchange: "binance",
        apiKey: "",
        apiSecret: "",
        passphrase: "",
        label: "",
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save API key");
    } finally {
      setSavingKey(false);
    }
  };

  const deleteExchangeKey = async (exchange: string) => {
    const key = apiKeys.find((k) => k.exchange === exchange);
    if (!key) return;

    if (!confirm(`Delete API key for ${exchange.toUpperCase()}?`)) return;

    try {
      const response = await fetch(`/api/exchange/keys?id=${key.id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        await fetchApiKeys();
        setSyncError(null);
      } else {
        alert(data.error || "Failed to delete API key");
      }
    } catch (error) {
      alert("Failed to delete API key");
    }
  };

  const portfolio = useMemo(() => {
    const totalInvestment = spotPositions.reduce((sum, p) => sum + p.totalCost, 0);
    const currentValue = spotPositions.reduce((sum, p) => {
      const currentPrice = prices[p.symbol] || p.currentPrice;
      return sum + p.quantity * currentPrice;
    }, 0);
    const totalPnL = currentValue - totalInvestment;
    const totalPnLPercent = totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;
    return { totalInvestment, currentValue, totalPnL, totalPnLPercent };
  }, [spotPositions, prices]);

  const addPosition = () => {
    const { exchange, baseAsset, quoteAsset, entryPrice, quantity, entryDate, notes } =
      formData;

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

    const formattedPair = EXCHANGE_FORMATS[exchange]?.(base, quote) || `${base}${quote}`;

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

  if (windowTooSmall) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#0a0e1a] rounded-lg p-4">
        <div className="text-center space-y-2">
          <div className="text-white/90 font-semibold text-sm">
            Window Too Small
          </div>
          <div className="text-white/50 text-xs">
            Minimum size: 400x300px
            <br />
            Please resize your window
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col relative ${showAddModal || showApiKeyModal ? 'overflow-hidden' : ''}`}>
      {/* 🎯 Fully Responsive Header */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 flex-shrink-0">
        <span className="font-semibold text-white/90 text-xs whitespace-nowrap">
          Spot Positions
        </span>
        <span className="text-white/40 text-xs">•</span>
        <span className="text-emerald-400 text-xs whitespace-nowrap">LIVE</span>

        <div className="flex-1 min-w-[20px]"></div>

        {/* Exchange Dropdown */}
        <div ref={exchangeRef} className="relative">
          <button
            onClick={() => setExchangeOpen((v) => !v)}
            className="
              h-7 px-3 rounded-md
              bg-[#0b1f1f]
              border border-white/10
              text-white text-xs
              flex items-center gap-1.5
              cursor-pointer
              hover:bg-white/5
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
                text-white/50 text-[10px]
                transition-transform duration-200
                ${exchangeOpen ? "rotate-180" : ""}
              `}
            >
              ▾
            </span>
          </button>

          {exchangeOpen && (
            <div
              onWheel={(e) => e.stopPropagation()}
              className="
                absolute right-0 mt-1 z-50
                w-[120px]
                max-h-[160px]
                overflow-y-auto
                bg-[#0b1f1f]
                border border-emerald-500/20
                rounded-md
                shadow-lg
                animate-in fade-in slide-in-from-top-2 duration-200

                [&::-webkit-scrollbar]:w-1.5
                [&::-webkit-scrollbar-thumb]:bg-emerald-500/40
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-track]:bg-transparent
              "
            >
              {SUPPORTED_EXCHANGES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => {
                    setSelectedExchange(ex);
                    setExchangeOpen(false);
                  }}
                  className="
                    w-full px-3 py-2
                    text-left text-xs
                    bg-transparent cursor-pointer
                    text-white
                    transition-colors
                    hover:bg-emerald-500/10
                    hover:text-emerald-400
                    flex items-center justify-between
                  "
                >
                  <span>{ex.toUpperCase()}</span>
                  {hasApiKey(ex) && <span className="text-emerald-400 text-[10px]">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sync/Connect Buttons */}
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
              <RefreshCw className={`w-3 h-3 ${syncing ? "animate-spin" : ""}`} />
              <span>{syncing ? "Syncing..." : "Sync"}</span>
            </button>
            <button
              onClick={() => {
                setApiKeyForm({ ...apiKeyForm, exchange: selectedExchange });
                setShowApiKeyModal(true);
              }}
              className="
                h-7 px-2 rounded-md
                bg-white/5 border border-white/10
                text-white/60 text-xs
                hover:bg-white/10
                transition-colors
                cursor-pointer
              "
              title="Change API Key"
            >
              <Key className="w-3 h-3" />
            </button>
            <button
              onClick={() => deleteExchangeKey(selectedExchange)}
              className="
                h-7 px-2 rounded-md
                bg-red-500/10 border border-red-500/20
                text-red-400 text-xs
                hover:bg-red-500/20
                transition-colors
                cursor-pointer
              "
              title="Delete API Key"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setApiKeyForm({ ...apiKeyForm, exchange: selectedExchange });
              setShowApiKeyModal(true);
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
        <div className="mx-3 mb-2 text-white/40 text-xs flex-shrink-0">
          Last sync: {lastSync.toLocaleTimeString()}
        </div>
      )}

      {/* Portfolio Summary - Fixed, no scroll, fully responsive grid */}
      <div className="px-3 pb-2 flex-shrink-0">
        <div className="grid grid-cols-2 @md:grid-cols-4 gap-1.5">
          <div className="bg-white/5 border border-white/10 rounded-md p-2 min-w-0">
            <div className="text-white/40 text-[10px] mb-0.5 break-words leading-tight">
              Investment
            </div>
            <div className="text-white font-semibold text-xs break-words leading-tight">
              ${portfolio.totalInvestment.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-md p-2 min-w-0">
            <div className="text-white/40 text-[10px] mb-0.5 break-words leading-tight">
              Value
            </div>
            <div className="text-white font-semibold text-xs break-words leading-tight">
              ${portfolio.currentValue.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-md p-2 min-w-0">
            <div className="text-white/40 text-[10px] mb-0.5 break-words leading-tight">
              P&L
            </div>
            <div
              className={`font-semibold text-xs break-words leading-tight ${
                portfolio.totalPnL >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {portfolio.totalPnL >= 0 ? "+" : ""}
              ${Math.abs(portfolio.totalPnL).toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-md p-2 min-w-0">
            <div className="text-white/40 text-[10px] mb-0.5 break-words leading-tight">
              P&L %
            </div>
            <div
              className={`font-semibold text-xs break-words leading-tight ${
                portfolio.totalPnLPercent >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {portfolio.totalPnLPercent >= 0 ? "+" : ""}
              {portfolio.totalPnLPercent.toFixed(2)}%
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
          [&::-webkit-scrollbar-thumb]:bg-teal-400/40
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb:hover]:bg-teal-400/70

          scrollbar-thin
          scrollbar-thumb-teal-400/40
          scrollbar-track-transparent
        "
      >
        {spotPositions.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center text-white/40 text-xs">
              No positions yet. Sync from exchange or add manually.
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {spotPositions.map((position) => {
              const { currentValue, pnl, pnlPercent, currentPrice, priceChange } =
                calculatePnL(position);
              return (
                <div
                  key={position.id}
                  className="p-2.5 rounded-md bg-white/5 border border-white/10 hover:bg-white/8 transition-colors"
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2">
                    <span className="font-semibold text-white text-xs whitespace-nowrap">
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
                      className="p-1 rounded text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                      title="Remove"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Formatted Pair */}
                  <div className="text-white/30 text-[10px] mb-2 truncate">
                    {position.formattedPair}
                  </div>

                  {/* Metrics Grid - Fully responsive */}
                  <div className="grid grid-cols-2 gap-1.5 text-[10px] mb-2">
                    <div className="bg-white/5 rounded px-2 py-1.5 min-w-0">
                      <div className="text-white/50 mb-0.5 break-words leading-tight text-[9px]">Entry</div>
                      <div className="text-white font-semibold break-words leading-tight truncate">
                        ${position.entryPrice.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded px-2 py-1.5 min-w-0">
                      <div className="text-white/50 mb-0.5 break-words leading-tight text-[9px]">Current</div>
                      <div className="text-white font-semibold flex items-start gap-1 flex-wrap leading-tight">
                        <span className="break-words truncate">
                          ${currentPrice.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 6,
                          })}
                        </span>
                        {priceChange !== 0 && (
                          <span
                            className={`text-[8px] shrink-0 ${
                              priceChange > 0 ? "text-emerald-400" : "text-red-400"
                            }`}
                          >
                            {priceChange > 0 ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded px-2 py-1.5 min-w-0">
                      <div className="text-white/50 mb-0.5 break-words leading-tight text-[9px]">Qty</div>
                      <div className="text-white font-semibold break-words leading-tight truncate">
                        {position.quantity.toLocaleString(undefined, {
                          minimumFractionDigits: 4,
                          maximumFractionDigits: 8,
                        })}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded px-2 py-1.5 min-w-0">
                      <div className="text-white/50 mb-0.5 break-words leading-tight text-[9px]">Cost</div>
                      <div className="text-white font-semibold break-words leading-tight truncate">
                        ${position.totalCost.toLocaleString(undefined, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded px-2 py-1.5 min-w-0">
                      <div className="text-white/50 mb-0.5 break-words leading-tight text-[9px]">Value</div>
                      <div className="text-white font-semibold break-words leading-tight truncate">
                        ${currentValue.toLocaleString(undefined, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded px-2 py-1.5 min-w-0 overflow-hidden">
                      <div className="text-white/50 mb-0.5 break-words leading-tight text-[9px]">P&L</div>
                      <div
                        className={`font-semibold break-words leading-tight ${
                          pnl >= 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        <div className="truncate">
                          {pnl >= 0 ? "+" : ""}${Math.abs(pnl).toFixed(0)}
                        </div>
                        <div className="truncate">
                          ({pnlPercent >= 0 ? "+" : ""}
                          {pnlPercent.toFixed(1)}%)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="text-white/30 text-[9px] pt-1.5 border-t border-white/5 truncate">
                    Entry: {new Date(position.entryDate).toLocaleDateString()}
                  </div>

                  {position.notes && (
                    <div className="text-white/40 text-[9px] pt-1.5 border-t border-white/5 mt-1.5 break-words">
                      📝 {position.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 🔧 Add Position Modal - TRULY FULL SCREEN */}
      {showAddModal && (
        <div 
          className="
            fixed inset-0
            bg-[#0a0e1a] z-[100]
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
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 border-b border-white/10 bg-white/5 flex-shrink-0">
            <span className="text-white font-semibold text-xs whitespace-nowrap">
              Add Spot Position
            </span>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-white/50 hover:text-white leading-none cursor-pointer transition-colors text-xl ml-auto"
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
              [&::-webkit-scrollbar-thumb]:bg-teal-400/40
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb:hover]:bg-teal-400/70

              scrollbar-thin
              scrollbar-thumb-teal-400/40
              scrollbar-track-transparent
            "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-3">
              {/* Exchange */}
              <div>
                <label className="block text-white/50 mb-1.5 text-[10px] font-medium">
                  Exchange
                </label>
                <div ref={exchangeModalRef} className="relative">
<button
  onClick={() => setExchangeModalOpen((v) => !v)}
  className="
    w-full h-9
    flex items-center justify-between
    bg-white/5
    border border-white/10
    rounded-md px-3
    text-white text-xs
    cursor-pointer
    hover:bg-white/8
    transition-colors
  "
>
  <span>{formData.exchange ? formData.exchange.toUpperCase() : "Select Exchange"}</span>
  <span className={`text-white/50 transition-transform ${exchangeModalOpen ? "rotate-180" : ""}`}>
    ▾
  </span>
</button>

{exchangeModalOpen && (
  <div
    onWheel={(e) => e.stopPropagation()}
    className="
      absolute z-50 mt-1 w-full
      max-h-[120px] overflow-y-auto
      bg-[#0a0e1a]
      border border-white/10
      rounded-md
      shadow-lg

      [&::-webkit-scrollbar]:w-1.5
      [&::-webkit-scrollbar-thumb]:bg-white/20
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
          text-white
          transition-colors
          hover:bg-white/10
          hover:text-white
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
                  <label className="block text-white/50 mb-1.5 text-[10px] font-medium">
                    Base Asset
                  </label>
                  <input
                    type="text"
                    value={formData.baseAsset}
                    onChange={(e) =>
                      setFormData({ ...formData, baseAsset: e.target.value.toUpperCase() })
                    }
                    placeholder="BTC"
                    className="w-full bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 text-white text-xs outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white/50 mb-1.5 text-[10px] font-medium">
                    Quote Asset
                  </label>
                  <input
                    type="text"
                    value={formData.quoteAsset}
                    onChange={(e) =>
                      setFormData({ ...formData, quoteAsset: e.target.value.toUpperCase() })
                    }
                    placeholder="USDT"
                    className="w-full bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 text-white text-xs outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
              </div>

              {/* Entry Price & Quantity */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-white/50 mb-1.5 text-[10px] font-medium">
                    Entry Price
                  </label>
                  <input
                    type="number"
                    value={formData.entryPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, entryPrice: e.target.value })
                    }
                    placeholder="0.00"
                    className="w-full bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 text-white text-xs outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white/50 mb-1.5 text-[10px] font-medium">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="0.00"
                    className="w-full bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 text-white text-xs outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
              </div>

              {/* Total Cost */}
              <div>
                <label className="block text-white/50 mb-1.5 text-[10px] font-medium">
                  Total Cost
                </label>
                <div className="w-full bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 text-white/70 text-xs truncate">
                  ${totalCost}
                </div>
              </div>

              {/* Entry Date */}
              <div>
                <label className="block text-white/50 mb-1.5 text-[10px] font-medium">
                  Entry Date
                </label>
                <input
                  type="date"
                  value={formData.entryDate}
                  onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 text-white text-xs outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-white/50 mb-1.5 text-[10px] font-medium">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any notes..."
                  className="w-full bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 text-white text-xs outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-3 border-t border-white/10 flex-shrink-0">
            <button
              onClick={addPosition}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-md font-semibold text-xs cursor-pointer transition-colors"
            >
              Add Position
            </button>
          </div>
        </div>
      )}

      {/* 🔧 API Key Modal - TRULY FULL SCREEN */}
      {showApiKeyModal && (
        <div 
          className="
            fixed inset-0
            bg-[#0a0e1a] z-[100]
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
<div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 border-b border-white/10 bg-white/5 flex-shrink-0">
  <div className="flex items-center gap-2 flex-wrap">
    <Key className="w-4 h-4 text-white shrink-0" />
    <span className="text-white font-semibold text-xs">
      Connect Exchange API
    </span>
  </div>
  <button
    onClick={() => setShowApiKeyModal(false)}
    className="text-white/50 hover:text-white leading-none cursor-pointer transition-colors text-xl ml-auto shrink-0"
  >
    ×
  </button>
</div>

          {/* Warning - FIXED, NO SCROLL */}
          <div className="p-3 bg-yellow-500/10 border-b border-yellow-500/30 flex items-start gap-2 flex-shrink-0">
            <span className="text-yellow-400 text-lg shrink-0">⚠️</span>
            <div className="text-yellow-400 text-[10px] break-words flex-1">
              Only use READ-ONLY API keys! Never share keys with withdrawal permissions.
            </div>
          </div>

          {/* Modal Content */}
          <div
            className="
              flex-1 min-h-0
              overflow-y-auto
              p-3

              [&::-webkit-scrollbar]:w-1.5
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-teal-400/40
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb:hover]:bg-teal-400/70

              scrollbar-thin
              scrollbar-thumb-teal-400/40
              scrollbar-track-transparent
            "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-3">

{/* Exchange */}
<div>
  <label className="block text-white/50 mb-1.5 text-[10px] font-medium">
    Exchange
  </label>
  <div className="relative">
    <button
      onClick={(e) => {
        e.stopPropagation();
        setExchangeModalOpen((v) => !v);
      }}
      className="
        w-full h-9
        flex items-center justify-between
        bg-white/5
        border border-white/10
        rounded-md px-3
        text-white text-xs
        cursor-pointer
        hover:bg-white/8
        transition-colors
      "
    >
      <span>{apiKeyForm.exchange ? apiKeyForm.exchange.toUpperCase() : "Select Exchange"}</span>
      <span className={`text-white/50 transition-transform ${exchangeModalOpen ? "rotate-180" : ""}`}>
        ▾
      </span>
    </button>

    {exchangeModalOpen && (
      <div
        onWheel={(e) => e.stopPropagation()}
        className="
          absolute z-50 mt-1 w-full
          max-h-[120px] overflow-y-auto
          bg-[#0a0e1a]
          border border-white/10
          rounded-md
          shadow-lg

          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-thumb]:bg-white/20
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-track]:bg-transparent
        "
      >
        {SUPPORTED_EXCHANGES.map((ex) => (
          <button
            key={ex}
            onClick={() => {
              setApiKeyForm({ ...apiKeyForm, exchange: ex });
              setExchangeModalOpen(false);
            }}
            className="
              w-full px-3 py-2
              text-left text-xs
              cursor-pointer
              bg-transparent
              text-white
              transition-colors
              hover:bg-white/10
              hover:text-white
            "
          >
            {ex.toUpperCase()}
          </button>
        ))}
      </div>
    )}
  </div>
</div>

              {/* API Key */}
              <div>
                <label className="block text-white/50 mb-1.5 text-[10px] font-medium">
                  API Key
                </label>
                <input
                  type="password"
                  value={apiKeyForm.apiKey}
                  onChange={(e) =>
                    setApiKeyForm({ ...apiKeyForm, apiKey: e.target.value })
                  }
                  placeholder="Enter your API key"
                  className="w-full bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 text-white text-xs outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>

              {/* API Secret */}
              <div>
                <label className="block text-white/50 mb-1.5 text-[10px] font-medium">
                  API Secret
                </label>
                <input
                  type="password"
                  value={apiKeyForm.apiSecret}
                  onChange={(e) =>
                    setApiKeyForm({ ...apiKeyForm, apiSecret: e.target.value })
                  }
                  placeholder="Enter your API secret"
                  className="w-full bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 text-white text-xs outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>

              {/* Passphrase (for OKX/Coinbase) */}
              {(apiKeyForm.exchange === "okx" || apiKeyForm.exchange === "coinbase") && (
                <div>
                  <label className="block text-white/50 mb-1.5 text-[10px] font-medium">
                    Passphrase
                  </label>
                  <input
                    type="password"
                    value={apiKeyForm.passphrase}
                    onChange={(e) =>
                      setApiKeyForm({ ...apiKeyForm, passphrase: e.target.value })
                    }
                    placeholder="Enter your passphrase"
                    className="w-full bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 text-white text-xs outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
              )}

              {/* Label */}
              <div>
                <label className="block text-white/50 mb-1.5 text-[10px] font-medium">
                  Label (Optional)
                </label>
                <input
                  type="text"
                  value={apiKeyForm.label}
                  onChange={(e) =>
                    setApiKeyForm({ ...apiKeyForm, label: e.target.value })
                  }
                  placeholder="e.g., Main Account"
                  className="w-full bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 text-white text-xs outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-3 border-t border-white/10 flex-shrink-0">
            <button
              onClick={saveApiKey}
              disabled={savingKey}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-2 rounded-md font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Key className="w-4 h-4" />
              {savingKey ? "Connecting..." : "Connect & Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}