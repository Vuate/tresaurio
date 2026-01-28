// lib/config/apiMonitor.ts
// Real-time API Monitoring System for Tresaurio Admin Dashboard

import {
  type Exchange,
  type DataProvider,
  EXCHANGE_CONFIG,
  DATA_PROVIDER_CONFIG,
  getRateLimit,
} from "./apiConfig";

// ============================================================================
// TYPES
// ============================================================================

export interface RequestLog {
  id: string;
  timestamp: number;
  source: Exchange | DataProvider;
  endpoint: string;
  method: "GET" | "POST" | "WS";
  url: string;
  status: "success" | "error" | "pending";
  statusCode?: number;
  latency?: number;
  errorMessage?: string;
  cached: boolean;
  params?: Record<string, unknown>;
}

export interface SourceStats {
  source: Exchange | DataProvider;
  requests: {
    total: number;
    last1m: number;
    last5m: number;
    last1h: number;
  };
  errors: {
    total: number;
    last1m: number;
    rate: number; // percentage
    lastError?: string;
    lastErrorTime?: number;
  };
  latency: {
    avg: number;
    min: number;
    max: number;
    p50: number;
    p95: number;
    p99: number;
  };
  cache: {
    hits: number;
    misses: number;
    hitRate: number;
  };
  rateLimit: {
    limit: number;
    used: number;
    remaining: number;
    resetTime: number;
  };
  status: "healthy" | "degraded" | "down";
  lastRequestTime?: number;
}

export interface WebSocketStats {
  exchange: Exchange;
  connections: number;
  activeStreams: string[];
  messagesReceived: number;
  lastMessageTime?: number;
  reconnects: number;
  status: "connected" | "connecting" | "disconnected" | "error";
}

export interface SystemHealth {
  overall: "healthy" | "degraded" | "critical";
  uptime: number;
  memoryUsage?: number;
  activeConnections: number;
  totalRequests: number;
  errorRate: number;
  lastUpdated: number;
}

// ============================================================================
// API MONITOR CLASS
// ============================================================================

class ApiMonitor {
  private logs: RequestLog[] = [];
  private maxLogs = 10000;
  private startTime = Date.now();

  private requestCounts = new Map<string, number[]>();
  private errorCounts = new Map<string, number[]>();
  private latencies = new Map<string, number[]>();
  private cacheHits = new Map<string, number>();
  private cacheMisses = new Map<string, number>();

  private wsStats = new Map<Exchange, WebSocketStats>();
  private listeners = new Set<(stats: SourceStats[]) => void>();

  constructor() {
    // Initialize stats for all sources
    const allSources = [
      ...Object.keys(EXCHANGE_CONFIG),
      ...Object.keys(DATA_PROVIDER_CONFIG),
    ] as (Exchange | DataProvider)[];

    allSources.forEach((source) => {
      this.requestCounts.set(source, []);
      this.errorCounts.set(source, []);
      this.latencies.set(source, []);
      this.cacheHits.set(source, 0);
      this.cacheMisses.set(source, 0);
    });

    // Initialize WebSocket stats
    (Object.keys(EXCHANGE_CONFIG) as Exchange[]).forEach((exchange) => {
      this.wsStats.set(exchange, {
        exchange,
        connections: 0,
        activeStreams: [],
        messagesReceived: 0,
        reconnects: 0,
        status: "disconnected",
      });
    });

    // Cleanup old data every minute
    if (typeof window !== "undefined") {
      setInterval(() => this.cleanup(), 60000);
    }
  }

  // ============================================================================
  // LOGGING METHODS
  // ============================================================================

  logRequest(log: Omit<RequestLog, "id">): string {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fullLog: RequestLog = { ...log, id };

    this.logs.push(fullLog);

    // Update counters
    const timestamps = this.requestCounts.get(log.source) || [];
    timestamps.push(log.timestamp);
    this.requestCounts.set(log.source, timestamps);

    if (log.status === "error") {
      const errors = this.errorCounts.get(log.source) || [];
      errors.push(log.timestamp);
      this.errorCounts.set(log.source, errors);
    }

    if (log.latency !== undefined) {
      const latencyList = this.latencies.get(log.source) || [];
      latencyList.push(log.latency);
      this.latencies.set(log.source, latencyList);
    }

    if (log.cached) {
      this.cacheHits.set(log.source, (this.cacheHits.get(log.source) || 0) + 1);
    } else {
      this.cacheMisses.set(log.source, (this.cacheMisses.get(log.source) || 0) + 1);
    }

    // Trim logs if needed
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Notify listeners
    this.notifyListeners();

    return id;
  }

  updateRequestStatus(
    id: string,
    status: "success" | "error",
    details?: { statusCode?: number; latency?: number; errorMessage?: string }
  ): void {
    const log = this.logs.find((l) => l.id === id);
    if (log) {
      log.status = status;
      if (details?.statusCode) log.statusCode = details.statusCode;
      if (details?.latency) {
        log.latency = details.latency;
        const latencyList = this.latencies.get(log.source) || [];
        latencyList.push(details.latency);
        this.latencies.set(log.source, latencyList);
      }
      if (details?.errorMessage) {
        log.errorMessage = details.errorMessage;
        const errors = this.errorCounts.get(log.source) || [];
        errors.push(Date.now());
        this.errorCounts.set(log.source, errors);
      }
      this.notifyListeners();
    }
  }

  // ============================================================================
  // WEBSOCKET TRACKING
  // ============================================================================

  logWsConnect(exchange: Exchange, stream: string): void {
    const stats = this.wsStats.get(exchange);
    if (stats) {
      stats.connections++;
      if (!stats.activeStreams.includes(stream)) {
        stats.activeStreams.push(stream);
      }
      stats.status = "connected";
      this.notifyListeners();
    }
  }

  logWsDisconnect(exchange: Exchange, stream: string): void {
    const stats = this.wsStats.get(exchange);
    if (stats) {
      stats.connections = Math.max(0, stats.connections - 1);
      stats.activeStreams = stats.activeStreams.filter((s) => s !== stream);
      if (stats.connections === 0) {
        stats.status = "disconnected";
      }
      this.notifyListeners();
    }
  }

  logWsMessage(exchange: Exchange): void {
    const stats = this.wsStats.get(exchange);
    if (stats) {
      stats.messagesReceived++;
      stats.lastMessageTime = Date.now();
    }
  }

  logWsReconnect(exchange: Exchange): void {
    const stats = this.wsStats.get(exchange);
    if (stats) {
      stats.reconnects++;
      stats.status = "connecting";
      this.notifyListeners();
    }
  }

  logWsError(exchange: Exchange): void {
    const stats = this.wsStats.get(exchange);
    if (stats) {
      stats.status = "error";
      this.notifyListeners();
    }
  }

  // ============================================================================
  // STATS METHODS
  // ============================================================================

  getSourceStats(source: Exchange | DataProvider): SourceStats {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const fiveMinutesAgo = now - 300000;
    const oneHourAgo = now - 3600000;

    const requests = this.requestCounts.get(source) || [];
    const errors = this.errorCounts.get(source) || [];
    const latencyList = this.latencies.get(source) || [];

    // Filter by time windows
    const requestsLast1m = requests.filter((t) => t > oneMinuteAgo).length;
    const requestsLast5m = requests.filter((t) => t > fiveMinutesAgo).length;
    const requestsLast1h = requests.filter((t) => t > oneHourAgo).length;

    const errorsLast1m = errors.filter((t) => t > oneMinuteAgo).length;

    // Calculate latency percentiles
    const sortedLatencies = [...latencyList].sort((a, b) => a - b);
    const getPercentile = (arr: number[], p: number) => {
      if (arr.length === 0) return 0;
      const idx = Math.ceil((p / 100) * arr.length) - 1;
      return arr[Math.max(0, idx)];
    };

    const rateLimit = getRateLimit(source);
    const usedRequests = requestsLast1m;

    // Determine health status
    let status: "healthy" | "degraded" | "down" = "healthy";
    const errorRate = requestsLast1m > 0 ? (errorsLast1m / requestsLast1m) * 100 : 0;
    if (errorRate > 50) status = "down";
    else if (errorRate > 10 || usedRequests > rateLimit.requestsPerMinute * 0.8) status = "degraded";

    const hits = this.cacheHits.get(source) || 0;
    const misses = this.cacheMisses.get(source) || 0;
    const totalCache = hits + misses;

    return {
      source,
      requests: {
        total: requests.length,
        last1m: requestsLast1m,
        last5m: requestsLast5m,
        last1h: requestsLast1h,
      },
      errors: {
        total: errors.length,
        last1m: errorsLast1m,
        rate: errorRate,
        lastError: this.logs
          .filter((l) => l.source === source && l.status === "error")
          .pop()?.errorMessage,
        lastErrorTime: errors[errors.length - 1],
      },
      latency: {
        avg: sortedLatencies.length > 0
          ? sortedLatencies.reduce((a, b) => a + b, 0) / sortedLatencies.length
          : 0,
        min: sortedLatencies[0] || 0,
        max: sortedLatencies[sortedLatencies.length - 1] || 0,
        p50: getPercentile(sortedLatencies, 50),
        p95: getPercentile(sortedLatencies, 95),
        p99: getPercentile(sortedLatencies, 99),
      },
      cache: {
        hits,
        misses,
        hitRate: totalCache > 0 ? (hits / totalCache) * 100 : 0,
      },
      rateLimit: {
        limit: rateLimit.requestsPerMinute,
        used: usedRequests,
        remaining: Math.max(0, rateLimit.requestsPerMinute - usedRequests),
        resetTime: now + 60000,
      },
      status,
      lastRequestTime: requests[requests.length - 1],
    };
  }

  getAllStats(): SourceStats[] {
    const allSources = [
      ...Object.keys(EXCHANGE_CONFIG),
      ...Object.keys(DATA_PROVIDER_CONFIG),
    ] as (Exchange | DataProvider)[];

    return allSources.map((source) => this.getSourceStats(source));
  }

  getWebSocketStats(): WebSocketStats[] {
    return Array.from(this.wsStats.values());
  }

  getSystemHealth(): SystemHealth {
    const allStats = this.getAllStats();
    const totalRequests = allStats.reduce((sum, s) => sum + s.requests.total, 0);
    const totalErrors = allStats.reduce((sum, s) => sum + s.errors.total, 0);
    const errorRate = totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0;

    const wsStats = this.getWebSocketStats();
    const activeConnections = wsStats.reduce((sum, s) => sum + s.connections, 0);

    const downCount = allStats.filter((s) => s.status === "down").length;
    const degradedCount = allStats.filter((s) => s.status === "degraded").length;

    let overall: "healthy" | "degraded" | "critical" = "healthy";
    if (downCount > 0) overall = "critical";
    else if (degradedCount > 0 || errorRate > 5) overall = "degraded";

    return {
      overall,
      uptime: Date.now() - this.startTime,
      activeConnections,
      totalRequests,
      errorRate,
      lastUpdated: Date.now(),
    };
  }

  getRecentLogs(limit = 100, source?: Exchange | DataProvider): RequestLog[] {
    let logs = this.logs;
    if (source) {
      logs = logs.filter((l) => l.source === source);
    }
    return logs.slice(-limit).reverse();
  }

  // ============================================================================
  // LISTENERS
  // ============================================================================

  subscribe(callback: (stats: SourceStats[]) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(): void {
    const stats = this.getAllStats();
    this.listeners.forEach((callback) => callback(stats));
  }

  // ============================================================================
  // CLEANUP
  // ============================================================================

  private cleanup(): void {
    const oneHourAgo = Date.now() - 3600000;

    // Clean old timestamps
    this.requestCounts.forEach((timestamps, key) => {
      this.requestCounts.set(key, timestamps.filter((t) => t > oneHourAgo));
    });

    this.errorCounts.forEach((timestamps, key) => {
      this.errorCounts.set(key, timestamps.filter((t) => t > oneHourAgo));
    });

    // Keep only recent latencies
    this.latencies.forEach((list, key) => {
      if (list.length > 1000) {
        this.latencies.set(key, list.slice(-1000));
      }
    });

    // Clean old logs
    this.logs = this.logs.filter((l) => l.timestamp > oneHourAgo);
  }

  reset(): void {
    this.logs = [];
    this.requestCounts.forEach((_, key) => this.requestCounts.set(key, []));
    this.errorCounts.forEach((_, key) => this.errorCounts.set(key, []));
    this.latencies.forEach((_, key) => this.latencies.set(key, []));
    this.cacheHits.forEach((_, key) => this.cacheHits.set(key, 0));
    this.cacheMisses.forEach((_, key) => this.cacheMisses.set(key, 0));
    this.startTime = Date.now();
    this.notifyListeners();
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const apiMonitor = new ApiMonitor();

// ============================================================================
// HELPER: Wrap fetch with monitoring
// ============================================================================

export async function monitoredFetch(
  url: string,
  options: RequestInit & {
    source: Exchange | DataProvider;
    endpoint: string;
    cached?: boolean;
  }
): Promise<Response> {
  const { source, endpoint, cached = false, ...fetchOptions } = options;
  const startTime = Date.now();

  const logId = apiMonitor.logRequest({
    timestamp: startTime,
    source,
    endpoint,
    method: (fetchOptions.method || "GET") as "GET" | "POST",
    url,
    status: "pending",
    cached,
  });

  try {
    const response = await fetch(url, fetchOptions);
    const latency = Date.now() - startTime;

    apiMonitor.updateRequestStatus(logId, response.ok ? "success" : "error", {
      statusCode: response.status,
      latency,
      errorMessage: response.ok ? undefined : `HTTP ${response.status}`,
    });

    return response;
  } catch (error) {
    const latency = Date.now() - startTime;
    apiMonitor.updateRequestStatus(logId, "error", {
      latency,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    });
    throw error;
  }
}

export default apiMonitor;
