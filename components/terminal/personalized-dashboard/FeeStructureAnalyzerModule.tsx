"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { TrendingDown, DollarSign, Award } from "lucide-react";

type Exchange = "binance" | "okx" | "bybit";

interface FeeAnalysis {
  currentVip: number;
  totalVolume: number;
  totalFees: number;
  makerVolume: number;
  takerVolume: number;
  makerFees: number;
  takerFees: number;
  averageFeeRate: number;
  makerRatio: number;
  takerRatio: number;
  nextVip: number | null;
  nextVipRequirement: number;
  potentialSavings: number;
  savingsPercent: number;
  breakEvenMonths: number | null;
}

interface Props {
  instanceId: string;
}

export default function FeeStructureAnalyzerModule({ instanceId }: Props) {
  const [exchange, setExchange] = useState<Exchange>("binance");
  const [currentVip, setCurrentVip] = useState(0);
  const [monthlyVolume, setMonthlyVolume] = useState(1250000);
  const [makerRatio, setMakerRatio] = useState(40);

  const exchangeFees = {
    binance: {
      vip: {
        0: { maker: 0.02, taker: 0.05, requirement: 0 },
        1: { maker: 0.016, taker: 0.04, requirement: 15000000 },
        2: { maker: 0.014, taker: 0.035, requirement: 30000000 },
        3: { maker: 0.012, taker: 0.032, requirement: 50000000 },
        4: { maker: 0.01, taker: 0.03, requirement: 100000000 },
        5: { maker: 0.008, taker: 0.027, requirement: 200000000 },
        6: { maker: 0.006, taker: 0.025, requirement: 400000000 },
        7: { maker: 0.004, taker: 0.022, requirement: 800000000 },
        8: { maker: 0.002, taker: 0.02, requirement: 1500000000 },
        9: { maker: 0.0, taker: 0.017, requirement: 2500000000 },
      },
    },
    okx: {
      vip: {
        0: { maker: 0.02, taker: 0.05, requirement: 0 },
        1: { maker: 0.015, taker: 0.04, requirement: 10000000 },
        2: { maker: 0.01, taker: 0.035, requirement: 50000000 },
        3: { maker: 0.008, taker: 0.03, requirement: 100000000 },
      },
    },
    bybit: {
      vip: {
        0: { maker: 0.01, taker: 0.06, requirement: 0 },
        1: { maker: 0.006, taker: 0.05, requirement: 5000000 },
        2: { maker: 0.004, taker: 0.045, requirement: 25000000 },
        3: { maker: 0.0, taker: 0.04, requirement: 100000000 },
      },
    },
  };

  const [vipOpen, setVipOpen] = useState(false);
const vipRef = useRef<HTMLDivElement>(null);
// AllInCostCalculatorModule
const [exchangeOpen, setExchangeOpen] = useState(false);
const exchangeRef = useRef<HTMLDivElement>(null);


useEffect(() => {
  function handleClickOutside(e: MouseEvent) {
    if (exchangeRef.current && !exchangeRef.current.contains(e.target as Node)) {
      setExchangeOpen(false);
    }
    if (vipRef.current && !vipRef.current.contains(e.target as Node)) {
      setVipOpen(false);
    }
  }

  document.addEventListener("pointerdown", handleClickOutside);
  return () => document.removeEventListener("pointerdown", handleClickOutside);
}, []);


  const analysis = useMemo((): FeeAnalysis => {
    const fees = exchangeFees[exchange].vip;
    const currentFees = fees[currentVip as keyof typeof fees];

    const makerVolume = (monthlyVolume * makerRatio) / 100;
    const takerVolume = monthlyVolume - makerVolume;

    const makerFees = (makerVolume * currentFees.maker) / 100;
    const takerFees = (takerVolume * currentFees.taker) / 100;
    const totalFees = makerFees + takerFees;


    const averageFeeRate =
      monthlyVolume > 0 ? (totalFees / monthlyVolume) * 100 : 0;

    let nextVip: number | null = null;
    let nextVipRequirement = 0;
    let potentialSavings = 0;

    for (const [level, config] of Object.entries(fees)) {
      const levelNum = parseInt(level);
      if (levelNum > currentVip && monthlyVolume < config.requirement) {
        nextVip = levelNum;
        nextVipRequirement = config.requirement;

        const nextMakerFees = (makerVolume * config.maker) / 100;
        const nextTakerFees = (takerVolume * config.taker) / 100;
        const nextTotalFees = nextMakerFees + nextTakerFees;
        potentialSavings = totalFees - nextTotalFees;
        break;
      }
    }

    const savingsPercent =
      totalFees > 0 ? (potentialSavings / totalFees) * 100 : 0;

    const volumeNeeded = nextVipRequirement - monthlyVolume;
    const breakEvenMonths =
      volumeNeeded > 0 && potentialSavings > 0
        ? Math.ceil(volumeNeeded / monthlyVolume)
        : null;

    return {
      currentVip,
      totalVolume: monthlyVolume,
      totalFees,
      makerVolume,
      takerVolume,
      makerFees,
      takerFees,
      averageFeeRate,
      makerRatio: makerRatio,
      takerRatio: 100 - makerRatio,
      nextVip,
      nextVipRequirement,
      potentialSavings,
      savingsPercent,
      breakEvenMonths,
    };
  }, [exchange, currentVip, monthlyVolume, makerRatio]);

  const exchangeConfig = exchangeFees[exchange];

  return (
    <div className="space-y-3 text-xs">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-white/70 font-semibold mb-2">
          <DollarSign className="w-3 h-3" />
          <span>Fee Configuration</span>
        </div>

        <div>
          <label className="block text-white/50 mb-1 text-[10px]">
            Exchange
          </label>

          <div ref={exchangeRef} className="relative">
  <button
    onClick={() => setExchangeOpen(v => !v)}
    className="
      w-full flex justify-between items-center
      bg-white/5 border border-white/10
      rounded px-3 py-1.5
      text-white text-xs cursor-pointer
    "
  >
    {exchange.toUpperCase()}
    <span className={`transition ${exchangeOpen ? "rotate-180" : ""}`}>▾</span>
  </button>

  {exchangeOpen && (
    <div
      className="
        absolute z-50 mt-1 w-full
        bg-[#0b1f1f]
        border border-emerald-500/20
        rounded-none
        max-h-[72px]
        overflow-y-auto

        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-thumb]:bg-emerald-500/40
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-track]:bg-transparent
      "
    >
      {(["binance", "okx", "bybit"] as Exchange[]).map((e) => (
        <button
          key={e}
          onClick={() => {
            setExchange(e);
            setExchangeOpen(false);
          }}
          className="
            w-full text-left px-3 py-2
            text-xs cursor-pointer
            hover:text-emerald-400
          "
        >
          {e.toUpperCase()}
        </button>
      ))}
    </div>
  )}
</div>


        </div>

        <div>
          <label className="block text-white/50 mb-1 text-[10px]">
            Current VIP Level
          </label>


<div ref={vipRef} className="relative">
  <button
    onClick={() => setVipOpen(v => !v)}
    className="
      w-full flex justify-between items-center
      bg-white/5 border border-white/10
      rounded px-3 py-1.5
      text-white text-xs cursor-pointer
    "
  >
    VIP {currentVip}
    <span className={`transition ${vipOpen ? "rotate-180" : ""}`}>▾</span>
  </button>

  {vipOpen && (
    <div
      className="
        absolute z-50 mt-1 w-full
        bg-[#0b1f1f]
        border border-emerald-500/20
        rounded-none
        max-h-[72px]
        overflow-y-auto

        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-thumb]:bg-emerald-500/40
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-track]:bg-transparent
      "
    >
      {Object.entries(exchangeFees[exchange].vip).map(
        ([level, fees]) => (
          <button
            key={level}
            onClick={() => {
              setCurrentVip(Number(level));
              setVipOpen(false);
            }}
            className="
              w-full text-left px-3 py-2
              text-xs cursor-pointer
              hover:text-emerald-400
            "
          >
            VIP {level} (M {fees.maker}% / T {fees.taker}%)
          </button>
        )
      )}
    </div>
  )}
</div>


        </div>

        <div>
          <label className="block text-white/50 mb-1 text-[10px]">
            30D Volume ($)
          </label>
          <input
            type="number"
            value={monthlyVolume}
            onChange={(e) => setMonthlyVolume(parseFloat(e.target.value) || 0)}
            className="w-full bg-white/5 border border-white/10 rounded px-3 py-1.5 text-white"
            step="100000"
          />
        </div>

        <div>
          <label className="block text-white/50 mb-1 text-[10px]">
            Maker Ratio (%)
          </label>
          <input
            type="number"
            value={makerRatio}
            onChange={(e) =>
              setMakerRatio(
                Math.min(100, Math.max(0, parseFloat(e.target.value) || 0))
              )
            }
            className="w-full bg-white/5 border border-white/10 rounded px-3 py-1.5 text-white"
            min="0"
            max="100"
            step="5"
          />
          <div className="mt-1 text-[10px] text-white/30">
            Taker: {100 - makerRatio}%
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-3 space-y-2">
        <div className="flex items-center gap-2 text-white/70 font-semibold mb-2">
          <Award className="w-3 h-3" />
          <span>Fee Analysis</span>
        </div>

        <Row label="Total Volume">${analysis.totalVolume.toLocaleString()}</Row>

        <Row label="Maker Volume">
          ${analysis.makerVolume.toLocaleString()} ({analysis.makerRatio}%)
        </Row>

        <Row label="Taker Volume">
          ${analysis.takerVolume.toLocaleString()} ({analysis.takerRatio}%)
        </Row>

        <div className="border-t border-white/10 my-2" />

        <Row label="Maker Fees">${analysis.makerFees.toFixed(2)}</Row>

        <Row label="Taker Fees">${analysis.takerFees.toFixed(2)}</Row>

        <Row label="Total Fees">
          <span className="text-red-400 font-semibold">
            ${analysis.totalFees.toFixed(2)}
          </span>
        </Row>

        <Row label="Average Fee Rate">
          {analysis.averageFeeRate.toFixed(4)}%
        </Row>

        <Row label="Annual Fees">
          <span className="text-red-400">
            ${(analysis.totalFees * 12).toLocaleString()}
          </span>
        </Row>
      </div>

      {analysis.nextVip !== null && (
        <div className="border-t border-white/10 pt-3 space-y-2">
          <div className="flex items-center gap-2 text-white/70 font-semibold mb-2">
            <TrendingDown className="w-3 h-3" />
            <span>Optimization</span>
          </div>

          <Row label="Next VIP Level">VIP {analysis.nextVip}</Row>

          <Row label="Volume Required">
            ${analysis.nextVipRequirement.toLocaleString()}
          </Row>

          <Row label="Volume Needed">
            $
            {(
              analysis.nextVipRequirement - analysis.totalVolume
            ).toLocaleString()}
          </Row>

          {analysis.potentialSavings > 0 && (
            <>
              <Row label="Monthly Savings">
                <span className="text-emerald-400 font-semibold">
                  ${analysis.potentialSavings.toFixed(2)} (
                  {analysis.savingsPercent.toFixed(1)}%)
                </span>
              </Row>

              <Row label="Annual Savings">
                <span className="text-emerald-400 font-semibold">
                  ${(analysis.potentialSavings * 12).toFixed(2)}
                </span>
              </Row>

              {analysis.breakEvenMonths && (
                <Row label="Break-even">{analysis.breakEvenMonths} months</Row>
              )}
            </>
          )}
        </div>
      )}

      {analysis.nextVip === null && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded p-2 text-[10px] text-emerald-400">
          ✓ You're at the highest VIP level!
        </div>
      )}

      {analysis.potentialSavings > analysis.totalFees * 0.2 && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded p-2 text-[10px] text-blue-400">
          💡 Upgrading to VIP {analysis.nextVip} could save you{" "}
          {analysis.savingsPercent.toFixed(0)}% on fees!
        </div>
      )}

      {analysis.makerRatio < 50 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-2 text-[10px] text-yellow-400">
          ⚠️ Consider using more limit orders (maker) to reduce fees
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
    <div className="flex justify-between">
      <span className="text-white/50">{label}</span>
      <span>{children}</span>
    </div>
  );
}
