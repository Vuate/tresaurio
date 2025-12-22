"use client";

interface TopBarProps {
  onAlertClick?: () => void;
  onAddWalletClick?: () => void;
}

export default function WalletTopBar({
  onAlertClick,
  onAddWalletClick,
}: TopBarProps) {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-[#041f20] px-6 py-3 backdrop-blur-xl">
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
      <div className="flex items-center gap-3">
        {/* TIME FILTER */}
        <div className="flex overflow-hidden rounded-lg border border-white/10 bg-white/5">
          {["1dk", "5dk", "15dk", "1s", "4s", "24s", "7g", "30g"].map(
            (label) => (
              <button
                key={label}
                className={`px-3 py-1 text-[12px] font-semibold transition ${
                  label === "24s"
                    ? "bg-teal-400/10 text-teal-300"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {label}
              </button>
            )
          )}
        </div>

        {/* NETWORK SELECT (FIXED) */}
        <div className="relative">
          <select
            className="
              appearance-none
              rounded-lg
              border border-white/10
              bg-[#041f20]
              px-3 py-1 pr-8
              text-[12px]
              font-semibold
              text-white
              outline-none
            "
          >
            <option className="bg-[#041f20] text-white">
              🌐 Tüm Networkler
            </option>
            <option className="bg-[#041f20] text-white">₿ Bitcoin</option>
            <option className="bg-[#041f20] text-white">Ξ Ethereum</option>
            <option className="bg-[#041f20] text-white">⚡ Tron</option>
            <option className="bg-[#041f20] text-white">🟡 BSC</option>
          </select>

          {/* CARET */}
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]">
            ▼
          </span>
        </div>

        {/* ALERT */}
        <button
          onClick={onAlertClick}
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm transition hover:border-teal-400 hover:bg-teal-400/10"
        >
          🔔
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold">
            3
          </span>
        </button>

        {/* ADD WALLET */}
        <button
          onClick={onAddWalletClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm transition hover:border-teal-400 hover:bg-teal-400/10"
        >
          ➕
        </button>

        {/* SETTINGS */}
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm transition hover:border-teal-400 hover:bg-teal-400/10">
          ⚙️
        </button>
      </div>
    </div>
  );
}
