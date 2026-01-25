import type { ModuleInstance } from "./types";

export const defaultModules: ModuleInstance[] = [
  {
    id: "live-prices-default",
    type: "live-prices",
    title: "Live Prices",
    category: "market-data",
    x: 4700,
    y: 4600,
    width: 420,
    height: 240,
  },
  {
    id: "spot-positions-default",
    type: "spot-positions",
    title: "Spot Positions",
    category: "portfolio",
    x: 5200,
    y: 4600,
    width: 460,
    height: 300,
  },
  {
    id: "exchange-flow-default",
    type: "exchange-flow",
    title: "Exchange Flow",
    category: "flow",
    x: 5200,
    y: 5000,
    width: 480,
    height: 260,
  },
];
