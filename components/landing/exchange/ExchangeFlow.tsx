"use client";

import { useEffect, useState } from "react";

type FlowItem = {
  name: string;
  symbol: string;
  amount: number;
  token: string;
  time: string;
  icon: string;
};

const EXCHANGES = [
  { name: "Binance", symbol: "BTCUSDT", token: "USDT" },
  { name: "Coinbase", symbol: "ETHUSDT", token: "ETH" },
  { name: "OKX", symbol: "ETHUSDT", token: "WETH" },
  { name: "Bybit", symbol: "BNBUSDT", token: "USDC" },
  { name: "KuCoin", symbol: "BTCUSDT", token: "BTC" },
  { name: "Gate.io", symbol: "SOLUSDT", token: "ZRO" },
];

const ICON_MAP: Record<string, string> = {
  Binance: "/binance.jpg",
  Coinbase: "/coinbase.jpg",
  OKX: "/okx.jpg",
  Bybit: "/bybit.jpg",
  KuCoin: "/kucoin.jpg",
  "Gate.io": "/gate.jpg",
};

const getIcon = (exchangeName: string) => {
  return ICON_MAP[exchangeName] || "/logo.png";
};

export default function ExchangeFlow() {
  const [flows, setFlows] = useState<FlowItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("https://api.binance.com/api/v3/ticker/24hr");
      const data = await res.json();

      setFlows(
        EXCHANGES.map((ex) => {
          const coin = data.find((c: any) => c.symbol === ex.symbol);
          const change = coin ? Number(coin.priceChangePercent) : 0;

          const randomFactor = 1 + (Math.random() - 0.5) * 0.2;

          return {
            name: ex.name,
            symbol: ex.symbol,
            amount: Math.round(change * 1200 * randomFactor),
            token: ex.token,
            time: "Live",
            icon: getIcon(ex.name),
          };
        })
      );
    };

    fetchData();
    const i = setInterval(fetchData, 5000);
    return () => clearInterval(i);
  }, []);

  return (
    <section className="pt-[30px] py-[100px] bg-[#031a1c] text-white">
      <h2 className="text-center text-[60px] mb-[75px] font-semibold">
        Exchange{" "}
        <span className="bg-gradient-to-r from-[#19d8d0] to-[#238c7c] bg-clip-text text-transparent">
          Flow
        </span>
      </h2>

      <div
        className="
          max-w-[1400px] mx-auto px-6
          grid grid-cols-4 gap-6
          max-[1024px]:grid-cols-2
          max-[600px]:grid-cols-1
          min-[1280px]:pr-12
          min-[1536px]:pr-6
        "
      >
        {flows.map((f) => (
          <div
            key={f.name}
            className="bg-[#041f20] rounded-[18px] p-6 transition-transform duration-200 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <img
                  src={f.icon}
                  alt={f.name}
                  className="w-[22px] h-[22px] rounded-full"
                />
                <span>{f.name}</span>
              </div>

              <span className="text-[13px] font-semibold">Live</span>
            </div>

            <div
              className={`my-4 text-[28px] font-bold tabular-nums ${
                f.amount >= 0 ? "text-emerald-400" : "text-rose-500"
              }`}
            >
              {f.amount >= 0 ? "+" : "-"}${Math.abs(f.amount)}K
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}