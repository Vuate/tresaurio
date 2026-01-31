// components/terminal/personalized-dashboard/FuturesPositionsModule.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useFuturesPositionStore } from "@/store/futuresPositionStore";
import { TrendingUp, TrendingDown, X, RefreshCw, Key, Link2, AlertCircle, Trash2 } from "lucide-react";
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

const SUPPORTED_EXCHANGES = ["binance", "okx", "bybit"];

export default function FuturesPositionsModule({ instanceId }: Props) {
  const storageKey = `futures-positions-${instanceId}`;

  const positions = useFuturesPositionStore((s) => s.positions);
  const removePosition = useFuturesPositionStore((s) => s.removePosition);
  const addPosition = useFuturesPositionStore((s) => s.addPosition);
  const prices = usePriceStore((s) => s.prices);

  // API Key states
  const [apiKeys, setApiKeys] = useState<ApiKeyInfo[]>([]);
  const [selectedExchange, setSelectedExchange] = useState<string>("binance");
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

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

  // Fetch API keys on mount
  useEffect(() => {
    fetchApiKeys();
  }, []);

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
          // Bybit API: BTCUSDT -> BTCUSDT
          url = `https://api.bybit.com/v5/market/tickers?category=linear&symbol=${symbol}`;
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            if (data.result?.list?.[0]?.lastPrice) {
              return parseFloat(data.result.list[0].lastPrice);
            }
          }
        } else if (exchange === "okx") {
          // OKX API: BTCUSDT -> BTC-USDT-SWAP
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

      for (const symbol of symbols) {
        // Seçili borsadan fiyat çek
        const price = await fetchPriceFromExchange(symbol, selectedExchange);
        if (price) {
          usePriceStore.getState().updatePrice(symbol, price);
        }
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

      // Add positions from API
      apiPositions.forEach((pos) => {
        const existingPosition = positions.find(
          (p) => p.symbol === pos.symbol && p.side === pos.side
        );

        if (!existingPosition) {
          addPosition({
            symbol: pos.symbol,
            side: pos.side,
            entryPrice: pos.entryPrice,
            size: pos.size,
            leverage: pos.leverage,
          });
        }
      });

      setLastSync(new Date());
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
    if (!apiKeyForm.apiKey || !apiKeyForm.apiSecret) {
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
          apiSecret: apiKeyForm.apiSecret,
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
    <div className="relative h-full flex flex-col text-xs">
      {/* Exchange Sync Section */}
      <div className="flex items-center gap-2 mb-3">
        <select
          value={selectedExchange}
          onChange={(e) => setSelectedExchange(e.target.value)}
          className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs"
        >
          {SUPPORTED_EXCHANGES.map((ex) => (
            <option key={ex} value={ex}>
              {ex.toUpperCase()} {hasApiKey(ex) ? "✓" : ""}
            </option>
          ))}
        </select>

        {hasApiKey(selectedExchange) ? (
          <div className="flex items-center gap-1">
            <button
              onClick={syncFromExchange}
              disabled={syncing}
              className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded text-xs hover:bg-emerald-500/30 transition-colors flex items-center gap-1 disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing..." : "Sync"}
            </button>
            <button
              onClick={() => {
                setApiKeyForm({ ...apiKeyForm, exchange: selectedExchange });
                setShowApiKeyModal(true);
              }}
              className="px-2 py-1.5 bg-white/5 border border-white/10 text-white/60 rounded text-xs hover:bg-white/10 transition-colors"
              title="Change API Key"
            >
              <Key className="w-3 h-3" />
            </button>
            <button
              onClick={() => deleteExchangeKey(selectedExchange)}
              className="px-2 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/20 transition-colors"
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
            className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded text-xs hover:bg-blue-500/30 transition-colors flex items-center gap-1"
          >
            <Key className="w-3 h-3" />
            Connect
          </button>
        )}
      </div>

      {syncError && (
        <div className="mb-3 p-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-[10px] flex items-center gap-2">
          <AlertCircle className="w-3 h-3" />
          {syncError}
        </div>
      )}

      {lastSync && (
        <div className="mb-3 text-white/40 text-[10px]">
          Last sync: {lastSync.toLocaleTimeString()}
        </div>
      )}

      {/* Add Position Form (when no positions) */}
      {positions.length === 0 && !showApiKeyModal && (
        <div className="space-y-2 mb-4">
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
              onChange={(e) => handleLeverageSliderChange(parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          <button
            onClick={addManualPosition}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition text-xs font-semibold"
          >
            Add Position
          </button>

          <div className="text-center text-white/40 text-[10px]">
            No futures positions. Sync from exchange or add manually.
          </div>
        </div>
      )}

      {/* Positions List */}
      {positions.length > 0 && !showApiKeyModal && (
        <>
          {/* Total Net PnL Summary */}
          {(() => {
            const totalNetPnL = positions.reduce((sum, pos) => {
              const currentPrice = prices[pos.symbol] || pos.entryPrice;
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
                <div className="text-[10px] text-white/50 mb-1">Total Net PnL</div>
                <div className="flex items-baseline justify-between">
                  <div className={`text-xl font-bold ${isProfit ? "text-emerald-400" : "text-red-400"}`}>
                    {isProfit ? "+" : ""}${totalNetPnL.toFixed(2)}
                  </div>
                  <div className={`text-sm font-semibold ${isProfit ? "text-emerald-400" : "text-red-400"}`}>
                    {isProfit ? "+" : ""}{totalPnlPercent.toFixed(2)}%
                  </div>
                </div>
                <div className="text-[9px] text-white/40 mt-1">
                  {positions.length} position{positions.length > 1 ? "s" : ""} • ${totalValue.toFixed(2)} total value
                </div>
              </div>
            );
          })()}

        <div className="flex-1 overflow-y-auto space-y-2">
          {positions.map((pos) => {
            const currentPrice = prices[pos.symbol] || pos.entryPrice;
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

                  {fundingRate && (
                    <div className="flex justify-between items-center text-white/50 pt-1 border-t border-white/10">
                      <div className="flex items-center gap-1">
                        <span>Funding</span>
                        <button
                          onClick={() => refreshFundingRate(pos.symbol)}
                          className="text-white/30 hover:text-white/60 transition-colors"
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
                      <span>Funding</span>
                      <span>Loading...</span>
                    </div>
                  )}

                  <div className="flex justify-between font-semibold pt-1 border-t border-white/10">
                    <span className="text-white/70">PnL</span>
                    <span className={isProfit ? "text-emerald-400" : "text-red-400"}>
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

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="absolute inset-[-16px] bg-[#0a0e1a] z-50 flex flex-col">
          <div className="flex justify-between items-center p-3 border-b border-white/10 bg-white/5">
            <h3 className="text-white font-semibold text-sm flex items-center gap-2">
              <Key className="w-4 h-4" />
              Connect Futures API
            </h3>
            <button
              onClick={() => setShowApiKeyModal(false)}
              className="text-white/50 hover:text-white text-xl leading-none"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded text-yellow-400 text-[10px]">
              ⚠️ Only use READ-ONLY API keys! Enable Futures permissions in your exchange API settings.
            </div>

            <div>
              <label className="block text-white/50 mb-1 text-[10px]">Exchange</label>
              <select
                value={apiKeyForm.exchange}
                onChange={(e) => setApiKeyForm({ ...apiKeyForm, exchange: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs"
              >
                {SUPPORTED_EXCHANGES.map((ex) => (
                  <option key={ex} value={ex}>{ex.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/50 mb-1 text-[10px]">API Key</label>
              <input
                type="password"
                value={apiKeyForm.apiKey}
                onChange={(e) => setApiKeyForm({ ...apiKeyForm, apiKey: e.target.value })}
                placeholder="Enter your API key"
                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-white/50 mb-1 text-[10px]">API Secret</label>
              <input
                type="password"
                value={apiKeyForm.apiSecret}
                onChange={(e) => setApiKeyForm({ ...apiKeyForm, apiSecret: e.target.value })}
                placeholder="Enter your API secret"
                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs"
              />
            </div>

            {apiKeyForm.exchange === "okx" && (
              <div>
                <label className="block text-white/50 mb-1 text-[10px]">Passphrase</label>
                <input
                  type="password"
                  value={apiKeyForm.passphrase}
                  onChange={(e) => setApiKeyForm({ ...apiKeyForm, passphrase: e.target.value })}
                  placeholder="Enter your passphrase"
                  className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs"
                />
              </div>
            )}

            <div>
              <label className="block text-white/50 mb-1 text-[10px]">Label (Optional)</label>
              <input
                type="text"
                value={apiKeyForm.label}
                onChange={(e) => setApiKeyForm({ ...apiKeyForm, label: e.target.value })}
                placeholder="e.g., Futures Account"
                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs"
              />
            </div>
          </div>

          <div className="p-3 border-t border-white/10">
            <button
              onClick={saveApiKey}
              disabled={savingKey}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white py-2 rounded font-semibold text-xs flex items-center justify-center gap-2"
            >
              <Link2 className="w-4 h-4" />
              {savingKey ? "Connecting..." : "Connect & Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
