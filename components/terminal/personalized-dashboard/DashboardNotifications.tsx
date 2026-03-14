"use client";

import { useEffect } from "react";
import { useDashboardNotificationStore } from "@/store/dashboardNotificationStore";
import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";

export default function DashboardNotifications() {
  const { notifications, remove } = useDashboardNotificationStore();
  const { topBarHeight } = usePersonalizedDashboardStore();

  
  useEffect(() => {
    const timers = notifications.map((n) => 
      setTimeout(() => remove(n.id), 1500)
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
                ? "bg-[#2B8FE0]/15 border-[#2B8FE0]/35 text-[#19D8D0]"
                : "bg-[#2B8FE0]/15 border-[#2B8FE0]/35 text-[#19D8D0]"
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