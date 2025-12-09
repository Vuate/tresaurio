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
        <h3 className="text-xl font-bold text-white mb-3">
            Korku & Açgözlülük Endeksi
        </h3>
        <p className="text-gray-500">Yükleniyor...</p>
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
      <h3 className="text-2xl font-bold text-white mb-7 mt-6 relative z-10">
        Korku & Açgözlülük Endeksi
      </h3>

      {/* FLEX ROW — YER DEĞİŞTİRİLDİ */}
      <div className="flex justify-between items-center relative z-10">

        {/* SOL — GAUGE */}
<div
  className={`
    relative flex items-center justify-center
    ${ringColor}
  `}
  style={{
    width: "140px",
    height: "140px",
    borderWidth: "10px",
    borderStyle: "solid",
    borderRadius: "50%",
    maskImage: "linear-gradient(to bottom, black 80%, transparent 90%)",
    WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 90%)",
  }}
>

          <span className="text-4xl font-extrabold animate-gaugeNumber">
            {value}
          </span>
        </div>

        {/* SAĞ — YAZILAR */}
        <div className="flex flex-col gap-2 text-right">
          <p className={`text-lg font-semibold ${ringColor}`}>
            {status.toUpperCase()}
          </p>

          <p className="text-gray-400 text-sm max-w-[240px] leading-relaxed mt-2">
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
