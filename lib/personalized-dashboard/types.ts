export type ModuleId = string;

export type ModuleCategory =
  | "temel-veri"
  | "trader-portfoy"
  | "dw-flow"
  | "likidite"
  | "alert"
  | "risk";

export type ModuleInstance = {
  id: ModuleId;
  type: string; // registry key: "live-prices" gibi
  title: string;
  category: ModuleCategory;

  x: number;
  y: number;
  width: number;
  height: number;

  minimized?: boolean;
};

export type NoteItem = {
  id: string;
  text: string;
  createdAt: number;
};

export type AlertCondition = "above" | "below";

export type AlertItem = {
  id: string;
  symbol: string; // BTCUSDT
  condition: AlertCondition;
  price: number;
  active: boolean;
};
