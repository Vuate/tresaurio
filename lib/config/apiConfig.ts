// lib/config/apiConfig.ts
// Centralized API Configuration for Tresaurio Trading Dashboard
// Version: 1.0.0

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type Exchange = "binance" | "okx" | "bybit" | "coinbase";
export type MarketType = "spot" | "futures";
export type DataProvider = "coingecko" | "defillama" | "etherscan" | "cryptoquant";

export interface RateLimitConfig {
  requestsPerMinute: number;
  requestsPerSecond: number;
  burstLimit: number;
  retryAfterMs: number;
}

export interface CacheConfig {
  ticker: number;
  depth: number;
  funding: number;
  klines: number;
  account: number;
  positions: number;
  trades: number;
  default: number;
}

export interface EndpointConfig {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  cacheTTL: number;
  requiresAuth: boolean;
  rateWeight: number;
  description: string;
}

export interface ExchangeConfig {
  name: string;
  id: Exchange;
  enabled: boolean;
  rest: {
    spot: string;
    futures: string;
  };
  websocket: {
    spot: string;
    futures: string;
  };
  rateLimit: RateLimitConfig;
  cache: CacheConfig;
  timeout: number;
  endpoints: Record<string, EndpointConfig>;
}

export interface DataProviderConfig {
  name: string;
  id: DataProvider;
  enabled: boolean;
  baseUrl: string;
  rateLimit: RateLimitConfig;
  timeout: number;
  apiKeyRequired: boolean;
  endpoints: Record<string, EndpointConfig>;
}

export interface ModuleUpdateInterval {
  name: string;
  interval: number; // ms, 0 = realtime
  description: string;
}

// ============================================================================
// EXCHANGE CONFIGURATIONS
// ============================================================================

export const EXCHANGE_CONFIG: Record<Exchange, ExchangeConfig> = {
  binance: {
    name: "Binance",
    id: "binance",
    enabled: true,
    rest: {
      spot: "https://api.binance.com",
      futures: "https://fapi.binance.com",
    },
    websocket: {
      spot: "wss://stream.binance.com:9443/ws",
      futures: "wss://fstream.binance.com/ws",
    },
    rateLimit: {
      requestsPerMinute: 1200,
      requestsPerSecond: 20,
      burstLimit: 50,
      retryAfterMs: 60000,
    },
    cache: {
      ticker: 3000,      // 3 seconds
      depth: 1000,       // 1 second
      funding: 5000,     // 5 seconds
      klines: 60000,     // 1 minute
      account: 5000,     // 5 seconds
      positions: 3000,   // 3 seconds
      trades: 1000,      // 1 second
      default: 5000,     // 5 seconds
    },
    timeout: 10000,
    endpoints: {
      // Spot endpoints
      spotTicker24h: {
        path: "/api/v3/ticker/24hr",
        method: "GET",
        cacheTTL: 3000,
        requiresAuth: false,
        rateWeight: 1,
        description: "24hr ticker price change statistics",
      },
      spotDepth: {
        path: "/api/v3/depth",
        method: "GET",
        cacheTTL: 1000,
        requiresAuth: false,
        rateWeight: 5,
        description: "Order book depth",
      },
      spotKlines: {
        path: "/api/v3/klines",
        method: "GET",
        cacheTTL: 60000,
        requiresAuth: false,
        rateWeight: 1,
        description: "Kline/candlestick data",
      },
      spotTrades: {
        path: "/api/v3/trades",
        method: "GET",
        cacheTTL: 1000,
        requiresAuth: false,
        rateWeight: 1,
        description: "Recent trades",
      },
      spotAccount: {
        path: "/api/v3/account",
        method: "GET",
        cacheTTL: 5000,
        requiresAuth: true,
        rateWeight: 10,
        description: "Account information",
      },
      // Futures endpoints
      futuresTicker24h: {
        path: "/fapi/v1/ticker/24hr",
        method: "GET",
        cacheTTL: 3000,
        requiresAuth: false,
        rateWeight: 1,
        description: "24hr ticker for futures",
      },
      futuresDepth: {
        path: "/fapi/v1/depth",
        method: "GET",
        cacheTTL: 1000,
        requiresAuth: false,
        rateWeight: 5,
        description: "Futures order book",
      },
      futuresFunding: {
        path: "/fapi/v1/fundingRate",
        method: "GET",
        cacheTTL: 5000,
        requiresAuth: false,
        rateWeight: 1,
        description: "Funding rate history",
      },
      futuresMarkPrice: {
        path: "/fapi/v1/premiumIndex",
        method: "GET",
        cacheTTL: 3000,
        requiresAuth: false,
        rateWeight: 1,
        description: "Mark price and funding rate",
      },
      futuresPositions: {
        path: "/fapi/v2/positionRisk",
        method: "GET",
        cacheTTL: 3000,
        requiresAuth: true,
        rateWeight: 5,
        description: "Position information",
      },
      futuresOpenInterest: {
        path: "/fapi/v1/openInterest",
        method: "GET",
        cacheTTL: 5000,
        requiresAuth: false,
        rateWeight: 1,
        description: "Open interest statistics",
      },
    },
  },

  okx: {
    name: "OKX",
    id: "okx",
    enabled: true,
    rest: {
      spot: "https://www.okx.com",
      futures: "https://www.okx.com",
    },
    websocket: {
      spot: "wss://ws.okx.com:8443/ws/v5/public",
      futures: "wss://ws.okx.com:8443/ws/v5/public",
    },
    rateLimit: {
      requestsPerMinute: 800,
      requestsPerSecond: 13,
      burstLimit: 30,
      retryAfterMs: 60000,
    },
    cache: {
      ticker: 3000,
      depth: 1000,
      funding: 5000,
      klines: 60000,
      account: 5000,
      positions: 3000,
      trades: 1000,
      default: 5000,
    },
    timeout: 10000,
    endpoints: {
      ticker: {
        path: "/api/v5/market/ticker",
        method: "GET",
        cacheTTL: 3000,
        requiresAuth: false,
        rateWeight: 1,
        description: "Ticker information",
      },
      depth: {
        path: "/api/v5/market/books",
        method: "GET",
        cacheTTL: 1000,
        requiresAuth: false,
        rateWeight: 1,
        description: "Order book",
      },
      fundingRate: {
        path: "/api/v5/public/funding-rate",
        method: "GET",
        cacheTTL: 5000,
        requiresAuth: false,
        rateWeight: 1,
        description: "Current funding rate",
      },
      fundingHistory: {
        path: "/api/v5/public/funding-rate-history",
        method: "GET",
        cacheTTL: 60000,
        requiresAuth: false,
        rateWeight: 1,
        description: "Funding rate history",
      },
      markPrice: {
        path: "/api/v5/public/mark-price",
        method: "GET",
        cacheTTL: 3000,
        requiresAuth: false,
        rateWeight: 1,
        description: "Mark price",
      },
      positions: {
        path: "/api/v5/account/positions",
        method: "GET",
        cacheTTL: 3000,
        requiresAuth: true,
        rateWeight: 1,
        description: "Position information",
      },
      openInterest: {
        path: "/api/v5/public/open-interest",
        method: "GET",
        cacheTTL: 5000,
        requiresAuth: false,
        rateWeight: 1,
        description: "Open interest",
      },
    },
  },

  bybit: {
    name: "Bybit",
    id: "bybit",
    enabled: true,
    rest: {
      spot: "https://api.bybit.com",
      futures: "https://api.bybit.com",
    },
    websocket: {
      spot: "wss://stream.bybit.com/v5/public/spot",
      futures: "wss://stream.bybit.com/v5/public/linear",
    },
    rateLimit: {
      requestsPerMinute: 600,
      requestsPerSecond: 10,
      burstLimit: 20,
      retryAfterMs: 60000,
    },
    cache: {
      ticker: 3000,
      depth: 1000,
      funding: 5000,
      klines: 60000,
      account: 5000,
      positions: 3000,
      trades: 1000,
      default: 5000,
    },
    timeout: 10000,
    endpoints: {
      ticker: {
        path: "/v5/market/tickers",
        method: "GET",
        cacheTTL: 3000,
        requiresAuth: false,
        rateWeight: 1,
        description: "Ticker information",
      },
      depth: {
        path: "/v5/market/orderbook",
        method: "GET",
        cacheTTL: 1000,
        requiresAuth: false,
        rateWeight: 1,
        description: "Order book",
      },
      fundingRate: {
        path: "/v5/market/funding/history",
        method: "GET",
        cacheTTL: 5000,
        requiresAuth: false,
        rateWeight: 1,
        description: "Funding rate history",
      },
      klines: {
        path: "/v5/market/kline",
        method: "GET",
        cacheTTL: 60000,
        requiresAuth: false,
        rateWeight: 1,
        description: "Kline data",
      },
      positions: {
        path: "/v5/position/list",
        method: "GET",
        cacheTTL: 3000,
        requiresAuth: true,
        rateWeight: 1,
        description: "Position list",
      },
      openInterest: {
        path: "/v5/market/open-interest",
        method: "GET",
        cacheTTL: 5000,
        requiresAuth: false,
        rateWeight: 1,
        description: "Open interest",
      },
    },
  },

  coinbase: {
    name: "Coinbase",
    id: "coinbase",
    enabled: true,
    rest: {
      spot: "https://api.exchange.coinbase.com",
      futures: "https://api.exchange.coinbase.com",
    },
    websocket: {
      spot: "wss://ws-feed.exchange.coinbase.com",
      futures: "wss://ws-feed.exchange.coinbase.com",
    },
    rateLimit: {
      requestsPerMinute: 600,
      requestsPerSecond: 10,
      burstLimit: 15,
      retryAfterMs: 60000,
    },
    cache: {
      ticker: 3000,
      depth: 1000,
      funding: 5000,
      klines: 60000,
      account: 5000,
      positions: 3000,
      trades: 1000,
      default: 5000,
    },
    timeout: 10000,
    endpoints: {
      ticker: {
        path: "/products/{product_id}/ticker",
        method: "GET",
        cacheTTL: 3000,
        requiresAuth: false,
        rateWeight: 1,
        description: "Product ticker",
      },
      depth: {
        path: "/products/{product_id}/book",
        method: "GET",
        cacheTTL: 1000,
        requiresAuth: false,
        rateWeight: 1,
        description: "Order book",
      },
      products: {
        path: "/products",
        method: "GET",
        cacheTTL: 300000,
        requiresAuth: false,
        rateWeight: 1,
        description: "All products",
      },
      trades: {
        path: "/products/{product_id}/trades",
        method: "GET",
        cacheTTL: 1000,
        requiresAuth: false,
        rateWeight: 1,
        description: "Recent trades",
      },
    },
  },
};

// ============================================================================
// DATA PROVIDER CONFIGURATIONS
// ============================================================================

export const DATA_PROVIDER_CONFIG: Record<DataProvider, DataProviderConfig> = {
  coingecko: {
    name: "CoinGecko",
    id: "coingecko",
    enabled: true,
    baseUrl: "https://api.coingecko.com/api/v3",
    rateLimit: {
      requestsPerMinute: 50, // Free tier
      requestsPerSecond: 1,
      burstLimit: 5,
      retryAfterMs: 60000,
    },
    timeout: 15000,
    apiKeyRequired: false,
    endpoints: {
      price: {
        path: "/simple/price",
        method: "GET",
        cacheTTL: 60000,
        requiresAuth: false,
        rateWeight: 1,
        description: "Simple price data",
      },
      coinList: {
        path: "/coins/list",
        method: "GET",
        cacheTTL: 86400000, // 24 hours
        requiresAuth: false,
        rateWeight: 1,
        description: "All coins list",
      },
      coinData: {
        path: "/coins/{id}",
        method: "GET",
        cacheTTL: 300000, // 5 minutes
        requiresAuth: false,
        rateWeight: 1,
        description: "Coin data by ID",
      },
      marketChart: {
        path: "/coins/{id}/market_chart",
        method: "GET",
        cacheTTL: 300000,
        requiresAuth: false,
        rateWeight: 1,
        description: "Historical market data",
      },
      trending: {
        path: "/search/trending",
        method: "GET",
        cacheTTL: 600000, // 10 minutes
        requiresAuth: false,
        rateWeight: 1,
        description: "Trending coins",
      },
    },
  },

  defillama: {
    name: "DeFiLlama",
    id: "defillama",
    enabled: true,
    baseUrl: "https://api.llama.fi",
    rateLimit: {
      requestsPerMinute: 300,
      requestsPerSecond: 5,
      burstLimit: 10,
      retryAfterMs: 60000,
    },
    timeout: 15000,
    apiKeyRequired: false,
    endpoints: {
      protocols: {
        path: "/protocols",
        method: "GET",
        cacheTTL: 300000,
        requiresAuth: false,
        rateWeight: 1,
        description: "All protocols TVL",
      },
      tvl: {
        path: "/tvl/{protocol}",
        method: "GET",
        cacheTTL: 300000,
        requiresAuth: false,
        rateWeight: 1,
        description: "Protocol TVL",
      },
      chains: {
        path: "/chains",
        method: "GET",
        cacheTTL: 300000,
        requiresAuth: false,
        rateWeight: 1,
        description: "Chain TVL data",
      },
      bridges: {
        path: "/bridges",
        method: "GET",
        cacheTTL: 300000,
        requiresAuth: false,
        rateWeight: 1,
        description: "Bridge volume data",
      },
      stablecoins: {
        path: "/stablecoins",
        method: "GET",
        cacheTTL: 300000,
        requiresAuth: false,
        rateWeight: 1,
        description: "Stablecoin data",
      },
    },
  },

  etherscan: {
    name: "Etherscan",
    id: "etherscan",
    enabled: true,
    baseUrl: "https://api.etherscan.io/api",
    rateLimit: {
      requestsPerMinute: 300, // Pro tier
      requestsPerSecond: 5,
      burstLimit: 10,
      retryAfterMs: 1000,
    },
    timeout: 10000,
    apiKeyRequired: true,
    endpoints: {
      balance: {
        path: "?module=account&action=balance",
        method: "GET",
        cacheTTL: 30000,
        requiresAuth: true,
        rateWeight: 1,
        description: "ETH balance",
      },
      tokenBalance: {
        path: "?module=account&action=tokenbalance",
        method: "GET",
        cacheTTL: 30000,
        requiresAuth: true,
        rateWeight: 1,
        description: "Token balance",
      },
      txList: {
        path: "?module=account&action=txlist",
        method: "GET",
        cacheTTL: 60000,
        requiresAuth: true,
        rateWeight: 1,
        description: "Transaction list",
      },
      tokenTx: {
        path: "?module=account&action=tokentx",
        method: "GET",
        cacheTTL: 60000,
        requiresAuth: true,
        rateWeight: 1,
        description: "Token transfers",
      },
      gasPrice: {
        path: "?module=gastracker&action=gasoracle",
        method: "GET",
        cacheTTL: 15000,
        requiresAuth: true,
        rateWeight: 1,
        description: "Gas price oracle",
      },
    },
  },

  cryptoquant: {
    name: "CryptoQuant",
    id: "cryptoquant",
    enabled: true,
    baseUrl: "https://api.cryptoquant.com/v1",
    rateLimit: {
      requestsPerMinute: 100,
      requestsPerSecond: 2,
      burstLimit: 5,
      retryAfterMs: 60000,
    },
    timeout: 15000,
    apiKeyRequired: true,
    endpoints: {
      exchangeFlow: {
        path: "/btc/exchange-flows/netflow",
        method: "GET",
        cacheTTL: 300000,
        requiresAuth: true,
        rateWeight: 1,
        description: "Exchange netflow data",
      },
      minerFlow: {
        path: "/btc/miner-flows/netflow",
        method: "GET",
        cacheTTL: 300000,
        requiresAuth: true,
        rateWeight: 1,
        description: "Miner flow data",
      },
      marketIndicator: {
        path: "/btc/market-indicator",
        method: "GET",
        cacheTTL: 300000,
        requiresAuth: true,
        rateWeight: 1,
        description: "Market indicators",
      },
    },
  },
};

// ============================================================================
// MODULE UPDATE INTERVALS
// ============================================================================

export const MODULE_UPDATE_INTERVALS: Record<string, ModuleUpdateInterval> = {
  livePrices: {
    name: "Live Prices",
    interval: 0, // Realtime via WebSocket
    description: "Real-time price updates via WebSocket",
  },
  orderBook: {
    name: "Order Book",
    interval: 0, // Realtime via WebSocket
    description: "Real-time order book via WebSocket",
  },
  fundingRate: {
    name: "Funding Rate",
    interval: 0, // Realtime via WebSocket
    description: "Real-time funding rate via WebSocket",
  },
  exchangeComparison: {
    name: "Exchange Comparison",
    interval: 300000, // 5 minutes
    description: "Compare prices across exchanges",
  },
  spreadMonitor: {
    name: "Spread Monitor",
    interval: 0, // Realtime
    description: "Monitor bid-ask spreads",
  },
  slippageMonitor: {
    name: "Slippage Monitor",
    interval: 0, // Realtime
    description: "Estimate slippage for orders",
  },
  tokenUnlock: {
    name: "Token Unlock",
    interval: 86400000, // 24 hours
    description: "Token unlock schedules",
  },
  exchangeNetflow: {
    name: "Exchange Netflow",
    interval: 300000, // 5 minutes
    description: "Exchange inflow/outflow data",
  },
  walletInspector: {
    name: "Wallet Inspector",
    interval: 60000, // 1 minute
    description: "Wallet balance and activity",
  },
  futuresPositions: {
    name: "Futures Positions",
    interval: 5000, // 5 seconds
    description: "Open futures positions",
  },
  allInCost: {
    name: "All-in Cost Calculator",
    interval: 10000, // 10 seconds
    description: "Trading cost calculation",
  },
  rsiHeatmap: {
    name: "RSI Heatmap",
    interval: 60000, // 1 minute
    description: "RSI indicators heatmap",
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Build full URL for an exchange endpoint
 */
export function buildExchangeUrl(
  exchange: Exchange,
  marketType: MarketType,
  endpointKey: string,
  params?: Record<string, string | number>
): string {
  const config = EXCHANGE_CONFIG[exchange];
  const endpoint = config.endpoints[endpointKey];

  if (!endpoint) {
    throw new Error(`Unknown endpoint: ${endpointKey} for ${exchange}`);
  }

  const baseUrl = config.rest[marketType];
  let path = endpoint.path;

  // Replace path parameters
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`{${key}}`, String(value));
    });
  }

  const url = new URL(path, baseUrl);

  // Add query parameters
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (!path.includes(`{${key}}`)) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

/**
 * Build full URL for a data provider endpoint
 */
export function buildProviderUrl(
  provider: DataProvider,
  endpointKey: string,
  params?: Record<string, string | number>
): string {
  const config = DATA_PROVIDER_CONFIG[provider];
  const endpoint = config.endpoints[endpointKey];

  if (!endpoint) {
    throw new Error(`Unknown endpoint: ${endpointKey} for ${provider}`);
  }

  let path = endpoint.path;

  // Replace path parameters
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`{${key}}`, String(value));
    });
  }

  const url = new URL(path, config.baseUrl);

  // Add query parameters
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (!path.includes(`{${key}}`)) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

/**
 * Get WebSocket URL for an exchange
 */
export function getWebSocketUrl(exchange: Exchange, marketType: MarketType): string {
  return EXCHANGE_CONFIG[exchange].websocket[marketType];
}

/**
 * Generate cache key for an API request
 */
export function getCacheKey(
  source: Exchange | DataProvider,
  endpoint: string,
  params?: Record<string, string | number>
): string {
  const paramStr = params ? JSON.stringify(params) : "";
  return `${source}:${endpoint}:${paramStr}`;
}

/**
 * Get cache TTL for an endpoint
 */
export function getCacheTTL(
  source: Exchange | DataProvider,
  endpointKey: string
): number {
  if (source in EXCHANGE_CONFIG) {
    const config = EXCHANGE_CONFIG[source as Exchange];
    return config.endpoints[endpointKey]?.cacheTTL ?? config.cache.default;
  }

  if (source in DATA_PROVIDER_CONFIG) {
    const config = DATA_PROVIDER_CONFIG[source as DataProvider];
    return config.endpoints[endpointKey]?.cacheTTL ?? 60000;
  }

  return 60000; // Default 1 minute
}

/**
 * Check if cached data is still valid
 */
export function isCacheValid(
  cachedAt: number,
  source: Exchange | DataProvider,
  endpointKey: string
): boolean {
  const ttl = getCacheTTL(source, endpointKey);
  return Date.now() - cachedAt < ttl;
}

/**
 * Get rate limit config for a source
 */
export function getRateLimit(source: Exchange | DataProvider): RateLimitConfig {
  if (source in EXCHANGE_CONFIG) {
    return EXCHANGE_CONFIG[source as Exchange].rateLimit;
  }
  if (source in DATA_PROVIDER_CONFIG) {
    return DATA_PROVIDER_CONFIG[source as DataProvider].rateLimit;
  }
  throw new Error(`Unknown source: ${source}`);
}

/**
 * Get timeout for a source
 */
export function getTimeout(source: Exchange | DataProvider): number {
  if (source in EXCHANGE_CONFIG) {
    return EXCHANGE_CONFIG[source as Exchange].timeout;
  }
  if (source in DATA_PROVIDER_CONFIG) {
    return DATA_PROVIDER_CONFIG[source as DataProvider].timeout;
  }
  return 10000; // Default 10 seconds
}

/**
 * Check if endpoint requires authentication
 */
export function requiresAuth(
  source: Exchange | DataProvider,
  endpointKey: string
): boolean {
  if (source in EXCHANGE_CONFIG) {
    const config = EXCHANGE_CONFIG[source as Exchange];
    return config.endpoints[endpointKey]?.requiresAuth ?? false;
  }
  if (source in DATA_PROVIDER_CONFIG) {
    const config = DATA_PROVIDER_CONFIG[source as DataProvider];
    return config.endpoints[endpointKey]?.requiresAuth ?? config.apiKeyRequired;
  }
  return false;
}

/**
 * Format symbol for different exchanges
 */
export function formatSymbol(
  symbol: string,
  exchange: Exchange,
  marketType: MarketType = "spot"
): string {
  const upper = symbol.toUpperCase().replace(/-SWAP$/, "").replace(/-PERP$/, "").replace(/-/g, "");

  switch (exchange) {
    case "binance":
    case "bybit":
      return upper;

    case "okx": {
      const formatted = upper.replace(/^([A-Z]+)(USDT|USDC|USD)$/, "$1-$2");
      return marketType === "futures" ? `${formatted}-SWAP` : formatted;
    }

    case "coinbase":
      return upper.replace("USDT", "USD").replace(/^([A-Z]+)(USD)$/, "$1-$2");

    default:
      return upper;
  }
}

/**
 * Get all enabled exchanges
 */
export function getEnabledExchanges(): Exchange[] {
  return (Object.keys(EXCHANGE_CONFIG) as Exchange[]).filter(
    (key) => EXCHANGE_CONFIG[key].enabled
  );
}

/**
 * Get all enabled data providers
 */
export function getEnabledProviders(): DataProvider[] {
  return (Object.keys(DATA_PROVIDER_CONFIG) as DataProvider[]).filter(
    (key) => DATA_PROVIDER_CONFIG[key].enabled
  );
}

// ============================================================================
// SIMPLE CACHE IMPLEMENTATION
// ============================================================================

interface CacheEntry<T> {
  data: T;
  cachedAt: number;
  source: Exchange | DataProvider;
  endpoint: string;
}

class ApiCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private maxSize = 1000;

  set<T>(
    source: Exchange | DataProvider,
    endpoint: string,
    params: Record<string, string | number> | undefined,
    data: T
  ): void {
    const key = getCacheKey(source, endpoint, params);

    // Evict oldest entries if at max size
    if (this.cache.size >= this.maxSize) {
      const oldest = [...this.cache.entries()].sort(
        (a, b) => a[1].cachedAt - b[1].cachedAt
      )[0];
      if (oldest) this.cache.delete(oldest[0]);
    }

    this.cache.set(key, {
      data,
      cachedAt: Date.now(),
      source,
      endpoint,
    });
  }

  get<T>(
    source: Exchange | DataProvider,
    endpoint: string,
    params?: Record<string, string | number>
  ): T | null {
    const key = getCacheKey(source, endpoint, params);
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) return null;

    if (!isCacheValid(entry.cachedAt, source, endpoint)) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  invalidate(
    source: Exchange | DataProvider,
    endpoint: string,
    params?: Record<string, string | number>
  ): void {
    const key = getCacheKey(source, endpoint, params);
    this.cache.delete(key);
  }

  invalidateAll(source?: Exchange | DataProvider): void {
    if (!source) {
      this.cache.clear();
      return;
    }

    for (const [key, entry] of this.cache.entries()) {
      if (entry.source === source) {
        this.cache.delete(key);
      }
    }
  }

  getStats(): { size: number; maxSize: number; sources: Record<string, number> } {
    const sources: Record<string, number> = {};

    for (const entry of this.cache.values()) {
      sources[entry.source] = (sources[entry.source] || 0) + 1;
    }

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      sources,
    };
  }
}

export const apiCache = new ApiCache();

// ============================================================================
// SIMPLE RATE LIMITER
// ============================================================================

class RateLimiter {
  private requests = new Map<string, number[]>();

  canMakeRequest(source: Exchange | DataProvider): boolean {
    const config = getRateLimit(source);
    const now = Date.now();
    const windowStart = now - 60000; // 1 minute window

    const sourceRequests = this.requests.get(source) || [];
    const recentRequests = sourceRequests.filter((t) => t > windowStart);

    return recentRequests.length < config.requestsPerMinute;
  }

  recordRequest(source: Exchange | DataProvider): void {
    const now = Date.now();
    const sourceRequests = this.requests.get(source) || [];

    // Clean old requests
    const windowStart = now - 60000;
    const recentRequests = sourceRequests.filter((t) => t > windowStart);

    recentRequests.push(now);
    this.requests.set(source, recentRequests);
  }

  getWaitTime(source: Exchange | DataProvider): number {
    const config = getRateLimit(source);
    const now = Date.now();
    const windowStart = now - 60000;

    const sourceRequests = this.requests.get(source) || [];
    const recentRequests = sourceRequests.filter((t) => t > windowStart);

    if (recentRequests.length < config.requestsPerMinute) {
      return 0;
    }

    // Calculate when the oldest request will expire
    const oldestRequest = Math.min(...recentRequests);
    return oldestRequest + 60000 - now;
  }

  getStats(source: Exchange | DataProvider): {
    requestsInWindow: number;
    limit: number;
    remainingRequests: number;
  } {
    const config = getRateLimit(source);
    const now = Date.now();
    const windowStart = now - 60000;

    const sourceRequests = this.requests.get(source) || [];
    const recentRequests = sourceRequests.filter((t) => t > windowStart);

    return {
      requestsInWindow: recentRequests.length,
      limit: config.requestsPerMinute,
      remainingRequests: Math.max(0, config.requestsPerMinute - recentRequests.length),
    };
  }
}

export const rateLimiter = new RateLimiter();

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  EXCHANGE_CONFIG,
  DATA_PROVIDER_CONFIG,
  MODULE_UPDATE_INTERVALS,
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
  apiCache,
  rateLimiter,
};
