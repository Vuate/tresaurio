import { create } from "zustand";

type PriceState = {
  prices: Record<string, number>;
  updatedAt: number | null;
};

type PriceActions = {
  setPrices: (next: Record<string, number>) => void;
  updatePrice: (symbol: string, price: number) => void;
  resetPrices: () => void;
};

export const usePriceStore = create<PriceState & PriceActions>((set) => ({
  prices: {},
  updatedAt: null,

  setPrices: (next) =>
    set({
      prices: next,
      updatedAt: Date.now(),
    }),

  updatePrice: (symbol, price) =>
    set((state) => ({
      prices: {
        ...state.prices,
        [symbol]: price,
      },
      updatedAt: Date.now(),
    })),

  resetPrices: () =>
    set({
      prices: {},
      updatedAt: null,
    }),
}));
