import { create } from "zustand";

export type OrderRow = {
  price: number;
  qty: number;
  total: number;
};

type OrderBookState = {
  symbol: string;
  bids: OrderRow[];
  asks: OrderRow[];
  mid: number | null;
  source: "api" | "mock";
};

type OrderBookActions = {
  setOrderBook: (data: OrderBookState) => void;
};

export const useOrderBookStore = create<OrderBookState & OrderBookActions>(
  (set) => ({
    symbol: "BTCUSDT",
    bids: [],
    asks: [],
    mid: null,
    source: "mock",

    setOrderBook: (data) => set(data),
  })
);
