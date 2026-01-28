// lib/config/apiConfig.examples.ts
// Usage Examples for Tresaurio API Configuration
// ============================================================================

import {
  // Types
  type Exchange,
  type MarketType,
  type DataProvider,

  // Configurations
  EXCHANGE_CONFIG,
  DATA_PROVIDER_CONFIG,
  MODULE_UPDATE_INTERVALS,

  // Helper Functions
  buildExchangeUrl,
  buildProviderUrl,
  getWebSocketUrl,
  getCacheKey,
  getCacheTTL,
  isCacheValid,
  getRateLimit,
  getTimeout,
  requiresAuth,
  formatSymbol,
  getEnabledExchanges,
  getEnabledProviders,

  // Utilities
  apiCache,
  rateLimiter,
} from "./apiConfig";

// ============================================================================
// EXAMPLE 1: Basic URL Building
// ============================================================================

export function example1_BasicUrlBuilding() {
  // Build Binance spot ticker URL
  const binanceTickerUrl = buildExchangeUrl("binance", "spot", "spotTicker24h", {
    symbol: "BTCUSDT",
  });
  console.log("Binance Ticker URL:", binanceTickerUrl);
  // Output: https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT

  // Build Binance futures depth URL
  const binanceDepthUrl = buildExchangeUrl("binance", "futures", "futuresDepth", {
    symbol: "BTCUSDT",
    limit: 20,
  });
  console.log("Binance Depth URL:", binanceDepthUrl);
  // Output: https://fapi.binance.com/fapi/v1/depth?symbol=BTCUSDT&limit=20

  // Build OKX funding rate URL
  const okxFundingUrl = buildExchangeUrl("okx", "futures", "fundingRate", {
    instId: "BTC-USDT-SWAP",
  });
  console.log("OKX Funding URL:", okxFundingUrl);

  // Build Bybit orderbook URL
  const bybitDepthUrl = buildExchangeUrl("bybit", "futures", "depth", {
    category: "linear",
    symbol: "BTCUSDT",
    limit: 50,
  });
  console.log("Bybit Depth URL:", bybitDepthUrl);
}

// ============================================================================
// EXAMPLE 2: Data Provider URLs
// ============================================================================

export function example2_DataProviderUrls() {
  // CoinGecko price
  const coingeckoUrl = buildProviderUrl("coingecko", "price", {
    ids: "bitcoin,ethereum",
    vs_currencies: "usd",
  });
  console.log("CoinGecko Price URL:", coingeckoUrl);

  // DeFiLlama TVL
  const defillamaUrl = buildProviderUrl("defillama", "tvl", {
    protocol: "aave",
  });
  console.log("DeFiLlama TVL URL:", defillamaUrl);

  // Etherscan balance
  const etherscanUrl = buildProviderUrl("etherscan", "balance", {
    address: "0x...",
    tag: "latest",
    apikey: "YOUR_API_KEY",
  });
  console.log("Etherscan Balance URL:", etherscanUrl);
}

// ============================================================================
// EXAMPLE 3: WebSocket URLs
// ============================================================================

export function example3_WebSocketUrls() {
  // Get WebSocket URLs for all exchanges
  const exchanges: Exchange[] = ["binance", "okx", "bybit", "coinbase"];
  const marketTypes: MarketType[] = ["spot", "futures"];

  exchanges.forEach((exchange) => {
    marketTypes.forEach((marketType) => {
      const wsUrl = getWebSocketUrl(exchange, marketType);
      console.log(`${exchange} ${marketType}: ${wsUrl}`);
    });
  });

  /* Output:
    binance spot: wss://stream.binance.com:9443/ws
    binance futures: wss://fstream.binance.com/ws
    okx spot: wss://ws.okx.com:8443/ws/v5/public
    okx futures: wss://ws.okx.com:8443/ws/v5/public
    bybit spot: wss://stream.bybit.com/v5/public/spot
    bybit futures: wss://stream.bybit.com/v5/public/linear
    coinbase spot: wss://ws-feed.exchange.coinbase.com
    coinbase futures: wss://ws-feed.exchange.coinbase.com
  */
}

// ============================================================================
// EXAMPLE 4: Caching with TTL
// ============================================================================

export async function example4_CachingWithTTL() {
  const exchange: Exchange = "binance";
  const endpoint = "spotTicker24h";
  const params = { symbol: "BTCUSDT" };

  // Check cache first
  const cachedData = apiCache.get<{ price: string }>(exchange, endpoint, params);

  if (cachedData) {
    console.log("Using cached data:", cachedData);
    return cachedData;
  }

  // Fetch fresh data
  const url = buildExchangeUrl(exchange, "spot", endpoint, params);
  const response = await fetch(url, {
    signal: AbortSignal.timeout(getTimeout(exchange)),
  });
  const data = await response.json();

  // Store in cache
  apiCache.set(exchange, endpoint, params, data);
  console.log("Fetched and cached:", data);

  return data;
}

// ============================================================================
// EXAMPLE 5: Rate Limiting
// ============================================================================

export async function example5_RateLimiting() {
  const exchange: Exchange = "binance";

  // Check if we can make a request
  if (!rateLimiter.canMakeRequest(exchange)) {
    const waitTime = rateLimiter.getWaitTime(exchange);
    console.log(`Rate limited. Wait ${waitTime}ms before next request.`);
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }

  // Record the request
  rateLimiter.recordRequest(exchange);

  // Make the request
  const url = buildExchangeUrl(exchange, "spot", "spotTicker24h", {
    symbol: "BTCUSDT",
  });
  const response = await fetch(url);
  const data = await response.json();

  // Check remaining quota
  const stats = rateLimiter.getStats(exchange);
  console.log(`Remaining requests: ${stats.remainingRequests}/${stats.limit}`);

  return data;
}

// ============================================================================
// EXAMPLE 6: Multi-Exchange Price Comparison
// ============================================================================

export async function example6_MultiExchangePriceComparison(symbol: string) {
  const exchanges = getEnabledExchanges();
  const prices: Record<string, number> = {};

  await Promise.all(
    exchanges.map(async (exchange) => {
      try {
        // Check rate limit
        if (!rateLimiter.canMakeRequest(exchange)) {
          console.warn(`${exchange}: Rate limited, skipping`);
          return;
        }

        // Get cached or fresh data
        const cacheKey = `ticker_${symbol}`;
        const cached = apiCache.get<{ price: number }>(exchange, cacheKey);

        if (cached) {
          prices[exchange] = cached.price;
          return;
        }

        // Build appropriate URL for each exchange
        let url: string;
        const formattedSymbol = formatSymbol(symbol, exchange, "spot");

        switch (exchange) {
          case "binance":
            url = buildExchangeUrl(exchange, "spot", "spotTicker24h", {
              symbol: formattedSymbol,
            });
            break;
          case "okx":
            url = buildExchangeUrl(exchange, "spot", "ticker", {
              instId: formattedSymbol,
            });
            break;
          case "bybit":
            url = buildExchangeUrl(exchange, "spot", "ticker", {
              category: "spot",
              symbol: formattedSymbol,
            });
            break;
          case "coinbase":
            url = buildExchangeUrl(exchange, "spot", "ticker", {
              product_id: formattedSymbol,
            });
            break;
          default:
            return;
        }

        rateLimiter.recordRequest(exchange);
        const response = await fetch(url, {
          signal: AbortSignal.timeout(getTimeout(exchange)),
        });
        const data = await response.json();

        // Parse price based on exchange response format
        let price: number;
        switch (exchange) {
          case "binance":
            price = parseFloat(data.lastPrice);
            break;
          case "okx":
            price = parseFloat(data.data?.[0]?.last);
            break;
          case "bybit":
            price = parseFloat(data.result?.list?.[0]?.lastPrice);
            break;
          case "coinbase":
            price = parseFloat(data.price);
            break;
          default:
            price = 0;
        }

        prices[exchange] = price;
        apiCache.set(exchange, cacheKey, undefined, { price });
      } catch (error) {
        console.error(`Error fetching from ${exchange}:`, error);
      }
    })
  );

  // Calculate spread
  const priceValues = Object.values(prices).filter((p) => p > 0);
  const minPrice = Math.min(...priceValues);
  const maxPrice = Math.max(...priceValues);
  const spreadPercent = ((maxPrice - minPrice) / minPrice) * 100;

  return {
    prices,
    minPrice,
    maxPrice,
    spreadPercent: spreadPercent.toFixed(4),
    bestBuy: Object.entries(prices).find(([, p]) => p === minPrice)?.[0],
    bestSell: Object.entries(prices).find(([, p]) => p === maxPrice)?.[0],
  };
}

// ============================================================================
// EXAMPLE 7: Fetching Funding Rates from Multiple Exchanges
// ============================================================================

export async function example7_FundingRatesComparison(symbol: string) {
  const results: Record<string, { rate: number; nextFunding: number }> = {};

  // Binance
  try {
    const binanceUrl = buildExchangeUrl("binance", "futures", "futuresMarkPrice", {
      symbol: formatSymbol(symbol, "binance", "futures"),
    });
    const binanceRes = await fetch(binanceUrl);
    const binanceData = await binanceRes.json();
    results.binance = {
      rate: parseFloat(binanceData.lastFundingRate) * 100,
      nextFunding: binanceData.nextFundingTime,
    };
  } catch (e) {
    console.error("Binance funding error:", e);
  }

  // OKX
  try {
    const okxUrl = buildExchangeUrl("okx", "futures", "fundingRate", {
      instId: formatSymbol(symbol, "okx", "futures"),
    });
    const okxRes = await fetch(okxUrl);
    const okxData = await okxRes.json();
    results.okx = {
      rate: parseFloat(okxData.data?.[0]?.fundingRate) * 100,
      nextFunding: parseInt(okxData.data?.[0]?.nextFundingTime),
    };
  } catch (e) {
    console.error("OKX funding error:", e);
  }

  // Bybit
  try {
    const bybitUrl = buildExchangeUrl("bybit", "futures", "fundingRate", {
      category: "linear",
      symbol: formatSymbol(symbol, "bybit", "futures"),
    });
    const bybitRes = await fetch(bybitUrl);
    const bybitData = await bybitRes.json();
    const item = bybitData.result?.list?.[0];
    results.bybit = {
      rate: parseFloat(item?.fundingRate) * 100,
      nextFunding: parseInt(item?.fundingRateTimestamp),
    };
  } catch (e) {
    console.error("Bybit funding error:", e);
  }

  return results;
}

// ============================================================================
// EXAMPLE 8: Symbol Formatting Across Exchanges
// ============================================================================

export function example8_SymbolFormatting() {
  const baseSymbol = "BTCUSDT";
  const exchanges: Exchange[] = ["binance", "okx", "bybit", "coinbase"];
  const marketTypes: MarketType[] = ["spot", "futures"];

  const formatted: Record<string, Record<string, string>> = {};

  exchanges.forEach((exchange) => {
    formatted[exchange] = {};
    marketTypes.forEach((marketType) => {
      formatted[exchange][marketType] = formatSymbol(baseSymbol, exchange, marketType);
    });
  });

  console.log("Symbol Formatting:");
  console.table(formatted);

  /* Output:
    ┌──────────┬─────────────┬─────────────────┐
    │          │ spot        │ futures         │
    ├──────────┼─────────────┼─────────────────┤
    │ binance  │ BTCUSDT     │ BTCUSDT         │
    │ okx      │ BTC-USDT    │ BTC-USDT-SWAP   │
    │ bybit    │ BTCUSDT     │ BTCUSDT         │
    │ coinbase │ BTC-USD     │ BTC-USD         │
    └──────────┴─────────────┴─────────────────┘
  */

  return formatted;
}

// ============================================================================
// EXAMPLE 9: Module Update Interval Management
// ============================================================================

export function example9_ModuleIntervals() {
  // Get all module intervals
  console.log("Module Update Intervals:");

  Object.entries(MODULE_UPDATE_INTERVALS).forEach(([key, config]) => {
    const intervalStr =
      config.interval === 0
        ? "Realtime"
        : config.interval >= 86400000
          ? `${config.interval / 86400000} day(s)`
          : config.interval >= 3600000
            ? `${config.interval / 3600000} hour(s)`
            : config.interval >= 60000
              ? `${config.interval / 60000} minute(s)`
              : `${config.interval / 1000} seconds`;

    console.log(`  ${config.name}: ${intervalStr}`);
  });

  // Create interval-based updater
  function createModuleUpdater(
    moduleKey: string,
    updateFn: () => Promise<void>
  ): NodeJS.Timeout | null {
    const config = MODULE_UPDATE_INTERVALS[moduleKey];

    if (!config) {
      console.error(`Unknown module: ${moduleKey}`);
      return null;
    }

    if (config.interval === 0) {
      console.log(`${config.name}: Use WebSocket for realtime updates`);
      return null;
    }

    console.log(`${config.name}: Setting up ${config.interval}ms interval`);
    return setInterval(updateFn, config.interval);
  }

  // Example usage
  const exchangeComparisonUpdater = createModuleUpdater(
    "exchangeComparison",
    async () => {
      console.log("Updating exchange comparison data...");
      // Fetch and update logic here
    }
  );

  return exchangeComparisonUpdater;
}

// ============================================================================
// EXAMPLE 10: Complete API Fetcher with All Features
// ============================================================================

interface FetchOptions {
  exchange: Exchange;
  marketType: MarketType;
  endpoint: string;
  params?: Record<string, string | number>;
  bypassCache?: boolean;
  bypassRateLimit?: boolean;
}

interface FetchResult<T> {
  data: T | null;
  fromCache: boolean;
  error: string | null;
  rateLimitStats: {
    requestsInWindow: number;
    limit: number;
    remainingRequests: number;
  };
}

export async function example10_CompleteFetcher<T>(
  options: FetchOptions
): Promise<FetchResult<T>> {
  const { exchange, marketType, endpoint, params, bypassCache, bypassRateLimit } =
    options;

  // 1. Check cache
  if (!bypassCache) {
    const cached = apiCache.get<T>(exchange, endpoint, params);
    if (cached) {
      return {
        data: cached,
        fromCache: true,
        error: null,
        rateLimitStats: rateLimiter.getStats(exchange),
      };
    }
  }

  // 2. Check rate limit
  if (!bypassRateLimit && !rateLimiter.canMakeRequest(exchange)) {
    const waitTime = rateLimiter.getWaitTime(exchange);
    return {
      data: null,
      fromCache: false,
      error: `Rate limited. Wait ${waitTime}ms`,
      rateLimitStats: rateLimiter.getStats(exchange),
    };
  }

  // 3. Check authentication requirement
  if (requiresAuth(exchange, endpoint)) {
    console.warn(`Endpoint ${endpoint} requires authentication`);
    // In real app: add auth headers here
  }

  // 4. Build URL
  const url = buildExchangeUrl(exchange, marketType, endpoint, params);

  // 5. Make request
  try {
    rateLimiter.recordRequest(exchange);

    const response = await fetch(url, {
      signal: AbortSignal.timeout(getTimeout(exchange)),
      headers: {
        "Content-Type": "application/json",
        // Add auth headers if needed
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = (await response.json()) as T;

    // 6. Cache the result
    apiCache.set(exchange, endpoint, params, data);

    return {
      data,
      fromCache: false,
      error: null,
      rateLimitStats: rateLimiter.getStats(exchange),
    };
  } catch (error) {
    return {
      data: null,
      fromCache: false,
      error: error instanceof Error ? error.message : "Unknown error",
      rateLimitStats: rateLimiter.getStats(exchange),
    };
  }
}

// ============================================================================
// EXAMPLE 11: Batch Requests with Rate Limiting
// ============================================================================

export async function example11_BatchRequests(symbols: string[]) {
  const exchange: Exchange = "binance";
  const results: Record<string, unknown> = {};
  const batchSize = 10;
  const delayBetweenBatches = 1000; // 1 second

  // Split symbols into batches
  const batches: string[][] = [];
  for (let i = 0; i < symbols.length; i += batchSize) {
    batches.push(symbols.slice(i, i + batchSize));
  }

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];

    // Process batch in parallel
    const batchPromises = batch.map(async (symbol) => {
      // Check rate limit
      while (!rateLimiter.canMakeRequest(exchange)) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      rateLimiter.recordRequest(exchange);

      const url = buildExchangeUrl(exchange, "spot", "spotTicker24h", { symbol });
      const response = await fetch(url);
      const data = await response.json();
      results[symbol] = data;
    });

    await Promise.all(batchPromises);

    // Wait between batches (except for last batch)
    if (i < batches.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayBetweenBatches));
    }
  }

  return results;
}

// ============================================================================
// EXAMPLE 12: Health Check for All APIs
// ============================================================================

export async function example12_HealthCheck() {
  const results: Record<
    string,
    { status: "ok" | "error"; latency: number; error?: string }
  > = {};

  // Check exchanges
  const exchanges = getEnabledExchanges();
  await Promise.all(
    exchanges.map(async (exchange) => {
      const start = Date.now();
      try {
        const url = buildExchangeUrl(exchange, "spot", "spotTicker24h", {
          symbol: formatSymbol("BTCUSDT", exchange, "spot"),
        });

        const response = await fetch(url, {
          signal: AbortSignal.timeout(5000),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        results[exchange] = {
          status: "ok",
          latency: Date.now() - start,
        };
      } catch (error) {
        results[exchange] = {
          status: "error",
          latency: Date.now() - start,
          error: error instanceof Error ? error.message : "Unknown",
        };
      }
    })
  );

  // Check data providers
  const providers = getEnabledProviders();
  await Promise.all(
    providers.map(async (provider) => {
      const start = Date.now();
      try {
        let url: string;
        switch (provider) {
          case "coingecko":
            url = buildProviderUrl("coingecko", "price", {
              ids: "bitcoin",
              vs_currencies: "usd",
            });
            break;
          case "defillama":
            url = buildProviderUrl("defillama", "chains");
            break;
          default:
            results[provider] = { status: "ok", latency: 0 };
            return;
        }

        const response = await fetch(url, {
          signal: AbortSignal.timeout(5000),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        results[provider] = {
          status: "ok",
          latency: Date.now() - start,
        };
      } catch (error) {
        results[provider] = {
          status: "error",
          latency: Date.now() - start,
          error: error instanceof Error ? error.message : "Unknown",
        };
      }
    })
  );

  return results;
}

// ============================================================================
// EXAMPLE 13: React Hook Usage Pattern
// ============================================================================

export const example13_ReactHookPattern = `
// hooks/useExchangeData.ts
import { useState, useEffect, useCallback } from 'react';
import {
  buildExchangeUrl,
  getTimeout,
  apiCache,
  rateLimiter,
  type Exchange,
  type MarketType,
} from '@/lib/config/apiConfig';

interface UseExchangeDataOptions {
  exchange: Exchange;
  marketType: MarketType;
  endpoint: string;
  params?: Record<string, string | number>;
  refreshInterval?: number;
  enabled?: boolean;
}

export function useExchangeData<T>(options: UseExchangeDataOptions) {
  const {
    exchange,
    marketType,
    endpoint,
    params,
    refreshInterval = 0,
    enabled = true,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    // Check cache
    const cached = apiCache.get<T>(exchange, endpoint, params);
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }

    // Check rate limit
    if (!rateLimiter.canMakeRequest(exchange)) {
      setError('Rate limited');
      return;
    }

    try {
      setLoading(true);
      rateLimiter.recordRequest(exchange);

      const url = buildExchangeUrl(exchange, marketType, endpoint, params);
      const response = await fetch(url, {
        signal: AbortSignal.timeout(getTimeout(exchange)),
      });

      if (!response.ok) throw new Error(\`HTTP \${response.status}\`);

      const result = await response.json() as T;
      apiCache.set(exchange, endpoint, params, result);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [exchange, marketType, endpoint, JSON.stringify(params), enabled]);

  useEffect(() => {
    fetchData();

    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, refreshInterval]);

  return { data, loading, error, refetch: fetchData };
}

// Usage:
// const { data, loading, error } = useExchangeData({
//   exchange: 'binance',
//   marketType: 'spot',
//   endpoint: 'spotTicker24h',
//   params: { symbol: 'BTCUSDT' },
//   refreshInterval: 3000,
// });
`;

// ============================================================================
// EXAMPLE 14: Migration Helper - Converting Old Code
// ============================================================================

export const example14_MigrationPatterns = `
// ============================================================================
// BEFORE: Hardcoded URLs scattered in code
// ============================================================================

// Old code in component
const fetchOldWay = async () => {
  const response = await fetch(
    'https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT'
  );
  return response.json();
};

// ============================================================================
// AFTER: Using centralized config
// ============================================================================

import { buildExchangeUrl, apiCache, rateLimiter } from '@/lib/config/apiConfig';

const fetchNewWay = async () => {
  // Check cache first
  const cached = apiCache.get('binance', 'spotTicker24h', { symbol: 'BTCUSDT' });
  if (cached) return cached;

  // Check rate limit
  if (!rateLimiter.canMakeRequest('binance')) {
    throw new Error('Rate limited');
  }

  // Build URL from config
  const url = buildExchangeUrl('binance', 'spot', 'spotTicker24h', {
    symbol: 'BTCUSDT',
  });

  rateLimiter.recordRequest('binance');
  const response = await fetch(url);
  const data = await response.json();

  // Cache the result
  apiCache.set('binance', 'spotTicker24h', { symbol: 'BTCUSDT' }, data);

  return data;
};

// ============================================================================
// MIGRATION CHECKLIST:
// ============================================================================
// 1. Replace hardcoded URLs with buildExchangeUrl() or buildProviderUrl()
// 2. Add cache checks before making requests
// 3. Add rate limit checks
// 4. Use getTimeout() for request timeouts
// 5. Use formatSymbol() for consistent symbol formatting
// 6. Store fetched data in apiCache
// 7. Handle errors with retry logic based on rate limit config
`;

// ============================================================================
// Run Examples (for testing)
// ============================================================================

export async function runAllExamples() {
  console.log("=".repeat(60));
  console.log("Running API Config Examples");
  console.log("=".repeat(60));

  console.log("\n--- Example 1: Basic URL Building ---");
  example1_BasicUrlBuilding();

  console.log("\n--- Example 2: Data Provider URLs ---");
  example2_DataProviderUrls();

  console.log("\n--- Example 3: WebSocket URLs ---");
  example3_WebSocketUrls();

  console.log("\n--- Example 8: Symbol Formatting ---");
  example8_SymbolFormatting();

  console.log("\n--- Example 9: Module Intervals ---");
  example9_ModuleIntervals();

  console.log("\n--- Cache Stats ---");
  console.log(apiCache.getStats());

  console.log("\n--- Rate Limiter Stats ---");
  getEnabledExchanges().forEach((exchange) => {
    console.log(`${exchange}:`, rateLimiter.getStats(exchange));
  });

  console.log("\n" + "=".repeat(60));
  console.log("Examples completed!");
  console.log("=".repeat(60));
}

// Uncomment to run:
// runAllExamples();
