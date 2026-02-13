import { create } from "zustand";

type SideRow = { price: number; qty: number; total: number };

type OrderBookData = {
  symbol: string;
  bids: SideRow[];
  asks: SideRow[];
  mid: number | null;
  source: "api" | "mock";
};

type OrderBookState = {
  instances: Record<string, OrderBookData>;
  setOrderBook: (instanceId: string, data: OrderBookData) => void;
  setSymbol: (instanceId: string, symbol: string) => void;
  getInstanceData: (instanceId: string) => OrderBookData;
};

const DEFAULT_DATA: OrderBookData = {
  symbol: "BTCUSDT",
  bids: [],
  asks: [],
  mid: null,
  source: "mock",
};

export const useOrderBookStore = create<OrderBookState>((set, get) => ({
  instances: {},

  setOrderBook: (instanceId, data) =>
    set((state) => ({
      instances: {
        ...state.instances,
        [instanceId]: data,
      },
    })),

  setSymbol: (instanceId, symbol) =>
    set((state) => ({
      instances: {
        ...state.instances,
        [instanceId]: {
          ...(state.instances[instanceId] || DEFAULT_DATA),
          symbol,
        },
      },
    })),

  getInstanceData: (instanceId) => {
    const state = get();
    return state.instances[instanceId] || DEFAULT_DATA;
  },
}));
