"use client";

import { useState } from "react";

interface TopBarProps {
  onAlertClick?: () => void;
  onAddWalletClick?: () => void;
}

export default function WalletTopBar({
  onAlertClick,
  onAddWalletClick,
}: TopBarProps) {
  const [activeRange, setActiveRange] = useState("24s"); // ✅ default

  return (
    <div className="flex items-center justify-between border-b border-white/10 bg-[#041f20] px-6 py-3 backdrop-blur-xl mt-3">
      {/* LEFT */}
      <div className="flex flex-col gap-[2px]">
        <div className="flex items-center gap-2 text-[20px] font-extrabold text-white">
          📊 Market Wallet Tracker
        </div>
        <div className="text-[11px] font-medium text-gray-400">
          Whale & Exchange Activity Monitor
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap">

        {/* TIME FILTER */}
<div className="flex overflow-hidden rounded-lg border border-white/10 bg-white/5">
  {["1dk", "5dk", "15dk", "1s", "4s", "24s", "7g", "30g"].map((label) => (
    <button
      key={label}
      onClick={() => setActiveRange(label)}
      className={`
        px-3 py-1 text-[12px] font-semibold
        cursor-pointer
        transition-all duration-150
        ${
          activeRange === label
            ? "bg-teal-400/20 text-teal-300"
            : "text-gray-400 hover:bg-white/10 hover:text-white"
        }
      `}
    >
      {label}
    </button>
  ))}
</div>


        {/* NETWORK SELECT */}
        <div className="relative">
          <select className="appearance-none rounded-lg border border-white/10 bg-[#041f20] px-3 py-1 pr-8 text-[12px] font-semibold text-white outline-none">
            <option>🌐 Tüm Networkler</option>
            <option>₿ Bitcoin</option>
            <option>Ξ Ethereum</option>
            <option>⚡ Tron</option>
            <option>🟡 BSC</option>
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]">
            ▼
          </span>
        </div>

        {/* ALERT */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition hover:border-teal-400 hover:bg-teal-400/10">
          🔔
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold">
            3
          </span>
        </button>

        {/* ADD WALLET */}
        <button
          onClick={onAddWalletClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition hover:border-teal-400 hover:bg-teal-400/10"
        >
          ➕
        </button>

        {/* SETTINGS */}
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition hover:border-teal-400 hover:bg-teal-400/10">
          ⚙️
        </button>
      </div>
    </div>
  );
}
