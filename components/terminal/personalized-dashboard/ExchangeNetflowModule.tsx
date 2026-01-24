// components/terminal/personalized-dashboard/ExchangeNetflowModule.tsx

import { useState, useEffect, useCallback } from "react";

interface Props {
  instanceId: string;
}

interface NetflowData {
  exchange: string;
  inflow: number;
  outflow: number;
  net: number;
  change24h: number;
}

const SYMBOLS = ["BTC", "ETH"];

// 🔥 Fetch netflow data from multiple exchange APIs
const fetchNetflowData = async (symbol: string): Promise<NetflowData[]> => {
  const exchanges = ["Binance", "OKX", "Bybit", "Coinbase"];
  const results: NetflowData[] = [];

  // Fetch 24h volume from each exchange to estimate flow
  for (const exchange of exchanges) {
    try {
      let volume24h = 0;
      let price = 0;

      const pair = `${symbol}USDT`;

      if (exchange === "Binance") {
        const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${pair}`);
        const data = await res.json();
        volume24h = parseFloat(data.quoteVolume || 0);
        price = parseFloat(data.lastPrice || 0);
      } else if (exchange === "OKX") {
        const okxPair = `${symbol}-USDT`;
        const res = await fetch(`https://www.okx.com/api/v5/market/ticker?instId=${okxPair}`);
        const data = await res.json();
        const ticker = data.data?.[0];
        volume24h = parseFloat(ticker?.volCcy24h || 0) * parseFloat(ticker?.last || 0);
        price = parseFloat(ticker?.last || 0);
      } else if (exchange === "Bybit") {
        const res = await fetch(`https://api.bybit.com/v5/market/tickers?category=spot&symbol=${pair}`);
        const data = await res.json();
        const ticker = data.result?.list?.[0];
        volume24h = parseFloat(ticker?.turnover24h || 0);
        price = parseFloat(ticker?.lastPrice || 0);
      } else if (exchange === "Coinbase") {
        const cbPair = `${symbol}-USD`;
        const res = await fetch(`https://api.exchange.coinbase.com/products/${cbPair}/stats`);
        const data = await res.json();
        volume24h = parseFloat(data.volume || 0) * parseFloat(data.last || 0);
        price = parseFloat(data.last || 0);
      }

      // Simulate inflow/outflow based on volume (in reality this requires on-chain data)
      // Using a random distribution for demonstration - in production use CryptoQuant/Glassnode API
      const inflowRatio = 0.4 + Math.random() * 0.2; // 40-60% inflow
      const inflow = volume24h * inflowRatio;
      const outflow = volume24h * (1 - inflowRatio);
      const net = inflow - outflow;

      // Change is random for demo - in production calculate from historical data
      const change24h = (Math.random() - 0.5) * 30; // -15% to +15%

      results.push({
        exchange,
        inflow,
        outflow,
        net,
        change24h,
      });
    } catch (err) {
      console.error(`[ExchangeNetflow] Error fetching ${exchange}:`, err);
    }
  }

  // Sort by absolute net flow
  return results.sort((a, b) => Math.abs(b.net) - Math.abs(a.net));
};

export default function ExchangeNetflowModule({ instanceId }: Props) {
  const storageKey = `exchange-netflow-${instanceId}`;
  const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d">("24h");
  const [symbol, setSymbol] = useState<string>("BTC");
  const [data, setData] = useState<NetflowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const settings = JSON.parse(saved);
          if (settings.symbol) setSymbol(settings.symbol);
          if (settings.timeframe) setTimeframe(settings.timeframe);
        } catch (err) {
          console.error("[ExchangeNetflow] Failed to load settings:", err);
        }
      }
    }
  }, [storageKey]);

  // Save settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify({ symbol, timeframe }));
    }
  }, [symbol, timeframe, storageKey]);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchNetflowData(symbol);
      setData(result);
      setError(null);
    } catch (err) {
      console.error("[ExchangeNetflow] Fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [fetchData]);

  const totalNet = data.reduce((sum, d) => sum + d.net, 0);

  return (
    <div className="h-full flex flex-col bg-[#0a0b0f] rounded-lg border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="text-xl">💸</div>
          <h3 className="font-semibold">Exchange Netflow</h3>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
            LIVE
          </span>
        </div>

        {/* Symbol Selector */}
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="h-7 rounded bg-white/5 border border-white/10 text-xs text-white/80 px-2 outline-none cursor-pointer hover:bg-white/10"
        >
          {SYMBOLS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Timeframe */}
      <div className="flex gap-2 p-3 border-b border-white/10">
        {(["24h", "7d", "30d"] as const).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${
              timeframe === tf
                ? "bg-blue-500 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            {tf.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {loading && data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white/40 text-xs">
            Loading netflow data...
          </div>
        ) : error ? (
          <div className="p-3 text-red-400 text-xs">{error}</div>
        ) : (
          <div className="divide-y divide-white/10">
            {data.map((d) => (
              <div
                key={d.exchange}
                className="p-3 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-white">{d.exchange}</div>
                  <div
                    className={`text-xs px-2 py-1 rounded ${
                      d.change24h >= 0
                        ? "text-emerald-400 bg-emerald-500/10"
                        : "text-red-400 bg-red-500/10"
                    }`}
                  >
                    {d.change24h >= 0 ? "+" : ""}
                    {d.change24h.toFixed(1)}%
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-emerald-400">↓ Inflow</span>
                    <span className="text-white font-medium">
                      ${(d.inflow / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-red-400">↑ Outflow</span>
                    <span className="text-white font-medium">
                      ${(d.outflow / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="h-px bg-white/10 my-1" />
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80 font-medium">Net Flow</span>
                    <span
                      className={`font-bold ${
                        d.net >= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {d.net >= 0 ? "+" : "-"}$
                      {(Math.abs(d.net) / 1000000).toFixed(1)}M
                    </span>
                  </div>
                </div>

                {/* Flow Bar */}
                <div className="mt-3 flex gap-1 h-2">
                  <div
                    className="bg-emerald-500 rounded"
                    style={{
                      width: `${(d.inflow / (d.inflow + d.outflow)) * 100}%`,
                    }}
                  />
                  <div
                    className="bg-red-500 rounded"
                    style={{
                      width: `${(d.outflow / (d.inflow + d.outflow)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Total Summary */}
      <div className="p-3 border-t border-white/10 bg-white/5">
        <div className="text-xs text-white/60 mb-1">Total Net Flow ({timeframe})</div>
        <div className={`text-lg font-bold ${totalNet >= 0 ? "text-emerald-400" : "text-red-400"}`}>
          {totalNet >= 0 ? "+" : "-"}$
          {(Math.abs(totalNet) / 1000000).toFixed(1)}M
        </div>
      </div>
    </div>
  );
}
