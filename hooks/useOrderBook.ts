// hooks/useOrderBook.ts

import { useState, useEffect, useCallback } from "react";
import { wsService, type Exchange } from "@/services/WebSocketService";

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
}

export interface UseOrderBookReturn {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  spread: number;
  spreadPercent: number;
  midPrice: number;
  loading: boolean;
  error: string | null;
  status: "connected" | "connecting" | "disconnected" | "fallback";
}

/**
 * Shared Order Book Hook
 *
 * Uses WebSocket for real-time order book data with automatic fallback to REST API.
 * Multiple components can subscribe to the same stream efficiently.
 *
 * @example
 * ```tsx
 * const { bids, asks, spread, loading } = useOrderBook({
 *   symbol: "BTCUSDT",
 *   marketType: "spot",
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
}: UseOrderBookOptions): UseOrderBookReturn {
  const [bids, setBids] = useState<OrderBookLevel[]>([]);
  const [asks, setAsks] = useState<OrderBookLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"connected" | "connecting" | "disconnected" | "fallback">("connecting");

  // Calculate derived values
  const spread = bids.length > 0 && asks.length > 0
    ? asks[0].price - bids[0].price
    : 0;

  const midPrice = bids.length > 0 && asks.length > 0
    ? (asks[0].price + bids[0].price) / 2
    : 0;

  const spreadPercent = midPrice > 0
    ? (spread / midPrice) * 100
    : 0;

  useEffect(() => {
    if (!enabled || !symbol) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const stream = `${symbol.toLowerCase()}@depth${limit}`;

    const unsubscribe = wsService.subscribe(
      stream,
      (data: any) => {
        try {
          // Parse order book data
          const parsedBids: OrderBookLevel[] = (data.bids || [])
            .slice(0, limit)
            .map((level: [string, string]) => ({
              price: parseFloat(level[0]),
              quantity: parseFloat(level[1]),
            }));

          const parsedAsks: OrderBookLevel[] = (data.asks || [])
            .slice(0, limit)
            .map((level: [string, string]) => ({
              price: parseFloat(level[0]),
              quantity: parseFloat(level[1]),
            }));

          setBids(parsedBids);
          setAsks(parsedAsks);
          setLoading(false);
          setError(null);
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
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(statusInterval);
    };
  }, [symbol, marketType, exchange, limit, enabled]);

  return {
    bids,
    asks,
    spread,
    spreadPercent,
    midPrice,
    loading,
    error,
    status,
  };
}
