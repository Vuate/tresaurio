// store/futuresPositionStore.ts
import { create } from "zustand";

export type FuturesPosition = {
  id: string;
  symbol: string;
  side: "long" | "short";
  entryPrice: number;
  markPrice?: number;
  size: number;
  leverage: number;
};

type FuturesPositionStore = {
  positions: FuturesPosition[];
  addPosition: (position: Omit<FuturesPosition, "id">) => void;
  removePosition: (id: string) => void;
};

export const useFuturesPositionStore = create<FuturesPositionStore>((set) => ({
  positions: [],

  addPosition: (position) =>
    set((state) => ({
      positions: [
        ...state.positions,
        {
          ...position,
          id: Date.now().toString(),
        },
      ],
    })),

  removePosition: (id) =>
    set((state) => ({
      positions: state.positions.filter((p) => p.id !== id),
    })),
}));
