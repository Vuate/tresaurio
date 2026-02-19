"use client";

import { useState, useRef, useEffect } from "react";
import { useLastOrders } from "@/hooks/useLastOrders";
import { RefreshCw, Settings, AlertTriangle } from "lucide-react";

interface Props {
  instanceId: string;
}

export default function LastOrdersModule({ instanceId }: Props) {
  const { orders, loading, error, settings, updateSettings, refresh } =
    useLastOrders(instanceId);
  const [showSettings, setShowSettings] = useState(false);
  const [marketTypeOpen, setMarketTypeOpen] = useState(false);
  const [orderSideOpen, setOrderSideOpen] = useState(false);
  
  const marketTypeRef = useRef<HTMLDivElement>(null);
  const orderSideRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (marketTypeRef.current && !marketTypeRef.current.contains(e.target as Node)) {
        setMarketTypeOpen(false);
      }
      if (orderSideRef.current && !orderSideRef.current.contains(e.target as Node)) {
        setOrderSideOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        return "text-emerald-400 bg-emerald-500/10";
      case "sell":
      case "short":
        return "text-red-400 bg-red-500/10";
      default:
        return "text-white/60 bg-white/5";
    }
  };

  const getSideBadge = (side: string, type: string) => {
    if (type === "spot") {
      return side === "buy" ? "BUY" : "SELL";
    }
    return side === "long" ? "LONG" : "SHORT";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "filled":
        return "text-emerald-400";
      case "cancelled":
        return "text-red-400";
      default:
        return "text-yellow-400";
    }
  };

  const marketTypeOptions = [
    { value: "all", label: "All Markets" },
    { value: "spot", label: "Spot Only" },
    { value: "futures", label: "Futures Only" },
  ];

  const orderSideOptions = [
    { value: "all", label: "All Sides" },
    { value: "buy", label: "Buy" },
    { value: "sell", label: "Sell" },
    { value: "long", label: "Long" },
    { value: "short", label: "Short" },
  ];

  return (
    <div className="h-full flex flex-col space-y-2 sm:space-y-3 text-xs overflow-visible">
<div className="relative z-50 flex flex-wrap items-center gap-x-2 gap-y-1.5 flex-shrink-0">
  <div className="text-[10px] sm:text-xs text-white/60 flex items-center gap-1.5 sm:gap-2">
    <span className="font-semibold text-white/90">
      <span className="hidden xs:inline">Last Orders</span>
      <span className="xs:hidden">Orders</span>
    </span>
    {loading && (
      <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    )}
    <span className="text-white/40"> • </span>
    <span className="text-emerald-400">LIVE</span>
  </div>

  <div className="flex-1 min-w-[10px]"></div>

  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
    <button
      onClick={refresh}
      className="text-white/50 hover:text-white transition-colors cursor-pointer p-1"
      title="Refresh"
    >
      <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
    </button>
    <button
      onClick={() => setShowSettings(!showSettings)}
      className="text-white/50 hover:text-white transition-colors cursor-pointer p-1"
      title="Settings"
    >
      <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
    </button>
  </div>
</div>

      {showSettings && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-2 sm:p-2.5 space-y-2 sm:space-y-2.5 flex-shrink-0">
          {/* Market Type Dropdown */}
          <div ref={marketTypeRef} className="relative">
            <label className="block text-white/60 mb-1 text-[10px] sm:text-xs font-medium">
              Market Type
            </label>
            <button
              onClick={() => setMarketTypeOpen(!marketTypeOpen)}
              className="w-full h-7 px-2.5 rounded-lg bg-[#0b1f1f] border border-emerald-500/20 text-white text-[10px] sm:text-xs flex items-center justify-between gap-1.5 cursor-pointer hover:bg-white/5 transition-all"
            >
              <span className="truncate">
                {marketTypeOptions.find(o => o.value === settings.filterType)?.label}
              </span>
              <span className={`text-white/50 text-[10px] shrink-0 transition-transform duration-200 ${marketTypeOpen ? "rotate-180" : ""}`}>
                ▾
              </span>
            </button>

            {marketTypeOpen && (() => {
              const buttonRect = marketTypeRef.current?.getBoundingClientRect();
              const shouldOpenLeft = buttonRect ? buttonRect.left > window.innerWidth / 2 : false;
              const viewportHeight = window.innerHeight;
              const dropdownHeight = 120;
              const spaceBelow = buttonRect ? viewportHeight - buttonRect.bottom : dropdownHeight;
              const shouldOpenUp = spaceBelow < dropdownHeight && buttonRect && buttonRect.top > dropdownHeight;

              return (
                <div
                  className={`
                   absolute z-[999] w-full
                 bg-[#0b1f1f] border border-emerald-500/20 rounded-lg shadow-xl
                   animate-in fade-in duration-200
                    [&::-webkit-scrollbar-thumb]:bg-emerald-500/40
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-track]:bg-transparent
                    ${shouldOpenLeft ? 'right-0' : 'left-0'}
                    ${shouldOpenUp ? 'bottom-full mb-1' : 'top-full mt-1'}
                  `}
                >
                  {marketTypeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        updateSettings({ filterType: opt.value as any });
                        setMarketTypeOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-[10px] sm:text-xs bg-transparent cursor-pointer text-white transition-colors hover:bg-emerald-500/10 hover:text-emerald-400"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Order Side Dropdown */}
          <div ref={orderSideRef} className="relative">
            <label className="block text-white/60 mb-1 text-[10px] sm:text-xs font-medium">
              Order Side
            </label>
            <button
              onClick={() => setOrderSideOpen(!orderSideOpen)}
              className="w-full h-7 px-2.5 rounded-lg bg-[#0b1f1f] border border-emerald-500/20 text-white text-[10px] sm:text-xs flex items-center justify-between gap-1.5 cursor-pointer hover:bg-white/5 transition-all"
            >
              <span className="truncate">
                {orderSideOptions.find(o => o.value === settings.filterSide)?.label}
              </span>
              <span className={`text-white/50 text-[10px] shrink-0 transition-transform duration-200 ${orderSideOpen ? "rotate-180" : ""}`}>
                ▾
              </span>
            </button>

            {orderSideOpen && (() => {
              const buttonRect = orderSideRef.current?.getBoundingClientRect();
              const shouldOpenLeft = buttonRect ? buttonRect.left > window.innerWidth / 2 : false;
              const viewportHeight = window.innerHeight;
              const dropdownHeight = 160;
              const spaceBelow = buttonRect ? viewportHeight - buttonRect.bottom : dropdownHeight;
              const shouldOpenUp = spaceBelow < dropdownHeight && buttonRect && buttonRect.top > dropdownHeight;

              return (
                <div
                  className={`
                   absolute z-[999] w-full
               bg-[#0b1f1f] border border-emerald-500/20 rounded-lg shadow-xl
                 animate-in fade-in duration-200
                    [&::-webkit-scrollbar-thumb]:bg-emerald-500/40
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-track]:bg-transparent
                    ${shouldOpenLeft ? 'right-0' : 'left-0'}
                    ${shouldOpenUp ? 'bottom-full mb-1' : 'top-full mt-1'}
                  `}
                >
                  {orderSideOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        updateSettings({ filterSide: opt.value as any });
                        setOrderSideOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-[10px] sm:text-xs bg-transparent cursor-pointer text-white transition-colors hover:bg-emerald-500/10 hover:text-emerald-400"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              );
            })()}
          </div>

          <div>
            <label className="block text-white/60 mb-1 text-[10px] sm:text-xs font-medium">
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
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>
        </div>
      )}

      <div
        className="
          flex-1 min-h-0 space-y-1.5 sm:space-y-2
          overflow-y-auto
          px-1 sm:px-0

          [&::-webkit-scrollbar]:w-1.5 sm:[&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-teal-400/40
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb:hover]:bg-teal-400/70

          scrollbar-thin
          scrollbar-thumb-teal-400/40
          scrollbar-track-transparent
        "
      >
        {error && (
          <div className="text-center py-6 sm:py-8">
<div className="text-red-400 mb-2 flex justify-center"><AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" /></div>
            <div className="text-red-400 text-[10px] sm:text-xs mb-2">{error}</div>
            <button
              onClick={refresh}
              className="text-[10px] sm:text-xs text-blue-400 hover:text-blue-300 cursor-pointer transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {!error && orders.length === 0 && !loading && (
          <div className="text-center py-6 sm:py-8 text-white/40">
            <div className="text-2xl sm:text-4xl mb-1 sm:mb-2">📭</div>
            <div className="text-[10px] sm:text-xs">No orders yet</div>
            <div className="text-[9px] sm:text-[10px] mt-0.5 sm:mt-1">
              Orders will appear here
            </div>
          </div>
        )}

        {!error && orders.length > 0 && (
          <>
            {orders.map((order) => (
              <div
                key={order.id}
                className="px-2 sm:px-3 py-2 sm:py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/8 transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1 mb-1.5 sm:mb-2">
                  <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                    <span className="font-medium text-white text-[10px] sm:text-xs whitespace-nowrap">
                      {order.symbol}
                    </span>
                    <span
                      className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded font-semibold whitespace-nowrap ${getSideColor(order.side)}`}
                    >
                      {getSideBadge(order.side, order.type)}
                    </span>
                    <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded bg-white/10 text-white/60 whitespace-nowrap">
                      {order.type.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-white/40 whitespace-nowrap shrink-0">
                    {formatTime(order.timestamp)}
                  </span>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-1.5 text-[10px] sm:text-[11px]">
                  <div className="flex flex-wrap items-center gap-1 min-w-0">
                    <span className="text-white/60 whitespace-nowrap">Price:</span>
                    <span className="text-white font-medium whitespace-nowrap ml-auto">
                      ${order.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1 min-w-0">
                    <span className="text-white/60 whitespace-nowrap">Qty:</span>
                    <span className="text-white font-medium whitespace-nowrap ml-auto">
                      {order.quantity.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1 min-w-0">
                    <span className="text-white/60 whitespace-nowrap">Total:</span>
                    <span className="text-white font-medium whitespace-nowrap ml-auto">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1 min-w-0">
                    <span className="text-white/60 whitespace-nowrap">Fee:</span>
                    <span className="text-white whitespace-nowrap ml-auto">
                      ${order.fee?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                </div>

                {order.pnl !== undefined && (
                  <div className="mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t border-white/10">
                    <div className="flex flex-wrap items-center gap-1 text-[10px] sm:text-[11px]">
                      <span className="text-white/60 whitespace-nowrap">PnL:</span>
                      <span
                        className={`font-medium whitespace-nowrap ml-auto ${order.pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}
                      >
                        {order.pnl >= 0 ? "+" : ""}${order.pnl.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="mt-1 sm:mt-1.5">
                  <span className={`text-[9px] sm:text-[10px] ${getStatusColor(order.status)}`}>
                    ● {order.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="flex-shrink-0 text-center">
        <span className="text-[9px] sm:text-[10px] text-white/40">
          Order history from last 7 days
        </span>
      </div>
    </div>
  );
}