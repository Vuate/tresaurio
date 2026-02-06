"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Calculator, TrendingUp, AlertTriangle, Plus, X } from "lucide-react";

type PositionSide = "long" | "short";
type FeeType = "maker" | "taker";
type Exchange = "binance" | "okx" | "bybit";

interface CostBreakdown {
  entryPrice: number;
  quantity: number;
  notionalValue: number;
  tradingFee: number;
  tradingFeePercent: number;
  tradingFeeWithDiscount: number;
  bnbSavings: number;
  slippage: number;
  slippagePercent: number;
  funding: number;
  fundingPercent: number;
  totalCost: number;
  effectivePrice: number;
  costImpact: number;
  liquidationPrice: number | null;
}

interface Props {
  instanceId: string;
}

const DEFAULT_TOKENS = [
  { symbol: "BTCUSDT", name: "BTC", defaultPrice: 95000 },
  { symbol: "ETHUSDT", name: "ETH", defaultPrice: 3500 },
  { symbol: "BNBUSDT", name: "BNB", defaultPrice: 600 },
  { symbol: "SOLUSDT", name: "SOL", defaultPrice: 150 },
];

const POPULAR_TOKENS = [
  { symbol: "BTCUSDT", name: "BTC" },
  { symbol: "ETHUSDT", name: "ETH" },
  { symbol: "BNBUSDT", name: "BNB" },
  { symbol: "SOLUSDT", name: "SOL" },
  { symbol: "XRPUSDT", name: "XRP" },
  { symbol: "ADAUSDT", name: "ADA" },
  { symbol: "DOGEUSDT", name: "DOGE" },
  { symbol: "MATICUSDT", name: "MATIC" },
  { symbol: "AVAXUSDT", name: "AVAX" },
  { symbol: "DOTUSDT", name: "DOT" },
];

const EXCHANGES = [
  { id: "binance", name: "Binance" },
  { id: "okx", name: "OKX" },
  { id: "bybit", name: "Bybit" },
];

export default function AllInCostCalculatorModule({ instanceId }: Props) {
  const tokensStorageKey = `all-in-cost-tokens-${instanceId}`;

  const [tokens, setTokens] = useState<typeof DEFAULT_TOKENS>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(tokensStorageKey);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return DEFAULT_TOKENS;
        }
      }
    }
    return DEFAULT_TOKENS;
  });

  const [selectedToken, setSelectedToken] = useState(tokens[0]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTokenSymbol, setNewTokenSymbol] = useState("");
  const [newTokenPrice, setNewTokenPrice] = useState("");

  const [entryPrice, setEntryPrice] = useState(selectedToken.defaultPrice);
  const [quantity, setQuantity] = useState(1);
  const [leverage, setLeverage] = useState(1);
  const [side, setSide] = useState<PositionSide>("long");
  const [exchange, setExchange] = useState<Exchange>("binance");
  const [vipLevel, setVipLevel] = useState(0);
  const [feeType, setFeeType] = useState<FeeType>("taker");
  const [useBnb, setUseBnb] = useState(false);
  const [slippagePercent, setSlippagePercent] = useState(0.05);
  const [fundingRate, setFundingRate] = useState(0.0125);
  const [holdingHours, setHoldingHours] = useState(24);

  const [tokenOpen, setTokenOpen] = useState(false);
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [vipOpen, setVipOpen] = useState(false);
  const [leverageOpen, setLeverageOpen] = useState(false);

  const tokenRef = useRef<HTMLDivElement>(null);
  const exchangeRef = useRef<HTMLDivElement>(null);
  const vipRef = useRef<HTMLDivElement>(null);
  const leverageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEntryPrice(selectedToken.defaultPrice);
  }, [selectedToken]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(tokensStorageKey, JSON.stringify(tokens));
    }
  }, [tokens, tokensStorageKey]);

  useEffect(() => {
    if (!tokenOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (tokenRef.current && !tokenRef.current.contains(e.target as Node)) {
        setTokenOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [tokenOpen]);

  useEffect(() => {
    if (!exchangeOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        exchangeRef.current &&
        !exchangeRef.current.contains(e.target as Node)
      ) {
        setExchangeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [exchangeOpen]);

  useEffect(() => {
    if (!vipOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (vipRef.current && !vipRef.current.contains(e.target as Node)) {
        setVipOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [vipOpen]);

  useEffect(() => {
    if (!leverageOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        leverageRef.current &&
        !leverageRef.current.contains(e.target as Node)
      ) {
        setLeverageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [leverageOpen]);

  useEffect(() => {
    if (showAddModal) {
      document.body.style.overflow = "hidden";
      if (contentRef.current) {
        const scrollTop = contentRef.current.scrollTop;
        contentRef.current.style.overflow = "hidden";
        contentRef.current.scrollTop = scrollTop;
      }
    }

    return () => {
      document.body.style.overflow = "";
      if (contentRef.current) {
        contentRef.current.style.overflow = "";
      }
    };
  }, [showAddModal]);

  const addToken = () => {
    const symbol = newTokenSymbol.trim().toUpperCase();
    const price = parseFloat(newTokenPrice);

    if (!symbol || !price || isNaN(price)) {
      alert("Please enter valid symbol and price");
      return;
    }

    if (tokens.some((t) => t.symbol === symbol)) {
      alert("Token already exists");
      return;
    }

    const newToken = {
      symbol,
      name: symbol.replace("USDT", "").replace("BUSD", "").replace("USDC", ""),
      defaultPrice: price,
    };

    setTokens([...tokens, newToken]);
    setSelectedToken(newToken);
    setNewTokenSymbol("");
    setNewTokenPrice("");
    setShowAddModal(false);
  };

  const removeToken = (symbol: string) => {
    if (tokens.length <= 1) {
      alert("Cannot remove last token");
      return;
    }

    const filtered = tokens.filter((t) => t.symbol !== symbol);
    setTokens(filtered);

    if (selectedToken.symbol === symbol) {
      setSelectedToken(filtered[0]);
    }
  };

  const exchangeFees = {
    binance: {
      vip: {
        0: { maker: 0.02, taker: 0.05 },
        1: { maker: 0.016, taker: 0.04 },
        2: { maker: 0.014, taker: 0.035 },
        3: { maker: 0.012, taker: 0.032 },
        4: { maker: 0.01, taker: 0.03 },
        5: { maker: 0.008, taker: 0.027 },
        6: { maker: 0.006, taker: 0.025 },
        7: { maker: 0.004, taker: 0.022 },
        8: { maker: 0.002, taker: 0.02 },
        9: { maker: 0.0, taker: 0.017 },
      },
      bnbDiscount: 0.1,
    },
    okx: {
      vip: {
        0: { maker: 0.02, taker: 0.05 },
        1: { maker: 0.015, taker: 0.04 },
        2: { maker: 0.01, taker: 0.035 },
        3: { maker: 0.008, taker: 0.03 },
      },
      bnbDiscount: 0,
    },
    bybit: {
      vip: {
        0: { maker: 0.01, taker: 0.06 },
        1: { maker: 0.006, taker: 0.05 },
        2: { maker: 0.004, taker: 0.045 },
        3: { maker: 0.0, taker: 0.04 },
      },
      bnbDiscount: 0,
    },
  };

  const costs = useMemo((): CostBreakdown => {
    const notionalValue = entryPrice * quantity;

    const exchangeConfig = exchangeFees[exchange];
    const vipConfig =
      exchangeConfig.vip[vipLevel as keyof typeof exchangeConfig.vip] ||
      exchangeConfig.vip[0];
    const tradingFeePercent = vipConfig[feeType];

    let tradingFee = (notionalValue * tradingFeePercent) / 100;

    const bnbDiscount = useBnb ? exchangeConfig.bnbDiscount : 0;
    const bnbSavings = tradingFee * bnbDiscount;
    const tradingFeeWithDiscount = tradingFee - bnbSavings;

    const slippage = (notionalValue * slippagePercent) / 100;

    const fundingPeriods = holdingHours / 8;
    const fundingPercent = fundingRate * fundingPeriods;
    const funding = (notionalValue * Math.abs(fundingPercent)) / 100;

    const totalCost = tradingFeeWithDiscount + slippage + funding;

    const effectivePrice =
      side === "long"
        ? entryPrice + totalCost / quantity
        : entryPrice - totalCost / quantity;

    const costImpact = ((effectivePrice - entryPrice) / entryPrice) * 100;

    let liquidationPrice: number | null = null;
    if (leverage > 1) {
      const maintenanceMargin = 0.5;
      const liquidationDistance = 100 / leverage - maintenanceMargin;
      liquidationPrice =
        side === "long"
          ? entryPrice * (1 - liquidationDistance / 100)
          : entryPrice * (1 + liquidationDistance / 100);
    }

    return {
      entryPrice,
      quantity,
      notionalValue,
      tradingFee,
      tradingFeePercent,
      tradingFeeWithDiscount,
      bnbSavings,
      slippage,
      slippagePercent,
      funding,
      fundingPercent,
      totalCost,
      effectivePrice,
      costImpact: side === "long" ? costImpact : -costImpact,
      liquidationPrice,
    };
  }, [
    entryPrice,
    quantity,
    leverage,
    side,
    exchange,
    vipLevel,
    feeType,
    useBnb,
    slippagePercent,
    fundingRate,
    holdingHours,
  ]);

  return (
    <div
      className={`h-full flex flex-col relative ${
        showAddModal ? "overflow-hidden" : ""
      }`}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 flex-shrink-0">
        <span className="font-semibold text-white/90 text-xs whitespace-nowrap">
          All-In Cost Calculator
        </span>

        <div className="flex-1 min-w-[20px]"></div>

        <div ref={tokenRef} className="relative">
          <button
            onClick={() => setTokenOpen((v) => !v)}
            className="
              h-7 px-3 rounded-md
              bg-[#0b1f1f]
              border border-white/10
              text-white text-xs
              flex items-center gap-1.5
              cursor-pointer
              hover:bg-white/5
              transition-all
              whitespace-nowrap
            "
          >
            <span>
              {selectedToken.name} ($
              {selectedToken.defaultPrice.toLocaleString()})
            </span>
            <span
              className={`
                text-white/50 text-[10px]
                transition-transform duration-200
                ${tokenOpen ? "rotate-180" : ""}
              `}
            >
              ▾
            </span>
          </button>

          {tokenOpen && (
            <div
              onWheel={(e) => e.stopPropagation()}
              className="
                absolute left-0 mt-1 z-50
                w-[180px]
                max-h-[200px]
                overflow-y-auto
                bg-[#0b1f1f]
                border border-emerald-500/20
                rounded-md
                shadow-lg
                animate-in fade-in slide-in-from-top-2 duration-200

                [&::-webkit-scrollbar]:w-1.5
                [&::-webkit-scrollbar-thumb]:bg-emerald-500/40
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-track]:bg-transparent
              "
            >
              {tokens.map((t) => (
                <button
                  key={t.symbol}
                  onClick={() => {
                    setSelectedToken(t);
                    setTokenOpen(false);
                  }}
                  className="
                    w-full px-3 py-2
                    text-left text-xs
                    bg-transparent cursor-pointer
                    text-white
                    transition-colors
                    hover:bg-emerald-500/10
                    hover:text-emerald-400
                  "
                >
                  {t.name} (${t.defaultPrice.toLocaleString()})
                </button>
              ))}
            </div>
          )}
        </div>

        <div ref={exchangeRef} className="relative">
          <button
            onClick={() => setExchangeOpen((v) => !v)}
            className="
              h-7 px-3 rounded-md
              bg-[#0b1f1f]
              border border-white/10
              text-white text-xs
              flex items-center gap-1.5
              cursor-pointer
              hover:bg-white/5
              transition-all
              whitespace-nowrap
            "
          >
            <span>{EXCHANGES.find((e) => e.id === exchange)?.name}</span>
            <span
              className={`
                text-white/50 text-[10px]
                transition-transform duration-200
                ${exchangeOpen ? "rotate-180" : ""}
              `}
            >
              ▾
            </span>
          </button>

          {exchangeOpen && (
            <div
              onWheel={(e) => e.stopPropagation()}
              className="
                absolute left-0 mt-1 z-50
                w-[120px]
                max-h-[160px]
                overflow-y-auto
                bg-[#0b1f1f]
                border border-emerald-500/20
                rounded-md
                shadow-lg
                animate-in fade-in slide-in-from-top-2 duration-200

                [&::-webkit-scrollbar]:w-1.5
                [&::-webkit-scrollbar-thumb]:bg-emerald-500/40
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-track]:bg-transparent
              "
            >
              {EXCHANGES.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => {
                    setExchange(ex.id as Exchange);
                    setExchangeOpen(false);
                  }}
                  className="
                    w-full px-3 py-2
                    text-left text-xs
                    bg-transparent cursor-pointer
                    text-white
                    transition-colors
                    hover:bg-emerald-500/10
                    hover:text-emerald-400
                  "
                >
                  {ex.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="h-7 px-3 rounded-md bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 transition-all flex items-center gap-1 cursor-pointer font-medium text-xs whitespace-nowrap"
        >
          <Plus className="w-3 h-3" />
          Add
        </button>

        {/* Remove Button */}
        {tokens.length > 1 && (
          <button
            onClick={() => removeToken(selectedToken.symbol)}
            className="h-7 px-3 rounded-md bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 transition-all flex items-center gap-1 cursor-pointer font-medium text-xs whitespace-nowrap"
          >
            <X className="w-3 h-3" />
            Remove
          </button>
        )}
      </div>

      <div
        ref={contentRef}
        className="
          flex-1 min-h-0 px-3 pb-3
          overflow-y-auto
          space-y-3

          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-teal-400/40
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb:hover]:bg-teal-400/70

          scrollbar-thin
          scrollbar-thumb-teal-400/40
          scrollbar-track-transparent
        "
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-white/70 font-semibold">
            <Calculator className="w-3 h-3" />
            <span className="text-xs">Position Setup</span>
          </div>

          <div>
            <label className="block text-white/50 mb-1 text-[10px]">
              VIP Level
            </label>
            <div ref={vipRef} className="relative">
              <button
                onClick={() => setVipOpen((v) => !v)}
                className="
                  w-full h-7 px-2 rounded-md
                  bg-white/5
                  border border-white/10
                  text-white text-[10px]
                  flex items-center justify-between gap-1
                  cursor-pointer
                  hover:bg-white/10
                  transition-all
                  leading-tight
                "
              >
                <span className="truncate min-w-0">
                  VIP {vipLevel} (M{" "}
                  {
                    exchangeFees[exchange].vip[
                      vipLevel as keyof (typeof exchangeFees)[typeof exchange]["vip"]
                    ].maker
                  }
                  % / T{" "}
                  {
                    exchangeFees[exchange].vip[
                      vipLevel as keyof (typeof exchangeFees)[typeof exchange]["vip"]
                    ].taker
                  }
                  %)
                </span>
                <span
                  className={`
                    text-white/50 text-[10px] shrink-0
                    transition-transform duration-200
                    ${vipOpen ? "rotate-180" : ""}
                  `}
                >
                  ▾
                </span>
              </button>

              {vipOpen && (
                <div
                  onWheel={(e) => e.stopPropagation()}
                  className="
                    absolute left-0 right-0 mt-1 z-50
                    max-h-[200px]
                    overflow-y-auto
                    bg-[#0b1f1f]
                    border border-emerald-500/20
                    rounded-md
                    shadow-lg
                    animate-in fade-in slide-in-from-top-2 duration-200

                    [&::-webkit-scrollbar]:w-1.5
                    [&::-webkit-scrollbar-thumb]:bg-emerald-500/40
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-track]:bg-transparent
                  "
                >
                  {Object.keys(exchangeFees[exchange].vip).map((level) => {
                    const fees =
                      exchangeFees[exchange].vip[
                        parseInt(
                          level
                        ) as keyof (typeof exchangeFees)[typeof exchange]["vip"]
                      ];
                    return (
                      <button
                        key={level}
                        onClick={() => {
                          setVipLevel(parseInt(level));
                          setVipOpen(false);
                        }}
                        className="
                          w-full px-2 py-1.5
                          text-left text-[10px]
                          bg-transparent cursor-pointer
                          text-white
                          transition-colors
                          hover:bg-emerald-500/10
                          hover:text-emerald-400
                          leading-tight
                        "
                      >
                        VIP {level} (M {fees.maker}% / T {fees.taker}%)
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-white/50 mb-1 text-[10px]">Side</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSide("long")}
                className={`py-1.5 rounded-md text-xs transition-colors ${
                  side === "long"
                    ? "bg-emerald-500 text-white"
                    : "bg-white/5 text-white/50 hover:bg-white/10"
                }`}
              >
                Long
              </button>
              <button
                onClick={() => setSide("short")}
                className={`py-1.5 rounded-md text-xs transition-colors ${
                  side === "short"
                    ? "bg-red-500 text-white"
                    : "bg-white/5 text-white/50 hover:bg-white/10"
                }`}
              >
                Short
              </button>
            </div>
          </div>

          <div>
            <label className="block text-white/50 mb-1 text-[10px]">
              Entry Price
            </label>
            <input
              type="number"
              value={entryPrice}
              onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
              className="w-full bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 text-white text-xs outline-none focus:border-blue-500/50 transition-colors"
              step="100"
            />
          </div>

          <div>
            <label className="block text-white/50 mb-1 text-[10px]">
              Quantity ({selectedToken.name})
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
              className="w-full bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 text-white text-xs outline-none focus:border-blue-500/50 transition-colors"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-white/50 mb-1 text-[10px]">
              Leverage
            </label>
            <div ref={leverageRef} className="relative">
              <button
                onClick={() => setLeverageOpen((v) => !v)}
                className="
                  w-full h-7 px-3 rounded-md
                  bg-white/5
                  border border-white/10
                  text-white text-xs
                  flex items-center justify-between gap-1.5
                  cursor-pointer
                  hover:bg-white/10
                  transition-all
                "
              >
                <span>{leverage}x</span>
                <span
                  className={`
                    text-white/50 text-[10px]
                    transition-transform duration-200
                    ${leverageOpen ? "rotate-180" : ""}
                  `}
                >
                  ▾
                </span>
              </button>

              {leverageOpen && (
                <div
                  onWheel={(e) => e.stopPropagation()}
                  className="
                    absolute left-0 right-0 mt-1 z-50
                    max-h-[200px]
                    overflow-y-auto
                    bg-[#0b1f1f]
                    border border-emerald-500/20
                    rounded-md
                    shadow-lg
                    animate-in fade-in slide-in-from-top-2 duration-200

                    [&::-webkit-scrollbar]:w-1.5
                    [&::-webkit-scrollbar-thumb]:bg-emerald-500/40
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-track]:bg-transparent
                  "
                >
                  {[1, 2, 3, 5, 10, 20, 50, 100, 125].map((lev) => (
                    <button
                      key={lev}
                      onClick={() => {
                        setLeverage(lev);
                        setLeverageOpen(false);
                      }}
                      className="
                        w-full px-3 py-2
                        text-left text-xs
                        bg-transparent cursor-pointer
                        text-white
                        transition-colors
                        hover:bg-emerald-500/10
                        hover:text-emerald-400
                      "
                    >
                      {lev}x
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-white/50 mb-1 text-[10px]">
              Order Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setFeeType("maker")}
                className={`py-1.5 rounded-md text-xs transition-colors ${
                  feeType === "maker"
                    ? "bg-blue-500 text-white"
                    : "bg-white/5 text-white/50 hover:bg-white/10"
                }`}
              >
                Maker (
                {
                  exchangeFees[exchange].vip[
                    vipLevel as keyof (typeof exchangeFees)[typeof exchange]["vip"]
                  ].maker
                }
                %)
              </button>
              <button
                onClick={() => setFeeType("taker")}
                className={`py-1.5 rounded-md text-xs transition-colors ${
                  feeType === "taker"
                    ? "bg-blue-500 text-white"
                    : "bg-white/5 text-white/50 hover:bg-white/10"
                }`}
              >
                Taker (
                {
                  exchangeFees[exchange].vip[
                    vipLevel as keyof (typeof exchangeFees)[typeof exchange]["vip"]
                  ].taker
                }
                %)
              </button>
            </div>
          </div>

          {exchange === "binance" && (
            <div className="flex items-center gap-2 text-[10px]">
              <input
                type="checkbox"
                checked={useBnb}
                onChange={(e) => setUseBnb(e.target.checked)}
                className="w-3 h-3"
              />
              <label className="text-white/70">
                Use BNB for 10% fee discount
              </label>
            </div>
          )}

          <div>
            <label className="block text-white/50 mb-1 text-[10px]">
              Expected Slippage (%)
            </label>
            <input
              type="number"
              value={slippagePercent}
              onChange={(e) =>
                setSlippagePercent(parseFloat(e.target.value) || 0)
              }
              className="w-full bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 text-white text-xs outline-none focus:border-blue-500/50 transition-colors"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-white/50 mb-1 text-[10px]">
              Funding Rate (% per 8h)
            </label>
            <input
              type="number"
              value={fundingRate}
              onChange={(e) => setFundingRate(parseFloat(e.target.value) || 0)}
              className="w-full bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 text-white text-xs outline-none focus:border-blue-500/50 transition-colors"
              step="0.001"
            />
          </div>

          <div>
            <label className="block text-white/50 mb-1 text-[10px]">
              Holding Period (hours)
            </label>
            <input
              type="number"
              value={holdingHours}
              onChange={(e) =>
                setHoldingHours(parseFloat(e.target.value) || 0)
              }
              className="w-full bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 text-white text-xs outline-none focus:border-blue-500/50 transition-colors"
              step="1"
            />
          </div>
        </div>

        <div className="border-t border-white/10 pt-3 space-y-2">
          <div className="flex items-center gap-2 text-white/70 font-semibold">
            <TrendingUp className="w-3 h-3" />
            <span className="text-xs">Cost Breakdown</span>
          </div>

          <Row label="Notional Value">
            ${costs.notionalValue.toLocaleString()}
          </Row>

          <Row label="Trading Fee">
            ${costs.tradingFee.toFixed(2)} ({costs.tradingFeePercent.toFixed(3)}
            %)
          </Row>

          {useBnb && costs.bnbSavings > 0 && (
            <Row label="BNB Discount">
              <span className="text-emerald-400">
                -${costs.bnbSavings.toFixed(2)} (10%)
              </span>
            </Row>
          )}

          <Row label="Final Trading Fee">
            <span className={useBnb ? "text-emerald-400" : ""}>
              ${costs.tradingFeeWithDiscount.toFixed(2)}
            </span>
          </Row>

          <Row label="Slippage">
            ${costs.slippage.toFixed(2)} ({costs.slippagePercent.toFixed(3)}%)
          </Row>

          <Row label="Funding Cost">
            ${costs.funding.toFixed(2)} ({costs.fundingPercent.toFixed(4)}%)
          </Row>

          <div className="border-t border-white/10 my-2" />

          <Row label="Total Cost">
            <span className="text-red-400 font-semibold">
              ${costs.totalCost.toFixed(2)}
            </span>
          </Row>

          <Row label="Effective Price">
            <span className="text-blue-400 font-semibold">
              ${costs.effectivePrice.toLocaleString()}
            </span>
          </Row>

          <Row label="Cost Impact">
            <span
              className={`font-semibold ${
                costs.costImpact > 0 ? "text-red-400" : "text-emerald-400"
              }`}
            >
              {costs.costImpact > 0 ? "+" : ""}
              {costs.costImpact.toFixed(3)}%
            </span>
          </Row>

          {costs.liquidationPrice && (
            <>
              <div className="border-t border-white/10 my-2" />
              <Row label="Liquidation Price">
                <span className="text-red-400 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />$
                  {costs.liquidationPrice.toLocaleString()}
                </span>
              </Row>
            </>
          )}
        </div>

        {costs.costImpact > 0.1 && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-md p-2 text-[10px] text-yellow-400">
            ⚠️ High cost impact ({costs.costImpact.toFixed(2)}%)!
          </div>
        )}

        {leverage > 10 && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-md p-2 text-[10px] text-red-400">
            ⚠️ High leverage ({leverage}x)! Risk of liquidation.
          </div>
        )}

        <div className="bg-white/5 border border-white/10 rounded-md p-2 text-[10px] text-white/40">
          {side === "long"
            ? `📈 Price must reach $${costs.effectivePrice.toLocaleString()} to break even`
            : `📉 Price must drop to $${costs.effectivePrice.toLocaleString()} to break even`}
        </div>
      </div>

      {showAddModal && (
        <div
          className="
            fixed inset-0
            bg-[#0a0e1a] z-[100]
            flex flex-col overflow-hidden
            animate-in fade-in slide-in-from-bottom-4 duration-200
          "
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: 0,
            padding: 0,
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 border-b border-white/10 bg-white/5 flex-shrink-0">
            <span className="text-white font-semibold text-xs whitespace-nowrap">
              Add Token
            </span>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-white/50 hover:text-white leading-none cursor-pointer transition-colors text-xl ml-auto"
            >
              ×
            </button>
          </div>

          <div
            className="
              flex-1 min-h-0 overflow-y-auto p-3

              [&::-webkit-scrollbar]:w-1.5
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-teal-400/40
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb:hover]:bg-teal-400/70

              scrollbar-thin
              scrollbar-thumb-teal-400/40
              scrollbar-track-transparent
            "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-3">
              <div>
                <label className="block text-white/50 mb-1 text-[10px]">
                  Symbol (e.g., BTCUSDT)
                </label>
                <input
                  value={newTokenSymbol}
                  onChange={(e) => setNewTokenSymbol(e.target.value)}
                  placeholder="BTCUSDT"
                  className="w-full bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 text-white text-xs outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-white/50 mb-1 text-[10px]">
                  Default Price ($)
                </label>
                <input
                  type="number"
                  value={newTokenPrice}
                  onChange={(e) => setNewTokenPrice(e.target.value)}
                  placeholder="95000"
                  className="w-full bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 text-white text-xs outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-white/50 mb-2 text-[10px]">
                  Popular Tokens
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_TOKENS.map((t) => (
                    <button
                      key={t.symbol}
                      onClick={() => setNewTokenSymbol(t.symbol)}
                      className="
                        px-2 py-1.5 rounded-md font-semibold text-[10px]
                        border transition-all duration-150
                        cursor-pointer
                        whitespace-nowrap
                        bg-white/10 text-white border-white/10
                        hover:bg-teal-500/15
                        hover:border-teal-400/40
                        hover:text-teal-400
                        hover:shadow-[0_0_0_1px_rgba(45,212,191,0.35)]
                      "
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={addToken}
                className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-semibold transition-all cursor-pointer text-xs"
              >
                Add Token
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-white/50">{label}</span>
      <span>{children}</span>
    </div>
  );
}