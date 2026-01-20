// hooks/useTicker.ts

import { useState, useEffect } from "react";
import { wsService } from "@/services/WebSocketService";

export interface TickerData {
  symbol: string;
  lastPrice: number;
  priceChange: number;
  priceChangePercent: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  quoteVolume: number;
  openPrice: number;
  closePrice: number;
}

export interface UseTickerOptions {
  symbol: string;
  marketType?: "spot" | "futures";
  enabled?: boolean;
}

export interface UseTickerReturn {
  data: TickerData | null;
  loading: boolean;
  error: string | null;
  status: "connected" | "connecting" | "disconnected" | "fallback";
}

/**
 * Shared 24hr Ticker Hook
 *
 * Uses WebSocket for real-time 24hr ticker data with automatic fallback to REST API.
 * Multiple components can subscribe to the same stream efficiently.
 *
 * @example
 * ```tsx
 * const { data, loading } = useTicker({
 *   symbol: "BTCUSDT",
 *   marketType: "spot"
 * });
 *
 * console.log(data?.lastPrice); // Current price
 * console.log(data?.priceChangePercent); // 24hr change %
 * ```
 */
export function useTicker({
  symbol,
  marketType = "spot",
  enabled = true,
}: UseTickerOptions): UseTickerReturn {
  const [data, setData] = useState<TickerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"connected" | "connecting" | "disconnected" | "fallback">("connecting");

  useEffect(() => {
    if (!enabled || !symbol) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const stream = `${symbol.toLowerCase()}@ticker`;

    const unsubscribe = wsService.subscribe(
      stream,
      (rawData: any) => {
        try {
          // Parse ticker data from WebSocket
          const tickerData: TickerData = {
            symbol: rawData.s || symbol,
            lastPrice: parseFloat(rawData.c || "0"),
            priceChange: parseFloat(rawData.p || "0"),
            priceChangePercent: parseFloat(rawData.P || "0"),
            highPrice: parseFloat(rawData.h || "0"),
            lowPrice: parseFloat(rawData.l || "0"),
            volume: parseFloat(rawData.v || "0"),
            quoteVolume: parseFloat(rawData.q || "0"),
            openPrice: parseFloat(rawData.o || "0"),
            closePrice: parseFloat(rawData.c || "0"),
          };

          setData(tickerData);
          setLoading(false);
          setError(null);
        } catch (err) {
          console.error("[useTicker] Parse error:", err);
          setError("Failed to parse ticker data");
        }
      },
      marketType
    );

    // Update status periodically
    const statusInterval = setInterval(() => {
      const currentStatus = wsService.getStatus(stream, marketType);
      setStatus(currentStatus);
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(statusInterval);
    };
  }, [symbol, marketType, enabled]);

  return {
    data,
    loading,
    error,
    status,
  };
}
