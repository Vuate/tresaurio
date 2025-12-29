"use client";

import { useEffect, useRef, useState } from "react";

type Item = {
  name: string;
  price: string;
  change: number;
  icon: string;
};

const SYMBOLS = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT"];

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
      const res = await fetch("https://api.binance.com/api/v3/ticker/24hr");
      const data = await res.json() as Array<{
        symbol: string;
        quoteVolume: string;
        priceChangePercent: string;
      }>;

      setItems(
        data
          .filter((c) => SYMBOLS.includes(c.symbol))
          .map((c): Item => {
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
          })
      );
    };

    fetchData();
    const i = setInterval(fetchData, 5000);
    return () => clearInterval(i);
  }, []);

  // 🔒 GERÇEK GENİŞLİĞE GÖRE AKIŞ
  useEffect(() => {
    if (!trackRef.current) return;

    const block = trackRef.current.children[0] as HTMLElement;
    if (!block) return;

    const width = block.scrollWidth;
    trackRef.current.style.setProperty("--marquee-distance", `-${width}px`);
  }, [items]);

  if (!items.length) return null;

  return (
    <div className="relative w-full overflow-hidden border-y border-white/10 bg-[#041f20]/95 py-4">
      <div
        ref={trackRef}
        className="ticker-track flex flex-nowrap"
      >
        {[...Array(3)].map((_, blockIndex) => (
          <div
            key={blockIndex}
            className="flex items-center gap-6 px-6"
          >
            {items.map((item, i) => (
              <TickerItem key={`${blockIndex}-${i}`} item={item} />
            ))}
          </div>
        ))}
      </div>

      <style jsx>{`
        .ticker-track {
          width: max-content;
          animation: marquee 25s linear infinite;
          will-change: transform;
        }

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
    <div className="flex min-w-[220px] items-center gap-3 whitespace-nowrap rounded-full bg-white/5 px-6 py-3 text-sm">
      <img
        src={item.icon}
        alt={item.name}
        className="h-[22px] w-[22px] rounded-full"
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
