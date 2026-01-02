import { create } from "zustand";
import type { ExchangeFlowEvent } from "@/lib/personalized-dashboard/types";

type FlowState = {
  events: ExchangeFlowEvent[];
};

type FlowActions = {
  addEvent: (e: ExchangeFlowEvent) => void;
  clear: () => void;
};

export const useExchangeFlowStore = create<FlowState & FlowActions>((set) => ({
  events: [],

  addEvent: (e) =>
    set((s) => ({
      events: [e, ...s.events].slice(0, 50),
    })),

  clear: () => set({ events: [] }),
}));
