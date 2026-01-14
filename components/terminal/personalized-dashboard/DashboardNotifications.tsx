"use client";

import { useEffect } from "react";
import { useDashboardNotificationStore } from "@/store/dashboardNotificationStore";

export default function DashboardNotifications() {
  const { notifications, remove } =
    useDashboardNotificationStore();

  useEffect(() => {
    notifications.forEach((n) => {
      const t = setTimeout(() => remove(n.id), 4000);
      return () => clearTimeout(t);
    });
  }, [notifications, remove]);

  return (
    <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-3">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`w-80 rounded-xl px-4 py-3 shadow-lg border
            ${
              n.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-rose-500/10 border-rose-500/30 text-rose-300"
            }`}
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
