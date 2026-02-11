
import { useState, useEffect } from "react";

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment?: "positive" | "negative" | "neutral";
  category?: string;
}

interface NewsSettings {
  category: string;
  limit: number;
}

// CryptoCompare category mapping
const CATEGORY_FILTERS: Record<string, string> = {
  all: "",
  bitcoin: "BTC",
  ethereum: "ETH",
  altcoins: "",
  defi: "",
  nft: "",
  regulation: "Regulation",
};

export function useNews(instanceId: string) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const storageKey = `news-settings-${instanceId}`;

  const getInitialSettings = (): NewsSettings => {
    if (typeof window === "undefined") {
      return { category: "all", limit: 10 };
    }

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to parse news settings:", e);
    }

    return { category: "all", limit: 10 };
  };

  const [settings, setSettings] = useState<NewsSettings>(getInitialSettings);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(settings));
    }
  }, [settings, storageKey]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        lang: "EN",
        limit: settings.limit.toString(),
      });

      // Add category filter
      const categoryFilter = CATEGORY_FILTERS[settings.category];
      if (categoryFilter) {
        params.append("categories", categoryFilter);
      }

      const url = `https://min-api.cryptocompare.com/data/v2/news/?${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`CryptoCompare API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.Type !== 100 || !data.Data) {
        throw new Error("Invalid response from CryptoCompare");
      }

      const transformedNews: NewsItem[] = data.Data.map(
        (item: {
          id: string;
          title: string;
          body: string;
          url: string;
          source: string;
          published_on: number;
          categories: string;
        }) => ({
          id: item.id,
          title: item.title,
          description: item.body?.substring(0, 150) || "",
          url: item.url,
          source: item.source,
          publishedAt: new Date(item.published_on * 1000).toISOString(),
          sentiment: "neutral" as const,
          category: item.categories?.split("|")[0]?.toLowerCase() || "crypto",
        })
      );

      setNews(transformedNews);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch news");
      console.error("News fetch error:", err);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 120000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.category, settings.limit]);

  const updateSettings = (newSettings: Partial<NewsSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return {
    news,
    loading,
    error,
    settings,
    updateSettings,
    refresh: fetchNews,
  };
}
