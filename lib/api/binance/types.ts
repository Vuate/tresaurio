// lib/api/binance/types.ts

/**
 * 24hr Ticker Statistics
 */
export interface Binance24hrTicker {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

/**
 * Price Ticker
 */
export interface BinancePrice {
  symbol: string;
  price: string;
}

/**
 * Book Ticker (Best Bid/Ask)
 */
export interface BinanceBookTicker {
  symbol: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
}

/**
 * Order Book Depth
 */
export interface BinanceDepth {
  lastUpdateId: number;
  bids: [string, string][]; // [price, quantity]
  asks: [string, string][];
}

/**
 * Futures Premium Index (Funding Rate)
 */
export interface BinancePremiumIndex {
  symbol: string;
  markPrice: string;
  indexPrice: string;
  estimatedSettlePrice: string;
  lastFundingRate: string;
  nextFundingTime: number;
  interestRate: string;
  time: number;
}

/**
 * Cache Entry
 */
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * API Error Response
 */
export interface BinanceError {
  code: number;
  msg: string;
}

/**
 * Service Options
 */
export interface BinanceServiceOptions {
  timeout?: number;
  cache?: boolean;
  retries?: number;
}
