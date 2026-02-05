"use client";

import { useEffect, useState } from "react";

function TrendLine({ data }: { data: number[] }) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 120;
      const y = 30 - ((v - min) / (max - min)) * 30;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg 
      width="80" 
      height="24" 
      className="sm:w-[90px] sm:h-[28px] md:w-[100px] md:h-[30px] lg:w-[120px] lg:h-[32px] xl:w-[140px] 2xl:w-[160px]"
    >
      <polyline
        points={points}
        fill="none"
        stroke="#2effb9"
        strokeWidth="2"
        className="lg:stroke-[3]"
        strokeLinecap="round"
      />
    </svg>
  );
}

const mapSymbols: any = {
  BTC: 1,
  ETH: 1027,
  BNB: 1839,
  SOL: 5426,
  XRP: 52,
  USDT: 825,
};

function getIcon(symbol: string) {
  const clean = symbol.toUpperCase();
  const id = mapSymbols[clean];
  if (!id) return "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png";
  return `https://s2.coinmarketcap.com/static/img/coins/64x64/${id}.png`;
}

export default function LivePrices() {
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [trendData, setTrendData] = useState<any>({});
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const symbols = [
    "BTCUSDT",
    "ETHUSDT",
    "BNBUSDT",
    "SOLUSDT",
    "XRPUSDT",
    "USDTUSDT",
  ];

  useEffect(() => {
    async function load() {
      const res = await fetch("https://api.binance.com/api/v3/ticker/24hr");
      const all = await res.json();
      setPrices(all.filter((i: any) => symbols.includes(i.symbol)));
      setLoading(false);
    }

    load();
    const int = setInterval(load, 5000);
    return () => clearInterval(int);
  }, []);

  useEffect(() => {
    async function loadTrend() {
      const trend: any = {};

      for (const s of symbols) {
        try {
          const r = await fetch(
            `https://api.binance.com/api/v3/klines?symbol=${s}&interval=1m&limit=30`
          );
          const json = await r.json();
          trend[s] = json.map((c: any) => Number(c[4]));
        } catch (err) {
          console.log("Trend fetch error:", err);
        }
      }

      setTrendData(trend);
    }

    loadTrend();
    const interval = setInterval(loadTrend, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return <p className="text-center text-gray-400 py-8 xl:py-10 2xl:py-12">Yükleniyor...</p>;

  return (
    <div className="w-full mt-60 xl:mt-62 2xl:mt-64">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-4 sm:mb-6 xl:mb-7 2xl:mb-8 gap-2 sm:gap-0">
        {/* SOL TARAF */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2 sm:gap-4 xl:gap-5 2xl:gap-6">
          <h2 className="text-lg sm:text-xl md:text-2xl xl:text-[28px] 2xl:text-3xl font-extrabold text-white leading-none">
            Canlı Piyasa Fiyatları
          </h2>

          <span className="flex items-center gap-1.5 sm:gap-2 text-green-400 font-semibold text-xs sm:text-sm sm:pb-[2px]">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></span>
            LIVE
          </span>
        </div>

        {/* SAĞ TARAF */}
        <div className="flex items-center gap-1 sm:gap-1.5 xl:gap-2 text-left sm:text-right sm:mr-2 xl:mr-2.5 2xl:mr-3">
          <p className="text-gray-400 text-[9px] sm:text-[10px] xl:text-[11px] 2xl:text-xs uppercase whitespace-nowrap">
            Last Update:
          </p>
          <p className="text-white font-semibold text-[10px] sm:text-xs xl:text-[13px] 2xl:text-sm whitespace-nowrap">
            {time}
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="divide-y divide-white/5 border border-white/10 rounded-lg sm:rounded-xl xl:rounded-2xl 2xl:rounded-2xl overflow-hidden">
        {/* HEADER - Mobilde gizli */}
        <div className="hidden lg:grid grid-cols-[200px_minmax(100px,1fr)_160px_100px] xl:grid-cols-[220px_minmax(120px,1fr)_180px_110px] 2xl:grid-cols-[240px_minmax(140px,1fr)_200px_120px] px-4 xl:px-5 2xl:px-6 py-2.5 xl:py-3 bg-white/[0.02] text-[11px] xl:text-xs 2xl:text-xs text-gray-400 uppercase tracking-wider">
          <span>Coin</span>
          <span>Trend</span>
          <span className="text-right">Fiyat</span>
          <span className="text-right">24h %</span>
        </div>

        {/* ROWS */}
        {prices.map((p) => {
          const name = p.symbol.replace("USDT", "");
          const percent = Number(p.priceChangePercent);

          return (
            <div
              key={p.symbol}
              className="
                /* Mobil: Kompakt grid (4 kolon) */
                grid grid-cols-[auto_1fr_auto_auto] 
                gap-x-2 gap-y-1
                px-2.5 py-2
                /* Tablet */
                sm:grid-cols-[auto_1fr_auto_auto]
                sm:gap-x-3 sm:px-3 sm:py-2.5
                /* Desktop */
                lg:grid-cols-[200px_minmax(100px,1fr)_160px_100px] lg:gap-x-0 lg:px-4 lg:py-3
                xl:grid-cols-[220px_minmax(120px,1fr)_180px_110px] xl:px-5 xl:py-3.5
                2xl:grid-cols-[240px_minmax(140px,1fr)_200px_120px] 2xl:px-6 2xl:py-4
                hover:bg-white/[0.03] transition-all
                items-center
              "
            >
              {/* COIN - Mobilde sola */}
              <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3 xl:gap-3.5 2xl:gap-4 col-span-1">
                <img
                  src={getIcon(name)}
                  onError={(e) => (e.currentTarget.src = getIcon("BTC"))}
                  alt={name}
                  className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 2xl:w-11 2xl:h-11 rounded-lg object-cover flex-shrink-0"
                />

                <div className="lg:block">
                  <p className="text-white font-semibold text-xs sm:text-sm lg:text-sm xl:text-[15px] 2xl:text-base leading-none">{name}</p>
                  <p className="text-gray-500 text-[9px] sm:text-[10px] lg:text-[11px] xl:text-xs 2xl:text-xs mt-0.5">{p.symbol}</p>
                </div>
              </div>

              {/* TREND - Mobilde ortada, desktop'ta kendi kolonunda */}
              <div className="flex items-center justify-center lg:justify-start col-span-2 lg:col-span-1">
                <TrendLine data={trendData[p.symbol]} />
              </div>

              {/* PRICE - Mobilde sağ üst */}
              <p className="text-white text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl font-semibold text-right col-span-1 lg:text-right leading-none">
                ${Number(p.lastPrice).toLocaleString()}
              </p>

              {/* CHANGE - Mobilde sağ alt, tek başına */}
              <p
                className={`text-right text-[10px] sm:text-xs lg:text-xs xl:text-sm 2xl:text-sm font-semibold col-start-4 lg:col-start-auto leading-none ${
                  percent >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {percent >= 0 ? "+" : ""}{percent.toFixed(2)}%
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
