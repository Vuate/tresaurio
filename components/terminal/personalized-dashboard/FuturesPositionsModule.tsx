"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useFuturesPositionStore } from "@/store/futuresPositionStore";
import { TrendingUp, TrendingDown, X, RefreshCw, Key, Link2, AlertCircle, Trash2, AlertTriangle } from "lucide-react";
import { useSession } from "next-auth/react";
import AuthModal from "@/components/auth/AuthModal";

interface Props {
  instanceId: string;
}

interface ApiKeyInfo {
  id: string;
  exchange: string;
  label: string | null;
  isActive: boolean;
}

interface FuturesPositionFromAPI {
  symbol: string;
  side: "long" | "short";
  size: number;
  entryPrice: number;
  markPrice: number;
  leverage: number;
  unrealizedPnl: number;
  marginType: "cross" | "isolated";
  liquidationPrice: number;
}

type FundingRate = {
  symbol: string;
  fundingRate: number;
  fundingTime: number;
  lastUpdate: number;
};

const SUPPORTED_EXCHANGES = ["binance", "okx", "bybit", "hyperliquid"];

export default function FuturesPositionsModule({ instanceId }: Props) {
  const storageKey = `futures-positions-${instanceId}`;

  const positions = useFuturesPositionStore((s) => s.positions);
  const removePosition = useFuturesPositionStore((s) => s.removePosition);
  const addPosition = useFuturesPositionStore((s) => s.addPosition);
  const updatePosition = useFuturesPositionStore((s) => s.updatePosition);
  const [localPrices, setLocalPrices] = useState<Record<string, number>>({});
  const [realizedPnl, setRealizedPnl] = useState<number | null>(null);
  const [loadingRealized, setLoadingRealized] = useState(false);
  const { data: session } = useSession();

  // API Key states
  const [apiKeys, setApiKeys] = useState<ApiKeyInfo[]>([]);
  const [selectedExchange, setSelectedExchange] = useState<string>("binance");
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [exchangeDropdownOpen, setExchangeDropdownOpen] = useState(false);
  const [exchangeModalDropdownOpen, setExchangeModalDropdownOpen] = useState(false);

  const exchangeDropdownRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const exchangeModalRef = useRef<HTMLDivElement>(null);

  // API Key form
  const [apiKeyForm, setApiKeyForm] = useState({
    exchange: "binance",
    apiKey: "",
    apiSecret: "",
    passphrase: "",
    label: "",
  });
  const [savingKey, setSavingKey] = useState(false);

  // Position form
  const [symbol, setSymbol] = useState("");
  const [side, setSide] = useState<"long" | "short">("long");
  const [entry, setEntry] = useState("");
  const [size, setSize] = useState("");
  const [leverage, setLeverage] = useState(10);
  const [leverageInput, setLeverageInput] = useState("10");

  // Funding rates
  const [fundingRates, setFundingRates] = useState<Record<string, FundingRate>>({});
  const [loadingFunding, setLoadingFunding] = useState(false);

  // Close exchange modal dropdown on outside click
  useEffect(() => {
    if (!exchangeModalDropdownOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (exchangeModalRef.current && !exchangeModalRef.current.contains(e.target as Node)) {
        setExchangeModalDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [exchangeModalDropdownOpen]);

  const fetchRealizedPnl = async () => {
    if (!apiKeys.some((k) => k.exchange === selectedExchange && k.isActive)) return;
    setLoadingRealized(true);
    try {
      const response = await fetch(`/api/exchange/realized-pnl?exchange=${selectedExchange}`);
      const data = await response.json();
      if (data.success) {
        setRealizedPnl(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch realized PnL:", error);
    } finally {
      setLoadingRealized(false);
    }
  };

  // Fetch API keys on mount
  useEffect(() => {
    fetchApiKeys();
  }, []);

  // Load realized PnL when exchange changes and has API key + positions
  useEffect(() => {
    if (positions.length > 0 && apiKeys.some((k) => k.exchange === selectedExchange && k.isActive)) {
      fetchRealizedPnl();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedExchange, apiKeys]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!exchangeDropdownOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        exchangeDropdownRef.current &&
        !exchangeDropdownRef.current.contains(e.target as Node)
      ) {
        setExchangeDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [exchangeDropdownOpen]);

  useEffect(() => {
    if (showApiKeyModal) {
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
  }, [showApiKeyModal]);

  // Fetch current prices for positions (multi-exchange support)
  useEffect(() => {
    if (positions.length === 0) return;

    const fetchPriceFromExchange = async (symbol: string, exchange: string): Promise<number | null> => {
      try {
        let url = "";

        if (exchange === "binance") {
          url = `https://fapi.binance.com/fapi/v1/ticker/price?symbol=${symbol}`;
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            return data.price ? parseFloat(data.price) : null;
          }
        } else if (exchange === "bybit") {
          url = `https://api.bybit.com/v5/market/tickers?category=linear&symbol=${symbol}`;
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            if (data.result?.list?.[0]?.lastPrice) {
              return parseFloat(data.result.list[0].lastPrice);
            }
          }
        } else if (exchange === "okx") {
          const baseAsset = symbol.replace("USDT", "");
          const instId = `${baseAsset}-USDT-SWAP`;
          url = `https://www.okx.com/api/v5/market/ticker?instId=${instId}`;
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            if (data.data?.[0]?.last) {
              return parseFloat(data.data[0].last);
            }
          }
        }
        return null;
      } catch (err) {
        console.error(`Failed to fetch price for ${symbol} from ${exchange}:`, err);
        return null;
      }
    };

    const fetchPrices = async () => {
      const symbols = [...new Set(positions.map((p) => p.symbol))];
      const updates: Record<string, number> = {};

      for (const symbol of symbols) {
        const price = await fetchPriceFromExchange(symbol, selectedExchange);
        if (price) {
          updates[symbol] = price;
        }
      }

      if (Object.keys(updates).length > 0) {
        setLocalPrices((prev) => ({ ...prev, ...updates }));
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 5000);

    return () => clearInterval(interval);
  }, [positions, selectedExchange]);

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

  const syncFromExchange = async () => {
    if (!hasApiKey(selectedExchange)) {
      setSyncError("No API key configured for this exchange");
      return;
    }

    setSyncing(true);
    setSyncError(null);

    try {
      const response = await fetch(
        `/api/exchange/positions?exchange=${selectedExchange}`
      );
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch positions");
      }

      const apiPositions: FuturesPositionFromAPI[] = data.data;

      // Remove positions that are no longer open on the exchange
      const stalePositions = positions.filter(
        (p) => !apiPositions.some((ap) => ap.symbol === p.symbol && ap.side === p.side)
      );
      stalePositions.forEach((p) => removePosition(p.id));

      // Update existing or add new positions
      apiPositions.forEach((pos) => {
        const existingPosition = positions.find(
          (p) => p.symbol === pos.symbol && p.side === pos.side
        );

        if (existingPosition) {
          updatePosition(existingPosition.id, {
            entryPrice: pos.entryPrice,
            markPrice: pos.markPrice,
            size: pos.size,
            leverage: pos.leverage,
          });
        } else {
          addPosition({
            symbol: pos.symbol,
            side: pos.side,
            entryPrice: pos.entryPrice,
            markPrice: pos.markPrice,
            size: pos.size,
            leverage: pos.leverage,
          });
        }
      });

      setLastSync(new Date());

      // Fetch realized PnL after sync
      fetchRealizedPnl();
    } catch (error) {
      console.error("Sync error:", error);
      setSyncError(
        error instanceof Error ? error.message : "Failed to sync"
      );
    } finally {
      setSyncing(false);
    }
  };

  const saveApiKey = async () => {
    if (!apiKeyForm.apiKey || (apiKeyForm.exchange !== "hyperliquid" && !apiKeyForm.apiSecret)) {
      alert("API Key and Secret are required");
      return;
    }

    if (apiKeyForm.exchange === "okx" && !apiKeyForm.passphrase) {
      alert("Passphrase is required for OKX");
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
          apiSecret: apiKeyForm.apiSecret || "none",
          passphrase: apiKeyForm.passphrase || undefined,
          label: apiKeyForm.label || undefined,
          permissions: ["futures"],
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

  // Fetch funding rates
  useEffect(() => {
    if (positions.length === 0) return;

    const fetchFundingRates = async () => {
      setLoadingFunding(true);

      try {
        const symbols = [...new Set(positions.map((p) => p.symbol))];

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
                fundingRate: parseFloat(data[0].fundingRate) * 100,
                fundingTime: data[0].fundingTime,
                lastUpdate: Date.now(),
              };
            }
            return null;
          } catch {
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
      } catch {
        console.error("Failed to fetch funding rates");
      } finally {
        setLoadingFunding(false);
      }
    };

    fetchFundingRates();
    const interval = setInterval(fetchFundingRates, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [positions]);

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

  const addManualPosition = () => {
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

    addPosition({
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

  const refreshFundingRate = async (symbolToRefresh: string) => {
    try {
      const response = await fetch(
        `https://fapi.binance.com/fapi/v1/fundingRate?symbol=${symbolToRefresh}&limit=1`
      );

      if (!response.ok) throw new Error("API failed");

      const data = await response.json();

      if (data && data.length > 0) {
        setFundingRates((prev) => ({
          ...prev,
          [symbolToRefresh]: {
            symbol: symbolToRefresh,
            fundingRate: parseFloat(data[0].fundingRate) * 100,
            fundingTime: data[0].fundingTime,
            lastUpdate: Date.now(),
          },
        }));
      }
    } catch {
      console.error(`Failed to refresh funding rate for ${symbolToRefresh}`);
    }
  };

  return (
    <div className={`h-full flex flex-col relative ${showApiKeyModal ? 'overflow-hidden' : ''}`}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-2 sm:px-3 py-2 flex-shrink-0">
        <div ref={exchangeDropdownRef} className="relative">       
          <button
            onClick={() => setExchangeDropdownOpen((v) => !v)}
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
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <span className="truncate">
                {selectedExchange.toUpperCase()}
              </span>
              {hasApiKey(selectedExchange) && (
                <span className="text-emerald-400 text-[10px] shrink-0">✓</span>
              )}
            </div>
            <span
              className={`
                text-white/50 text-[10px] shrink-0
                transition-transform duration-200
                ${exchangeDropdownOpen ? "rotate-180" : ""}
              `}
            >
              ▾
            </span>
          </button>

          {exchangeDropdownOpen && (() => {
            const buttonRect = exchangeDropdownRef.current?.getBoundingClientRect();
            const shouldOpenLeft = buttonRect ? buttonRect.left > window.innerWidth / 2 : false;
            
            const viewportHeight = window.innerHeight;
            const dropdownHeight = 120;
            const spaceBelow = buttonRect ? viewportHeight - buttonRect.bottom : dropdownHeight;
            const shouldOpenUp = spaceBelow < dropdownHeight && buttonRect && buttonRect.top > dropdownHeight;

            return (
              <div
                onWheel={(e) => e.stopPropagation()}
                className={`
                 absolute z-[999]
                 w-[140px]
               bg-[#0b1f1f]
                 border border-emerald-500/20
                  rounded-lg
                  overflow-hidden
                  shadow-xl
                  animate-in fade-in duration-200

                  [&::-webkit-scrollbar]:w-1.5
                  [&::-webkit-scrollbar-thumb]:bg-emerald-500/40
                  [&::-webkit-scrollbar-thumb]:rounded-full
                  [&::-webkit-scrollbar-track]:bg-transparent

                  ${shouldOpenLeft ? 'right-0' : 'left-0'}
                  ${shouldOpenUp ? 'bottom-full mb-1' : 'top-full mt-1'}
                `}
              >
                {SUPPORTED_EXCHANGES.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => {
                      setSelectedExchange(ex);
                      setExchangeDropdownOpen(false);
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
            );
          })()}
        </div>

        {hasApiKey(selectedExchange) ? (
          <div className="flex items-center gap-1.5 flex-wrap shrink-0">
            <button
              onClick={syncFromExchange}
              disabled={syncing}
              className="h-7 px-2.5 sm:px-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs hover:bg-emerald-500/30 transition-colors flex items-center gap-1 disabled:opacity-50 cursor-pointer whitespace-nowrap"
            >
              <RefreshCw className={`w-3 h-3 ${syncing ? "animate-spin" : ""}`} />
              <span className="hidden xs:inline">{syncing ? "Syncing..." : "Sync"}</span>
            </button>
            <button
              onClick={() => {
                if (!session) {
                  setShowAuthModal(true);
                  return;
                }
                setApiKeyForm({ ...apiKeyForm, exchange: selectedExchange });
                setShowApiKeyModal(true);
              }}
              className="h-7 px-2 bg-white/5 border border-white/10 text-white/60 rounded-lg text-xs hover:bg-white/10 transition-colors cursor-pointer"
              title="Change API Key"
            >
              <Key className="w-3 h-3" />
            </button>
            <button
              onClick={() => deleteExchangeKey(selectedExchange)}
              className="h-7 px-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/20 transition-colors cursor-pointer"
              title="Delete API Key"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              if (!session) {
                setShowAuthModal(true);
                return;
              }
              setApiKeyForm({ ...apiKeyForm, exchange: selectedExchange });
              setShowApiKeyModal(true);
            }}
            className="h-7 px-2.5 sm:px-3 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg text-xs hover:bg-blue-500/30 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Key className="w-3 h-3" />
            <span>Connect</span>
          </button>
        )}
      </div>

      {syncError && (
        <div className="mx-2 sm:mx-3 mb-2 p-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-[10px] flex items-center gap-2 flex-shrink-0">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span className="break-words">{syncError}</span>
        </div>
      )}

      {lastSync && (
        <div className="px-2 sm:px-3 mb-2 text-white/40 text-[10px] flex-shrink-0">
          Last sync: {lastSync.toLocaleTimeString()}
        </div>
      )}

      <div
        ref={contentRef}
        className="
          flex-1 min-h-0 px-2 sm:px-3 pb-2 sm:pb-3
          overflow-y-auto

          [&::-webkit-scrollbar]:w-1.5 sm:[&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-teal-400/40
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb:hover]:bg-teal-400/70

          scrollbar-thin
          scrollbar-thumb-teal-400/40
          scrollbar-track-transparent
        "
      >
        {positions.length === 0 && (
          <div className="space-y-2 mb-4">
            <input
              type="text"
              placeholder="Symbol (e.g. BTCUSDT)"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-blue-500/50 transition-colors"
            />

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSide("long")}
                className={`py-2 rounded-lg text-xs transition font-semibold cursor-pointer ${
                  side === "long"
                    ? "bg-emerald-500 text-white"
                    : "bg-white/5 text-white/50 hover:bg-white/10"
                }`}
              >
                Long
              </button>
              <button
                onClick={() => setSide("short")}
                className={`py-2 rounded-lg text-xs transition font-semibold cursor-pointer ${
                  side === "short"
                    ? "bg-red-500 text-white"
                    : "bg-white/5 text-white/50 hover:bg-white/10"
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
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-blue-500/50 transition-colors"
            />

            <input
              type="number"
              placeholder="Size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-blue-500/50 transition-colors"
            />

            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <label className="text-white/50 text-[10px] font-medium whitespace-nowrap">Leverage</label>
                <input
                  type="number"
                  min="1"
                  max="125"
                  value={leverageInput}
                  onChange={(e) => handleLeverageInputChange(e.target.value)}
                  onBlur={handleLeverageInputBlur}
                  className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white text-xs outline-none text-right focus:border-blue-500/50 transition-colors shrink-0"
                />
              </div>
              <input
                type="range"
                min="1"
                max="125"
                value={leverage}
                onChange={(e) => handleLeverageSliderChange(parseInt(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            <button
              onClick={addManualPosition}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition text-xs font-semibold cursor-pointer"
            >
              Add Position
            </button>

            <div className="text-center text-white/40 text-xs py-4">
              No futures positions. Sync from exchange or add manually.
            </div>
          </div>
        )}

        {positions.length > 0 && (
          <>
            {/* Total Net PnL Summary */}
            {(() => {
              const totalNetPnL = positions.reduce((sum, pos) => {
                const currentPrice = localPrices[pos.symbol] || pos.markPrice || pos.entryPrice;
                const pnl =
                  pos.side === "long"
                    ? (currentPrice - pos.entryPrice) * pos.size
                    : (pos.entryPrice - currentPrice) * pos.size;
                return sum + pnl;
              }, 0);

              const totalValue = positions.reduce((sum, pos) => {
                return sum + pos.entryPrice * pos.size;
              }, 0);

              const totalPnlPercent = totalValue > 0 ? (totalNetPnL / totalValue) * 100 : 0;
              const isProfit = totalNetPnL >= 0;

              return (
                <div className="mb-3 p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] text-white/50">Float PnL</span>
                    <span className={`text-sm font-bold ${isProfit ? "text-emerald-400" : "text-red-400"}`}>
                      {isProfit ? "+" : ""}${totalNetPnL.toFixed(2)} ({isProfit ? "+" : ""}{totalPnlPercent.toFixed(2)}%)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-white/50">Realized PnL</span>
                    <span className={`text-sm font-bold ${realizedPnl === null ? "text-white/30" : realizedPnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {realizedPnl === null
                        ? (loadingRealized ? "..." : "—")
                        : `${realizedPnl >= 0 ? "+" : ""}$${realizedPnl.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="text-[9px] text-white/40 mt-1.5 truncate">
                    {positions.length} position{positions.length > 1 ? "s" : ""} • ${totalValue.toFixed(2)} total value
                  </div>
                </div>
              );
            })()}

            <div className="space-y-2">
              {positions.map((pos) => {
                const currentPrice = localPrices[pos.symbol] || pos.markPrice || pos.entryPrice;
                const pnl =
                  pos.side === "long"
                    ? (currentPrice - pos.entryPrice) * pos.size
                    : (pos.entryPrice - currentPrice) * pos.size;

                const pnlPercent = (pnl / (pos.entryPrice * pos.size)) * 100 * pos.leverage;
                const isProfit = pnl >= 0;

                const fundingRate = fundingRates[pos.symbol];
                const fundingCost = fundingRate
                  ? pos.entryPrice * pos.size * (fundingRate.fundingRate / 100)
                  : null;

                return (
                  <div
                    key={pos.id}
                    className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/8 transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 mb-1">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {pos.side === "long" ? (
                          <TrendingUp className="w-3 h-3 text-emerald-400 shrink-0" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-400 shrink-0" />
                        )}
                        <span className="text-sm font-semibold text-white truncate">
                          {pos.symbol.replace("USDT", "")}
                        </span>
                        <span className="text-[10px] text-white/40 whitespace-nowrap shrink-0">
                          {pos.leverage}x
                        </span>
                      </div>

                      <button
                        onClick={() => removePosition(pos.id)}
                        className="text-white/40 hover:text-red-400 transition-colors shrink-0 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-[11px] space-y-0.5">
                      <div className="flex justify-between text-white/50">
                        <span>Entry</span>
                        <span className="truncate ml-2">${pos.entryPrice.toLocaleString('en-US')}</span>
                      </div>

                      <div className="flex justify-between text-white/50">
                        <span>Current</span>
                        <span className="truncate ml-2">${currentPrice.toLocaleString('en-US')}</span>
                      </div>

                      <div className="flex justify-between text-white/50">
                        <span>Size</span>
                        <span className="truncate ml-2">{pos.size}</span>
                      </div>

                      {fundingRate && (
                        <div className="flex justify-between items-center text-white/50 pt-1 border-t border-white/10">
                          <div className="flex items-center gap-1">
                            <span>Funding</span>
                            <button
                              onClick={() => refreshFundingRate(pos.symbol)}
                              className="text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                            >
                              <RefreshCw className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="text-right min-w-0">
                            <div
                              className={`truncate ${
                                fundingRate.fundingRate >= 0
                                  ? "text-red-400"
                                  : "text-emerald-400"
                              }`}
                            >
                              {fundingRate.fundingRate >= 0 ? "+" : ""}
                              {fundingRate.fundingRate.toFixed(4)}%
                            </div>
                            {fundingCost !== null && (
                              <div className="text-[9px] text-white/30 truncate">
                                ~${Math.abs(fundingCost).toFixed(2)}/8h
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {loadingFunding && !fundingRate && (
                        <div className="flex justify-between text-white/30 text-[10px] pt-1 border-t border-white/10">
                          <span>Funding</span>
                          <span>Loading...</span>
                        </div>
                      )}

                      <div className="flex justify-between font-semibold pt-1 border-t border-white/10">
                        <span className="text-white/70">PnL</span>
                        <span className={`truncate ml-2 ${isProfit ? "text-emerald-400" : "text-red-400"}`}>
                          {isProfit ? "+" : ""}${pnl.toFixed(2)} ({isProfit ? "+" : ""}
                          {pnlPercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* API Key Modal - FULL SCREEN */}
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
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 px-3 py-2 border-b border-white/10 bg-white/5 flex-shrink-0">
            <span className="text-white font-semibold text-[11px] sm:text-xs flex items-center gap-1.5 break-words min-w-0">
              <Key className="w-3.5 h-3.5 shrink-0" />
              <span className="break-words">Connect Futures API</span>
            </span>
            <button
              onClick={() => setShowApiKeyModal(false)}
              className="text-white/50 hover:text-white leading-none cursor-pointer transition-colors text-xl ml-auto shrink-0"
            >
              ×
            </button>
          </div>

          <div className="flex-shrink-0 p-2.5 bg-yellow-500/10 border border-yellow-500/30 rounded-none text-yellow-400 text-[10px] break-words">
<AlertTriangle className="w-3 h-3 inline mr-1 shrink-0" /> Only use READ-ONLY API keys! Enable Futures permissions in your exchange API settings.
          </div>

          <div
            className="
              flex-1 min-h-0 overflow-y-auto p-3
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
                    onClick={() => setExchangeModalDropdownOpen((v) => !v)}
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
                    <span className={`text-white/50 transition-transform ${exchangeModalDropdownOpen ? "rotate-180" : ""}`}>
                      ▾
                    </span>
                  </button>

                  {exchangeModalDropdownOpen && (
                    <div
                      onWheel={(e) => e.stopPropagation()}
                      className="
                      absolute z-50 mt-1 w-full
                      bg-[#0a0e1a]
                        border border-white/10
                        rounded-md
                        overflow-hidden
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
                            setExchangeModalDropdownOpen(false);
                          }}
                          className="
                            w-full px-3 py-2
                            text-left text-xs
                            cursor-pointer
                            bg-transparent
                            text-white
                            transition-colors
                          hover:bg-emerald-500/10
                          hover:text-emerald-400
                          "
                        >
                          {ex.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-white/50 mb-1.5 text-[10px] font-medium">API Key</label>
                <input
                  type="password"
                  value={apiKeyForm.apiKey}
                  onChange={(e) => setApiKeyForm({ ...apiKeyForm, apiKey: e.target.value })}
                  placeholder="Enter your API key"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-white/50 mb-1.5 text-[10px] font-medium">API Secret</label>
                <input
                  type="password"
                  value={apiKeyForm.apiSecret}
                  onChange={(e) => setApiKeyForm({ ...apiKeyForm, apiSecret: e.target.value })}
                  placeholder="Enter your API secret"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>

              {apiKeyForm.exchange === "okx" && (
                <div>
                  <label className="block text-white/50 mb-1.5 text-[10px] font-medium">Passphrase</label>
                  <input
                    type="password"
                    value={apiKeyForm.passphrase}
                    onChange={(e) => setApiKeyForm({ ...apiKeyForm, passphrase: e.target.value })}
                    placeholder="Enter your passphrase"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
              )}

              <div>
                <label className="block text-white/50 mb-1.5 text-[10px] font-medium">Label (Optional)</label>
                <input
                  type="text"
                  value={apiKeyForm.label}
                  onChange={(e) => setApiKeyForm({ ...apiKeyForm, label: e.target.value })}
                  placeholder="e.g., Futures Account"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="p-3 border-t border-white/10 flex-shrink-0">
            <button
              onClick={saveApiKey}
              disabled={savingKey}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 rounded-lg font-semibold text-xs cursor-pointer transition-colors flex items-center justify-center gap-2"
            >
              <Link2 className="w-3.5 h-3.5" />
              {savingKey ? "Connecting..." : "Connect & Save"}
            </button>
          </div>
        </div>
      )}

      <AuthModal
        open={showAuthModal}
        mode={authMode}
        onClose={() => setShowAuthModal(false)}
        onChange={setAuthMode}
      />
    </div>
  );
}