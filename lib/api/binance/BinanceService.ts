// lib/api/binance/BinanceService.ts

import { BINANCE_CONFIG, ENDPOINTS, ERROR_MESSAGES } from "./constants";
import type {
  Binance24hrTicker,
  BinancePrice,
  BinanceBookTicker,
  BinanceDepth,
  BinancePremiumIndex,
  CacheEntry,
  BinanceServiceOptions,
} from "./types";

/**
 * Centralized Binance API Service
 *
 * Features:
 * - In-memory caching with TTL
 * - Automatic timeout handling
 * - Consistent error handling
 * - Type-safe responses
 * - Rate limit protection
 *
 * @example
 * ```typescript
 * // Get single price
 * const price = await BinanceService.getPrice("BTCUSDT");
 *
 * // Get multiple tickers
 * const tickers = await BinanceService.get24hrTickers(["BTCUSDT", "ETHUSDT"]);
 *
 * // Get order book
 * const depth = await BinanceService.getDepth("BTCUSDT", 20);
 * ```
 */
export class BinanceService {
  private static cache = new Map<string, CacheEntry<any>>();
  private static requestCount = 0;
  private static windowStart = Date.now();

  /**
   * Check rate limit
   */
  private static checkRateLimit(): void {
    const now = Date.now();
    const elapsed = now - this.windowStart;

    // Reset window if needed
    if (elapsed > BINANCE_CONFIG.RATE_LIMIT.WINDOW_MS) {
      this.requestCount = 0;
      this.windowStart = now;
    }

    // Check limit
    if (this.requestCount >= BINANCE_CONFIG.RATE_LIMIT.MAX_REQUESTS) {
      throw new Error(ERROR_MESSAGES.RATE_LIMIT);
    }

    this.requestCount++;
  }

  /**
   * Fetch with timeout and error handling
   */
  private static async fetchWithTimeout<T>(
    url: string,
    options: BinanceServiceOptions = {},
  ): Promise<T> {
    const { timeout = BINANCE_CONFIG.REQUEST_TIMEOUT, retries = 0 } = options;

    this.checkRateLimit();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Try to parse error from Binance
        try {
          const error = await response.json();
          throw new Error(
            `${ERROR_MESSAGES.UPSTREAM_ERROR}: ${error.msg || response.statusText}`,
          );
        } catch {
          throw new Error(
            `${ERROR_MESSAGES.UPSTREAM_ERROR}: HTTP ${response.status}`,
          );
        }
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      clearTimeout(timeoutId);

      // Handle timeout
      if (error.name === "AbortError") {
        if (retries > 0) {
          console.warn(
            `[BinanceService] Timeout, retrying... (${retries} left)`,
          );
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1s before retry
          return this.fetchWithTimeout<T>(url, {
            ...options,
            retries: retries - 1,
          });
        }
        throw new Error(ERROR_MESSAGES.TIMEOUT);
      }

      // Network error
      if (error.message.includes("fetch")) {
        throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
      }

      throw error;
    }
  }

  /**
   * Get from cache or fetch
   */
  private static async getCached<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number,
    useCache: boolean = true,
  ): Promise<T> {
    // Skip cache if disabled
    if (!useCache) {
      return fetcher();
    }

    // Check cache
    const cached = this.cache.get(key);
    const now = Date.now();

    if (cached && now - cached.timestamp < cached.ttl) {
      console.log(`[BinanceService] Cache HIT: ${key}`);
      return cached.data as T;
    }

    // Fetch new data
    console.log(`[BinanceService] Cache MISS: ${key}`);
    const data = await fetcher();

    // Store in cache
    this.cache.set(key, {
      data,
      timestamp: now,
      ttl,
    });

    return data;
  }

  /**
   * Get 24hr ticker for single symbol
   */
  static async get24hrTicker(
    symbol: string,
    options: BinanceServiceOptions = {},
  ): Promise<Binance24hrTicker> {
    const key = `ticker24hr:${symbol}`;
    const url = `${BINANCE_CONFIG.SPOT_API}${ENDPOINTS.TICKER_24HR}?symbol=${symbol.toUpperCase()}`;

    return this.getCached(
      key,
      () => this.fetchWithTimeout<Binance24hrTicker>(url, options),
      BINANCE_CONFIG.CACHE_TTL.TICKER_24HR,
      options.cache !== false,
    );
  }

  /**
   * Get 24hr tickers for multiple symbols
   */
  static async get24hrTickers(
    symbols: string[],
    options: BinanceServiceOptions = {},
  ): Promise<Binance24hrTicker[]> {
    const key = `ticker24hr:${symbols.sort().join(",")}`;

    return this.getCached(
      key,
      async () => {
        const requests = symbols.map((symbol) =>
          this.fetchWithTimeout<Binance24hrTicker>(
            `${BINANCE_CONFIG.SPOT_API}${ENDPOINTS.TICKER_24HR}?symbol=${symbol.toUpperCase()}`,
            options,
          ),
        );
        return Promise.all(requests);
      },
      BINANCE_CONFIG.CACHE_TTL.TICKER_24HR,
      options.cache !== false,
    );
  }

  /**
   * Get current price for single symbol
   */
  static async getPrice(
    symbol: string,
    options: BinanceServiceOptions = {},
  ): Promise<BinancePrice> {
    const key = `price:${symbol}`;
    const url = `${BINANCE_CONFIG.SPOT_API_VISION}${ENDPOINTS.TICKER_PRICE}?symbol=${symbol.toUpperCase()}`;

    return this.getCached(
      key,
      () => this.fetchWithTimeout<BinancePrice>(url, options),
      BINANCE_CONFIG.CACHE_TTL.PRICE,
      options.cache !== false,
    );
  }

  /**
   * Get order book depth
   */
  static async getDepth(
    symbol: string,
    limit: number = 20,
    options: BinanceServiceOptions = {},
  ): Promise<BinanceDepth> {
    const key = `depth:${symbol}:${limit}`;
    const url = `${BINANCE_CONFIG.SPOT_API_VISION}${ENDPOINTS.DEPTH}?symbol=${symbol.toUpperCase()}&limit=${limit}`;

    return this.getCached(
      key,
      () => this.fetchWithTimeout<BinanceDepth>(url, options),
      BINANCE_CONFIG.CACHE_TTL.DEPTH,
      options.cache !== false,
    );
  }

  /**
   * Get book ticker (best bid/ask)
   */
  static async getBookTicker(
    symbol: string,
    options: BinanceServiceOptions = {},
  ): Promise<BinanceBookTicker> {
    const key = `bookTicker:${symbol}`;
    const url = `${BINANCE_CONFIG.SPOT_API}${ENDPOINTS.BOOK_TICKER}?symbol=${symbol.toUpperCase()}`;

    return this.getCached(
      key,
      () => this.fetchWithTimeout<BinanceBookTicker>(url, options),
      BINANCE_CONFIG.CACHE_TTL.BOOK_TICKER,
      options.cache !== false,
    );
  }

  /**
   * Get futures funding rate
   */
  static async getFundingRate(
    symbol: string,
    options: BinanceServiceOptions = {},
  ): Promise<BinancePremiumIndex> {
    const key = `funding:${symbol}`;
    const url = `${BINANCE_CONFIG.FUTURES_API}${ENDPOINTS.PREMIUM_INDEX}?symbol=${symbol.toUpperCase()}`;

    return this.getCached(
      key,
      () => this.fetchWithTimeout<BinancePremiumIndex>(url, options),
      BINANCE_CONFIG.CACHE_TTL.FUNDING,
      options.cache !== false,
    );
  }

  /**
   * Clear cache
   */
  static clearCache(pattern?: string): void {
    if (pattern) {
      // Clear matching keys
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
          console.log(`[BinanceService] Cleared cache: ${key}`);
        }
      }
    } else {
      // Clear all
      this.cache.clear();
      console.log("[BinanceService] Cleared all cache");
    }
  }

  /**
   * Get cache stats
   */
  static getCacheStats() {
    return {
      size: this.cache.size,
      requestCount: this.requestCount,
      keys: Array.from(this.cache.keys()),
    };
  }
}
