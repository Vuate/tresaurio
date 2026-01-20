// lib/api/binance/constants.ts

/**
 * Binance API Configuration
 */
export const BINANCE_CONFIG = {
  // Base URLs
  SPOT_API: "https://api.binance.com/api/v3",
  SPOT_API_VISION: "https://data-api.binance.vision/api/v3",
  FUTURES_API: "https://fapi.binance.com/fapi/v1",

  // WebSocket URLs (already in WebSocketService, but kept for reference)
  SPOT_WS: "wss://stream.binance.com:9443/ws",
  FUTURES_WS: "wss://fstream.binance.com/ws",

  // Timeouts (ms)
  REQUEST_TIMEOUT: 8000,

  // Cache TTL (ms)
  CACHE_TTL: {
    TICKER_24HR: 3000, // 3 seconds
    PRICE: 2000, // 2 seconds
    DEPTH: 1000, // 1 second (order book changes fast)
    FUNDING: 5000, // 5 seconds
    BOOK_TICKER: 2000, // 2 seconds
  },

  // Rate Limits (Binance allows 1200 req/min for most endpoints)
  RATE_LIMIT: {
    MAX_REQUESTS: 1000,
    WINDOW_MS: 60000, // 1 minute
  },
} as const;

/**
 * API Endpoints
 */
export const ENDPOINTS = {
  TICKER_24HR: "/ticker/24hr",
  TICKER_PRICE: "/ticker/price",
  BOOK_TICKER: "/ticker/bookTicker",
  DEPTH: "/depth",
  PREMIUM_INDEX: "/premiumIndex",
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  TIMEOUT: "Request timeout - Binance API took too long to respond",
  NETWORK_ERROR: "Network error - Unable to reach Binance API",
  INVALID_SYMBOL: "Invalid symbol format",
  RATE_LIMIT: "Rate limit exceeded - Too many requests",
  UPSTREAM_ERROR: "Binance API returned an error",
  PARSE_ERROR: "Failed to parse API response",
} as const;
