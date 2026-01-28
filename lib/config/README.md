# Tresaurio API Configuration

Centralized API management system for the Tresaurio Trading Dashboard.

## Quick Start

```typescript
import {
  buildExchangeUrl,
  buildProviderUrl,
  getWebSocketUrl,
  apiCache,
  rateLimiter,
  formatSymbol,
} from '@/lib/config/apiConfig';

// Build a URL
const url = buildExchangeUrl('binance', 'spot', 'spotTicker24h', {
  symbol: 'BTCUSDT',
});

// Fetch with caching and rate limiting
async function fetchTicker(symbol: string) {
  // Check cache
  const cached = apiCache.get('binance', 'spotTicker24h', { symbol });
  if (cached) return cached;

  // Check rate limit
  if (!rateLimiter.canMakeRequest('binance')) {
    throw new Error('Rate limited');
  }

  // Fetch
  rateLimiter.recordRequest('binance');
  const response = await fetch(url);
  const data = await response.json();

  // Cache
  apiCache.set('binance', 'spotTicker24h', { symbol }, data);
  return data;
}
```

## Supported APIs

### Exchange APIs

| Exchange | REST Spot | REST Futures | WebSocket Spot | WebSocket Futures |
|----------|-----------|--------------|----------------|-------------------|
| Binance  | ✅ | ✅ | ✅ | ✅ |
| OKX      | ✅ | ✅ | ✅ | ✅ |
| Bybit    | ✅ | ✅ | ✅ | ✅ |
| Coinbase | ✅ | ✅ | ✅ | ✅ |

### Data Providers

| Provider    | Purpose              | Rate Limit    | Auth Required |
|-------------|----------------------|---------------|---------------|
| CoinGecko   | Token prices         | 50/min (free) | No            |
| DeFiLlama   | DeFi TVL data        | 300/min       | No            |
| Etherscan   | Wallet inspection    | 300/min       | Yes (API key) |
| CryptoQuant | On-chain analytics   | 100/min       | Yes (API key) |

## Configuration Structure

### Exchange Config

```typescript
EXCHANGE_CONFIG.binance = {
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
    account: 5000,
    positions: 3000,
    trades: 1000,
    default: 5000,
  },
  timeout: 10000,
  endpoints: { ... }
}
```

## Cache TTL Reference

| Data Type        | Binance | OKX  | Bybit | Coinbase |
|------------------|---------|------|-------|----------|
| Ticker           | 3s      | 3s   | 3s    | 3s       |
| Order Book       | 1s      | 1s   | 1s    | 1s       |
| Funding Rate     | 5s      | 5s   | 5s    | N/A      |
| Klines           | 60s     | 60s  | 60s   | 60s      |
| Account          | 5s      | 5s   | 5s    | 5s       |
| Positions        | 3s      | 3s   | 3s    | 3s       |

## Rate Limits

| Exchange | Requests/Min | Requests/Sec | Burst Limit |
|----------|--------------|--------------|-------------|
| Binance  | 1200         | 20           | 50          |
| OKX      | 800          | 13           | 30          |
| Bybit    | 600          | 10           | 20          |
| Coinbase | 600          | 10           | 15          |

## Module Update Intervals

| Module               | Interval    | Type      |
|----------------------|-------------|-----------|
| Live Prices          | Realtime    | WebSocket |
| Order Book           | Realtime    | WebSocket |
| Funding Rate         | Realtime    | WebSocket |
| Spread Monitor       | Realtime    | WebSocket |
| Slippage Monitor     | Realtime    | WebSocket |
| Futures Positions    | 5 seconds   | REST      |
| All-in Cost          | 10 seconds  | REST      |
| Wallet Inspector     | 1 minute    | REST      |
| RSI Heatmap          | 1 minute    | REST      |
| Exchange Comparison  | 5 minutes   | REST      |
| Exchange Netflow     | 5 minutes   | REST      |
| Token Unlock         | 24 hours    | REST      |

## Helper Functions

### buildExchangeUrl

Build URLs for exchange API endpoints.

```typescript
const url = buildExchangeUrl('binance', 'spot', 'spotTicker24h', {
  symbol: 'BTCUSDT',
});
// Result: https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT

const futuresUrl = buildExchangeUrl('binance', 'futures', 'futuresDepth', {
  symbol: 'BTCUSDT',
  limit: 20,
});
// Result: https://fapi.binance.com/fapi/v1/depth?symbol=BTCUSDT&limit=20
```

### buildProviderUrl

Build URLs for data provider endpoints.

```typescript
const url = buildProviderUrl('coingecko', 'price', {
  ids: 'bitcoin,ethereum',
  vs_currencies: 'usd',
});
// Result: https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd
```

### getWebSocketUrl

Get WebSocket URLs for exchanges.

```typescript
const wsUrl = getWebSocketUrl('binance', 'futures');
// Result: wss://fstream.binance.com/ws
```

### formatSymbol

Format symbols for different exchanges.

```typescript
formatSymbol('BTCUSDT', 'binance', 'spot');    // BTCUSDT
formatSymbol('BTCUSDT', 'okx', 'spot');        // BTC-USDT
formatSymbol('BTCUSDT', 'okx', 'futures');     // BTC-USDT-SWAP
formatSymbol('BTCUSDT', 'coinbase', 'spot');   // BTC-USD
```

### Cache Operations

```typescript
// Set cache
apiCache.set('binance', 'spotTicker24h', { symbol: 'BTCUSDT' }, data);

// Get cache (returns null if expired or not found)
const cached = apiCache.get('binance', 'spotTicker24h', { symbol: 'BTCUSDT' });

// Invalidate specific cache
apiCache.invalidate('binance', 'spotTicker24h', { symbol: 'BTCUSDT' });

// Invalidate all cache for an exchange
apiCache.invalidateAll('binance');

// Get cache stats
const stats = apiCache.getStats();
// { size: 42, maxSize: 1000, sources: { binance: 30, okx: 12 } }
```

### Rate Limiter

```typescript
// Check if request allowed
if (rateLimiter.canMakeRequest('binance')) {
  rateLimiter.recordRequest('binance');
  // Make request...
}

// Get wait time if rate limited
const waitMs = rateLimiter.getWaitTime('binance');

// Get stats
const stats = rateLimiter.getStats('binance');
// { requestsInWindow: 45, limit: 1200, remainingRequests: 1155 }
```

## Best Practices

### 1. Always Check Cache First

```typescript
const cached = apiCache.get(exchange, endpoint, params);
if (cached) return cached;
```

### 2. Always Check Rate Limits

```typescript
if (!rateLimiter.canMakeRequest(exchange)) {
  const wait = rateLimiter.getWaitTime(exchange);
  await new Promise(r => setTimeout(r, wait));
}
rateLimiter.recordRequest(exchange);
```

### 3. Use Proper Timeouts

```typescript
const response = await fetch(url, {
  signal: AbortSignal.timeout(getTimeout(exchange)),
});
```

### 4. Format Symbols Correctly

```typescript
// Don't hardcode symbol formats
const symbol = formatSymbol('BTCUSDT', exchange, marketType);
```

### 5. Handle Errors Gracefully

```typescript
try {
  const data = await fetchData();
} catch (error) {
  if (error.message.includes('Rate limited')) {
    // Wait and retry
  } else if (error.message.includes('timeout')) {
    // Use cached data or show error
  }
}
```

## Migration Guide

### Step 1: Replace Hardcoded URLs

```typescript
// Before
const url = 'https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT';

// After
import { buildExchangeUrl } from '@/lib/config/apiConfig';
const url = buildExchangeUrl('binance', 'spot', 'spotTicker24h', {
  symbol: 'BTCUSDT',
});
```

### Step 2: Add Caching

```typescript
// Before
const response = await fetch(url);
return response.json();

// After
const cached = apiCache.get('binance', 'spotTicker24h', { symbol });
if (cached) return cached;

const response = await fetch(url);
const data = await response.json();
apiCache.set('binance', 'spotTicker24h', { symbol }, data);
return data;
```

### Step 3: Add Rate Limiting

```typescript
// Before
const response = await fetch(url);

// After
if (!rateLimiter.canMakeRequest('binance')) {
  throw new Error('Rate limited');
}
rateLimiter.recordRequest('binance');
const response = await fetch(url);
```

### Step 4: Use Consistent Symbol Formatting

```typescript
// Before
const symbol = exchange === 'okx' ? 'BTC-USDT' : 'BTCUSDT';

// After
import { formatSymbol } from '@/lib/config/apiConfig';
const symbol = formatSymbol('BTCUSDT', exchange, marketType);
```

## File Structure

```
lib/config/
├── apiConfig.ts           # Main configuration file
├── apiConfig.examples.ts  # Usage examples (14 scenarios)
└── README.md              # This documentation
```

## Types Reference

```typescript
type Exchange = 'binance' | 'okx' | 'bybit' | 'coinbase';
type MarketType = 'spot' | 'futures';
type DataProvider = 'coingecko' | 'defillama' | 'etherscan' | 'cryptoquant';

interface RateLimitConfig {
  requestsPerMinute: number;
  requestsPerSecond: number;
  burstLimit: number;
  retryAfterMs: number;
}

interface CacheConfig {
  ticker: number;
  depth: number;
  funding: number;
  klines: number;
  account: number;
  positions: number;
  trades: number;
  default: number;
}

interface EndpointConfig {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  cacheTTL: number;
  requiresAuth: boolean;
  rateWeight: number;
  description: string;
}
```

## Endpoints Reference

### Binance Endpoints

| Key              | Path                      | Cache TTL | Auth |
|------------------|---------------------------|-----------|------|
| spotTicker24h    | /api/v3/ticker/24hr       | 3s        | No   |
| spotDepth        | /api/v3/depth             | 1s        | No   |
| spotKlines       | /api/v3/klines            | 60s       | No   |
| spotTrades       | /api/v3/trades            | 1s        | No   |
| spotAccount      | /api/v3/account           | 5s        | Yes  |
| futuresTicker24h | /fapi/v1/ticker/24hr      | 3s        | No   |
| futuresDepth     | /fapi/v1/depth            | 1s        | No   |
| futuresFunding   | /fapi/v1/fundingRate      | 5s        | No   |
| futuresMarkPrice | /fapi/v1/premiumIndex     | 3s        | No   |
| futuresPositions | /fapi/v2/positionRisk     | 3s        | Yes  |

### OKX Endpoints

| Key            | Path                              | Cache TTL | Auth |
|----------------|-----------------------------------|-----------|------|
| ticker         | /api/v5/market/ticker             | 3s        | No   |
| depth          | /api/v5/market/books              | 1s        | No   |
| fundingRate    | /api/v5/public/funding-rate       | 5s        | No   |
| fundingHistory | /api/v5/public/funding-rate-history | 60s     | No   |
| markPrice      | /api/v5/public/mark-price         | 3s        | No   |
| positions      | /api/v5/account/positions         | 3s        | Yes  |

### Bybit Endpoints

| Key         | Path                       | Cache TTL | Auth |
|-------------|----------------------------|-----------|------|
| ticker      | /v5/market/tickers         | 3s        | No   |
| depth       | /v5/market/orderbook       | 1s        | No   |
| fundingRate | /v5/market/funding/history | 5s        | No   |
| klines      | /v5/market/kline           | 60s       | No   |
| positions   | /v5/position/list          | 3s        | Yes  |

## Support

For issues or feature requests, contact the Tresaurio development team.
