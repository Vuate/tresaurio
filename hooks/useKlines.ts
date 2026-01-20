// hooks/useKlines.ts

import { useState, useEffect } from "react";
import { BinanceService } from "@/lib/api/binance/BinanceService";

export interface Kline {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: number;
  quoteVolume: number;
  trades: number;
}

export interface UseKlinesOptions {
  symbol: string;
  interval: "1m" | "3m" | "5m" | "15m" | "30m" | "1h" | "2h" | "4h" | "6h" | "8h" | "12h" | "1d" | "3d" | "1w" | "1M";
  limit?: number;
  enabled?: boolean;
  refreshInterval?: number; // in milliseconds
}

export interface UseKlinesReturn {
  data: Kline[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Shared Klines (Candlestick) Hook
 *
 * Uses BinanceService REST API with caching for candlestick data.
 * Useful for technical indicators like RSI, MACD, etc.
 *
 * @example
 * ```tsx
 * const { data, loading } = useKlines({
 *   symbol: "BTCUSDT",
 *   interval: "15m",
 *   limit: 100
 * });
 *
 * // Calculate RSI
 * const rsi = calculateRSI(data);
 * ```
 */
export function useKlines({
  symbol,
  interval,
  limit = 100,
  enabled = true,
  refreshInterval,
}: UseKlinesOptions): UseKlinesReturn {
  const [data, setData] = useState<Kline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKlines = async () => {
    if (!enabled || !symbol) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Use BinanceService (which has caching)
      const endpoint = `/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${limit}`;
      const url = `https://api.binance.com${endpoint}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch klines: ${response.statusText}`);
      }

      const rawData = await response.json();

      // Parse klines data
      const klines: Kline[] = rawData.map((k: any[]) => ({
        openTime: k[0],
        open: parseFloat(k[1]),
        high: parseFloat(k[2]),
        low: parseFloat(k[3]),
        close: parseFloat(k[4]),
        volume: parseFloat(k[5]),
        closeTime: k[6],
        quoteVolume: parseFloat(k[7]),
        trades: k[8],
      }));

      setData(klines);
      setLoading(false);
    } catch (err: any) {
      console.error("[useKlines] Fetch error:", err);
      setError(err.message || "Failed to fetch klines");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKlines();

    // Auto-refresh if interval specified
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(fetchKlines, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [symbol, interval, limit, enabled, refreshInterval]);

  return {
    data,
    loading,
    error,
    refetch: fetchKlines,
  };
}
