// components/terminal/personalized-dashboard/LastOrdersModule.tsx

import { useState } from "react";
import { useLastOrders } from "@/lib/personalized-dashboard/useLastOrders";

interface Props {
  instanceId: string;
}

export default function LastOrdersModule({ instanceId }: Props) {
  const { orders, loading, error, settings, updateSettings, refresh } =
    useLastOrders(instanceId);
  const [showSettings, setShowSettings] = useState(false);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getSideColor = (side: string) => {
    switch (side) {
      case "buy":
      case "long":
        return "text-emerald-400";
      case "sell":
      case "short":
        return "text-red-400";
      default:
        return "text-white/60";
    }
  };

  const getSideBadge = (side: string, type: string) => {
    if (type === "spot") {
      return side === "buy" ? "BUY" : "SELL";
    }
    return side === "long" ? "LONG" : "SHORT";
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0b0f] rounded-lg border border-white/10">
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="text-xl">📋</div>
          <h3 className="font-semibold">Last Orders</h3>
          {loading && (
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            className="text-white/50 hover:text-white transition-colors"
            title="Refresh"
          >
            🔄
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-white/50 hover:text-white transition-colors"
          >
            ⚙️
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="p-3 border-b border-white/10 bg-white/5 space-y-3">
          <div>
            <label className="text-xs text-white/60 mb-1 block">
              Market Type
            </label>
            <select
              value={settings.filterType}
              onChange={(e) =>
                updateSettings({ filterType: e.target.value as any })
              }
              className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm"
            >
              <option value="all">All Markets</option>
              <option value="spot">Spot Only</option>
              <option value="futures">Futures Only</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1 block">
              Order Side
            </label>
            <select
              value={settings.filterSide}
              onChange={(e) =>
                updateSettings({ filterSide: e.target.value as any })
              }
              className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm"
            >
              <option value="all">All Sides</option>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
              <option value="long">Long</option>
              <option value="short">Short</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1 block">
              Show: {settings.limit} orders
            </label>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={settings.limit}
              onChange={(e) =>
                updateSettings({ limit: parseInt(e.target.value) })
              }
              className="w-full"
            />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        {error && (
          <div className="p-4 text-center">
            <div className="text-red-400 mb-2">⚠️ {error}</div>
            <button
              onClick={refresh}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Try again
            </button>
          </div>
        )}

        {!error && orders.length === 0 && !loading && (
          <div className="p-8 text-center text-white/40">
            <div className="text-4xl mb-2">📭</div>
            <div className="text-sm">No orders yet</div>
          </div>
        )}

        {!error && orders.length > 0 && (
          <div className="divide-y divide-white/10">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-3 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">
                      {order.symbol}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-medium ${getSideColor(order.side)} bg-current/10`}
                    >
                      {getSideBadge(order.side, order.type)}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/60">
                      {order.type.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs text-white/40">
                    {formatTime(order.timestamp)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-white/60">Price:</span>
                    <span className="text-white ml-1 font-medium">
                      ${order.price.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/60">Qty:</span>
                    <span className="text-white ml-1 font-medium">
                      {order.quantity.toFixed(4)}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/60">Total:</span>
                    <span className="text-white ml-1 font-medium">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/60">Fee:</span>
                    <span className="text-white ml-1">
                      ${order.fee?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                </div>

                {order.pnl !== undefined && (
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <span className="text-xs text-white/60">PnL: </span>
                    <span
                      className={`text-xs font-medium ${order.pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}
                    >
                      {order.pnl >= 0 ? "+" : ""}${order.pnl.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="mt-1">
                  <span
                    className={`text-xs ${order.status === "filled" ? "text-emerald-400" : order.status === "cancelled" ? "text-red-400" : "text-yellow-400"}`}
                  >
                    ● {order.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-2 border-t border-white/10 text-center">
        <span className="text-xs text-white/40">
          Order history from last 7 days
        </span>
      </div>
    </div>
  );
}
