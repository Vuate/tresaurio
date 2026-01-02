import { create } from "zustand";
import type {
  SpotPosition,
  FuturesPosition,
} from "@/lib/personalized-dashboard/types";

type PortfolioState = {
  spotPositions: SpotPosition[];
  futuresPositions: FuturesPosition[];
};

type PortfolioActions = {
  /* SPOT */
  setSpotPositions: (p: SpotPosition[]) => void;
  updateSpotPrice: (symbol: string, price: number) => void;

  /* FUTURES */
  setFuturesPositions: (p: FuturesPosition[]) => void;
  updateFuturesPrice: (symbol: string, price: number) => void;
};

export const usePortfolioStore = create<PortfolioState & PortfolioActions>(
  (set) => ({
    /* ---------------- SPOT POSITIONS ---------------- */
    spotPositions: [
      {
        id: "1",
        symbol: "BTCUSDT",
        qty: 0.18,
        entryPrice: 41200,
        currentPrice: 41200,
      },
      {
        id: "2",
        symbol: "ETHUSDT",
        qty: 1.4,
        entryPrice: 2150,
        currentPrice: 2150,
      },
      {
        id: "3",
        symbol: "SOLUSDT",
        qty: 32,
        entryPrice: 98,
        currentPrice: 98,
      },
    ],

    /* ---------------- FUTURES POSITIONS ---------------- */
    futuresPositions: [
      {
        id: "f1",
        symbol: "BTCUSDT",
        side: "long",
        qty: 0.05,
        entryPrice: 42000,
        markPrice: 43500,
        leverage: 10,
        liquidationPrice: 38000,
      },
      {
        id: "f2",
        symbol: "ETHUSDT",
        side: "short",
        qty: 1.2,
        entryPrice: 2300,
        markPrice: 2150,
        leverage: 8,
        liquidationPrice: 2550,
      },
    ],

    /* ---------------- ACTIONS ---------------- */
    setSpotPositions: (spotPositions) => set({ spotPositions }),

    updateSpotPrice: (symbol, price) =>
      set((state) => ({
        spotPositions: state.spotPositions.map((p) =>
          p.symbol === symbol ? { ...p, currentPrice: price } : p
        ),
      })),

    setFuturesPositions: (futuresPositions) => set({ futuresPositions }),

    updateFuturesPrice: (symbol, price) =>
      set((state) => ({
        futuresPositions: state.futuresPositions.map((p) =>
          p.symbol === symbol ? { ...p, markPrice: price } : p
        ),
      })),
  })
);
