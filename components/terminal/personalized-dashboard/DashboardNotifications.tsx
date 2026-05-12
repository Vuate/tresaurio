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

  const variants = {
    success: {
      card: "bg-card border border-border border-l-[3px] border-l-emerald-500 shadow-[0_8px_28px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_28px_rgba(0,0,0,0.45)]",
      dot:  "bg-emerald-500",
      title:"text-emerald-500",
    },
    error: {
      card: "bg-card border border-border border-l-[3px] border-l-red-500 shadow-[0_8px_28px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_28px_rgba(0,0,0,0.45)]",
      dot:  "bg-red-500",
      title:"text-red-500",
    },
    info: {
      card: "bg-card border border-border border-l-[3px] border-l-[#1A73E8] shadow-[0_8px_28px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_28px_rgba(0,0,0,0.45)]",
      dot:  "bg-[#1A73E8]",
      title:"text-[#1A73E8]",
    },
  } as const;

  return (
    <div
      data-notification
      className="fixed right-4 z-9999 flex flex-col gap-2.5"
      style={{ top: (topBarHeight || 64) + 16 }}
    >
      {notifications.map((n) => {
        const v = variants[n.type] ?? variants.info;
        return (
          <div
            key={n.id}
            onClick={() => remove(n.id)}
            className={`w-72 max-w-[90vw] rounded-xl px-4 py-3 cursor-pointer transition-opacity duration-300 hover:opacity-90 ${v.card}`}
          >
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${v.dot}`} />
              <span className={`text-[13px] font-semibold leading-snug ${v.title}`}>{n.title}</span>
            </div>
            {n.description && (
              <div className="text-[12px] text-muted-foreground leading-snug pl-3.5">
                {n.description}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}