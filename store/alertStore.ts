import { create } from "zustand";
import type { PriceAlert } from "@/lib/personalized-dashboard/alertTypes";

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
    set((s) => ({
      alerts: s.alerts.map((a) => {
        if (a.triggered) return a;

        const price = prices[a.symbol];
        if (!price) return a;

        const hit =
          a.condition === "above" ? price >= a.target : price <= a.target;

        return hit ? { ...a, triggered: true } : a;
      }),
    })),
}));
