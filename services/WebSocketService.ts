// services/WebSocketService.ts

type StreamCallback = (data: any) => void;
type Exchange = "binance" | "okx" | "bybit" | "coinbase";

interface StreamSubscription {
  stream: string;
  callbacks: Set<StreamCallback>;
  ws: WebSocket | null;
  reconnectAttempts: number;
  reconnectTimeout: NodeJS.Timeout | null;
  fallbackInterval: NodeJS.Timeout | null;
  marketType: "spot" | "futures";
  exchange: Exchange;
}

class WebSocketService {
  private subscriptions: Map<string, StreamSubscription> = new Map();

  // Multi-exchange endpoints
  private baseUrls = {
    binance: {
      spot: "wss://stream.binance.com:9443/ws",
      futures: "wss://fstream.binance.com/ws",
    },
    okx: {
      spot: "wss://ws.okx.com:8443/ws/v5/public",
      futures: "wss://ws.okx.com:8443/ws/v5/public",
    },
    bybit: {
      spot: "wss://stream.bybit.com/v5/public/spot",
      futures: "wss://stream.bybit.com/v5/public/linear",
    },
    coinbase: {
      spot: "wss://ws-feed.exchange.coinbase.com",
      futures: "wss://ws-feed.exchange.coinbase.com",
    },
  };

  private maxReconnectAttempts = 3;
  private reconnectDelay = 2000;

  private isBrowser(): boolean {
    return typeof window !== "undefined" && typeof WebSocket !== "undefined";
  }

  /**
   * Subscribe to a stream with market type and exchange
   */
  subscribe(
    stream: string,
    callback: StreamCallback,
    marketType: "spot" | "futures" = "spot",
    exchange: Exchange = "binance", // NEW: Exchange parameter
  ): () => void {
    if (!this.isBrowser()) {
      console.warn("[WebSocket] Skipping subscription (SSR environment)");
      return () => {};
    }

    const normalizedStream = stream.toLowerCase();
    const subscriptionKey = `${exchange}-${marketType}-${normalizedStream}`;

    if (!this.subscriptions.has(subscriptionKey)) {
      this.subscriptions.set(subscriptionKey, {
        stream: normalizedStream,
        callbacks: new Set(),
        ws: null,
        reconnectAttempts: 0,
        reconnectTimeout: null,
        fallbackInterval: null,
        marketType,
        exchange, // NEW: Store exchange
      });
    }

    const sub = this.subscriptions.get(subscriptionKey)!;
    sub.callbacks.add(callback);

    // Only Binance has fallback
    if (exchange === "binance" && sub.fallbackInterval) {
      return () => this.unsubscribe(subscriptionKey, callback);
    }

    if (!sub.ws || sub.ws.readyState !== WebSocket.OPEN) {
      this.connect(subscriptionKey);
    }

    return () => this.unsubscribe(subscriptionKey, callback);
  }

  private unsubscribe(subscriptionKey: string, callback: StreamCallback) {
    const sub = this.subscriptions.get(subscriptionKey);
    if (!sub) return;

    sub.callbacks.delete(callback);

    if (sub.callbacks.size === 0) {
      this.disconnect(subscriptionKey);
    }
  }

  /**
   * Get WebSocket URL for exchange and market type
   */
  private getWsUrl(exchange: Exchange, marketType: "spot" | "futures"): string {
    return this.baseUrls[exchange][marketType];
  }

  /**
   * Format symbol for different exchanges
   */
  private formatSymbol(symbol: string, exchange: Exchange): string {
    const upper = symbol.toUpperCase();

    switch (exchange) {
      case "binance":
      case "bybit":
        return upper; // BTCUSDT

      case "okx":
        // BTCUSDT -> BTC-USDT
        return upper.replace(/^([A-Z]+)(USDT|USDC|USD)$/, "$1-$2");

      case "coinbase":
        // BTCUSDT -> BTC-USD (Coinbase uses USD not USDT)
        return upper.replace("USDT", "USD").replace(/^([A-Z]+)(USD)$/, "$1-$2");

      default:
        return upper;
    }
  }

  /**
   * Build subscribe message for each exchange
   */
  private buildSubscribeMessage(exchange: Exchange, stream: string): any {
    const [symbolPart, streamType] = stream.split("@");
    const symbol = this.formatSymbol(symbolPart, exchange);

    switch (exchange) {
      case "binance":
        // Binance doesn't need subscribe message, URL-based
        return null;

      case "okx":
        if (streamType?.includes("depth")) {
          return {
            op: "subscribe",
            args: [{ channel: "books5", instId: symbol }],
          };
        }
        if (streamType?.includes("ticker")) {
          return {
            op: "subscribe",
            args: [{ channel: "tickers", instId: symbol }],
          };
        }
        break;

      case "bybit":
        if (streamType?.includes("depth")) {
          return {
            op: "subscribe",
            args: [`orderbook.50.${symbolPart.toUpperCase()}`],
          };
        }
        if (streamType?.includes("ticker")) {
          return {
            op: "subscribe",
            args: [`tickers.${symbolPart.toUpperCase()}`],
          };
        }
        break;

      case "coinbase":
        if (streamType?.includes("depth")) {
          return {
            type: "subscribe",
            product_ids: [symbol],
            channels: ["level2"],
          };
        }
        if (streamType?.includes("ticker")) {
          return {
            type: "subscribe",
            product_ids: [symbol],
            channels: ["ticker"],
          };
        }
        break;
    }
    return null;
  }

  /**
   * Normalize data from different exchanges to Binance format
   */
  private normalizeMessage(exchange: Exchange, data: any): any {
    switch (exchange) {
      case "binance":
        return data; // Already correct format

      case "okx":
        if (data.arg?.channel === "books5") {
          const book = data.data?.[0];
          if (!book) return null;
          return {
            bids: book.bids || [],
            asks: book.asks || [],
          };
        }
        if (data.arg?.channel === "tickers") {
          const t = data.data?.[0];
          if (!t) return null;
          const last = parseFloat(t.last || "0");
          const open = parseFloat(t.open24h || t.last || "0");
          return {
            e: "24hrTicker",
            s: t.instId.replace("-", ""),
            c: t.last,
            p: (last - open).toString(),
            P: open > 0 ? (((last / open) - 1) * 100).toFixed(2) : "0",
            h: t.high24h || t.last,
            l: t.low24h || t.last,
            v: t.vol24h || "0",
            q: t.volCcy24h || "0",
            o: t.open24h || t.last,
          };
        }
        break;

      case "bybit":
        if (data.topic?.includes("orderbook")) {
          const book = data.data;
          if (!book) return null;
          return {
            bids: book.b || [],
            asks: book.a || [],
          };
        }
        if (data.topic?.includes("tickers")) {
          const t = data.data;
          if (!t) return null;
          const last = parseFloat(t.lastPrice || "0");
          const pcnt = parseFloat(t.price24hPcnt || "0");
          return {
            e: "24hrTicker",
            s: t.symbol,
            c: t.lastPrice,
            p: (last * pcnt / 100).toString(),
            P: (pcnt * 100).toFixed(2),
            h: t.highPrice24h || t.lastPrice,
            l: t.lowPrice24h || t.lastPrice,
            v: t.volume24h || "0",
            q: t.turnover24h || "0",
            o: t.prevPrice24h || t.lastPrice,
          };
        }
        break;

      case "coinbase":
        if (data.type === "snapshot") {
          return {
            bids: data.bids || [],
            asks: data.asks || [],
          };
        }
        if (data.type === "l2update") {
          return {
            bids: data.changes?.filter((c: any) => c[0] === "buy").map((c: any) => [c[1], c[2]]) || [],
            asks: data.changes?.filter((c: any) => c[0] === "sell").map((c: any) => [c[1], c[2]]) || [],
          };
        }
        if (data.type === "ticker") {
          const price = parseFloat(data.price || "0");
          const open = parseFloat(data.open_24h || data.price || "0");
          return {
            e: "24hrTicker",
            s: data.product_id.replace("-", ""),
            c: data.price,
            p: (price - open).toString(),
            P: open > 0 ? (((price / open) - 1) * 100).toFixed(2) : "0",
            h: data.high_24h || data.price,
            l: data.low_24h || data.price,
            v: data.volume_24h || "0",
            q: data.volume_24h || "0",
            o: data.open_24h || data.price,
          };
        }
        break;
    }
    return null;
  }

  /**
   * Connect with correct endpoint based on exchange and market type
   */
  private connect(subscriptionKey: string) {
    if (!this.isBrowser()) return;

    const sub = this.subscriptions.get(subscriptionKey);
    if (!sub) return;

    try {
      const baseUrl = this.getWsUrl(sub.exchange, sub.marketType);

      // For Binance, append stream to URL
      const wsUrl = sub.exchange === "binance"
        ? `${baseUrl}/${sub.stream}`
        : baseUrl;

      console.log(
        `🔌 [WebSocket] Connecting to ${sub.exchange.toUpperCase()} ${sub.marketType.toUpperCase()}: ${sub.stream}`,
      );

      const ws = new WebSocket(wsUrl);

      const timeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          console.warn(
            `⏱️ [WebSocket] Connection timeout: ${sub.stream} (${sub.exchange}, ${sub.marketType})`,
          );
          ws.close();
          this.handleConnectionFailure(subscriptionKey);
        }
      }, 10000); // 10s timeout for other exchanges

      ws.onopen = () => {
        clearTimeout(timeout);
        console.log(
          `✅ [WebSocket] Connected (${sub.exchange.toUpperCase()} ${sub.marketType.toUpperCase()}): ${sub.stream}`,
        );
        sub.reconnectAttempts = 0;

        // Send subscribe message for non-Binance exchanges
        if (sub.exchange !== "binance") {
          const subscribeMsg = this.buildSubscribeMessage(sub.exchange, sub.stream);
          if (subscribeMsg) {
            ws.send(JSON.stringify(subscribeMsg));
            console.log(`📤 [${sub.exchange.toUpperCase()}] Sent subscribe message`);
          }
        }
      };

      ws.onmessage = (event) => {
        try {
          const rawData = JSON.parse(event.data);

          // Normalize data based on exchange
          const normalizedData = this.normalizeMessage(sub.exchange, rawData);

          if (normalizedData) {
            sub.callbacks.forEach((callback) => {
              try {
                callback(normalizedData);
              } catch (err) {
                console.error(`[WebSocket] Callback error:`, err);
              }
            });
          }
        } catch (err) {
          console.error(`[WebSocket] Parse error:`, err);
        }
      };

      ws.onerror = () => {
        clearTimeout(timeout);
        console.warn(
          `⚠️ [WebSocket] Connection error: ${sub.stream} (${sub.exchange}, ${sub.marketType})`,
        );
      };

      ws.onclose = (event) => {
        clearTimeout(timeout);
        console.log(
          `🔌 [WebSocket] Closed: ${sub.stream} (${sub.exchange}, ${sub.marketType}, code: ${event.code})`,
        );
        sub.ws = null;

        if (sub.callbacks.size > 0) {
          this.handleConnectionFailure(subscriptionKey);
        }
      };

      sub.ws = ws;
    } catch (err) {
      console.error(`[WebSocket] Connection error:`, err);
      this.handleConnectionFailure(subscriptionKey);
    }
  }

  private handleConnectionFailure(subscriptionKey: string) {
    const sub = this.subscriptions.get(subscriptionKey);
    if (!sub) return;

    sub.reconnectAttempts++;

    if (sub.reconnectAttempts >= this.maxReconnectAttempts) {
      // Only Binance has REST fallback
      if (sub.exchange === "binance") {
        console.warn(
          `🔄 [WebSocket] Switching to REST fallback for ${sub.stream}`,
        );
        this.startFallback(subscriptionKey);
      } else {
        console.error(
          `❌ [WebSocket] Max reconnect attempts reached for ${sub.exchange.toUpperCase()}, no fallback available`,
        );
        // Keep trying for other exchanges
        sub.reconnectAttempts = 0;
        this.reconnect(subscriptionKey);
      }
    } else {
      this.reconnect(subscriptionKey);
    }
  }

  private reconnect(subscriptionKey: string) {
    const sub = this.subscriptions.get(subscriptionKey);
    if (!sub) return;

    if (sub.reconnectTimeout) {
      clearTimeout(sub.reconnectTimeout);
    }

    const delay = this.reconnectDelay * Math.pow(2, sub.reconnectAttempts - 1);

    console.log(
      `🔄 [WebSocket] Reconnecting ${sub.stream} (${sub.marketType}) in ${delay}ms (attempt ${sub.reconnectAttempts}/${this.maxReconnectAttempts})`,
    );

    sub.reconnectTimeout = setTimeout(() => {
      this.connect(subscriptionKey);
    }, delay);
  }

  /**
   * 🔥 REST Fallback with market type support
   */
  private startFallback(subscriptionKey: string) {
    const sub = this.subscriptions.get(subscriptionKey);
    if (!sub) return;

    if (sub.fallbackInterval) {
      clearInterval(sub.fallbackInterval);
    }

    console.log(
      `📡 [REST Fallback] Starting for ${sub.stream} (${sub.marketType})`,
    );

    const isTicker = sub.stream.includes("@ticker");
    const isDepth = sub.stream.includes("@depth");
    const symbol = sub.stream.split("@")[0].toUpperCase();

    // 🔥 Different API endpoints for spot vs futures
    const getApiUrl = (endpoint: string) => {
      if (sub.marketType === "futures") {
        return `https://fapi.binance.com/fapi/v1/${endpoint}`;
      }
      return `https://api.binance.com/api/v3/${endpoint}`;
    };

    const poll = async () => {
      try {
        let data;

        if (isTicker) {
          const url = getApiUrl(`ticker/24hr?symbol=${symbol}`);
          const res = await fetch(url);
          if (!res.ok) throw new Error("REST failed");
          const json = await res.json();

          data = {
            e: "24hrTicker",
            s: json.symbol,
            c: json.lastPrice,
            p: json.priceChange,
            P: json.priceChangePercent,
            h: json.highPrice,
            l: json.lowPrice,
            v: json.volume,
          };
        } else if (isDepth) {
          const url = getApiUrl(`depth?symbol=${symbol}&limit=20`);
          const res = await fetch(url);
          if (!res.ok) throw new Error("REST failed");
          const json = await res.json();

          data = {
            bids: json.bids,
            asks: json.asks,
          };
        }

        if (data) {
          sub.callbacks.forEach((callback) => {
            try {
              callback(data);
            } catch (err) {
              console.error(`[REST Fallback] Callback error:`, err);
            }
          });
        }
      } catch (err) {
        console.error(
          `[REST Fallback] Fetch error for ${sub.stream} (${sub.marketType}):`,
          err,
        );
      }
    };

    poll();

    const interval = isTicker ? 3000 : 2000;
    sub.fallbackInterval = setInterval(poll, interval);
  }

  private disconnect(subscriptionKey: string) {
    const sub = this.subscriptions.get(subscriptionKey);
    if (!sub) return;

    // Don't disconnect if there are still callbacks
    if (sub.callbacks.size > 0) {
      return;
    }

    if (sub.reconnectTimeout) {
      clearTimeout(sub.reconnectTimeout);
      sub.reconnectTimeout = null;
    }

    if (sub.fallbackInterval) {
      clearInterval(sub.fallbackInterval);
      sub.fallbackInterval = null;
    }

    if (sub.ws) {
      sub.ws.close();
      sub.ws = null;
    }

    this.subscriptions.delete(subscriptionKey);
    console.log(
      `👋 [WebSocket] Disconnected: ${sub.stream} (${sub.marketType})`,
    );
  }

  disconnectAll() {
    this.subscriptions.forEach((_, key) => {
      this.disconnect(key);
    });
  }

  getStatus(
    stream: string,
    marketType: "spot" | "futures" = "spot",
    exchange: Exchange = "binance",
  ): "connected" | "connecting" | "disconnected" | "fallback" {
    if (!this.isBrowser()) return "disconnected";

    const subscriptionKey = `${exchange}-${marketType}-${stream.toLowerCase()}`;
    const sub = this.subscriptions.get(subscriptionKey);
    if (!sub) return "disconnected";

    if (sub.fallbackInterval) return "fallback";
    if (!sub.ws) return "disconnected";

    switch (sub.ws.readyState) {
      case WebSocket.OPEN:
        return "connected";
      case WebSocket.CONNECTING:
        return "connecting";
      default:
        return "disconnected";
    }
  }
}

export type { Exchange };
export const wsService = new WebSocketService();

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    wsService.disconnectAll();
  });
}
