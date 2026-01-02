"use client";

import { useEffect, useState } from "react";
import { usePriceStore } from "@/store/priceStore";

type Ticker = {
  symbol: string;
  price: string;
};

type PriceRow = {
  symbol: string;
  price: number;
};

const SYMBOLS = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT"];

export default function LivePricesModule() {
  const [prices, setPrices] = useState<PriceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔥 SADECE PRICE ENGINE'E YAZAR
  const setPricesToStore = usePriceStore((s) => s.setPrices);

  useEffect(() => {
    let mounted = true;

    const fetchPrices = async () => {
      try {
        const res = await fetch("https://api.binance.com/api/v3/ticker/price", {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch prices");

        const data: Ticker[] = await res.json();
        if (!mounted) return;

        const filtered: PriceRow[] = data
          .filter((t) => SYMBOLS.includes(t.symbol))
          .map((t) => ({
            symbol: t.symbol,
            price: Number(t.price),
          }))
          .filter((p) => Number.isFinite(p.price));

        // 🔹 UI için local state
        setPrices(filtered);
        setLoading(false);
        setError(null);

        // 🔹 GLOBAL PRICE ENGINE
        const priceMap: Record<string, number> = {};
        filtered.forEach((p) => {
          priceMap[p.symbol] = p.price;
        });

        setPricesToStore(priceMap);
      } catch (err) {
        console.error("LivePrices fetch error", err);
        if (!mounted) return;
        setError("Price feed unavailable");
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 3000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [setPricesToStore]);

  /* ---------------- UI STATES ---------------- */

  if (loading) {
    return <div className="text-white/50 text-sm">Loading live prices…</div>;
  }

  if (error) {
    return <div className="text-red-400 text-sm">{error}</div>;
  }

  /* ---------------- RENDER ---------------- */

  return (
    <div className="space-y-2">
      {prices.map((p) => (
        <div
          key={p.symbol}
          className="flex items-center justify-between
            px-3 py-2 rounded-lg
            bg-white/5 border border-white/10"
        >
          <div className="text-sm font-semibold text-white">
            {p.symbol.replace("USDT", "")}
          </div>

          <div className="font-mono text-sm text-teal-400">
            ${p.price.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
