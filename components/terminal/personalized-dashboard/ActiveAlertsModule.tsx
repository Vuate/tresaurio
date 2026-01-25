// components/terminal/personalized-dashboard/ActiveAlertsModule.tsx
"use client";

import { useEffect } from "react";
import { useAlertStore } from "@/store/alertStore";
import { usePriceStore } from "@/store/priceStore";
import { Bell, BellRing } from "lucide-react";
import { useDashboardNotificationStore } from "@/store/dashboardNotificationStore";


interface Props {
  instanceId: string;
}

export default function ActiveAlertsModule({ instanceId }: Props) {
  const alerts = useAlertStore((s) => s.alerts);
  const removeAlert = useAlertStore((s) => s.removeAlert);
  const checkAlerts = useAlertStore((s) => s.checkAlerts);

  const prices = usePriceStore((s) => s.prices);

  useEffect(() => {
    if (Object.keys(prices).length > 0) {
      checkAlerts(prices);
    }
  }, [prices, checkAlerts]);

  if (alerts.length === 0) {
    return (
      <div className="text-center text-white/40 py-4 text-[10px] flex flex-col items-center gap-2">
        <Bell className="w-8 h-8 opacity-30" />
        <span>No active alerts</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {alerts.map((a) => {
        const isTriggered = a.triggered;
        const currentPrice = prices[a.symbol] || 0;

        return (
          <div
            key={a.id}
            className={`
              flex items-center justify-between
              px-3 py-2 rounded-lg
              border transition-colors
              ${
                isTriggered
                  ? "bg-red-500/10 border-red-400/40 animate-pulse"
                  : "bg-white/5 border-white/10"
              }
            `}
          >
            <div className="space-y-0.5 flex-1">
              <div className="flex items-center gap-2">
                {isTriggered ? (
                  <BellRing className="w-3 h-3 text-red-400" />
                ) : (
                  <Bell className="w-3 h-3 text-white/40" />
                )}
                <span className="text-sm font-semibold text-white">
                  {a.symbol.replace("USDT", "")}
                </span>
              </div>

              <div className="text-[11px] text-white/50">
                {a.condition === "above" ? "Above" : "Below"} $
                {a.target.toLocaleString()}
              </div>

              {currentPrice > 0 && (
                <div className="text-[10px] text-white/40">
                  Current: ${currentPrice.toLocaleString()}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-semibold ${
                  isTriggered ? "text-red-400" : "text-teal-400"
                }`}
              >
                {isTriggered ? "🔔 Triggered" : "⏱ Waiting"}
              </span>

<button
  onClick={() => {
    removeAlert(a.id);
    
    useDashboardNotificationStore.getState().push({
      type: "success",
      title: "Alert Removed",
      description: `${a.symbol} ${a.condition} $${a.target.toLocaleString()} alert removed`,
    });
  }}
  className="
    h-6 w-6 rounded-md
    border border-white/10
    bg-white/5
    text-white/60
    cursor-pointer
    hover:bg-red-500/80
    hover:text-white
    transition
  "
  title="Remove alert"
>
  ×
</button>

            </div>
          </div>
        );
      })}
    </div>
  );
}
