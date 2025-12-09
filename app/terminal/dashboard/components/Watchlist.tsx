"use client";

import { useEffect, useState } from "react";

export default function Watchlist() {
  const [coins, setCoins] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch("https://api.binance.com/api/v3/ticker/24hr");
      const data = await res.json();

      const list = data
        .filter((c: any) =>
          ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT"].includes(
            c.symbol
          )
        )
        .map((c: any) => ({
          symbol: c.symbol.replace("USDT", ""),
          price: Number(c.lastPrice),
          change: Number(c.priceChangePercent),
        }));

      setCoins(list);
    }
    load();
  }, []);

  const filtered = coins.filter((c) =>
    c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Title */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Watchlist</h2>
        <button className="w-8 h-8 flex items-center justify-center bg-teal-500 rounded-lg">
          +
        </button>
      </div>

      {/* Search */}
      <input
        placeholder="Ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-[#1a1c24] border border-white/10 text-sm outline-none"
      />

      {/* Coin List */}
      <div className="flex flex-col gap-3">
        {filtered.map((coin, i) => (
          <div
            key={i}
            className="p-3 rounded-xl bg-[#13161d] border border-white/5 hover:border-teal-400/40 transition cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="font-semibold">{coin.symbol}</span>
                <span className="text-xs text-gray-400">USDT</span>
              </div>

              <div className="flex flex-col items-end">
                <span>${coin.price.toFixed(2)}</span>
                <span
                  className={
                    coin.change >= 0
                      ? "text-green-400 text-sm"
                      : "text-red-400 text-sm"
                  }
                >
                  {coin.change.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
