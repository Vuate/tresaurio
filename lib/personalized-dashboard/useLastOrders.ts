// lib/personalized-dashboard/useLastOrders.ts

import { useState, useEffect } from "react";
import { usePortfolioStore } from "@/store/portfolioStore";

export interface OrderHistory {
  id: string;
  symbol: string;
  side: "buy" | "sell" | "long" | "short";
  type: "spot" | "futures";
  price: number;
  quantity: number;
  total: number;
  timestamp: Date;
  status: "filled" | "cancelled" | "pending";
  fee?: number;
  pnl?: number;
}

interface LastOrdersSettings {
  filterType: "all" | "spot" | "futures";
  filterSide: "all" | "buy" | "sell" | "long" | "short";
  limit: number;
}

const generateMockOrders = (): OrderHistory[] => {
  const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "AVAXUSDT", "LINKUSDT"];
  const orders: OrderHistory[] = [];

  for (let i = 0; i < 20; i++) {
    const isSpot = Math.random() > 0.5;
    const isBuy = Math.random() > 0.5;
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const price = Math.random() * 50000 + 1000;
    const quantity = Math.random() * 5 + 0.1;

    orders.push({
      id: `order-${Date.now()}-${i}`,
      symbol,
      side: isSpot ? (isBuy ? "buy" : "sell") : isBuy ? "long" : "short",
      type: isSpot ? "spot" : "futures",
      price,
      quantity,
      total: price * quantity,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      status: Math.random() > 0.1 ? "filled" : "cancelled",
      fee: price * quantity * 0.001,
      pnl:
        !isSpot && Math.random() > 0.5
          ? (Math.random() - 0.5) * 500
          : undefined,
    });
  }

  return orders.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export function useLastOrders(instanceId: string) {
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const storageKey = `last-orders-settings-${instanceId}`;

  const getInitialSettings = (): LastOrdersSettings => {
    if (typeof window === "undefined") {
      return { filterType: "all", filterSide: "all", limit: 10 };
    }

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to parse last orders settings:", e);
    }

    return { filterType: "all", filterSide: "all", limit: 10 };
  };

  const [settings, setSettings] =
    useState<LastOrdersSettings>(getInitialSettings);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(settings));
    }
  }, [settings, storageKey]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      await new Promise((resolve) => setTimeout(resolve, 300));

      let allOrders = generateMockOrders();

      if (settings.filterType !== "all") {
        allOrders = allOrders.filter((o) => o.type === settings.filterType);
      }

      if (settings.filterSide !== "all") {
        allOrders = allOrders.filter((o) => o.side === settings.filterSide);
      }

      allOrders = allOrders.slice(0, settings.limit);

      setOrders(allOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Orders fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.filterType, settings.filterSide, settings.limit]);

  const updateSettings = (newSettings: Partial<LastOrdersSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return {
    orders,
    loading,
    error,
    settings,
    updateSettings,
    refresh: fetchOrders,
  };
}
