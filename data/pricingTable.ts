export type Cell = "check" | "x" | "lock" | "plus" | "-";

export type FeatureRow = {
  feature: string;
  trader: Cell;
  proTrader: Cell;
  enterprise: Cell;
  addOn: Cell;
  desc: string;
};

export type CategoryBlock = {
  category: string;
  rows: FeatureRow[];
};

export const PRICING_TABLE: CategoryBlock[] = [
  // -------------------------------------------------------------
  // 1) BASIC DATA
  // -------------------------------------------------------------
  {
    category: "Basic Data",
    rows: [
      {
        feature: "Live prices",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Shows real-time spot prices of all coins.",
      },
      {
        feature: "Multi-exchange price comparison",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Compares coin prices across different exchanges.",
      },
      {
        feature: "Watchlist",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Saves the list of tracked coins.",
      },
      {
        feature: "Coin info cards",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Provides market cap, volume, supply, historical price data.",
      },
    ],
  },

  // -------------------------------------------------------------
  // 2) LIQUIDITY & ORDERBOOK
  // -------------------------------------------------------------
  {
    category: "Liquidity & Orderbook",
    rows: [
      {
        feature: "5-level orderbook",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Shows 5 levels of buy and sell orders.",
      },
      {
        feature: "20-level orderbook",
        trader: "x",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Provides full market depth up to 20 levels.",
      },
      {
        feature: "Spread & depth summary",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Analyzes spread and cumulative depth.",
      },
      {
        feature: "LP Market price tracking",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Monitors liquidity provider prices.",
      },
      {
        feature: "Liquidity heatmap",
        trader: "lock",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Displays order concentrations as a heatmap.",
      },
      {
        feature: "Spread anomalies",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Detects abnormal spikes in spread behavior.",
      },
      {
        feature: "Wall/depth analysis",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Analyzes large order blocks.",
      },
      {
        feature: "Multi-LP price comparison",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Compares prices from multiple liquidity providers.",
      },
      {
        feature: "Volume cluster analysis",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Analyzes volume clusters to identify dominant levels.",
      },
      {
        feature: "Market pressure (buy/sell dominance)",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Presents buyer and seller pressure as percentages.",
      },
    ],
  },

  // -------------------------------------------------------------
  // 3) TRADER PORTFOLIO
  // -------------------------------------------------------------
  {
    category: "Trader Portfolio",
    rows: [
      {
        feature: "PnL analysis",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Calculates profit/loss analysis.",
      },
      {
        feature: "Open position tracking",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Shows real-time status of open positions.",
      },
      {
        feature: "Closed position tracking",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Provides history of closed positions.",
      },
      {
        feature: "Realized PnL",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Calculates realized profit/loss.",
      },
      {
        feature: "Unrealized PnL",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Calculates unrealized profit/loss.",
      },
      {
        feature: "Futures position tracking",
        trader: "x",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Tracks futures positions in detail.",
      },
      {
        feature: "Trade history analysis",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Analyzes past trades.",
      },
      {
        feature: "Liq/stop details",
        trader: "x",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Shows liquidation and stop levels.",
      },
    ],
  },

  // -------------------------------------------------------------
  // 4) DW & FLOW
  // -------------------------------------------------------------
  {
    category: "DW & Flow",
    rows: [
      {
        feature: "Net flow (positive/negative)",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Shows the difference between total inflows and outflows.",
      },
      {
        feature: "Chain-based D/W breakdown",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Provides network-based deposit/withdraw distribution.",
      },
      {
        feature: "Whale alert",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Detects large-volume transfers.",
      },
      {
        feature: "Internal flow map",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Shows internal transfer flow between wallets.",
      },
      {
        feature: "Fee calculation (maker/taker)",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Calculates transaction-based fees.",
      },
      {
        feature: "D/W limit check",
        trader: "x",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Checks limit exceeded situations.",
      },
      {
        feature: "Chain health score",
        trader: "x",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Scores blockchain network health.",
      },
      {
        feature: "Token flow anomaly",
        trader: "x",
        proTrader: "x",
        enterprise: "check",
        addOn: "plus",
        desc: "Detects token-based unusual inflows/outflows.",
      },
    ],
  },

  // -------------------------------------------------------------
  // 5) FEE & TAX
  // -------------------------------------------------------------
  {
    category: "Fee & Tax",
    rows: [
      {
        feature: "Fee breakdown (BTC/USDT/TRY)",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Shows which asset the fees are charged from.",
      },
      {
        feature: "VAT separation",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Separates VAT amount within the fee.",
      },
      {
        feature: "Fee revenue report",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Reports fee revenues on a time basis.",
      },
      {
        feature: "Fee model comparator",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Compares fee models across different exchanges.",
      },
      {
        feature: "Exchange-based limit",
        trader: "lock",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Sets exchange-specific fee limits.",
      },
      {
        feature: "Multi-asset fee breakdown",
        trader: "x",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Provides BTC/USDT/TRY-based fee breakdown.",
      },
      {
        feature: "Fee collection alert",
        trader: "x",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Alerts when there's an anomaly in fee collection.",
      },
      {
        feature: "Tax compliance mode",
        trader: "lock",
        proTrader: "lock",
        enterprise: "check",
        addOn: "plus",
        desc: "Generates tax reports compliant with local regulations.",
      },
    ],
  },

  // -------------------------------------------------------------
  // 6) LIQUIDITY RISK & LIMIT
  // -------------------------------------------------------------
  {
    category: "Liquidity Risk & Limit",
    rows: [
      {
        feature: "Umutgun lower limit",
        trader: "lock",
        proTrader: "lock",
        enterprise: "check",
        addOn: "-",
        desc: "Limit setting for enterprise only.",
      },
      {
        feature: "Low liquidity coin alert",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Generates alarms for coins with low liquidity.",
      },
      {
        feature: "Coin risk plan",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Shows coin-based risk scoring.",
      },
      {
        feature: "Exchange-based limit",
        trader: "lock",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Sets specific limits for each exchange.",
      },
      {
        feature: "Low liquidity coin score",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Provides scoring based on liquidity strength.",
      },
      {
        feature: "Coin alert system",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Provides automatic alerts for risky coins.",
      },
      {
        feature: "Upper limit analysis",
        trader: "lock",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Provides coin upper limit analyses.",
      },
      {
        feature: "Liquidity threshold alarm",
        trader: "x",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Alerts when liquidity falls below threshold.",
      },
      {
        feature: "Wallet tolerance analysis",
        trader: "lock",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Calculates tolerance levels for wallets.",
      },
      {
        feature: "Wallet movement limiter",
        trader: "lock",
        proTrader: "lock",
        enterprise: "check",
        addOn: "plus",
        desc: "Sets system-wide wallet movement limits.",
      },
    ],
  },

  // -------------------------------------------------------------
  // 7) TREASURY & WALLET
  // -------------------------------------------------------------
  {
    category: "Treasury & Wallet",
    rows: [
      {
        feature: "Wallet groups (LP/HW/CW)",
        trader: "lock",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Manages LP, Hot, Warm, Cold wallet structures.",
      },
      {
        feature: "Coin & wallet distribution",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Shows asset distribution across all wallets.",
      },
      {
        feature: "Band analysis & down",
        trader: "lock",
        proTrader: "lock",
        enterprise: "check",
        addOn: "plus",
        desc: "Alerts when wallets go out of band.",
      },
      {
        feature: "Health score",
        trader: "x",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Calculates overall health score of wallets.",
      },
      {
        feature: "Target distribution model",
        trader: "lock",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Creates wallet target distribution models.",
      },
      {
        feature: "Internal transfer flow",
        trader: "x",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Provides transfer flow between wallets.",
      },
      {
        feature: "Simulation mode",
        trader: "lock",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Provides simulation of wallet movements.",
      },
    ],
  },

  // -------------------------------------------------------------
  // 8) AUTOBALANCER & SIMULATION
  // -------------------------------------------------------------
  {
    category: "Autobalancer & Simulation",
    rows: [
      {
        feature: "What-if scenarios",
        trader: "lock",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Simulates hypothetical market conditions.",
      },
      {
        feature: "Automatic balancing suggestion",
        trader: "lock",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Suggests recommendations for wallet imbalances.",
      },
      {
        feature: "Transfer policies",
        trader: "lock",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Manages HW–LP transfer policies.",
      },
      {
        feature: "Price shock stress test",
        trader: "lock",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Tests system behavior under price shocks.",
      },
      {
        feature: "Treasury volatility analysis",
        trader: "x",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Analyzes volatility impact of assets.",
      },
    ],
  },

  // -------------------------------------------------------------
  // 9) ALERT SYSTEM
  // -------------------------------------------------------------
  {
    category: "Alert System",
    rows: [
      {
        feature: "Spread alert",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Generates alarm on spread anomaly.",
      },
      {
        feature: "Liquidity alarm",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Alerts when liquidity falls below threshold.",
      },
      {
        feature: "Wallet alarm",
        trader: "lock",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Detects abnormal movement in wallets.",
      },
      {
        feature: "D/W anomaly alert",
        trader: "x",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Detects deposit/withdrawal anomalies.",
      },
      {
        feature: "Price movement alert",
        trader: "x",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Provides alerts on sudden price movements.",
      },
    ],
  },

  // -------------------------------------------------------------
  // 10) REPORTING
  // -------------------------------------------------------------
  {
    category: "Reporting",
    rows: [
      {
        feature: "Daily report",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Generates daily summary metric reports.",
      },
      {
        feature: "Advanced report",
        trader: "x",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Produces reports with detailed data.",
      },
      {
        feature: "Custom report generator",
        trader: "x",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Creates custom reports for users.",
      },
      {
        feature: "PDF/Excel output",
        trader: "check",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Reports are exported in PDF/Excel format.",
      },
    ],
  },

  // -------------------------------------------------------------
  // 11) SECURITY / ENTERPRISE
  // -------------------------------------------------------------
  {
    category: "Security / Enterprise",
    rows: [
      {
        feature: "API permission restrictions",
        trader: "lock",
        proTrader: "check",
        enterprise: "check",
        addOn: "-",
        desc: "Restricts API access permissions.",
      },
      {
        feature: "Multi-user & role management",
        trader: "lock",
        proTrader: "lock",
        enterprise: "check",
        addOn: "-",
        desc: "Provides enterprise-level user and role management.",
      },
      {
        feature: "IP whitelist",
        trader: "x",
        proTrader: "check",
        enterprise: "check",
        addOn: "plus",
        desc: "Defines access permissions for specific IP addresses.",
      },
    ],
  },
];