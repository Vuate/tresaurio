"use client";

export default function FreeTierBanner() {
  return (
    <div
      className="
        bg-gradient-to-r from-purple-600/20 to-blue-500/10
        border border-purple-400/40
        p-8 rounded-2xl
        flex justify-between items-center
      "
    >
      <div>
        <h3 className="font-bold text-lg mb-1">
          🎉 Trader (Free) Planını Kullanıyorsunuz
        </h3>

        <p className="text-gray-400 text-sm">
          Orderbook derinliği, risk analizleri ve daha fazlası için Pro’ya
          geçin.
        </p>
      </div>

      <button
        className="
          px-6 py-3 rounded-xl
          bg-purple-600 hover:bg-purple-500
          text-white font-semibold text-sm
          transition
        "
      >
        Pro'ya Yükselt
      </button>
    </div>
  );
}
