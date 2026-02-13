
import { useState, useRef, useEffect } from "react";
import { useNews } from "@/hooks/useNews";
import { RefreshCw, Settings } from "lucide-react";

interface Props {
  instanceId: string;
}

const CATEGORIES = [
  { id: "all", name: "All News" },
  { id: "bitcoin", name: "Bitcoin" },
  { id: "ethereum", name: "Ethereum" },
  { id: "altcoins", name: "Altcoins" },
  { id: "defi", name: "DeFi" },
  { id: "nft", name: "NFT" },
  { id: "regulation", name: "Regulation" },
];

export default function NewsModule({ instanceId }: Props) {
  const { news, loading, error, settings, updateSettings, refresh } =
    useNews(instanceId);
  const [showSettings, setShowSettings] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  // Close settings on outside click
  useEffect(() => {
    if (!showSettings) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(e.target as Node)
      ) {
        setShowSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSettings]);

  // Close category dropdown on outside click
  useEffect(() => {
    if (!categoryOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(e.target as Node)
      ) {
        setCategoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [categoryOpen]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case "positive":
        return "text-emerald-400";
      case "negative":
        return "text-red-400";
      default:
        return "text-white/60";
    }
  };

  const selectedCategory = CATEGORIES.find((c) => c.id === settings.category);

  return (
    <div ref={containerRef} className="h-full flex flex-col relative">
      <div className="flex items-center justify-between gap-2 px-3 py-2 flex-shrink-0">
        <div className="text-white/60 text-xs flex-1">
          <span className="font-semibold text-white/90">Crypto News</span>
          <span className="text-white/40"> • </span>
          <span className="text-emerald-400">LIVE</span>
        </div>

        <div className="flex items-center gap-2">
          {loading && (
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          )}
<button
  onClick={refresh}
  className="h-7 px-3 rounded-md bg-[#0b1f1f] border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-center"
  title="Refresh"
>
    <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <div ref={settingsRef} className="relative">
<button
  onClick={() => setShowSettings(!showSettings)}
  className="h-7 px-3 rounded-md bg-[#0b1f1f] border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-center"
  title="Settings"
>
             <Settings className="w-3.5 h-3.5" />
            </button>

{showSettings && (
  <div
    onWheel={(e) => e.stopPropagation()}
    className="
      absolute right-0 mt-1 z-50
      w-[180px]
      bg-[#0b1f1f]
      border border-emerald-500/20
      rounded
      shadow-lg
      p-2
      space-y-2
      animate-in fade-in slide-in-from-top-2 duration-200
    "
  >
    <div>
      <label className="text-white/50 mb-1 block font-medium text-[9px]">
        Category
      </label>
      
      {/* Custom Dropdown - LivePrices Style */}
      <div ref={categoryRef} className="relative">
        <button
          onClick={() => setCategoryOpen((v) => !v)}
          className="
            w-full h-7 px-2 rounded-md
            bg-[#0b1f1f]
            border border-white/10
            text-white text-[11px]
            flex items-center justify-between
            cursor-pointer
            hover:bg-white/5
            transition-all
          "
        >
          <span>{selectedCategory?.name || "All News"}</span>
          <span
            className={`
              text-white/50 text-[9px]
              transition-transform duration-200
              ${categoryOpen ? "rotate-180" : ""}
            `}
          >
            ▾
          </span>
        </button>

{categoryOpen && (
  <div
    onWheel={(e) => e.stopPropagation()}
    className="
      absolute left-0 mt-1 z-50
      w-full
      max-h-[140px]
      overflow-y-auto
      bg-[#0b1f1f]
      border border-emerald-500/20
      rounded
      shadow-lg
      animate-in fade-in slide-in-from-top-2 duration-200

      [&::-webkit-scrollbar]:w-1
      [&::-webkit-scrollbar-thumb]:bg-emerald-500/40
      [&::-webkit-scrollbar-thumb]:rounded-full
      [&::-webkit-scrollbar-track]:bg-transparent
    "
  >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  updateSettings({ category: cat.id });
                  setCategoryOpen(false);
                }}
                className="
                  w-full px-2 py-1.5
                  text-left text-[11px]
                  bg-transparent cursor-pointer
                  text-white
                  transition-colors
                  hover:bg-emerald-500/10
                  hover:text-emerald-400
                "
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>

    <div>
      <label className="text-white/50 mb-1 block font-medium text-[9px]">
        Items: {settings.limit}
      </label>
      <input
        type="range"
        min="5"
        max="50"
        step="5"
        value={settings.limit}
        onChange={(e) =>
          updateSettings({ limit: parseInt(e.target.value) })
        }
        className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-2.5
          [&::-webkit-slider-thumb]:h-2.5
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-emerald-500
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-moz-range-thumb]:w-2.5
          [&::-moz-range-thumb]:h-2.5
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-emerald-500
          [&::-moz-range-thumb]:cursor-pointer
          [&::-moz-range-thumb]:border-0
        "
      />
      <div className="flex justify-between text-[8px] text-white/40 mt-0.5">
        <span>5</span>
        <span>50</span>
      </div>
    </div>
  </div>
)}
          </div>
        </div>
      </div>

      <div
        className="
          flex-1 min-h-0 px-3 pb-3
          overflow-y-auto

          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-teal-400/40
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb:hover]:bg-teal-400/70

          scrollbar-thin
          scrollbar-thumb-teal-400/40
          scrollbar-track-transparent
        "
      >
        <div className="space-y-2">
          {error && (
            <div className="p-4 text-center">
              <div className="text-red-400 mb-2 text-xs">⚠️ {error}</div>
              <button
                onClick={refresh}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Try again
              </button>
            </div>
          )}

          {!error && news.length === 0 && !loading && (
            <div className="text-center py-8 text-white/40 text-xs">
              No news available. Click "Refresh" to load news.
            </div>
          )}

          {!error && news.length > 0 && (
            <>
              {news.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 rounded-md bg-white/5 border border-white/10 hover:bg-white/8 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-white/60 font-medium truncate">
                      {item.source}
                    </span>
                    <span className="text-[10px] text-white/40 flex-shrink-0 ml-2">
                      {formatTime(item.publishedAt)}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 mb-1.5">
                    {item.title}
                  </h4>

                  {item.description && (
                    <p className="text-[10px] text-white/60 line-clamp-2 mb-1.5">
                      {item.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 flex-wrap">
                    {item.sentiment && (
                      <span
                        className={`text-xs ${getSentimentColor(item.sentiment)}`}
                      >
                        {item.sentiment === "positive"
                          ? "📈"
                          : item.sentiment === "negative"
                            ? "📉"
                            : "➖"}
                      </span>
                    )}
                    {item.category && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                        {item.category}
                      </span>
                    )}
                    <span className="text-[10px] text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto flex-shrink-0">
                      Read more →
                    </span>
                  </div>
                </a>
              ))}
            </>
          )}
        </div>
      </div>

    </div>
  );
}