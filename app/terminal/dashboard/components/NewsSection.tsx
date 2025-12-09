"use client";

import { useEffect, useState } from "react";

export default function NewsSection() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await fetch("/api/news", { cache: "no-store" });
        const json = await res.json();
        setNews(json.result || []);
      } catch (err) {
        console.error("NEWS FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    }

    loadNews();
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
      {/* HEADER */}
      <h3 className="text-sm font-semibold mb-5 flex items-center gap-2">
        <span>📰</span> Son Haberler
      </h3>

      {loading ? (
        <p className="text-gray-500 text-sm">Yükleniyor...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {news.slice(0, 6).map((item, i) => (
            <div
              key={i}
              className={`
                rounded-xl p-4 
                border-l-4 
                ${
                  i % 2 === 0
                    ? "border-emerald-400 bg-emerald-400/10"
                    : "border-sky-400 bg-sky-400/10"
                }
                hover:bg-white/10 
                hover:border-white/20
                transition
              `}
            >
              {/* HEADER TIME + SOURCE */}
              <div className="text-[10px] text-slate-400 uppercase tracking-[0.16em] mb-2">
                {item.published || "Bilinmeyen tarih"} ·{" "}
                {item.source || "Kaynak"}
              </div>

              {/* TITLE */}
              <a
                href={item.link}
                target="_blank"
                className="text-sm font-semibold text-white leading-tight hover:text-emerald-300 transition"
              >
                {item.title}
              </a>

              {/* DESCRIPTION */}
              <p className="text-[11px] text-slate-400 mt-2 line-clamp-3">
                {item.description || "Detay bulunamadı..."}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
