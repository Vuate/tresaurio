"use client";

import React, { useEffect, useState } from "react";

type TickerItem = {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
};

type ProxyResponse<T> =
  | { success: true; data: T }
  | { success: false; error?: string };

type KlineRow = [
  number, // openTime
  string, // open
  string, // high
  string, // low
  string, // close (index 4)
  string, // volume
  number, // closeTime
  string, // quoteAssetVolume
  number, // numberOfTrades
  string, // takerBuyBaseAssetVolume
  string, // takerBuyQuoteAssetVolume
  string, // ignore
];

function TrendLine({ data }: { data?: number[] }) {
  if (!data || data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);

  const denomX = data.length - 1;
  const denomY = max - min || 1;

  const points = data
    .map((v, i) => {
      const x = (i / denomX) * 120;
      const y = 30 - ((v - min) / denomY) * 30;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width="80" height="24" className="w-[120px] h-[32px]">
      <polyline
        points={points}
        fill="none"
        stroke="#2effb9"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const SYMBOLS = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT"] as const;

export default function HomeLivePrices() {
  const [prices, setPrices] = useState<TickerItem[]>([]);
  const [trendData, setTrendData] = useState<Record<string, number[]>>({});
  const [loading, setLoading] = useState(true);

  // ✅ Ticker: proxy route üzerinden (CORS yok)
  useEffect(() => {
    let alive = true;

    async function loadTicker() {
      try {
        const qs = SYMBOLS.join(",");
        const res = await fetch(
          `/api/v2/binance/ticker?symbols=${encodeURIComponent(qs)}`,
          { cache: "no-store" },
        );

        const json = (await res.json()) as ProxyResponse<TickerItem[]>;

        if (!json.success) {
          console.error(json.error);
          return;
        }

        const all = Array.isArray(json.data) ? json.data : [];
        const filtered = all.filter((i) =>
          (SYMBOLS as readonly string[]).includes(i.symbol),
        );

        if (alive) {
          setPrices(filtered);
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
      }
    }

    loadTicker();
    const int = setInterval(loadTicker, 5000);

    return () => {
      alive = false;
      clearInterval(int);
    };
  }, []);

  // ✅ Klines (sparkline trend): proxy route üzerinden (CORS yok)
  useEffect(() => {
    let alive = true;

    async function loadTrends() {
      const trend: Record<string, number[]> = {};

      for (const s of SYMBOLS) {
        try {
          const r = await fetch(
            `/api/v2/binance/klines?symbol=${encodeURIComponent(
              s,
            )}&interval=1m&limit=30`,
            { cache: "no-store" },
          );

          const j = (await r.json()) as ProxyResponse<KlineRow[]>;

          if (!j.success) {
            console.error(j.error);
            trend[s] = [];
            continue;
          }

          const rows = j.data;

          trend[s] = (Array.isArray(rows) ? rows : [])
            .map((c) => Number(c[4])) // close
            .filter((n) => Number.isFinite(n));
        } catch (err) {
          console.log("Trend fetch error:", err);
          trend[s] = [];
        }
      }

      if (alive) setTrendData(trend);
    }

    loadTrends();
    const int = setInterval(loadTrends, 5000);

    return () => {
      alive = false;
      clearInterval(int);
    };
  }, []);

  if (loading) return <div className="text-gray-400">Loading...</div>;

  return (
    <div className="w-full">
      <div className="divide-y divide-white/10 border border-white/10 rounded-xl overflow-hidden">
        {prices.map((p) => {
          const name = p.symbol.replace("USDT", "");
          const percent = Number(p.priceChangePercent);

          return (
            <div
              key={p.symbol}
              className="grid grid-cols-[140px_1fr_140px_90px] items-center px-4 py-3"
            >
              <div className="text-white font-semibold">{name}</div>

              <div className="flex justify-start">
                <TrendLine data={trendData[p.symbol]} />
              </div>

              <div className="text-right text-white font-semibold">
                ${Number(p.lastPrice).toLocaleString()}
              </div>

              <div
                className={`text-right font-semibold ${
                  percent >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {percent >= 0 ? "+" : ""}
                {Number.isFinite(percent) ? percent.toFixed(2) : "0.00"}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
