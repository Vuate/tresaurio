"use client";

import { useEffect, useState } from "react";

function TrendLine({ data }: { data: number[] }) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);

  // Normalize et (0-30 arası yükseklik)
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 120;
      const y = 30 - ((v - min) / (max - min)) * 30;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width="120" height="32">
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

// ICON HANDLER
function getIcon(symbol: string) {
  const clean = symbol.toUpperCase();
  const id = mapSymbols[clean];

  // coin bulunamazsa BTC ikonu gelsin
  if (!id) return "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png";

  return `https://s2.coinmarketcap.com/static/img/coins/64x64/${id}.png`;
}


export default function LivePrices() {
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [trendData, setTrendData] = useState<any>({});


  // ✅ LAST UPDATE TIME
  const [time, setTime] = useState("");

  // TIME UPDATE EFFECT
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

  // PRICE FETCH
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

  // TREND FETCH — 🔥 EKLENEN TEK USEEFFECT
useEffect(() => {
  async function loadTrend() {
    const trend: any = {};

    for (const s of symbols) {
      try {
        const r = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${s}&interval=1m&limit=30`
        );
        const json = await r.json();
        trend[s] = json.map((c: any) => Number(c[4])); // kapanış fiyatları
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
    return <p className="text-center text-gray-400 py-10">Yükleniyor...</p>;

  return (
<div className="w-full mt-63">

      {/* HEADER */}
      <div className="flex items-end justify-between mb-8">

        {/* SOL TARAF */}
        <div className="flex items-end gap-6">
          <h2 className="text-3xl font-extrabold text-white">
               Canlı Piyasa Fiyatları
          </h2>



          <span className="flex items-center gap-2 text-green-400 font-semibold pb-[2px]">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            LIVE
          </span>
        </div>

        {/* SAĞ TARAF — LAST UPDATE CARD */}
<div className="flex items-center gap-2 text-right mr-3">
  <p className="text-gray-400 text-[11px] uppercase">
    Last Update:
  </p>
  <p className="text-white font-semibold text-sm">
    {time}
  </p>
</div>

      </div>

      {/* TABLE */}
      <div className="divide-y divide-white/5 border border-white/10 rounded-2xl overflow-hidden">

        {/* HEADER */}
        <div className="grid grid-cols-[220px_minmax(120px,1fr)_180px_110px] px-6 py-3 bg-white/[0.02] text-xs text-gray-400 uppercase tracking-wider">
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
              className="grid grid-cols-[240px_1fr_200px_140px] px-6 py-4 hover:bg-white/[0.03] transition-all"
            >
              {/* COIN */}
              <div className="flex items-center gap-4">
                <img
                  src={getIcon(name)}
                  onError={(e) => (e.currentTarget.src = getIcon("BTC"))}
                  alt={name}
                  className="w-10 h-10 rounded-lg object-cover"
              />

                <div>
                  <p className="text-white font-semibold">{name}</p>
                  <p className="text-gray-500 text-xs">{p.symbol}</p>
                </div>
              </div>

              {/* TREND */}
            <div className="flex items-center">
                  <TrendLine data={trendData[p.symbol]} />
            </div>

              {/* PRICE */}
              <p className="text-white text-lg font-semibold text-right">
                ${Number(p.lastPrice).toLocaleString()}
              </p>

              {/* CHANGE */}
              <p
                className={`text-right text-sm font-semibold ${
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
