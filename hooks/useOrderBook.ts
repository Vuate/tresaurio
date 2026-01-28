// hooks/useOrderBook.ts

import { useState, useEffect, useCallback, useRef } from "react";
import { wsService, type Exchange, type ConnectionStatus } from "@/services/WebSocketService";

export interface OrderBookLevel {
  price: number;
  quantity: number;
}

export interface OrderBookData {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  spread: number;
  spreadPercent: number;
  midPrice: number;
}

export interface UseOrderBookOptions {
  symbol: string;
  marketType?: "spot" | "futures";
  exchange?: Exchange;
  limit?: number;
  enabled?: boolean;
  timeoutMs?: number; // Timeout before showing error (default: 30000)
}

export interface UseOrderBookReturn {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  spread: number;
  spreadPercent: number;
  midPrice: number;
  loading: boolean;
  error: string | null;
  status: ConnectionStatus;
  retry: () => void;
  lastUpdate: number | null;
}

/**
 * Shared Order Book Hook
 *
 * Uses WebSocket for real-time order book data with automatic fallback to REST API.
 * Multiple components can subscribe to the same stream efficiently.
 *
 * Features:
 * - Multi-exchange support (Binance, OKX, Bybit, Coinbase)
 * - Automatic reconnection with exponential backoff
 * - REST fallback for Binance
 * - Timeout handling with error display
 * - Manual retry capability
 *
 * @example
 * ```tsx
 * const { bids, asks, spread, loading, retry } = useOrderBook({
 *   symbol: "BTCUSDT",
 *   marketType: "spot",
 *   exchange: "binance",
 *   limit: 20
 * });
 * ```
 */
export function useOrderBook({
  symbol,
  marketType = "spot",
  exchange = "binance",
  limit = 20,
  enabled = true,
  timeoutMs = 30000,
}: UseOrderBookOptions): UseOrderBookReturn {
  const [bids, setBids] = useState<OrderBookLevel[]>([]);
  const [asks, setAsks] = useState<OrderBookLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  // Calculate derived values
  const spread =
    bids.length > 0 && asks.length > 0 ? asks[0].price - bids[0].price : 0;

  const midPrice =
    bids.length > 0 && asks.length > 0
      ? (asks[0].price + bids[0].price) / 2
      : 0;

  const spreadPercent = midPrice > 0 ? (spread / midPrice) * 100 : 0;

  // Binance only supports depth5, depth10, depth20
  // Other exchanges support higher limits
  const getStreamLimit = (ex: Exchange, requestedLimit: number): number => {
    if (ex === "binance") {
      if (requestedLimit <= 5) return 5;
      if (requestedLimit <= 10) return 10;
      return 20; // Max for Binance WebSocket
    }
    // Other exchanges can handle higher limits
    return requestedLimit;
  };

  const streamLimit = getStreamLimit(exchange, limit);

  // Retry function
  const retry = useCallback(() => {
    if (!enabled || !symbol) return;

    console.log(`🔄 [useOrderBook] Manual retry for ${exchange}:${symbol}`);
    setLoading(true);
    setError(null);
    retryCountRef.current = 0;

    const stream = `${symbol.toLowerCase()}@depth${streamLimit}`;
    wsService.forceReconnect(stream, marketType, exchange);
  }, [symbol, marketType, exchange, streamLimit, enabled]);

  useEffect(() => {
    if (!enabled || !symbol) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    retryCountRef.current = 0;

    const stream = `${symbol.toLowerCase()}@depth${streamLimit}`;

    // Set timeout for loading state
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (loading && bids.length === 0 && asks.length === 0) {
        retryCountRef.current++;

        if (retryCountRef.current >= maxRetries) {
          setError(`Connection timeout for ${exchange.toUpperCase()}. No data received.`);
          setLoading(false);
        } else {
          console.log(`⏱️ [useOrderBook] Timeout, retrying (${retryCountRef.current}/${maxRetries})...`);
          wsService.forceReconnect(stream, marketType, exchange);

          // Reset timeout for retry
          timeoutRef.current = setTimeout(() => {
            if (bids.length === 0 && asks.length === 0) {
              setError(`Connection failed for ${exchange.toUpperCase()} after ${maxRetries} retries.`);
              setLoading(false);
            }
          }, timeoutMs);
        }
      }
    }, timeoutMs);

    const unsubscribe = wsService.subscribe(
      stream,
      (data: any) => {
        try {
          // Clear timeout on first data
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }

          // Parse order book data
          const parsedBids: OrderBookLevel[] = (data.bids || [])
            .slice(0, limit)
            .map((level: [string, string]) => ({
              price: parseFloat(level[0]),
              quantity: parseFloat(level[1]),
            }))
            .filter(
              (l: OrderBookLevel) =>
                Number.isFinite(l.price) && Number.isFinite(l.quantity) && l.quantity > 0
            );

          const parsedAsks: OrderBookLevel[] = (data.asks || [])
            .slice(0, limit)
            .map((level: [string, string]) => ({
              price: parseFloat(level[0]),
              quantity: parseFloat(level[1]),
            }))
            .filter(
              (l: OrderBookLevel) =>
                Number.isFinite(l.price) && Number.isFinite(l.quantity) && l.quantity > 0
            );

          // Only update if we have valid data
          if (parsedBids.length > 0 || parsedAsks.length > 0) {
            setBids(parsedBids);
            setAsks(parsedAsks);
            setLastUpdate(Date.now());
            setLoading(false);
            setError(null);
            retryCountRef.current = 0;
          }
        } catch (err) {
          console.error("[useOrderBook] Parse error:", err);
          setError("Failed to parse order book data");
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
      if (currentStatus === "error" && bids.length === 0 && asks.length === 0) {
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
  }, [symbol, marketType, exchange, limit, enabled, timeoutMs]);

  // Reset state when exchange changes
  useEffect(() => {
    setBids([]);
    setAsks([]);
    setLoading(true);
    setError(null);
    setLastUpdate(null);
  }, [exchange]);

  return {
    bids,
    asks,
    spread,
    spreadPercent,
    midPrice,
    loading,
    error,
    status,
    retry,
    lastUpdate,
  };
}
