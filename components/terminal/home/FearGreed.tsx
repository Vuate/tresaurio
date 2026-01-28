"use client";

import { useEffect, useState } from "react";

export default function FearGreed() {
  const [indexData, setIndexData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function fetchFearGreed() {
    try {
      const res = await fetch("https://api.alternative.me/fng/?limit=1");
      const json = await res.json();
      setIndexData(json.data[0]);
      setLoading(false);
    } catch (err) {
      console.error("FearGreed API error:", err);
    }
  }

  useEffect(() => {
    fetchFearGreed();
    const interval = setInterval(fetchFearGreed, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !indexData) {
    return (
      <div>
        <h3 className="text-lg xl:text-xl 2xl:text-2xl font-bold text-white mb-2 xl:mb-2.5 2xl:mb-3">
          Korku & Açgözlülük Endeksi
        </h3>
        <p className="text-gray-500 text-sm xl:text-[15px] 2xl:text-base">Yükleniyor...</p>
      </div>
    );
  }

  const value = Number(indexData.value);
  const status = indexData.value_classification;

  const ringColor =
    value < 30
      ? "border-red-500 text-red-400"
      : value < 60
      ? "border-yellow-400 text-yellow-300"
      : "border-green-400 text-green-400";

  return (
    <div className="relative">
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-purple-600/20 via-cyan-500/20 to-transparent blur-3xl pointer-events-none" />

      {/* TITLE */}
      <h3 className="text-xl xl:text-2xl 2xl:text-[28px] font-bold text-white mb-5 xl:mb-6 2xl:mb-7 mt-4 xl:mt-5 2xl:mt-6 relative z-10">
        Korku & Açgözlülük Endeksi
      </h3>

      {/* FLEX ROW */}
      <div className="flex justify-between items-center relative z-10">
        {/* SOL — GAUGE */}
        <div
          className={`
            relative flex items-center justify-center
            w-28 h-28 xl:w-32 xl:h-32 2xl:w-36 2xl:h-36
            ${ringColor}
          `}
          style={{
            borderWidth: "8px",
            borderStyle: "solid",
            borderRadius: "50%",
            maskImage: "linear-gradient(to bottom, black 80%, transparent 90%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 90%)",
          }}
        >
          <span className="text-3xl xl:text-4xl 2xl:text-[42px] font-extrabold animate-gaugeNumber">
            {value}
          </span>
        </div>

        {/* SAĞ — TEXT */}
        <div className="flex flex-col gap-1.5 xl:gap-2 text-right">
          <p className={`text-base xl:text-lg 2xl:text-xl font-semibold ${ringColor}`}>
            {status.toUpperCase()}
          </p>

          <p className="text-gray-400 text-xs xl:text-sm 2xl:text-[15px] max-w-[220px] xl:max-w-[240px] 2xl:max-w-[260px] leading-relaxed mt-1 xl:mt-1.5 2xl:mt-2">
            Endeks şu anda yatırımcı hissiyatını{" "}
            <span className="font-semibold">{status.toLowerCase()}</span>{" "}
            olarak gösteriyor.
          </p>
        </div>
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes gaugeNumber {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.22);
          }
        }
        .animate-gaugeNumber {
          animation: gaugeNumber 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}