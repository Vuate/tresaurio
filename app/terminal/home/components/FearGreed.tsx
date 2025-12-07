"use client";

import { useEffect, useState } from "react";

export default function FearGreed() {
  const [indexData, setIndexData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function fetchFearGreed() {
    try {
      const res = await fetch("https://api.alternative.me/fng/?limit=1");
      const json = await res.json();

      const item = json.data[0];
      setIndexData(item);
      setLoading(false);
    } catch (err) {
      console.error("FearGreed API error:", err);
    }
  }

  useEffect(() => {
    fetchFearGreed();
    const interval = setInterval(fetchFearGreed, 60000); // 1 dk'da bir güncelle
    return () => clearInterval(interval);
  }, []);

  if (loading || !indexData) {
    return (
      <div className="bg-[#13141a] border border-white/10 rounded-2xl p-8">
        <h3 className="text-xl font-bold mb-6">Korku & Açgözlülük Endeksi</h3>
        <p className="text-gray-500">Yükleniyor...</p>
      </div>
    );
  }

  const value = Number(indexData.value);
  const status = indexData.value_classification;

  return (
    <div className="bg-[#13141a] border border-white/10 rounded-2xl p-8 flex flex-col items-center">
      <h3 className="text-xl font-bold mb-6">Korku & Açgözlülük Endeksi</h3>

      {/* Gauge */}
      <div className="w-40 h-40 rounded-full bg-gradient-to-t from-green-500 to-purple-500 flex items-center justify-center shadow-lg">
        <div className="w-32 h-32 rounded-full bg-[#0a0b0f] flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold text-green-400">
            {value}
          </span>
          <span className="text-gray-400 text-xs">INDEX</span>
        </div>
      </div>

      <p className="mt-4 text-green-400 text-lg font-semibold">
        {status.toUpperCase()}
      </p>

      <p className="text-gray-500 text-center text-sm mt-2">
        Piyasa şu anda {status.toLowerCase()} bölgesinde.
      </p>
    </div>
  );
}
