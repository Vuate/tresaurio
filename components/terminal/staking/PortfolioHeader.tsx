"use client";

export default function PortfolioHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-lg font-bold flex items-center gap-2">
          💼 Aktif Stake Pozisyonlarım
        </div>
        <div className="text-sm text-gray-400">
          Tüm stake işlemleriniz ve kazançlarınız
        </div>
      </div>

      <button className="rounded-lg bg-teal-400 px-4 py-2 text-sm font-semibold text-black hover:bg-teal-300 transition">
        + Yeni Stake
      </button>
    </div>
  );
}
