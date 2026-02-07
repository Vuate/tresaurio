
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

// CryptoPanic API response types
interface CryptoPanicNewsItem {
  id: number;
  title: string;
  url: string;
  source: {
    title: string;
  };
  published_at: string;
  kind: string; // "news", "media", "blog"
  currencies?: Array<{
    code: string;
    title: string;
  }>;
  votes?: {
    positive: number;
    negative: number;
    important: number;
    liked: number;
    disliked: number;
    lol: number;
    toxic: number;
    saved: number;
  };
}

interface CryptoPanicResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CryptoPanicNewsItem[];
}

// Category mapping to CryptoPanic filters
const CATEGORY_FILTERS: Record<string, string> = {
  all: "",
  bitcoin: "currencies=BTC",
  ethereum: "currencies=ETH",
  altcoins: "",
  defi: "filter=rising", // Use rising filter for DeFi-related news
  nft: "",
  regulation: "filter=important", // Important news often covers regulation
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

  const determineSentiment = (votes?: CryptoPanicNewsItem["votes"]): NewsItem["sentiment"] => {
    if (!votes) return "neutral";

    const positiveScore = votes.positive + votes.liked;
    const negativeScore = votes.negative + votes.disliked + votes.toxic;

    if (positiveScore > negativeScore * 1.5) return "positive";
    if (negativeScore > positiveScore * 1.5) return "negative";
    return "neutral";
  };

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ USE CRYPTOPANIC FREE API (no auth required)
      const categoryFilter = CATEGORY_FILTERS[settings.category] || "";
      const baseUrl = "https://cryptopanic.com/api/v1/posts/";
      const params = new URLSearchParams({
        public: "true", // Free tier
        kind: "news", // Only news articles
        ...(categoryFilter && { filter: categoryFilter }),
      });

      const url = `${baseUrl}?${params.toString()}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`CryptoPanic API error: ${response.status}`);
      }

      const data: CryptoPanicResponse = await response.json();

      // Transform CryptoPanic data to our NewsItem format
      const transformedNews: NewsItem[] = data.results
        .slice(0, settings.limit)
        .map((item) => ({
          id: item.id.toString(),
          title: item.title,
          description: item.currencies?.map((c) => c.title).join(", ") || "",
          url: item.url,
          source: item.source.title,
          publishedAt: item.published_at,
          sentiment: determineSentiment(item.votes),
          category: item.currencies?.[0]?.code.toLowerCase() || "crypto",
        }));

      setNews(transformedNews);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch news");
      console.error("News fetch error:", err);

      // Fallback to empty array on error
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
