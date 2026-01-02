"use client";

import { useEffect, useState } from "react";

type PriceState = {
  binance: number;
  kucoin: number;
  diff: number;
};

const MOCK_DATA: PriceState = {
  binance: 43210,
  kucoin: 43235,
  diff: ((43235 - 43210) / 43210) * 100,
};

export default function ExchangeComparisonModule() {
  const [data, setData] = useState<PriceState | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    const fetchPrices = async () => {
      try {
        setErr(null);

        const [binanceRes, kucoinRes] = await Promise.all([
          fetch("/api/markets/binance/price?symbol=BTCUSDT", {
            cache: "no-store",
          }),
          fetch("/api/markets/kucoin/price?symbol=BTC-USDT", {
            cache: "no-store",
          }),
        ]);

        if (!binanceRes.ok || !kucoinRes.ok) {
          throw new Error("UPSTREAM_ERROR");
        }

        const bText = await binanceRes.text();
        const kText = await kucoinRes.text();

        if (!bText || !kText) {
          throw new Error("EMPTY_BODY");
        }

        const b = JSON.parse(bText);
        const k = JSON.parse(kText);

        const binance = Number(b.price);
        const kucoin = Number(k.price);

        if (!Number.isFinite(binance) || !Number.isFinite(kucoin)) {
          throw new Error("INVALID_PRICE");
        }

        const diff = ((kucoin - binance) / binance) * 100;

        if (alive) setData({ binance, kucoin, diff });
      } catch (e) {
        console.warn("Exchange comparison fallback:", e);
        if (alive) {
          setData(MOCK_DATA); // 🔥 fallback
          setErr("Live data unavailable");
        }
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 6000);

    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, []);

  if (!data) {
    return <div className="text-xs text-white/40">Loading…</div>;
  }

  const isPositive = data.diff >= 0;

  return (
    <div className="space-y-2 text-xs">
      {err && <div className="text-[10px] text-yellow-400/80">{err}</div>}

      <div className="flex justify-between">
        <span className="text-white/50">Binance</span>
        <span className="font-semibold text-white">
          {data.binance.toLocaleString()}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-white/50">KuCoin</span>
        <span className="font-semibold text-white">
          {data.kucoin.toLocaleString()}
        </span>
      </div>

      <div className="pt-1 border-t border-white/10 flex justify-between">
        <span className="text-white/40">Difference</span>
        <span
          className={`font-semibold ${
            isPositive ? "text-green-400" : "text-red-400"
          }`}
        >
          {isPositive ? "+" : ""}
          {data.diff.toFixed(3)}%
        </span>
      </div>
    </div>
  );
}
