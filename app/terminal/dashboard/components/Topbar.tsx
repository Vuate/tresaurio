"use client";

import { useEffect, useState } from "react";

export default function Topbar() {
  const [time, setTime] = useState("");
  const [exchange, setExchange] = useState("BINANCE");
  const [selectedAsset, setSelectedAsset] = useState("BTC");

  // === ZAMAN GÜNCELLEME ===
  useEffect(() => {
    function updateTime() {
      const now = new Date();
      const formatted = now.toLocaleString("tr-TR", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      setTime(formatted);
    }

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#0d0e13]/80 backdrop-blur-xl">
      {/* Sol - Dashboard Title */}
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold bg-gradient-to-br from-white to-teal-300 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-sm text-gray-400">
          {selectedAsset} üzerinde {exchange} verisi görüntüleniyor
        </p>
      </div>

      {/* Sağ - Exchange Select + Time */}
      <div className="flex items-center gap-4">
        {/* Exchange Selector */}
        <select
          value={exchange}
          onChange={(e) => setExchange(e.target.value.toUpperCase())}
          className="
            px-4 py-2 text-sm rounded-xl font-mono bg-[#1a1c24] border border-white/10
            text-gray-200 outline-none cursor-pointer
            hover:border-teal-300 transition
          "
        >
          <option value="binance">BINANCE</option>
          <option value="okx">OKX</option>
          <option value="coinbase">COINBASE</option>
          <option value="upbit">UPBIT</option>
          <option value="bitget">BITGET</option>
          <option value="kucoin">KUCOIN</option>
          <option value="mexc">MEXC</option>
        </select>

        {/* Time */}
        <div
          className="
            px-4 py-2 rounded-xl text-sm font-mono
            bg-white/5 border border-white/10 text-gray-300
          "
        >
          {time}
        </div>
      </div>
    </div>
  );
}
