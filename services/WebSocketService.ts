// services/WebSocketService.ts

type StreamCallback = (data: any) => void;

interface StreamSubscription {
  stream: string;
  callbacks: Set<StreamCallback>;
  ws: WebSocket | null;
  reconnectAttempts: number;
  reconnectTimeout: NodeJS.Timeout | null;
  fallbackInterval: NodeJS.Timeout | null; // 🔥 REST fallback
}

class WebSocketService {
  private subscriptions: Map<string, StreamSubscription> = new Map();
  private baseUrl = "wss://stream.binance.com:9443/ws";
  private maxReconnectAttempts = 3; // Daha az deneme
  private reconnectDelay = 2000;
  private useFallback = false; // 🔥 Global fallback flag

  /**
   * Check if we're in browser environment
   */
  private isBrowser(): boolean {
    return typeof window !== "undefined" && typeof WebSocket !== "undefined";
  }

  /**
   * Subscribe to a Binance WebSocket stream
   */
  subscribe(stream: string, callback: StreamCallback): () => void {
    if (!this.isBrowser()) {
      console.warn("[WebSocket] Skipping subscription (SSR environment)");
      return () => {};
    }

    const normalizedStream = stream.toLowerCase();

    // Get or create subscription
    if (!this.subscriptions.has(normalizedStream)) {
      this.subscriptions.set(normalizedStream, {
        stream: normalizedStream,
        callbacks: new Set(),
        ws: null,
        reconnectAttempts: 0,
        reconnectTimeout: null,
        fallbackInterval: null,
      });
    }

    const sub = this.subscriptions.get(normalizedStream)!;
    sub.callbacks.add(callback);

    // 🔥 Use fallback if WebSocket failed before
    if (this.useFallback) {
      this.startFallback(normalizedStream);
    } else {
      // Try WebSocket first
      if (!sub.ws || sub.ws.readyState !== WebSocket.OPEN) {
        this.connect(normalizedStream);
      }
    }

    // Return unsubscribe function
    return () => this.unsubscribe(normalizedStream, callback);
  }

  /**
   * Unsubscribe from a stream
   */
  private unsubscribe(stream: string, callback: StreamCallback) {
    const sub = this.subscriptions.get(stream);
    if (!sub) return;

    sub.callbacks.delete(callback);

    // Close connection if no more subscribers
    if (sub.callbacks.size === 0) {
      this.disconnect(stream);
    }
  }

  /**
   * Connect to a WebSocket stream
   */
  private connect(stream: string) {
    if (!this.isBrowser()) return;

    const sub = this.subscriptions.get(stream);
    if (!sub) return;

    try {
      const ws = new WebSocket(`${this.baseUrl}/${stream}`);

      // 🔥 Connection timeout (5 seconds)
      const timeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          console.warn(`⏱️ [WebSocket] Connection timeout: ${stream}`);
          ws.close();
          this.handleConnectionFailure(stream);
        }
      }, 5000);

      ws.onopen = () => {
        clearTimeout(timeout);
        console.log(`✅ [WebSocket] Connected: ${stream}`);
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
        console.warn(`⚠️ [WebSocket] Connection error: ${stream}`);
      };

      ws.onclose = (event) => {
        clearTimeout(timeout);
        console.log(`🔌 [WebSocket] Closed: ${stream} (code: ${event.code})`);
        sub.ws = null;

        // Handle connection failure
        if (sub.callbacks.size > 0) {
          this.handleConnectionFailure(stream);
        }
      };

      sub.ws = ws;
    } catch (err) {
      console.error(`[WebSocket] Connection error:`, err);
      this.handleConnectionFailure(stream);
    }
  }

  /**
   * Handle connection failure
   */
  private handleConnectionFailure(stream: string) {
    const sub = this.subscriptions.get(stream);
    if (!sub) return;

    sub.reconnectAttempts++;

    // 🔥 After 3 failed attempts, switch to REST fallback
    if (sub.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn(`🔄 [WebSocket] Switching to REST fallback for ${stream}`);
      this.useFallback = true; // Global flag
      this.startFallback(stream);
    } else {
      // Try reconnecting
      this.reconnect(stream);
    }
  }

  /**
   * Reconnect with exponential backoff
   */
  private reconnect(stream: string) {
    const sub = this.subscriptions.get(stream);
    if (!sub) return;

    if (sub.reconnectTimeout) {
      clearTimeout(sub.reconnectTimeout);
    }

    const delay = this.reconnectDelay * Math.pow(2, sub.reconnectAttempts - 1);

    console.log(
      `🔄 [WebSocket] Reconnecting ${stream} in ${delay}ms (attempt ${sub.reconnectAttempts}/${this.maxReconnectAttempts})`
    );

    sub.reconnectTimeout = setTimeout(() => {
      this.connect(stream);
    }, delay);
  }

  /**
   * 🔥 REST API Fallback (polling)
   */
  private startFallback(stream: string) {
    const sub = this.subscriptions.get(stream);
    if (!sub) return;

    // Clear any existing fallback
    if (sub.fallbackInterval) {
      clearInterval(sub.fallbackInterval);
    }

    console.log(`📡 [REST Fallback] Starting for ${stream}`);

    // Parse stream type
    const isTicker = stream.includes("@ticker");
    const isDepth = stream.includes("@depth");
    const symbol = stream.split("@")[0].toUpperCase();

    // REST polling function
    const poll = async () => {
      try {
        let data;

        if (isTicker) {
          // Ticker endpoint
          const res = await fetch(
            `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
          );
          if (!res.ok) throw new Error("REST failed");
          const json = await res.json();

          // Format to match WebSocket response
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
          // Order book endpoint
          const res = await fetch(
            `https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=20`
          );
          if (!res.ok) throw new Error("REST failed");
          const json = await res.json();

          data = {
            bids: json.bids,
            asks: json.asks,
          };
        }

        // Call callbacks
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
        console.error(`[REST Fallback] Fetch error for ${stream}:`, err);
      }
    };

    // Initial call
    poll();

    // Set interval (ticker: 3s, depth: 2s)
    const interval = isTicker ? 3000 : 2000;
    sub.fallbackInterval = setInterval(poll, interval);
  }

  /**
   * Disconnect from a stream
   */
  private disconnect(stream: string) {
    const sub = this.subscriptions.get(stream);
    if (!sub) return;

    // Clear reconnect timeout
    if (sub.reconnectTimeout) {
      clearTimeout(sub.reconnectTimeout);
      sub.reconnectTimeout = null;
    }

    // Clear fallback interval
    if (sub.fallbackInterval) {
      clearInterval(sub.fallbackInterval);
      sub.fallbackInterval = null;
    }

    // Close WebSocket
    if (sub.ws) {
      sub.ws.close();
      sub.ws = null;
    }

    // Remove subscription
    this.subscriptions.delete(stream);
    console.log(`👋 [WebSocket] Disconnected: ${stream}`);
  }

  /**
   * Disconnect all streams
   */
  disconnectAll() {
    this.subscriptions.forEach((_, stream) => {
      this.disconnect(stream);
    });
  }

  /**
   * Get connection status
   */
  getStatus(
    stream: string
  ): "connected" | "connecting" | "disconnected" | "fallback" {
    if (!this.isBrowser()) return "disconnected";

    const sub = this.subscriptions.get(stream.toLowerCase());
    if (!sub) return "disconnected";

    // Check if using fallback
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

// Singleton instance
export const wsService = new WebSocketService();

// Cleanup on page unload (browser only)
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    wsService.disconnectAll();
  });
}
