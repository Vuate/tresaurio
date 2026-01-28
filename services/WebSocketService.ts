// services/WebSocketService.ts
// Production-ready WebSocket service with multi-exchange support

type StreamCallback = (data: any) => void;
type Exchange = "binance" | "okx" | "bybit" | "coinbase";
type ConnectionStatus = "connected" | "connecting" | "disconnected" | "fallback" | "error";

interface OrderBookState {
  bids: Map<string, string>; // price -> quantity
  asks: Map<string, string>;
  lastUpdateId?: number;
}

interface StreamSubscription {
  stream: string;
  callbacks: Set<StreamCallback>;
  ws: WebSocket | null;
  reconnectAttempts: number;
  reconnectTimeout: NodeJS.Timeout | null;
  fallbackInterval: NodeJS.Timeout | null;
  heartbeatInterval: NodeJS.Timeout | null;
  marketType: "spot" | "futures";
  exchange: Exchange;
  lastMessageTime: number;
  orderBookState: OrderBookState | null; // For incremental updates (Bybit, Coinbase)
  status: ConnectionStatus;
  statusCallbacks: Set<(status: ConnectionStatus) => void>;
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

  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;
  private heartbeatIntervalMs = 20000; // 20 seconds
  private messageTimeoutMs = 30000; // 30 seconds without message = reconnect

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
    exchange: Exchange = "binance"
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
        heartbeatInterval: null,
        marketType,
        exchange,
        lastMessageTime: Date.now(),
        orderBookState: null,
        status: "connecting",
        statusCallbacks: new Set(),
      });
    }

    const sub = this.subscriptions.get(subscriptionKey)!;
    sub.callbacks.add(callback);

    // If already in fallback mode, just add callback
    if (sub.fallbackInterval) {
      return () => this.unsubscribe(subscriptionKey, callback);
    }

    // Connect if not already connected
    if (!sub.ws || sub.ws.readyState !== WebSocket.OPEN) {
      this.connect(subscriptionKey);
    }

    return () => this.unsubscribe(subscriptionKey, callback);
  }

  /**
   * Subscribe to status changes
   */
  subscribeToStatus(
    stream: string,
    marketType: "spot" | "futures",
    exchange: Exchange,
    callback: (status: ConnectionStatus) => void
  ): () => void {
    const normalizedStream = stream.toLowerCase();
    const subscriptionKey = `${exchange}-${marketType}-${normalizedStream}`;

    const sub = this.subscriptions.get(subscriptionKey);
    if (sub) {
      sub.statusCallbacks.add(callback);
      callback(sub.status); // Immediately send current status
    }

    return () => {
      const sub = this.subscriptions.get(subscriptionKey);
      if (sub) {
        sub.statusCallbacks.delete(callback);
      }
    };
  }

  private updateStatus(subscriptionKey: string, status: ConnectionStatus) {
    const sub = this.subscriptions.get(subscriptionKey);
    if (sub && sub.status !== status) {
      sub.status = status;
      sub.statusCallbacks.forEach(cb => {
        try {
          cb(status);
        } catch (e) {
          console.error("[WebSocket] Status callback error:", e);
        }
      });
    }
  }

  private unsubscribe(subscriptionKey: string, callback: StreamCallback) {
    const sub = this.subscriptions.get(subscriptionKey);
    if (!sub) return;

    sub.callbacks.delete(callback);

    if (sub.callbacks.size === 0) {
      this.disconnect(subscriptionKey);
    }
  }

  private getWsUrl(exchange: Exchange, marketType: "spot" | "futures"): string {
    return this.baseUrls[exchange][marketType];
  }

  /**
   * Format symbol for different exchanges
   */
  private formatSymbol(
    symbol: string,
    exchange: Exchange,
    marketType?: "spot" | "futures"
  ): string {
    const upper = symbol.toUpperCase();
    const clean = upper.replace(/-SWAP$/, "").replace(/-PERP$/, "").replace(/-/g, "");

    switch (exchange) {
      case "binance":
      case "bybit":
        return clean;

      case "okx":
        // OKX needs dash format: BTC-USDT or BTC-USDT-SWAP
        let okxSymbol = clean;
        if (!okxSymbol.includes("-")) {
          okxSymbol = okxSymbol.replace(/^([A-Z]+)(USDT|USDC|USD)$/, "$1-$2");
        }
        if (marketType === "futures") {
          return okxSymbol + "-SWAP";
        }
        return okxSymbol;

      case "coinbase":
        // Coinbase: BTC-USD format (not USDT)
        let cbSymbol = clean.replace("USDT", "USD");
        if (!cbSymbol.includes("-")) {
          cbSymbol = cbSymbol.replace(/^([A-Z]+)(USD)$/, "$1-$2");
        }
        return cbSymbol;

      default:
        return upper;
    }
  }

  /**
   * Build subscribe message for each exchange
   */
  private buildSubscribeMessage(
    exchange: Exchange,
    stream: string,
    marketType: "spot" | "futures"
  ): any {
    const [symbolPart, streamType] = stream.split("@");
    const symbol = this.formatSymbol(symbolPart, exchange, marketType);

    switch (exchange) {
      case "binance":
        return null; // Binance uses URL-based subscription

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
        // Bybit: Use orderbook.200 for full book with incremental updates
        if (streamType?.includes("depth")) {
          return {
            op: "subscribe",
            args: [`orderbook.200.${symbolPart.toUpperCase()}`],
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
            channels: ["level2_batch"], // Use batch for better performance
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
   * Initialize order book state from snapshot
   */
  private initOrderBookState(
    subscriptionKey: string,
    bids: [string, string][],
    asks: [string, string][]
  ): void {
    const sub = this.subscriptions.get(subscriptionKey);
    if (!sub) return;

    sub.orderBookState = {
      bids: new Map(bids.map(([p, q]) => [p, q])),
      asks: new Map(asks.map(([p, q]) => [p, q])),
    };
  }

  /**
   * Apply delta updates to order book state
   */
  private applyOrderBookDelta(
    subscriptionKey: string,
    bids: [string, string][],
    asks: [string, string][]
  ): { bids: [string, string][]; asks: [string, string][] } | null {
    const sub = this.subscriptions.get(subscriptionKey);
    if (!sub?.orderBookState) return null;

    const state = sub.orderBookState;

    // Apply bid updates
    for (const [price, quantity] of bids) {
      if (parseFloat(quantity) === 0) {
        state.bids.delete(price);
      } else {
        state.bids.set(price, quantity);
      }
    }

    // Apply ask updates
    for (const [price, quantity] of asks) {
      if (parseFloat(quantity) === 0) {
        state.asks.delete(price);
      } else {
        state.asks.set(price, quantity);
      }
    }

    // Convert to sorted arrays and limit to top 100 levels
    const sortedBids = Array.from(state.bids.entries())
      .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
      .slice(0, 100);

    const sortedAsks = Array.from(state.asks.entries())
      .sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]))
      .slice(0, 100);

    return { bids: sortedBids, asks: sortedAsks };
  }

  /**
   * Normalize data from different exchanges to unified format
   */
  private normalizeMessage(
    exchange: Exchange,
    data: any,
    subscriptionKey: string
  ): any {
    switch (exchange) {
      case "binance":
        // Order book data (depthUpdate or REST response)
        if (data.e === "depthUpdate" || data.lastUpdateId) {
          return {
            bids: data.b || data.bids || [],
            asks: data.a || data.asks || [],
          };
        }
        // REST order book response (has bids/asks arrays)
        if (data.bids && data.asks && Array.isArray(data.bids)) {
          return {
            bids: data.bids,
            asks: data.asks,
          };
        }
        // Ticker data - pass through as-is (has e: "24hrTicker")
        if (data.e === "24hrTicker") {
          return data;
        }
        return data;

      case "okx":
        if (data.arg?.channel === "books5" || data.arg?.channel?.startsWith("books")) {
          const book = data.data?.[0];
          if (!book) return null;

          console.log(`📊 [OKX] OrderBook: ${book.bids?.length} bids, ${book.asks?.length} asks`);
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
            P: open > 0 ? ((last / open - 1) * 100).toFixed(2) : "0",
            h: t.high24h || t.last,
            l: t.low24h || t.last,
            v: t.vol24h || "0",
            q: t.volCcy24h || "0",
            o: t.open24h || t.last,
          };
        }
        break;

      case "bybit":
        // Bybit orderbook handling with delta updates
        if (data.topic?.includes("orderbook")) {
          const book = data.data;
          if (!book) return null;

          const isSnapshot = data.type === "snapshot";

          if (isSnapshot) {
            // Initialize state from snapshot
            console.log(`📊 [Bybit] Snapshot: ${book.b?.length} bids, ${book.a?.length} asks`);
            this.initOrderBookState(subscriptionKey, book.b || [], book.a || []);
            return {
              bids: book.b || [],
              asks: book.a || [],
            };
          } else {
            // Apply delta update
            const result = this.applyOrderBookDelta(
              subscriptionKey,
              book.b || [],
              book.a || []
            );
            if (result) {
              console.log(`📊 [Bybit] Delta applied: ${result.bids.length} bids, ${result.asks.length} asks`);
              return result;
            }
            return null;
          }
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
            p: ((last * pcnt) / 100).toString(),
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
        // Coinbase L2 order book handling
        if (data.type === "snapshot") {
          console.log(`📊 [Coinbase] Snapshot: ${data.bids?.length} bids, ${data.asks?.length} asks`);
          this.initOrderBookState(subscriptionKey, data.bids || [], data.asks || []);
          return {
            bids: data.bids || [],
            asks: data.asks || [],
          };
        }
        if (data.type === "l2update") {
          // Process updates
          const bidUpdates: [string, string][] = [];
          const askUpdates: [string, string][] = [];

          for (const change of data.changes || []) {
            const [side, price, size] = change;
            if (side === "buy") {
              bidUpdates.push([price, size]);
            } else {
              askUpdates.push([price, size]);
            }
          }

          const result = this.applyOrderBookDelta(subscriptionKey, bidUpdates, askUpdates);
          if (result) {
            return result;
          }
          return null;
        }
        if (data.type === "ticker") {
          const price = parseFloat(data.price || "0");
          const open = parseFloat(data.open_24h || data.price || "0");
          return {
            e: "24hrTicker",
            s: data.product_id?.replace("-", "") || "",
            c: data.price,
            p: (price - open).toString(),
            P: open > 0 ? ((price / open - 1) * 100).toFixed(2) : "0",
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

    // Clear any existing state for fresh connection
    sub.orderBookState = null;

    try {
      const baseUrl = this.getWsUrl(sub.exchange, sub.marketType);
      const wsUrl = sub.exchange === "binance" ? `${baseUrl}/${sub.stream}` : baseUrl;

      console.log(
        `🔌 [WebSocket] Connecting to ${sub.exchange.toUpperCase()} ${sub.marketType.toUpperCase()}: ${sub.stream}`
      );

      this.updateStatus(subscriptionKey, "connecting");

      const ws = new WebSocket(wsUrl);

      const timeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          console.warn(`⏱️ [WebSocket] Connection timeout: ${sub.stream} (${sub.exchange})`);
          ws.close();
          this.handleConnectionFailure(subscriptionKey);
        }
      }, 15000);

      ws.onopen = () => {
        clearTimeout(timeout);
        console.log(`✅ [WebSocket] Connected (${sub.exchange.toUpperCase()}): ${sub.stream}`);

        sub.reconnectAttempts = 0;
        sub.lastMessageTime = Date.now();
        this.updateStatus(subscriptionKey, "connected");

        // Send subscribe message for non-Binance exchanges
        if (sub.exchange !== "binance") {
          const subscribeMsg = this.buildSubscribeMessage(sub.exchange, sub.stream, sub.marketType);
          if (subscribeMsg) {
            ws.send(JSON.stringify(subscribeMsg));
            console.log(`📤 [${sub.exchange.toUpperCase()}] Subscribe:`, JSON.stringify(subscribeMsg));
          }
        }

        // Start heartbeat monitoring
        this.startHeartbeat(subscriptionKey);
      };

      ws.onmessage = (event) => {
        try {
          // Handle plain text ping/pong messages (some exchanges send these)
          if (typeof event.data === "string") {
            const textData = event.data.trim().toLowerCase();
            if (textData === "pong" || textData === "ping") {
              sub.lastMessageTime = Date.now();
              console.log(`🏓 [${sub.exchange.toUpperCase()}] Received: ${textData}`);
              return;
            }
          }

          const rawData = JSON.parse(event.data);
          sub.lastMessageTime = Date.now();

          // Handle JSON ping/pong
          if (this.handlePingPong(ws, sub.exchange, rawData)) {
            return;
          }

          // Skip subscription confirmations
          if (this.isSubscriptionConfirmation(rawData)) {
            console.log(`✅ [${sub.exchange.toUpperCase()}] Subscription confirmed`);
            return;
          }

          // Normalize and dispatch data
          const normalizedData = this.normalizeMessage(sub.exchange, rawData, subscriptionKey);

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
        console.warn(`⚠️ [WebSocket] Error: ${sub.stream} (${sub.exchange})`);
        this.updateStatus(subscriptionKey, "error");
      };

      ws.onclose = (event) => {
        clearTimeout(timeout);
        console.log(`🔌 [WebSocket] Closed: ${sub.stream} (${sub.exchange}, code: ${event.code})`);

        sub.ws = null;
        this.stopHeartbeat(subscriptionKey);

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

  private handlePingPong(ws: WebSocket, exchange: Exchange, data: any): boolean {
    if (exchange === "bybit") {
      if (data.op === "ping" || data.ret_msg === "pong") {
        ws.send(JSON.stringify({ op: "pong" }));
        return true;
      }
    }
    if (exchange === "okx") {
      if (data.event === "ping" || data === "ping") {
        ws.send(JSON.stringify({ op: "pong" }));
        return true;
      }
    }
    return false;
  }

  private isSubscriptionConfirmation(data: any): boolean {
    return (
      data.event === "subscribe" ||
      data.op === "subscribe" ||
      data.success === true ||
      data.type === "subscriptions" ||
      (data.ret_msg === "subscribe" && data.success === true)
    );
  }

  private startHeartbeat(subscriptionKey: string) {
    const sub = this.subscriptions.get(subscriptionKey);
    if (!sub) return;

    // Clear existing heartbeat
    this.stopHeartbeat(subscriptionKey);

    sub.heartbeatInterval = setInterval(() => {
      // Check if we've received data recently
      const timeSinceLastMessage = Date.now() - sub.lastMessageTime;

      if (timeSinceLastMessage > this.messageTimeoutMs) {
        console.warn(`⏱️ [WebSocket] No data for ${timeSinceLastMessage}ms, reconnecting...`);
        if (sub.ws) {
          sub.ws.close();
        }
        return;
      }

      // Send ping for exchanges that need it
      if (sub.ws?.readyState === WebSocket.OPEN) {
        if (sub.exchange === "bybit") {
          sub.ws.send(JSON.stringify({ op: "ping" }));
        } else if (sub.exchange === "okx") {
          sub.ws.send("ping");
        }
      }
    }, this.heartbeatIntervalMs);
  }

  private stopHeartbeat(subscriptionKey: string) {
    const sub = this.subscriptions.get(subscriptionKey);
    if (sub?.heartbeatInterval) {
      clearInterval(sub.heartbeatInterval);
      sub.heartbeatInterval = null;
    }
  }

  private handleConnectionFailure(subscriptionKey: string) {
    const sub = this.subscriptions.get(subscriptionKey);
    if (!sub) return;

    sub.reconnectAttempts++;

    if (sub.reconnectAttempts >= this.maxReconnectAttempts) {
      // Only Binance has REST fallback via our proxy
      if (sub.exchange === "binance") {
        console.warn(`🔄 [WebSocket] Switching to REST fallback for ${sub.stream}`);
        this.startFallback(subscriptionKey);
      } else {
        console.error(`❌ [WebSocket] Max reconnect attempts for ${sub.exchange.toUpperCase()}`);
        this.updateStatus(subscriptionKey, "error");
        // Reset and try again after a longer delay
        setTimeout(() => {
          sub.reconnectAttempts = 0;
          this.connect(subscriptionKey);
        }, 10000);
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

    const delay = this.reconnectDelay * Math.pow(1.5, sub.reconnectAttempts - 1);
    const jitter = Math.random() * 1000;

    console.log(
      `🔄 [WebSocket] Reconnecting ${sub.stream} in ${Math.round(delay + jitter)}ms (attempt ${sub.reconnectAttempts}/${this.maxReconnectAttempts})`
    );

    this.updateStatus(subscriptionKey, "connecting");

    sub.reconnectTimeout = setTimeout(() => {
      this.connect(subscriptionKey);
    }, delay + jitter);
  }

  /**
   * REST Fallback using our Next.js API proxy
   */
  private startFallback(subscriptionKey: string) {
    const sub = this.subscriptions.get(subscriptionKey);
    if (!sub) return;

    if (sub.fallbackInterval) {
      clearInterval(sub.fallbackInterval);
    }

    console.log(`📡 [REST Fallback] Starting for ${sub.stream} (${sub.marketType})`);
    this.updateStatus(subscriptionKey, "fallback");

    const isDepth = sub.stream.includes("@depth");
    const symbol = sub.stream.split("@")[0].toUpperCase();

    const poll = async () => {
      try {
        if (isDepth) {
          // Use our proxy API to avoid CORS
          const limit = parseInt(sub.stream.match(/@depth(\d+)/)?.[1] || "20");
          const url = `/api/v2/binance/depth?symbol=${symbol}&limit=${limit}`;

          const res = await fetch(url);
          if (!res.ok) throw new Error(`REST failed: ${res.status}`);

          const json = await res.json();
          if (!json.ok) throw new Error(json.error || "API error");

          const data = {
            bids: json.bids,
            asks: json.asks,
          };

          sub.callbacks.forEach((callback) => {
            try {
              callback(data);
            } catch (err) {
              console.error(`[REST Fallback] Callback error:`, err);
            }
          });
        }
      } catch (err) {
        console.error(`[REST Fallback] Fetch error:`, err);
      }
    };

    // Immediate poll
    poll();

    // Poll every 2 seconds
    sub.fallbackInterval = setInterval(poll, 2000);
  }

  private disconnect(subscriptionKey: string) {
    const sub = this.subscriptions.get(subscriptionKey);
    if (!sub) return;

    // Don't disconnect if there are still callbacks
    if (sub.callbacks.size > 0) {
      return;
    }

    // Clear all timeouts/intervals
    if (sub.reconnectTimeout) {
      clearTimeout(sub.reconnectTimeout);
      sub.reconnectTimeout = null;
    }

    if (sub.fallbackInterval) {
      clearInterval(sub.fallbackInterval);
      sub.fallbackInterval = null;
    }

    this.stopHeartbeat(subscriptionKey);

    if (sub.ws) {
      sub.ws.close();
      sub.ws = null;
    }

    sub.orderBookState = null;
    this.subscriptions.delete(subscriptionKey);

    console.log(`👋 [WebSocket] Disconnected: ${sub.stream} (${sub.marketType})`);
  }

  disconnectAll() {
    this.subscriptions.forEach((sub, key) => {
      sub.callbacks.clear(); // Force disconnect
      this.disconnect(key);
    });
  }

  getStatus(
    stream: string,
    marketType: "spot" | "futures" = "spot",
    exchange: Exchange = "binance"
  ): ConnectionStatus {
    if (!this.isBrowser()) return "disconnected";

    const subscriptionKey = `${exchange}-${marketType}-${stream.toLowerCase()}`;
    const sub = this.subscriptions.get(subscriptionKey);

    if (!sub) return "disconnected";
    return sub.status;
  }

  // Force reconnect for a specific subscription
  forceReconnect(
    stream: string,
    marketType: "spot" | "futures" = "spot",
    exchange: Exchange = "binance"
  ) {
    const subscriptionKey = `${exchange}-${marketType}-${stream.toLowerCase()}`;
    const sub = this.subscriptions.get(subscriptionKey);

    if (sub) {
      console.log(`🔄 [WebSocket] Force reconnecting ${subscriptionKey}`);
      if (sub.ws) {
        sub.ws.close();
      }
      if (sub.fallbackInterval) {
        clearInterval(sub.fallbackInterval);
        sub.fallbackInterval = null;
      }
      sub.reconnectAttempts = 0;
      sub.orderBookState = null;
      this.connect(subscriptionKey);
    }
  }
}

export type { Exchange, ConnectionStatus };
export const wsService = new WebSocketService();

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    wsService.disconnectAll();
  });
}
