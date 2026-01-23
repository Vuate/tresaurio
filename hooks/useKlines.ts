// hooks/useKlines.ts

import { useState, useEffect } from "react";
import { BinanceService } from "@/lib/api/binance/BinanceService";
import type { Exchange } from "@/services/WebSocketService";

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
  exchange?: Exchange; // 🔥 Multi-exchange support
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
// 🔥 Exchange-specific API endpoints and symbol formatting
const getExchangeKlinesUrl = (
  exchange: Exchange,
  symbol: string,
  interval: string,
  limit: number
): string => {
  const upperSymbol = symbol.toUpperCase();

  switch (exchange) {
    case "binance":
      return `https://api.binance.com/api/v3/klines?symbol=${upperSymbol}&interval=${interval}&limit=${limit}`;

    case "okx":
      // OKX uses different format: BTC-USDT instead of BTCUSDT
      const okxSymbol = upperSymbol.replace(/USDT$/, "-USDT").replace(/USDC$/, "-USDC").replace(/BTC$/, "-BTC");
      // OKX interval mapping: 1H, 4H, 1D, etc.
      const okxInterval = interval.toUpperCase().replace("h", "H").replace("d", "D").replace("m", "m");
      return `https://www.okx.com/api/v5/market/candles?instId=${okxSymbol}&bar=${okxInterval}&limit=${limit}`;

    case "bybit":
      // Bybit uses same symbol format as Binance for spot
      // Bybit interval: 1, 3, 5, 15, 30, 60, 120, 240, 360, 720, D, W, M
      let bybitInterval = interval;
      if (interval === "1h") bybitInterval = "60";
      else if (interval === "2h") bybitInterval = "120";
      else if (interval === "4h") bybitInterval = "240";
      else if (interval === "6h") bybitInterval = "360";
      else if (interval === "12h") bybitInterval = "720";
      else if (interval === "1d") bybitInterval = "D";
      else if (interval === "1w") bybitInterval = "W";
      else if (interval === "1M") bybitInterval = "M";
      else bybitInterval = interval.replace("m", "");
      return `https://api.bybit.com/v5/market/kline?category=spot&symbol=${upperSymbol}&interval=${bybitInterval}&limit=${limit}`;

    case "coinbase":
      // Coinbase uses BTC-USD format and different granularity
      const cbSymbol = upperSymbol.replace(/USDT$/, "-USD").replace(/USDC$/, "-USDC");
      // Granularity in seconds: 60, 300, 900, 3600, 21600, 86400
      let granularity = 3600; // default 1h
      if (interval === "1m") granularity = 60;
      else if (interval === "5m") granularity = 300;
      else if (interval === "15m") granularity = 900;
      else if (interval === "1h") granularity = 3600;
      else if (interval === "6h") granularity = 21600;
      else if (interval === "1d") granularity = 86400;
      return `https://api.exchange.coinbase.com/products/${cbSymbol}/candles?granularity=${granularity}`;

    default:
      return `https://api.binance.com/api/v3/klines?symbol=${upperSymbol}&interval=${interval}&limit=${limit}`;
  }
};

// 🔥 Parse exchange-specific kline response
const parseKlinesResponse = (exchange: Exchange, rawData: any): Kline[] => {
  switch (exchange) {
    case "binance":
      return rawData.map((k: any[]) => ({
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

    case "okx":
      // OKX response: { data: [[ts, o, h, l, c, vol, volCcy, volCcyQuote, confirm], ...] }
      const okxData = rawData.data || rawData;
      return okxData.map((k: any[]) => ({
        openTime: parseInt(k[0]),
        open: parseFloat(k[1]),
        high: parseFloat(k[2]),
        low: parseFloat(k[3]),
        close: parseFloat(k[4]),
        volume: parseFloat(k[5]),
        closeTime: parseInt(k[0]) + 3600000, // approximate
        quoteVolume: parseFloat(k[7]) || 0,
        trades: 0,
      })).reverse(); // OKX returns newest first

    case "bybit":
      // Bybit response: { result: { list: [[startTime, open, high, low, close, volume, turnover], ...] } }
      const bybitData = rawData.result?.list || [];
      return bybitData.map((k: any[]) => ({
        openTime: parseInt(k[0]),
        open: parseFloat(k[1]),
        high: parseFloat(k[2]),
        low: parseFloat(k[3]),
        close: parseFloat(k[4]),
        volume: parseFloat(k[5]),
        closeTime: parseInt(k[0]) + 3600000, // approximate
        quoteVolume: parseFloat(k[6]) || 0,
        trades: 0,
      })).reverse(); // Bybit returns newest first

    case "coinbase":
      // Coinbase response: [[time, low, high, open, close, volume], ...]
      return rawData.map((k: any[]) => ({
        openTime: k[0] * 1000,
        open: parseFloat(k[3]),
        high: parseFloat(k[2]),
        low: parseFloat(k[1]),
        close: parseFloat(k[4]),
        volume: parseFloat(k[5]),
        closeTime: k[0] * 1000 + 3600000, // approximate
        quoteVolume: 0,
        trades: 0,
      })).reverse(); // Coinbase returns newest first

    default:
      return rawData.map((k: any[]) => ({
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
  }
};

export function useKlines({
  symbol,
  interval,
  limit = 100,
  enabled = true,
  refreshInterval,
  exchange = "binance", // 🔥 Default to Binance
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

      // 🔥 Get exchange-specific URL
      const url = getExchangeKlinesUrl(exchange, symbol, interval, limit);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch klines from ${exchange}: ${response.statusText}`);
      }

      const rawData = await response.json();

      // 🔥 Parse exchange-specific response
      const klines = parseKlinesResponse(exchange, rawData);

      setData(klines);
      setLoading(false);
    } catch (err: any) {
      console.error(`[useKlines] Fetch error (${exchange}):`, err);
      setError(err.message || "Failed to fetch klines");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKlines();

    // Auto-refresh if interval specified
    if (refreshInterval && refreshInterval > 0) {
      const intervalId = setInterval(fetchKlines, refreshInterval);
      return () => clearInterval(intervalId);
    }
  }, [symbol, interval, limit, enabled, refreshInterval, exchange]);

  return {
    data,
    loading,
    error,
    refetch: fetchKlines,
  };
}
