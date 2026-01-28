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
    <svg width="120" height="32" className="xl:w-[140px] 2xl:w-[160px]">
      <polyline
        points={points}
        fill="none"
        stroke="#2effb9"
        strokeWidth="3"
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
      <div className="flex items-end justify-between mb-6 xl:mb-7 2xl:mb-8">
        {/* SOL TARAF */}
        <div className="flex items-end gap-4 xl:gap-5 2xl:gap-6">
          <h2 className="text-2xl xl:text-[28px] 2xl:text-3xl font-extrabold text-white">
            Canlı Piyasa Fiyatları
          </h2>

          <span className="flex items-center gap-2 text-green-400 font-semibold pb-[2px]">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            LIVE
          </span>
        </div>

        {/* SAĞ TARAF */}
        <div className="flex items-center gap-1.5 xl:gap-2 text-right mr-2 xl:mr-2.5 2xl:mr-3">
          <p className="text-gray-400 text-[10px] xl:text-[11px] 2xl:text-xs uppercase">
            Last Update:
          </p>
          <p className="text-white font-semibold text-xs xl:text-[13px] 2xl:text-sm">
            {time}
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="divide-y divide-white/5 border border-white/10 rounded-xl xl:rounded-2xl 2xl:rounded-2xl overflow-hidden">
        {/* HEADER */}
        <div className="grid grid-cols-[200px_minmax(100px,1fr)_160px_100px] xl:grid-cols-[220px_minmax(120px,1fr)_180px_110px] 2xl:grid-cols-[240px_minmax(140px,1fr)_200px_120px] px-4 xl:px-5 2xl:px-6 py-2.5 xl:py-3 bg-white/[0.02] text-[11px] xl:text-xs 2xl:text-xs text-gray-400 uppercase tracking-wider">
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
              className="grid grid-cols-[220px_1fr_180px_120px] xl:grid-cols-[240px_1fr_200px_140px] 2xl:grid-cols-[260px_1fr_220px_160px] px-4 xl:px-5 2xl:px-6 py-3 xl:py-3.5 2xl:py-4 hover:bg-white/[0.03] transition-all"
            >
              {/* COIN */}
              <div className="flex items-center gap-3 xl:gap-3.5 2xl:gap-4">
                <img
                  src={getIcon(name)}
                  onError={(e) => (e.currentTarget.src = getIcon("BTC"))}
                  alt={name}
                  className="w-9 h-9 xl:w-10 xl:h-10 2xl:w-11 2xl:h-11 rounded-lg object-cover"
                />

                <div>
                  <p className="text-white font-semibold text-sm xl:text-[15px] 2xl:text-base">{name}</p>
                  <p className="text-gray-500 text-[11px] xl:text-xs 2xl:text-xs">{p.symbol}</p>
                </div>
              </div>

              {/* TREND */}
              <div className="flex items-center">
                <TrendLine data={trendData[p.symbol]} />
              </div>

              {/* PRICE */}
              <p className="text-white text-base xl:text-lg 2xl:text-xl font-semibold text-right">
                ${Number(p.lastPrice).toLocaleString()}
              </p>

              {/* CHANGE */}
              <p
                className={`text-right text-xs xl:text-sm 2xl:text-sm font-semibold ${
                  percent >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {percent.toFixed(2)}%
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}