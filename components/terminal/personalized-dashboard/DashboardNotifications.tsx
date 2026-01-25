"use client";

import { useEffect } from "react";
import { useDashboardNotificationStore } from "@/store/dashboardNotificationStore";
import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";

export default function DashboardNotifications() {
  const { notifications, remove } = useDashboardNotificationStore();
  const { topBarHeight } = usePersonalizedDashboardStore();

  
  useEffect(() => {
    const timers = notifications.map((n) => 
      setTimeout(() => remove(n.id), 4000)
    );
    return () => timers.forEach(clearTimeout);
  }, [notifications, remove]);

  return (
    <div 
      className="fixed right-4 z-[9999] flex flex-col gap-3"
      style={{ top: (topBarHeight || 64) + 16 }}
    >
      {notifications.map((n) => (
        <div
          key={n.id}
          onClick={() => remove(n.id)}
          className={`
            w-80 max-w-[90vw] rounded-xl px-4 py-3 shadow-lg border
            cursor-pointer
            transition-opacity duration-300 ease-out
            hover:opacity-90
            ${
              n.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-rose-500/10 border-rose-500/30 text-rose-300"
            }
          `}
        >
          <div className="font-semibold">{n.title}</div>
          {n.description && (
            <div className="text-sm opacity-80">
              {n.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}