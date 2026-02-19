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

type ProxyResponse<T> =
  | { success: true; data: T }
  | { success: false; error?: string };

type Binance24hrTicker = {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
};

// ❗ FIX: USDTUSDT kaldırıldı (geçersiz symbol → 500 hatası yapıyordu)
const SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "SOLUSDT",
  "XRPUSDT",
] as const;

const ICON_MAP: Record<string, number> = {
  BTC: 1,
  ETH: 1027,
  BNB: 1839,
  SOL: 5426,
  XRP: 52,
};

const getIcon = (symbol: string) =>
  `https://s2.coinmarketcap.com/static/img/coins/64x64/${
    ICON_MAP[symbol.replace("USDT", "")] || 1
  }.png`;

export default function CryptoTicker() {
  const [coins, setCoins] = useState<Coin[]>([]);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const qs = SYMBOLS.join(",");
        const res = await fetch(
          `/api/v2/binance/ticker?symbols=${encodeURIComponent(qs)}`,
          { cache: "no-store" }
        );

        const json = (await res.json()) as ProxyResponse<Binance24hrTicker[]>;

        if (!json.success) {
          console.error("Ticker API error:", json.error);
          return;
        }

        const data = json.data;
        if (!Array.isArray(data)) return;

        setCoins(
          data.map((c) => {
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
      } catch (e) {
        console.error("CryptoTicker fetch error:", e);
      }
    };

    fetchCoins();
    const i = setInterval(fetchCoins, 5000);
    return () => clearInterval(i);
  }, []);

  return (
    <div
      className="
        mx-auto 
        mt-[56px] xl:mt-[72px] 2xl:mt-[80px]
        flex max-w-[1400px] 
        gap-4 xl:gap-6 2xl:gap-7
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
              flex items-center
              h-[78px] xl:h-[90px] 2xl:h-[100px]
              w-[160px] xl:w-[180px] 2xl:w-[200px]
              flex-shrink-0
              gap-2.5 xl:gap-3 2xl:gap-3.5
              rounded-[16px] xl:rounded-[18px] 2xl:rounded-[20px]
              bg-[rgba(4,31,32,0.9)] 
              p-4 xl:p-5 2xl:p-6
            "
          >
            <img
              src={coin.image}
              alt={coin.name}
              className="
                h-[36px] xl:h-[42px] 2xl:h-[48px]
                w-[36px] xl:w-[42px] 2xl:w-[48px]
              "
            />

            <div className="flex min-w-0 flex-col gap-0.5 xl:gap-1">
              <span
                className="
                  text-[13px] xl:text-[14px] 2xl:text-[15px]
                  font-bold tracking-wide text-white
                "
              >
                {coin.symbol.toUpperCase()}
              </span>

              <span
                className="
                  whitespace-nowrap 
                  text-[14px] xl:text-[15px] 2xl:text-[16px]
                  text-gray-200 tabular-nums
                "
              >
                ${coin.current_price.toLocaleString("en-US")}
              </span>

              <span
                className={`
                  whitespace-nowrap 
                  text-[12px] xl:text-[13px] 2xl:text-[14px]
                  font-semibold 
                  ${isUp ? "text-green-400" : "text-red-400"}
                `}
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
