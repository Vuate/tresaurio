// store/whaleStore.ts
import { create } from "zustand";
import type { WhaleTransfer } from "@/lib/personalized-dashboard/types";

type WhaleState = {
  transfers: WhaleTransfer[];
};

type WhaleActions = {
  addTransfer: (t: WhaleTransfer) => void;
};

export const useWhaleStore = create<WhaleState & WhaleActions>((set) => ({
  transfers: [],

  addTransfer: (t) =>
    set((s) => ({
      transfers: [t, ...s.transfers].slice(0, 20),
    })),
}));
