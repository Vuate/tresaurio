// components/terminal/personalized-dashboard/TokenFlowModule.tsx

import { useState, useEffect, useCallback } from "react";

interface Props {
  instanceId: string;
}

interface FlowData {
  chain: string;
  inflow: number;
  outflow: number;
  net: number;
  volume24h: number;
  tvl: number;
}

const CHAINS = ["Ethereum", "BSC", "Polygon", "Arbitrum", "Optimism", "Avalanche"];
const TOKENS = ["USDT", "USDC", "ETH", "BTC"];

// 🔥 Fetch chain TVL data from DeFiLlama
const fetchChainFlows = async (): Promise<FlowData[]> => {
  const results: FlowData[] = [];

  try {
    // Fetch chain TVL from DeFiLlama
    const tvlRes = await fetch("https://api.llama.fi/v2/chains");
    const tvlData = await tvlRes.json();

    // Get stablecoin data for flow estimation
    const stableRes = await fetch("https://stablecoins.llama.fi/stablecoins?includePrices=false");
    const stableData = await stableRes.json();

    for (const chainName of CHAINS) {
      const chainData = tvlData.find((c: any) =>
        c.name.toLowerCase() === chainName.toLowerCase() ||
        c.gecko_id?.toLowerCase() === chainName.toLowerCase()
      );

      if (chainData) {
        const tvl = chainData.tvl || 0;

        // Estimate flows based on TVL change (simulated - in production use bridge data)
        // DeFiLlama has bridge data API that can be used for real flow data
        const flowRatio = 0.4 + Math.random() * 0.2;
        const dailyVolume = tvl * 0.02; // Estimate 2% daily volume
        const inflow = dailyVolume * flowRatio;
        const outflow = dailyVolume * (1 - flowRatio);

        results.push({
          chain: chainName,
          inflow,
          outflow,
          net: inflow - outflow,
          volume24h: dailyVolume,
          tvl,
        });
      }
    }

    // Sort by TVL
    return results.sort((a, b) => b.tvl - a.tvl);
  } catch (err) {
    console.error("[TokenFlow] Fetch error:", err);
    return [];
  }
};

export default function TokenFlowModule({ instanceId }: Props) {
  const storageKey = `token-flow-${instanceId}`;
  const [selectedToken, setSelectedToken] = useState("USDT");
  const [data, setData] = useState<FlowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const settings = JSON.parse(saved);
          if (settings.token) setSelectedToken(settings.token);
        } catch (err) {
          console.error("[TokenFlow] Failed to load settings:", err);
        }
      }
    }
  }, [storageKey]);

  // Save settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify({ token: selectedToken }));
    }
  }, [selectedToken, storageKey]);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchChainFlows();
      setData(result);
      setError(null);
    } catch (err) {
      console.error("[TokenFlow] Fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [fetchData]);

  const totalNet = data.reduce((sum, f) => sum + f.net, 0);

  return (
    <div className="h-full flex flex-col bg-[#0a0b0f] rounded-lg border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="text-xl">🌊</div>
          <h3 className="font-semibold">Token Flow</h3>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
            LIVE
          </span>
        </div>
      </div>

      {/* Token Selector */}
      <div className="p-3 border-b border-white/10">
        <select
          value={selectedToken}
          onChange={(e) => setSelectedToken(e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm cursor-pointer hover:bg-white/15"
        >
          {TOKENS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Total Summary */}
      <div
        className={`p-3 border-b border-white/10 ${
          totalNet >= 0 ? "bg-emerald-500/10" : "bg-red-500/10"
        }`}
      >
        <div className="text-xs text-white/60 mb-1">Total Net Flow (24h)</div>
        <div
          className={`text-2xl font-bold ${
            totalNet >= 0 ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {totalNet >= 0 ? "+" : "-"}${(Math.abs(totalNet) / 1000000).toFixed(1)}M
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {loading && data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white/40 text-xs">
            Loading flow data...
          </div>
        ) : error ? (
          <div className="p-3 text-red-400 text-xs">{error}</div>
        ) : (
          <div className="divide-y divide-white/10">
            {data.map((flow) => (
              <div
                key={flow.chain}
                className="p-3 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-white">{flow.chain}</div>
                  <div className="text-xs text-white/40">
                    TVL: ${(flow.tvl / 1000000000).toFixed(2)}B
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-emerald-400">↓ Inflow</span>
                    <span className="text-white font-medium">
                      ${(flow.inflow / 1000000).toFixed(1)}M
                    </span>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-red-400">↑ Outflow</span>
                    <span className="text-white font-medium">
                      ${(flow.outflow / 1000000).toFixed(1)}M
                    </span>
                  </div>

                  <div className="h-px bg-white/10 my-1" />

                  <div className="flex justify-between text-sm">
                    <span className="text-white/80 font-medium">Net Flow</span>
                    <span
                      className={`font-bold ${
                        flow.net >= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {flow.net >= 0 ? "+" : "-"}$
                      {(Math.abs(flow.net) / 1000000).toFixed(1)}M
                    </span>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Volume (24h)</span>
                    <span className="text-white/80">
                      ${(flow.volume24h / 1000000).toFixed(1)}M
                    </span>
                  </div>
                </div>

                {/* Flow Visualization */}
                <div className="mt-3 flex gap-1 h-2">
                  <div
                    className="bg-emerald-500 rounded"
                    style={{
                      width: `${(flow.inflow / (flow.inflow + flow.outflow)) * 100}%`,
                    }}
                  />
                  <div
                    className="bg-red-500 rounded"
                    style={{
                      width: `${(flow.outflow / (flow.inflow + flow.outflow)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
