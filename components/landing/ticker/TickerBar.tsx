"use client";

import { useEffect, useRef, useState } from "react";

type Item = {
  name: string;
  price: string;
  change: number;
  icon: string;
};

type ProxyResponse<T> =
  | { success: true; data: T }
  | { success: false; error?: string };

type Binance24hrTicker = {
  symbol: string;
  quoteVolume: string;
  priceChangePercent: string;
};

const SYMBOLS = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT"] as const;

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

export default function TickerBar() {
  const [items, setItems] = useState<Item[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/v2/binance/ticker?symbols=${SYMBOLS.join(",")}`,
          { cache: "no-store" },
        );

        const json = (await res.json()) as ProxyResponse<Binance24hrTicker[]>;

        if (!json.success) {
          console.error(json.error);
          return;
        }

        const data = json.data;
        if (!Array.isArray(data)) return;

        const nextItems: Item[] = data
          // defensive: route already returns requested symbols, but keep it safe
          .filter((c) => (SYMBOLS as readonly string[]).includes(c.symbol))
          .map((c) => {
            const volume = Number(c.quoteVolume);
            return {
              name: c.symbol.replace("USDT", ""),
              price:
                volume > 1e9
                  ? `$${(volume / 1e9).toFixed(2)}B`
                  : `$${(volume / 1e6).toFixed(1)}M`,
              change: Number(c.priceChangePercent),
              icon: getIcon(c.symbol),
            };
          });

        setItems(nextItems);
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
    const i = setInterval(fetchData, 5000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    if (!trackRef.current) return;

    const firstChild = trackRef.current.children[0];
    if (!(firstChild instanceof HTMLElement)) return;

    const width = firstChild.scrollWidth;
    trackRef.current.style.setProperty("--marquee-distance", `-${width}px`);
  }, [items]);

  if (!items.length) return null;

  return (
    <div className="relative w-full overflow-hidden border-y border-white/10 bg-[#041f20]/95 py-3 xl:py-4 2xl:py-5">
      <div
        ref={trackRef}
        className="flex flex-nowrap"
        style={{
          width: "max-content",
          willChange: "transform",
          animation: "marquee 25s linear infinite",
        }}
      >
        {Array.from({ length: 3 }).map((_, blockIndex) => (
          <div
            key={blockIndex}
            className="flex items-center gap-4 xl:gap-6 2xl:gap-7 px-4 xl:px-6 2xl:px-7"
          >
            {items.map((item, i) => (
              <TickerItem key={`${blockIndex}-${i}`} item={item} />
            ))}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(var(--marquee-distance));
          }
        }
      `}</style>
    </div>
  );
}

function TickerItem({ item }: { item: Item }) {
  return (
    <div className="flex min-w-[190px] xl:min-w-[220px] 2xl:min-w-[240px] items-center gap-2.5 xl:gap-3 2xl:gap-3.5 whitespace-nowrap rounded-full bg-white/5 px-5 xl:px-6 2xl:px-7 py-2.5 xl:py-3 2xl:py-3.5 text-xs xl:text-sm 2xl:text-[15px]">
      <img
        src={item.icon}
        alt={item.name}
        className="h-[18px] xl:h-[22px] 2xl:h-[24px] w-[18px] xl:w-[22px] 2xl:w-[24px] rounded-full"
      />
      <span className="font-semibold text-white">{item.name}</span>
      <span className="text-gray-400">{item.price}</span>
      <span
        className={`font-semibold ${
          item.change >= 0 ? "text-green-500" : "text-red-500"
        }`}
      >
        {item.change >= 0 ? "+" : ""}
        {item.change.toFixed(2)}%
      </span>
    </div>
  );
}
