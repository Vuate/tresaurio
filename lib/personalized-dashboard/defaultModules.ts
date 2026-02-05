import type { ModuleInstance } from "./types";

export const defaultModules: ModuleInstance[] = [
  {
    id: "market-efficiency-default",
    type: "market-efficiency",
    title: "Market Efficiency",
    category: "market-microstructure",
    x: 1800,
    y: 1025,
    width: 420,
    height: 240,
  },
  {
    id: "spot-positions-default",
    type: "spot-positions",
    title: "Spot Positions",
    category: "portfolio",
    x: 1910,
    y: 1125,
    width: 460,
    height: 300,
  },
  {
    id: "exchange-flow-default",
    type: "exchange-flow",
    title: "Exchange Flow",
    category: "flow",
    x: 1750,
    y: 1225,
    width: 480,
    height: 260,
  },
];
