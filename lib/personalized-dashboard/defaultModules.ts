import type { ModuleInstance } from "./types";

export const defaultModules: ModuleInstance[] = [
  {
    id: "live-prices-default",
    type: "live-prices",
    title: "Live Prices",
    category: "temel-veri",
    x: 1800,
    y: 1025,
    width: 420,
    height: 240,
  },
  {
    id: "spot-positions-default",
    type: "spot-positions",
    title: "Spot Positions",
    category: "trader-portfoy",
    x: 1910,
    y: 1125,
    width: 460,
    height: 300,
  },
  {
    id: "exchange-flow-default",
    type: "exchange-flow",
    title: "Exchange Flow",
    category: "dw-flow",
    x: 1750,
    y: 1225,
    width: 480,
    height: 260,
  },
];
