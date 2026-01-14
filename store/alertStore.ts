import { create } from "zustand";
import type { PriceAlert } from "@/lib/personalized-dashboard/alertTypes";
import { useDashboardNotificationStore } from "@/store/dashboardNotificationStore";


type AlertState = {
  alerts: PriceAlert[];
};

type AlertActions = {
  addAlert: (a: Omit<PriceAlert, "id" | "createdAt" | "triggered">) => void;
  removeAlert: (id: string) => void;
  checkAlerts: (prices: Record<string, number>) => void;
};

export const useAlertStore = create<AlertState & AlertActions>((set, get) => ({
  alerts: [],

  addAlert: (a) =>
    set((s) => ({
      alerts: [
        {
          id: crypto.randomUUID(),
          triggered: false,
          createdAt: Date.now(),
          ...a,
        },
        ...s.alerts,
      ],
    })),

  removeAlert: (id) =>
    set((s) => ({
      alerts: s.alerts.filter((a) => a.id !== id),
    })),
checkAlerts: (prices) =>
  set((s) => {
    const push =
      useDashboardNotificationStore.getState().push;

    return {
      alerts: s.alerts.map((a) => {
        if (a.triggered) return a;

        const price = prices[a.symbol];
        if (!price) return a;

        const hit =
          a.condition === "above"
            ? price >= a.target
            : price <= a.target;

        if (hit) {
          push({
            type: "success",
            title: "Alert Triggered",
            description: `${a.symbol} ${a.condition} ${a.target}`,
          });

          return { ...a, triggered: true };
        }

        return a;
      }),
    };
  }),

}));
