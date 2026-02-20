"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  Server,
  Wifi,
  WifiOff,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  LogOut,
  Zap,
  Database,
  TrendingUp,
  Shield,
  BarChart3,
  Globe,
  Users,
  LogIn,
} from "lucide-react";
import {
  apiMonitor,
  type SourceStats,
  type WebSocketStats,
  type SystemHealth,
} from "@/lib/config/apiMonitor";
import { EXCHANGE_CONFIG, DATA_PROVIDER_CONFIG } from "@/lib/config/apiConfig";

type ActivityLog = {
  id: string;
  action: string;
  createdAt: string;
  user: { name: string | null; email: string };
};

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
  activityLogs: { action: string; createdAt: string }[];
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<SourceStats[]>([]);
  const [wsStats, setWsStats] = useState<WebSocketStats[]>([]);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [userList, setUserList] = useState<UserRow[]>([]);
  const [recentLogs, setRecentLogs] = useState<ActivityLog[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Auth check
  useEffect(() => {
    const session = sessionStorage.getItem("admin_session");
    if (!session) {
      router.push("/admin/login");
      return;
    }
    const parsed = JSON.parse(session);
    if (parsed.expires < Date.now()) {
      sessionStorage.removeItem("admin_session");
      router.push("/admin/login");
    }
  }, [router]);

  // Load stats
  const loadStats = useCallback(() => {
    setStats(apiMonitor.getAllStats());
    setWsStats(apiMonitor.getWebSocketStats());
    setHealth(apiMonitor.getSystemHealth());
    setLastUpdate(Date.now());
  }, []);

  useEffect(() => {
    loadStats();

    // Subscribe to updates
    const unsubscribe = apiMonitor.subscribe((newStats) => {
      if (autoRefresh) {
        setStats(newStats);
        setWsStats(apiMonitor.getWebSocketStats());
        setHealth(apiMonitor.getSystemHealth());
        setLastUpdate(Date.now());
      }
    });

    // Auto refresh every 5 seconds
    const interval = setInterval(() => {
      if (autoRefresh) loadStats();
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [loadStats, autoRefresh]);

  const fetchUsers = useCallback(async () => {
    const session = sessionStorage.getItem("admin_session");
    if (!session) return;
    const { password } = JSON.parse(session);
    setUsersLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        headers: { "x-admin-password": password },
      });
      const json = await res.json();
      if (json.success) {
        setTotalUsers(json.data.totalUsers);
        setUserList(json.data.users);
        setRecentLogs(json.data.recentLogs);
      }
    } catch {
      // silently fail
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_session");
    router.push("/admin/login");
  };

  const formatUptime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const formatLatency = (ms: number) => {
    if (ms < 1) return "<1ms";
    return `${Math.round(ms)}ms`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "connected":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "degraded":
      case "connecting":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "down":
      case "critical":
      case "error":
      case "disconnected":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      default:
        return "text-white/50 bg-white/5 border-white/10";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
      case "connected":
        return <CheckCircle className="w-4 h-4" />;
      case "degraded":
      case "connecting":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <XCircle className="w-4 h-4" />;
    }
  };

  // Group sources
  const exchangeStats = stats.filter((s) => s.source in EXCHANGE_CONFIG);
  const providerStats = stats.filter((s) => s.source in DATA_PROVIDER_CONFIG);

  return (
    <div className="min-h-screen bg-[#030711] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#030711]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Admin Dashboard</h1>
                <p className="text-xs text-white/40">API Monitoring System</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-white/40">
                <Clock className="w-3.5 h-3.5" />
                Last update: {new Date(lastUpdate).toLocaleTimeString()}
              </div>

              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`p-2 rounded-lg transition-colors ${
                  autoRefresh
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-white/5 text-white/40"
                }`}
                title={autoRefresh ? "Auto-refresh ON" : "Auto-refresh OFF"}
              >
                <RefreshCw className={`w-4 h-4 ${autoRefresh ? "animate-spin" : ""}`} style={{ animationDuration: "3s" }} />
              </button>

              <button
                onClick={loadStats}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 transition-colors"
                title="Refresh now"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* System Health Overview */}
        {health && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className={`p-4 rounded-xl border ${getStatusColor(health.overall)}`}>
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(health.overall)}
                <span className="text-xs font-medium uppercase">System Status</span>
              </div>
              <div className="text-2xl font-bold capitalize">{health.overall}</div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2 text-white/50">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium">Uptime</span>
              </div>
              <div className="text-2xl font-bold">{formatUptime(health.uptime)}</div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2 text-white/50">
                <Wifi className="w-4 h-4" />
                <span className="text-xs font-medium">Connections</span>
              </div>
              <div className="text-2xl font-bold">{health.activeConnections}</div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2 text-white/50">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-medium">Total Requests</span>
              </div>
              <div className="text-2xl font-bold">{health.totalRequests.toLocaleString()}</div>
            </div>

            <div className={`p-4 rounded-xl border ${health.errorRate > 5 ? "bg-red-500/10 border-red-500/20" : "bg-white/5 border-white/10"}`}>
              <div className="flex items-center gap-2 mb-2 text-white/50">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-medium">Error Rate</span>
              </div>
              <div className={`text-2xl font-bold ${health.errorRate > 5 ? "text-red-400" : ""}`}>
                {health.errorRate.toFixed(2)}%
              </div>
            </div>
          </div>
        )}

        {/* Exchange APIs */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold">Exchange APIs</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {exchangeStats.map((stat) => (
              <div
                key={stat.source}
                onClick={() => setSelectedSource(selectedSource === stat.source ? null : stat.source)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedSource === stat.source
                    ? "bg-blue-500/10 border-blue-500/30"
                    : "bg-white/5 border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-white/50" />
                    <span className="font-semibold uppercase">{stat.source}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs border ${getStatusColor(stat.status)}`}>
                    {stat.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/40">Requests (1m)</span>
                    <span>{stat.requests.last1m}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Errors (1m)</span>
                    <span className={stat.errors.last1m > 0 ? "text-red-400" : ""}>
                      {stat.errors.last1m}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Avg Latency</span>
                    <span>{formatLatency(stat.latency.avg)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Cache Hit</span>
                    <span className="text-emerald-400">{stat.cache.hitRate.toFixed(0)}%</span>
                  </div>

                  {/* Rate Limit Bar */}
                  <div className="pt-2">
                    <div className="flex justify-between text-xs text-white/40 mb-1">
                      <span>Rate Limit</span>
                      <span>{stat.rateLimit.used}/{stat.rateLimit.limit}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          stat.rateLimit.used / stat.rateLimit.limit > 0.8
                            ? "bg-red-500"
                            : stat.rateLimit.used / stat.rateLimit.limit > 0.5
                              ? "bg-yellow-500"
                              : "bg-emerald-500"
                        }`}
                        style={{ width: `${(stat.rateLimit.used / stat.rateLimit.limit) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Data Providers */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold">Data Providers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {providerStats.map((stat) => (
              <div
                key={stat.source}
                onClick={() => setSelectedSource(selectedSource === stat.source ? null : stat.source)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedSource === stat.source
                    ? "bg-purple-500/10 border-purple-500/30"
                    : "bg-white/5 border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-white/50" />
                    <span className="font-semibold capitalize">{stat.source}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs border ${getStatusColor(stat.status)}`}>
                    {stat.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/40">Requests (1m)</span>
                    <span>{stat.requests.last1m}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Avg Latency</span>
                    <span>{formatLatency(stat.latency.avg)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Cache Hit</span>
                    <span className="text-emerald-400">{stat.cache.hitRate.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WebSocket Connections */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-semibold">WebSocket Connections</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {wsStats.map((ws) => (
              <div
                key={ws.exchange}
                className="p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {ws.status === "connected" ? (
                      <Wifi className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-red-400" />
                    )}
                    <span className="font-semibold uppercase">{ws.exchange}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs border ${getStatusColor(ws.status)}`}>
                    {ws.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/40">Connections</span>
                    <span>{ws.connections}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Active Streams</span>
                    <span>{ws.activeStreams.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Messages</span>
                    <span>{ws.messagesReceived.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Reconnects</span>
                    <span className={ws.reconnects > 0 ? "text-yellow-400" : ""}>
                      {ws.reconnects}
                    </span>
                  </div>
                </div>

                {ws.activeStreams.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="text-xs text-white/40 mb-2">Active Streams:</div>
                    <div className="flex flex-wrap gap-1">
                      {ws.activeStreams.slice(0, 3).map((stream) => (
                        <span
                          key={stream}
                          className="px-2 py-0.5 rounded bg-white/5 text-xs text-white/60"
                        >
                          {stream}
                        </span>
                      ))}
                      {ws.activeStreams.length > 3 && (
                        <span className="px-2 py-0.5 rounded bg-white/5 text-xs text-white/40">
                          +{ws.activeStreams.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Users Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-semibold">Users</h2>
              {totalUsers !== null && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                  {totalUsers} total
                </span>
              )}
            </div>
            <button
              onClick={fetchUsers}
              disabled={usersLoading}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 transition-colors"
              title="Refresh users"
            >
              <RefreshCw className={`w-4 h-4 ${usersLoading ? "animate-spin" : ""}`} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* User List */}
            <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10 text-sm font-medium text-white/60">
                Registered Users
              </div>
              <div className="divide-y divide-white/5 max-h-72 overflow-y-auto">
                {userList.length === 0 && !usersLoading && (
                  <div className="px-4 py-6 text-center text-white/30 text-sm">No users yet</div>
                )}
                {userList.map((u) => {
                  const lastLog = u.activityLogs[0];
                  return (
                    <div key={u.id} className="px-4 py-3 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{u.name || u.email}</div>
                        {u.name && <div className="text-xs text-white/40">{u.email}</div>}
                        <div className="text-xs text-white/30 mt-0.5">
                          Joined {new Date(u.createdAt).toLocaleDateString("tr-TR")}
                        </div>
                      </div>
                      {lastLog && (
                        <div className="text-right">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border ${
                            lastLog.action === "login"
                              ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                              : "text-white/40 bg-white/5 border-white/10"
                          }`}>
                            <LogIn className="w-3 h-3" />
                            {lastLog.action}
                          </span>
                          <div className="text-xs text-white/30 mt-1">
                            {new Date(lastLog.createdAt).toLocaleString("tr-TR")}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10 text-sm font-medium text-white/60">
                Recent Activity (last 50)
              </div>
              <div className="divide-y divide-white/5 max-h-72 overflow-y-auto">
                {recentLogs.length === 0 && !usersLoading && (
                  <div className="px-4 py-6 text-center text-white/30 text-sm">No activity yet</div>
                )}
                {recentLogs.map((log) => (
                  <div key={log.id} className="px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${
                        log.action === "login" ? "bg-emerald-400" : "bg-white/30"
                      }`} />
                      <div>
                        <span className="text-sm">{log.user.name || log.user.email}</span>
                        <span className={`ml-2 text-xs ${
                          log.action === "login" ? "text-emerald-400" : "text-white/40"
                        }`}>{log.action}</span>
                      </div>
                    </div>
                    <div className="text-xs text-white/30 shrink-0">
                      {new Date(log.createdAt).toLocaleString("tr-TR")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Selected Source Details */}
        {selectedSource && (
          <section className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold uppercase">{selectedSource} Details</h3>
              <button
                onClick={() => setSelectedSource(null)}
                className="text-white/40 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {(() => {
              const stat = stats.find((s) => s.source === selectedSource);
              if (!stat) return null;

              return (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {/* Requests */}
                  <div>
                    <h4 className="text-sm text-white/40 mb-2 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" /> Requests
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/50">Last 1m</span>
                        <span>{stat.requests.last1m}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Last 5m</span>
                        <span>{stat.requests.last5m}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Last 1h</span>
                        <span>{stat.requests.last1h}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Total</span>
                        <span className="font-semibold">{stat.requests.total}</span>
                      </div>
                    </div>
                  </div>

                  {/* Latency */}
                  <div>
                    <h4 className="text-sm text-white/40 mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" /> Latency
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/50">Min</span>
                        <span>{formatLatency(stat.latency.min)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Avg</span>
                        <span>{formatLatency(stat.latency.avg)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">P95</span>
                        <span>{formatLatency(stat.latency.p95)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Max</span>
                        <span className="font-semibold">{formatLatency(stat.latency.max)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Errors */}
                  <div>
                    <h4 className="text-sm text-white/40 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Errors
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/50">Last 1m</span>
                        <span className={stat.errors.last1m > 0 ? "text-red-400" : ""}>
                          {stat.errors.last1m}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Total</span>
                        <span>{stat.errors.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Rate</span>
                        <span className={stat.errors.rate > 5 ? "text-red-400" : ""}>
                          {stat.errors.rate.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    {stat.errors.lastError && (
                      <div className="mt-2 p-2 rounded bg-red-500/10 text-red-400 text-xs">
                        {stat.errors.lastError}
                      </div>
                    )}
                  </div>

                  {/* Cache */}
                  <div>
                    <h4 className="text-sm text-white/40 mb-2 flex items-center gap-2">
                      <Database className="w-4 h-4" /> Cache
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/50">Hits</span>
                        <span className="text-emerald-400">{stat.cache.hits}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Misses</span>
                        <span>{stat.cache.misses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Hit Rate</span>
                        <span className="font-semibold text-emerald-400">
                          {stat.cache.hitRate.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </section>
        )}
      </main>
    </div>
  );
}
