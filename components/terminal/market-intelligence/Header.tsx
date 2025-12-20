"use client";

export default function Header() {
  return (
    <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#041F20]/80 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-4">
        <button className="h-10 w-10 rounded-lg border border-white/10 bg-white/5 hover:border-cyan-400">
          ←
        </button>
        <div>
          <h1 className="text-lg font-extrabold">
            📊 Market Microstructure & Cost Intelligence
          </h1>
          <p className="text-xs text-gray-400">
            Gerçek işlem maliyeti ve piyasa yapısı analizi
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex overflow-hidden rounded-lg border border-white/10">
          {["Binance", "OKX", "Bybit", "Kraken"].map((ex) => (
            <button
              key={ex}
              className="px-3 py-2 text-xs font-semibold text-gray-400 hover:text-white data-[active=true]:bg-cyan-400/10 data-[active=true]:text-cyan-400"
              data-active={ex === "Binance"}
            >
              {ex}
            </button>
          ))}
        </div>

        <select className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs">
          <option>BTC/USDT Perpetual</option>
          <option>BTC/USDT Spot</option>
          <option>ETH/USDT Perpetual</option>
          <option>ETH/USDT Spot</option>
        </select>
      </div>
    </div>
  );
}
