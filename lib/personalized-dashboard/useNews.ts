// lib/personalized-dashboard/useNews.ts

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

// 🔥 MOCK DATA - API hazır olana kadar
const MOCK_NEWS: NewsItem[] = [
  {
    id: "1",
    title: "Bitcoin Surges Past $45,000 as Institutional Demand Grows",
    description:
      "Major institutions continue accumulating BTC amid regulatory clarity hopes",
    url: "#",
    source: "CoinDesk",
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    sentiment: "positive",
    category: "bitcoin",
  },
  {
    id: "2",
    title: "Ethereum Foundation Announces Major Protocol Upgrade",
    description:
      "EIP-7702 aims to improve account abstraction and user experience",
    url: "#",
    source: "The Block",
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    sentiment: "positive",
    category: "ethereum",
  },
  {
    id: "3",
    title:
      "SEC Files Charges Against DeFi Protocol Over Unregistered Securities",
    description:
      "Regulatory crackdown continues as agency targets yield-generating protocols",
    url: "#",
    source: "Bloomberg Crypto",
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    sentiment: "negative",
    category: "regulation",
  },
  {
    id: "4",
    title: "Binance Reports Record Trading Volume in Q1 2025",
    description:
      "Exchange sees 40% increase in daily active users compared to previous quarter",
    url: "#",
    source: "CoinTelegraph",
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
    sentiment: "positive",
    category: "altcoins",
  },
  {
    id: "5",
    title: "Top DeFi Protocols Experience Flash Loan Attack",
    description:
      "Hackers exploit oracle vulnerability, approximately $12M drained",
    url: "#",
    source: "Decrypt",
    publishedAt: new Date(Date.now() - 18000000).toISOString(),
    sentiment: "negative",
    category: "defi",
  },
];

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

      // 🔥 MOCK DATA KULLAN
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

      let filteredNews = MOCK_NEWS;

      // Category filter
      if (settings.category !== "all") {
        filteredNews = MOCK_NEWS.filter(
          (n) => n.category === settings.category,
        );
      }

      // Limit
      filteredNews = filteredNews.slice(0, settings.limit);

      setNews(filteredNews);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("News fetch error:", err);
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
