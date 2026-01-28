// hooks/useTicker.ts

import { useState, useEffect, useCallback, useRef } from "react";
import { wsService, type Exchange, type ConnectionStatus } from "@/services/WebSocketService";

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
  exchange?: Exchange;
  enabled?: boolean;
  timeoutMs?: number;
}

export interface UseTickerReturn {
  data: TickerData | null;
  loading: boolean;
  error: string | null;
  status: ConnectionStatus;
  retry: () => void;
}

/**
 * Shared 24hr Ticker Hook
 *
 * Uses WebSocket for real-time 24hr ticker data with automatic fallback to REST API.
 * Multiple components can subscribe to the same stream efficiently.
 *
 * @example
 * ```tsx
 * const { data, loading, retry } = useTicker({
 *   symbol: "BTCUSDT",
 *   marketType: "spot",
 *   exchange: "binance"
 * });
 *
 * console.log(data?.lastPrice); // Current price
 * console.log(data?.priceChangePercent); // 24hr change %
 * ```
 */
export function useTicker({
  symbol,
  marketType = "spot",
  exchange = "binance",
  enabled = true,
  timeoutMs = 30000,
}: UseTickerOptions): UseTickerReturn {
  const [data, setData] = useState<TickerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  // Retry function
  const retry = useCallback(() => {
    if (!enabled || !symbol) return;

    console.log(`🔄 [useTicker] Manual retry for ${exchange}:${symbol}`);
    setLoading(true);
    setError(null);
    retryCountRef.current = 0;

    const stream = `${symbol.toLowerCase()}@ticker`;
    wsService.forceReconnect(stream, marketType, exchange);
  }, [symbol, marketType, exchange, enabled]);

  useEffect(() => {
    if (!enabled || !symbol) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    retryCountRef.current = 0;

    const stream = `${symbol.toLowerCase()}@ticker`;

    // Set timeout for loading state
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (loading && !data) {
        retryCountRef.current++;

        if (retryCountRef.current >= maxRetries) {
          setError(`Connection timeout for ${exchange.toUpperCase()}. No ticker data received.`);
          setLoading(false);
        } else {
          console.log(`⏱️ [useTicker] Timeout, retrying (${retryCountRef.current}/${maxRetries})...`);
          wsService.forceReconnect(stream, marketType, exchange);
        }
      }
    }, timeoutMs);

    const unsubscribe = wsService.subscribe(
      stream,
      (rawData: any) => {
        try {
          // Clear timeout on first data
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }

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
          retryCountRef.current = 0;
        } catch (err) {
          console.error("[useTicker] Parse error:", err);
          setError("Failed to parse ticker data");
        }
      },
      marketType,
      exchange
    );

    // Update status periodically
    const statusInterval = setInterval(() => {
      const currentStatus = wsService.getStatus(stream, marketType, exchange);
      setStatus(currentStatus);

      // If status is error and we have no data, show error
      if (currentStatus === "error" && !data) {
        setError(`Connection error for ${exchange.toUpperCase()}`);
        setLoading(false);
      }
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(statusInterval);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [symbol, marketType, exchange, enabled, timeoutMs]);

  // Reset state when exchange changes
  useEffect(() => {
    setData(null);
    setLoading(true);
    setError(null);
  }, [exchange]);

  return {
    data,
    loading,
    error,
    status,
    retry,
  };
}
