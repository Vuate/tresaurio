"use client";

import { useEffect, useState } from "react";

type Coin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
};

const SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "SOLUSDT",
  "XRPUSDT",
  "USDTUSDT",
];

const ICON_MAP: Record<string, number> = {
  BTC: 1,
  ETH: 1027,
  BNB: 1839,
  SOL: 5426,
  XRP: 52,
  USDT: 825,
};

const getIcon = (symbol: string) =>
  `https://s2.coinmarketcap.com/static/img/coins/64x64/${
    ICON_MAP[symbol.replace("USDT", "")] || 1
  }.png`;

export default function CryptoTicker() {
  const [coins, setCoins] = useState<Coin[]>([]);

  useEffect(() => {
    const fetchCoins = async () => {
      const res = await fetch("https://api.binance.com/api/v3/ticker/24hr");
      const data = await res.json();

      setCoins(
        data
          .filter((c: any) => SYMBOLS.includes(c.symbol))
          .map((c: any) => {
            const name = c.symbol.replace("USDT", "");
            return {
              id: c.symbol,
              symbol: name.toLowerCase(),
              name,
              image: getIcon(c.symbol),
              current_price: Number(c.lastPrice),
              price_change_percentage_24h: Number(c.priceChangePercent),
            };
          })
      );
    };

    fetchCoins();
    const i = setInterval(fetchCoins, 5000);
    return () => clearInterval(i);
  }, []);

  return (
    <div
      className="
        mx-auto mt-[72px] flex max-w-[1400px] gap-6
        overflow-x-auto px-6
        max-[1200px]:flex-wrap max-[1200px]:justify-center
      "
    >
      {coins.map((coin) => {
        const isUp = coin.price_change_percentage_24h >= 0;

        return (
          <div
            key={coin.id}
            className="
              flex h-[90px] w-[180px] flex-shrink-0 items-center gap-3
              rounded-[18px] bg-[rgba(4,31,32,0.9)] p-5
            "
          >
            {/* Icon */}
            <img
              src={coin.image}
              alt={coin.name}
              className="h-[42px] w-[42px]"
            />

            {/* Info */}
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-[14px] font-bold tracking-wide text-white">
                {coin.symbol.toUpperCase()}
              </span>

              <span className="whitespace-nowrap text-[15px] text-gray-200 tabular-nums">
                ${coin.current_price.toLocaleString("en-US")}
              </span>

              <span
                className={`whitespace-nowrap text-[13px] font-semibold ${
                  isUp ? "text-green-400" : "text-red-400"
                }`}
              >
                {isUp ? "▲" : "▼"}{" "}
                {coin.price_change_percentage_24h.toFixed(2)}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
