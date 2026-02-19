// store/portfolioStore.ts - TAM YENİ VERSİYON

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SpotPosition {
  id: string;
  exchange: string;
  baseAsset: string;
  quoteAsset: string;
  pair: string;
  formattedPair: string;
  symbol: string;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  totalCost: number;
  entryDate: string;
  notes?: string;
  manualEntryPrice?: number;
}

export interface FuturesPosition {
  id: string;
  exchange: string;
  baseAsset: string;
  quoteAsset: string;
  pair: string;
  formattedPair: string;
  symbol: string;
  side: "long" | "short";
  quantity: number;
  entryPrice: number;
  markPrice: number;
  leverage: number;
  liquidationPrice: number;
  totalCost: number;
  entryDate: string;
  fundingRate: number;
  notes?: string;
}

type PortfolioState = {
  spotPositions: SpotPosition[];
  futuresPositions: FuturesPosition[];
};

type PortfolioActions = {
  // Spot
  addSpotPosition: (p: Omit<SpotPosition, "id">) => void;
  removeSpotPosition: (id: string) => void;
  updateSpotPosition: (id: string, updates: Partial<SpotPosition>) => void;
  updateSpotPrice: (symbol: string, price: number) => void;

  // Futures
  addFuturesPosition: (p: Omit<FuturesPosition, "id">) => void;
  removeFuturesPosition: (id: string) => void;
  updateFuturesPosition: (
    id: string,
    updates: Partial<FuturesPosition>
  ) => void;
  updateFuturesPrice: (symbol: string, price: number) => void;
};

export const usePortfolioStore = create<PortfolioState & PortfolioActions>()(
  persist(
    (set) => ({
      spotPositions: [],
      futuresPositions: [],

      // Spot actions
      addSpotPosition: (p) =>
        set((state) => ({
          spotPositions: [
            { id: crypto.randomUUID(), ...p },
            ...state.spotPositions,
          ],
        })),

      removeSpotPosition: (id) =>
        set((state) => ({
          spotPositions: state.spotPositions.filter((p) => p.id !== id),
        })),

      updateSpotPosition: (id, updates) =>
        set((state) => ({
          spotPositions: state.spotPositions.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      updateSpotPrice: (symbol, price) =>
        set((state) => ({
          spotPositions: state.spotPositions.map((p) =>
            p.symbol === symbol ? { ...p, currentPrice: price } : p
          ),
        })),

      // Futures actions
      addFuturesPosition: (p) =>
        set((state) => ({
          futuresPositions: [
            { id: crypto.randomUUID(), ...p },
            ...state.futuresPositions,
          ],
        })),

      removeFuturesPosition: (id) =>
        set((state) => ({
          futuresPositions: state.futuresPositions.filter((p) => p.id !== id),
        })),

      updateFuturesPosition: (id, updates) =>
        set((state) => ({
          futuresPositions: state.futuresPositions.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      updateFuturesPrice: (symbol, price) =>
        set((state) => ({
          futuresPositions: state.futuresPositions.map((p) =>
            p.symbol === symbol ? { ...p, markPrice: price } : p
          ),
        })),
    }),
    {
      name: "treasurio-portfolio-storage",
    }
  )
);
