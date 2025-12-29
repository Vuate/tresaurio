"use client";

import { useAlertStore } from "@/store/alertStore";

export default function ActiveAlertsModule() {
  const alerts = useAlertStore((s) => s.alerts);
  const removeAlert = useAlertStore((s) => s.removeAlert);

  if (alerts.length === 0) {
    return <div className="text-xs text-white/40">No active alerts.</div>;
  }

  return (
    <div className="space-y-2">
      {alerts.map((a) => {
        const isTriggered = a.triggered;

        return (
          <div
            key={a.id}
            className={`
              flex items-center justify-between
              px-3 py-2 rounded-lg
              border
              ${
                isTriggered
                  ? "bg-red-500/10 border-red-400/40"
                  : "bg-white/5 border-white/10"
              }
            `}
          >
            {/* LEFT */}
            <div className="space-y-0.5">
              <div className="text-sm font-semibold text-white">
                {a.symbol.replace("USDT", "")}
              </div>

              <div className="text-[11px] text-white/50">
                {a.condition === "above" ? "Above" : "Below"}{" "}
                {a.target.toLocaleString()}
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-semibold ${
                  isTriggered ? "text-red-400" : "text-teal-400"
                }`}
              >
                {isTriggered ? "Triggered" : "Waiting"}
              </span>

              <button
                onClick={() => removeAlert(a.id)}
                className="
                  h-6 w-6 rounded-md
                  border border-white/10
                  bg-white/5
                  text-white/60
                  hover:bg-red-500/80 hover:text-white
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
