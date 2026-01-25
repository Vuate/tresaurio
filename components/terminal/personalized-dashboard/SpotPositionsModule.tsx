// components/terminal/personalized-dashboard/SpotPositionsModule.tsx
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Plus, Trash2, RefreshCw, Key, Link2, AlertCircle } from "lucide-react";
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

const EXCHANGE_FORMATS: Record<
  string,
  (base: string, quote: string) => string
> = {
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

export default function SpotPositionsModule({ instanceId }: Props) {
  const { spotPositions, addSpotPosition, removeSpotPosition } =
    usePortfolioStore();
  const prices = usePriceStore((s) => s.prices);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKeyInfo[]>([]);
  const [selectedExchange, setSelectedExchange] = useState<string>("binance");
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);

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

  const syncFromExchange = async () => {
    if (!hasApiKey(selectedExchange)) {
      setSyncError("No API key configured for this exchange");
      return;
    }

    setSyncing(true);
    setSyncError(null);

    try {
      const response = await fetch(
        `/api/exchange/account?exchange=${selectedExchange}`
      );
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch balances");
      }

      const balances: SpotBalance[] = data.data;

      // Get current prices for USD value calculation
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
      const priceMap = Object.fromEntries(
        pricesData.map((p) => [p.asset, p.price])
      );

      // Add positions from balances
      balances
        .filter((b) => b.total > 0 && b.asset !== "USDT" && b.asset !== "USDC")
        .forEach((balance) => {
          const price = priceMap[balance.asset] || 0;
          const existingPosition = spotPositions.find(
            (p) =>
              p.exchange === selectedExchange &&
              p.baseAsset === balance.asset
          );

          if (!existingPosition && price > 0) {
            addSpotPosition({
              exchange: selectedExchange,
              baseAsset: balance.asset,
              quoteAsset: "USDT",
              pair: `${balance.asset}/USDT`,
              formattedPair: EXCHANGE_FORMATS[selectedExchange]?.(
                balance.asset,
                "USDT"
              ) || `${balance.asset}USDT`,
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
          <button
            onClick={syncFromExchange}
            disabled={syncing}
            className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded text-xs hover:bg-emerald-500/30 transition-colors flex items-center gap-1 disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing..." : "Sync"}
          </button>
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

      {/* Portfolio Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 border border-white/10 rounded p-3">
          <div className="text-white/40 text-[10px] mb-1">Total Investment</div>
          <div className="text-white font-semibold">
            ${portfolio.totalInvestment.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded p-3">
          <div className="text-white/40 text-[10px] mb-1">Current Value</div>
          <div className="text-white font-semibold">
            ${portfolio.currentValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded p-3">
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
        <div className="bg-white/5 border border-white/10 rounded p-3">
          <div className="text-white/40 text-[10px] mb-1">P&L %</div>
          <div
            className={`font-semibold ${
              portfolio.totalPnLPercent >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {portfolio.totalPnLPercent >= 0 ? "+" : ""}
            {portfolio.totalPnLPercent.toFixed(2)}%
          </div>
        </div>
      </div>

      {!showAddModal && !showApiKeyModal && (
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full bg-white/5 border border-white/10 py-2.5 rounded-lg mt-3 mb-4 hover:bg-white/15 text-white transition-colors flex items-center justify-center gap-2 font-semibold select-none"
        >
          <Plus className="w-4 h-4" />
          Add Position Manually
        </button>
      )}

      {!showAddModal && !showApiKeyModal && (
        <div className="flex-1 overflow-y-auto space-y-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-teal-400/40 [&::-webkit-scrollbar-thumb]:rounded-full">
          {spotPositions.length === 0 ? (
            <div className="text-center py-8 text-white/40 text-[10px]">
              No positions yet. Sync from exchange or add manually.
            </div>
          ) : (
            spotPositions.map((position) => {
              const { currentValue, pnl, pnlPercent, currentPrice, priceChange } =
                calculatePnL(position);
              return (
                <div
                  key={position.id}
                  className="bg-white/5 border border-white/10 rounded p-4 space-y-3 hover:bg-white/8 transition-colors"
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
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[10px]">
                    <Row label="Entry Price">${position.entryPrice.toLocaleString()}</Row>
                    <Row label="Current Price">
                      <span className="flex items-center gap-1">
                        ${currentPrice.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 6,
                        })}
                        {priceChange !== 0 && (
                          <span className={`text-[8px] ${priceChange > 0 ? "text-emerald-400" : "text-red-400"}`}>
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
                      ${position.totalCost.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Row>
                    <Row label="Current Value">
                      ${currentValue.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Row>
                    <Row label="P&L">
                      <span className={pnl >= 0 ? "text-emerald-400" : "text-red-400"}>
                        {pnl >= 0 ? "+" : ""}${Math.abs(pnl).toFixed(2)} (
                        {pnlPercent >= 0 ? "+" : ""}{pnlPercent.toFixed(2)}%)
                      </span>
                    </Row>
                  </div>

                  <div className="text-white/30 text-[9px] pt-2 border-t border-white/5">
                    Entry: {new Date(position.entryDate).toLocaleDateString()}
                  </div>

                  {position.notes && (
                    <div className="text-white/40 text-[9px] pt-2 border-t border-white/5">
                      📝 {position.notes}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Add Position Modal */}
      {showAddModal && (
        <div className="absolute inset-[-16px] bg-[#0a0e1a] z-50 flex flex-col">
          <div className="flex justify-between items-center p-3 border-b border-white/10 bg-white/5">
            <h3 className="text-white font-semibold text-sm">Add Spot Position</h3>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-white/50 hover:text-white text-xl leading-none"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            <div>
              <label className="block text-white/50 mb-1 text-[10px]">Exchange</label>
              <select
                value={formData.exchange}
                onChange={(e) => setFormData({ ...formData, exchange: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs"
              >
                <option value="">Select Exchange</option>
                {ALL_EXCHANGES.map((ex) => (
                  <option key={ex} value={ex}>{ex.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white/50 mb-1 text-[10px]">Base Asset</label>
                <input
                  type="text"
                  value={formData.baseAsset}
                  onChange={(e) => setFormData({ ...formData, baseAsset: e.target.value.toUpperCase() })}
                  placeholder="BTC"
                  className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-white/50 mb-1 text-[10px]">Quote Asset</label>
                <input
                  type="text"
                  value={formData.quoteAsset}
                  onChange={(e) => setFormData({ ...formData, quoteAsset: e.target.value.toUpperCase() })}
                  placeholder="USDT"
                  className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white/50 mb-1 text-[10px]">Entry Price</label>
                <input
                  type="number"
                  value={formData.entryPrice}
                  onChange={(e) => setFormData({ ...formData, entryPrice: e.target.value })}
                  placeholder="0.00"
                  className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-white/50 mb-1 text-[10px]">Quantity</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="0.00"
                  className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/50 mb-1 text-[10px]">Total Cost</label>
              <div className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white/70 text-xs">
                ${totalCost}
              </div>
            </div>

            <div>
              <label className="block text-white/50 mb-1 text-[10px]">Entry Date</label>
              <input
                type="date"
                value={formData.entryDate}
                onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-white/50 mb-1 text-[10px]">Notes (Optional)</label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="absolute inset-[-16px] bg-[#0a0e1a] z-50 flex flex-col">
          <div className="flex justify-between items-center p-3 border-b border-white/10 bg-white/5">
            <h3 className="text-white font-semibold text-sm flex items-center gap-2">
              <Key className="w-4 h-4" />
              Connect Exchange API
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
              ⚠️ Only use READ-ONLY API keys! Never share keys with withdrawal permissions.
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

            {(apiKeyForm.exchange === "okx" || apiKeyForm.exchange === "coinbase") && (
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
                placeholder="e.g., Main Account"
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

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between select-none">
      <span className="text-white/50">{label}</span>
      <span>{children}</span>
    </div>
  );
}
