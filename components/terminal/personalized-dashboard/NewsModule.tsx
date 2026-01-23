// components/terminal/personalized-dashboard/NewsModule.tsx

import { useState } from "react";
import { useNews } from "@/lib/personalized-dashboard/useNews";

interface Props {
  instanceId: string;
}

export default function NewsModule({ instanceId }: Props) {
  const { news, loading, error, settings, updateSettings, refresh } =
    useNews(instanceId);
  const [showSettings, setShowSettings] = useState(false);

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

  return (
    <div className="h-full flex flex-col bg-[#0a0b0f] rounded-lg border border-white/10">
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="text-xl">📰</div>
          <h3 className="font-semibold">Crypto News</h3>
          {loading && (
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            className="text-white/50 hover:text-white transition-colors"
            title="Refresh"
          >
            🔄
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-white/50 hover:text-white transition-colors"
          >
            ⚙️
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="p-3 border-b border-white/10 bg-white/5 space-y-3">
          <div>
            <label className="text-xs text-white/60 mb-1 block">Category</label>
            <select
              value={settings.category}
              onChange={(e) => updateSettings({ category: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm"
            >
              <option value="all">All News</option>
              <option value="bitcoin">Bitcoin</option>
              <option value="ethereum">Ethereum</option>
              <option value="altcoins">Altcoins</option>
              <option value="defi">DeFi</option>
              <option value="nft">NFT</option>
              <option value="regulation">Regulation</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1 block">
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
              className="w-full"
            />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        {error && (
          <div className="p-4 text-center">
            <div className="text-red-400 mb-2">⚠️ {error}</div>
            <button
              onClick={refresh}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Try again
            </button>
          </div>
        )}

        {!error && news.length === 0 && !loading && (
          <div className="p-8 text-center text-white/40">
            <div className="text-4xl mb-2">📭</div>
            <div className="text-sm">No news available</div>
          </div>
        )}

        {!error && news.length > 0 && (
          <div className="divide-y divide-white/10">
            {news.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 hover:bg-white/5 transition-colors group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white/60 font-medium">
                    {item.source}
                  </span>
                  <span className="text-xs text-white/40">
                    {formatTime(item.publishedAt)}
                  </span>
                </div>

                <h4 className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors line-clamp-2 mb-1">
                  {item.title}
                </h4>

                {item.description && (
                  <p className="text-xs text-white/60 line-clamp-2 mb-2">
                    {item.description}
                  </p>
                )}

                <div className="flex items-center gap-2">
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
                    <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/60">
                      {item.category}
                    </span>
                  )}
                  <span className="text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                    Read more →
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="p-2 border-t border-white/10 text-center">
        <span className="text-xs text-white/40">
          Auto-refresh every 2 minutes
        </span>
      </div>
    </div>
  );
}
