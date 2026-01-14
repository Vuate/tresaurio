// components/terminal/personalized-dashboard/AllInCostCalculatorModule.tsx
"use client";

import { useState, useMemo } from "react";
import { Calculator, TrendingUp, AlertTriangle } from "lucide-react";

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

export default function AllInCostCalculatorModule({ instanceId }: Props) {
  const [entryPrice, setEntryPrice] = useState(95000);
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
    <div className="space-y-3 text-xs">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-white/70 font-semibold mb-2">
          <Calculator className="w-3 h-3" />
          <span>Position Setup</span>
        </div>

        <div>
          <label className="block text-white/50 mb-1 text-[10px]">
            Exchange
          </label>
          <select
            value={exchange}
            onChange={(e) => setExchange(e.target.value as Exchange)}
            className="w-full bg-white/5 border border-white/10 rounded px-3 py-1.5 text-white text-xs outline-none"
          >
            <option value="binance" className="bg-[#112240]">
              Binance
            </option>
            <option value="okx" className="bg-[#112240]">
              OKX
            </option>
            <option value="bybit" className="bg-[#112240]">
              Bybit
            </option>
          </select>
        </div>

        <div>
          <label className="block text-white/50 mb-1 text-[10px]">
            VIP Level
          </label>
          <select
            value={vipLevel}
            onChange={(e) => setVipLevel(parseInt(e.target.value))}
            className="w-full bg-white/5 border border-white/10 rounded px-3 py-1.5 text-white text-xs outline-none"
          >
            {Object.keys(exchangeFees[exchange].vip).map((level) => {
              const fees =
                exchangeFees[exchange].vip[
                  parseInt(
                    level
                  ) as keyof (typeof exchangeFees)[typeof exchange]["vip"]
                ];
              return (
                <option key={level} value={level} className="bg-[#112240]">
                  VIP {level} (Maker {fees.maker}% / Taker {fees.taker}%)
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="block text-white/50 mb-1 text-[10px]">Side</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSide("long")}
              className={`py-1.5 rounded text-xs transition-colors ${
                side === "long"
                  ? "bg-emerald-500 text-white"
                  : "bg-white/5 text-white/50 hover:bg-white/10"
              }`}
            >
              Long
            </button>
            <button
              onClick={() => setSide("short")}
              className={`py-1.5 rounded text-xs transition-colors ${
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
            className="w-full bg-white/5 border border-white/10 rounded px-3 py-1.5 text-white"
            step="100"
          />
        </div>

        <div>
          <label className="block text-white/50 mb-1 text-[10px]">
            Quantity (BTC)
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
            className="w-full bg-white/5 border border-white/10 rounded px-3 py-1.5 text-white"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-white/50 mb-1 text-[10px]">
            Leverage
          </label>
          <select
            value={leverage}
            onChange={(e) => setLeverage(parseInt(e.target.value))}
            className="w-full bg-white/5 border border-white/10 rounded px-3 py-1.5 text-white text-xs outline-none"
          >
            {[1, 2, 3, 5, 10, 20, 50, 100, 125].map((lev) => (
              <option key={lev} value={lev} className="bg-[#112240]">
                {lev}x
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white/50 mb-1 text-[10px]">
            Order Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setFeeType("maker")}
              className={`py-1.5 rounded text-xs transition-colors ${
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
              className={`py-1.5 rounded text-xs transition-colors ${
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
            className="w-full bg-white/5 border border-white/10 rounded px-3 py-1.5 text-white"
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
            className="w-full bg-white/5 border border-white/10 rounded px-3 py-1.5 text-white"
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
            onChange={(e) => setHoldingHours(parseFloat(e.target.value) || 0)}
            className="w-full bg-white/5 border border-white/10 rounded px-3 py-1.5 text-white"
            step="1"
          />
        </div>
      </div>

      <div className="border-t border-white/10 pt-3 space-y-2">
        <div className="flex items-center gap-2 text-white/70 font-semibold mb-2">
          <TrendingUp className="w-3 h-3" />
          <span>Cost Breakdown</span>
        </div>

        <Row label="Notional Value">
          ${costs.notionalValue.toLocaleString()}
        </Row>

        <Row label="Trading Fee">
          ${costs.tradingFee.toFixed(2)} ({costs.tradingFeePercent.toFixed(3)}%)
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
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-2 text-[10px] text-yellow-400">
          ⚠️ High cost impact ({costs.costImpact.toFixed(2)}%)!
        </div>
      )}

      {leverage > 10 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded p-2 text-[10px] text-red-400">
          ⚠️ High leverage ({leverage}x)! Risk of liquidation.
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded p-2 text-[10px] text-white/40">
        {side === "long"
          ? `📈 Price must reach $${costs.effectivePrice.toLocaleString()} to break even`
          : `📉 Price must drop to $${costs.effectivePrice.toLocaleString()} to break even`}
      </div>
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
    <div className="flex justify-between">
      <span className="text-white/50">{label}</span>
      <span>{children}</span>
    </div>
  );
}
