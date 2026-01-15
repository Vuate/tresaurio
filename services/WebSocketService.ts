// services/WebSocketService.ts

type StreamCallback = (data: any) => void;

interface StreamSubscription {
  stream: string;
  callbacks: Set<StreamCallback>;
  ws: WebSocket | null;
  reconnectAttempts: number;
  reconnectTimeout: NodeJS.Timeout | null;
  fallbackInterval: NodeJS.Timeout | null;
  marketType: "spot" | "futures"; // 🔥 YENİ
}

class WebSocketService {
  private subscriptions: Map<string, StreamSubscription> = new Map();

  // 🔥 İki farklı endpoint
  private spotBaseUrl = "wss://stream.binance.com:9443/ws";
  private futuresBaseUrl = "wss://fstream.binance.com/ws";

  private maxReconnectAttempts = 3;
  private reconnectDelay = 2000;
  private useFallback = false;

  private isBrowser(): boolean {
    return typeof window !== "undefined" && typeof WebSocket !== "undefined";
  }

  /**
   * 🔥 Subscribe to a stream with market type
   */
  subscribe(
    stream: string,
    callback: StreamCallback,
    marketType: "spot" | "futures" = "spot" // 🔥 YENİ PARAMETRE
  ): () => void {
    if (!this.isBrowser()) {
      console.warn("[WebSocket] Skipping subscription (SSR environment)");
      return () => {};
    }

    const normalizedStream = stream.toLowerCase();
    const subscriptionKey = `${marketType}-${normalizedStream}`; // 🔥 Unique key

    if (!this.subscriptions.has(subscriptionKey)) {
      this.subscriptions.set(subscriptionKey, {
        stream: normalizedStream,
        callbacks: new Set(),
        ws: null,
        reconnectAttempts: 0,
        reconnectTimeout: null,
        fallbackInterval: null,
        marketType, // 🔥 Store market type
      });
    }

    const sub = this.subscriptions.get(subscriptionKey)!;
    sub.callbacks.add(callback);

    if (this.useFallback) {
      this.startFallback(subscriptionKey);
    } else {
      if (!sub.ws || sub.ws.readyState !== WebSocket.OPEN) {
        this.connect(subscriptionKey);
      }
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
   * 🔥 Connect with correct endpoint based on market type
   */
  private connect(subscriptionKey: string) {
    if (!this.isBrowser()) return;

    const sub = this.subscriptions.get(subscriptionKey);
    if (!sub) return;

    try {
      // 🔥 Choose endpoint based on market type
      const baseUrl =
        sub.marketType === "futures" ? this.futuresBaseUrl : this.spotBaseUrl;
      const wsUrl = `${baseUrl}/${sub.stream}`;

      console.log(
        `🔌 [WebSocket] Connecting to ${sub.marketType.toUpperCase()}: ${
          sub.stream
        }`
      );

      const ws = new WebSocket(wsUrl);

      const timeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          console.warn(
            `⏱️ [WebSocket] Connection timeout: ${sub.stream} (${sub.marketType})`
          );
          ws.close();
          this.handleConnectionFailure(subscriptionKey);
        }
      }, 5000);

      ws.onopen = () => {
        clearTimeout(timeout);
        console.log(
          `✅ [WebSocket] Connected (${sub.marketType.toUpperCase()}): ${
            sub.stream
          }`
        );
        sub.reconnectAttempts = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          sub.callbacks.forEach((callback) => {
            try {
              callback(data);
            } catch (err) {
              console.error(`[WebSocket] Callback error:`, err);
            }
          });
        } catch (err) {
          console.error(`[WebSocket] Parse error:`, err);
        }
      };

      ws.onerror = () => {
        clearTimeout(timeout);
        console.warn(
          `⚠️ [WebSocket] Connection error: ${sub.stream} (${sub.marketType})`
        );
      };

      ws.onclose = (event) => {
        clearTimeout(timeout);
        console.log(
          `🔌 [WebSocket] Closed: ${sub.stream} (${sub.marketType}, code: ${event.code})`
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
      console.warn(
        `🔄 [WebSocket] Switching to REST fallback for ${sub.stream} (${sub.marketType})`
      );
      this.useFallback = true;
      this.startFallback(subscriptionKey);
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
      `🔄 [WebSocket] Reconnecting ${sub.stream} (${sub.marketType}) in ${delay}ms (attempt ${sub.reconnectAttempts}/${this.maxReconnectAttempts})`
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
      `📡 [REST Fallback] Starting for ${sub.stream} (${sub.marketType})`
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
          err
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
      `👋 [WebSocket] Disconnected: ${sub.stream} (${sub.marketType})`
    );
  }

  disconnectAll() {
    this.subscriptions.forEach((_, key) => {
      this.disconnect(key);
    });
  }

  getStatus(
    stream: string,
    marketType: "spot" | "futures" = "spot"
  ): "connected" | "connecting" | "disconnected" | "fallback" {
    if (!this.isBrowser()) return "disconnected";

    const subscriptionKey = `${marketType}-${stream.toLowerCase()}`;
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

export const wsService = new WebSocketService();

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    wsService.disconnectAll();
  });
}
