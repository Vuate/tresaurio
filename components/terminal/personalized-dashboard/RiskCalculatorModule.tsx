"use client";

import { useState, useMemo } from "react";
import { Shield, AlertTriangle } from "lucide-react";

interface RiskMetrics {
  positionSize: number;
  riskAmount: number;
  riskPercent: number;
  stopLossDistance: number;
  stopLossPrice: number;
  takeProfitPrice: number;
  rewardRiskRatio: number;
  potentialProfit: number;
  potentialLoss: number;
}

interface Props {
  instanceId: string;
}

export default function RiskCalculatorModule({ instanceId }: Props) {
  const [accountSize, setAccountSize] = useState(10000);
  const [riskPercent, setRiskPercent] = useState(1);
  const [entryPrice, setEntryPrice] = useState(95000);
  const [stopLoss, setStopLoss] = useState(94000);
  const [takeProfit, setTakeProfit] = useState(98000);

  const metrics = useMemo((): RiskMetrics => {
    const riskAmount = (accountSize * riskPercent) / 100;
    const stopLossDistance = Math.abs(entryPrice - stopLoss);
    const positionSize =
      stopLossDistance > 0 ? riskAmount / stopLossDistance : 0;

    const tpDistance = Math.abs(takeProfit - entryPrice);
    const rewardRiskRatio =
      stopLossDistance > 0 ? tpDistance / stopLossDistance : 0;

    const potentialProfit = positionSize * tpDistance;
    const potentialLoss = positionSize * stopLossDistance;

    return {
      positionSize,
      riskAmount,
      riskPercent,
      stopLossDistance,
      stopLossPrice: stopLoss,
      takeProfitPrice: takeProfit,
      rewardRiskRatio,
      potentialProfit,
      potentialLoss,
    };
  }, [accountSize, riskPercent, entryPrice, stopLoss, takeProfit]);

  return (
    <div className="space-y-3 text-xs">
      <div className="flex items-center gap-2 text-white/70 font-semibold">
        <Shield className="w-3 h-3" />
        <span>Risk Calculator</span>
      </div>

      <div className="space-y-2">
        <div>
          <label className="block text-white/50 mb-1 text-[10px]">
            Account Size ($)
          </label>
          <input
            type="number"
            value={accountSize}
            onChange={(e) => setAccountSize(parseFloat(e.target.value) || 0)}
            className="w-full bg-white/5 border border-white/10 rounded px-3 py-1.5 text-white"
            step="1000"
          />
        </div>

        <div>
          <label className="block text-white/50 mb-1 text-[10px]">
            Risk Per Trade (%)
          </label>
          <input
            type="number"
            value={riskPercent}
            onChange={(e) => setRiskPercent(parseFloat(e.target.value) || 0)}
            className="w-full bg-white/5 border border-white/10 rounded px-3 py-1.5 text-white"
            step="0.5"
            min="0"
            max="100"
          />
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
            Stop Loss
          </label>
          <input
            type="number"
            value={stopLoss}
            onChange={(e) => setStopLoss(parseFloat(e.target.value) || 0)}
            className="w-full bg-white/5 border border-white/10 rounded px-3 py-1.5 text-white"
            step="100"
          />
        </div>

        <div>
          <label className="block text-white/50 mb-1 text-[10px]">
            Take Profit
          </label>
          <input
            type="number"
            value={takeProfit}
            onChange={(e) => setTakeProfit(parseFloat(e.target.value) || 0)}
            className="w-full bg-white/5 border border-white/10 rounded px-3 py-1.5 text-white"
            step="100"
          />
        </div>
      </div>

      <div className="border-t border-white/10 pt-3 space-y-2">
        <Row label="Position Size">{metrics.positionSize.toFixed(4)} BTC</Row>

        <Row label="Risk Amount">
          <span className="text-red-400 font-semibold">
            ${metrics.riskAmount.toFixed(2)}
          </span>
        </Row>

        <Row label="Stop Loss Distance">
          ${metrics.stopLossDistance.toLocaleString()}
        </Row>

        <div className="border-t border-white/10 my-2" />

        <Row label="Potential Profit">
          <span className="text-emerald-400 font-semibold">
            +${metrics.potentialProfit.toFixed(2)}
          </span>
        </Row>

        <Row label="Potential Loss">
          <span className="text-red-400 font-semibold">
            -${metrics.potentialLoss.toFixed(2)}
          </span>
        </Row>

        <Row label="Risk:Reward">
          <span
            className={`font-semibold ${
              metrics.rewardRiskRatio >= 2
                ? "text-emerald-400"
                : metrics.rewardRiskRatio >= 1
                ? "text-yellow-400"
                : "text-red-400"
            }`}
          >
            1:{metrics.rewardRiskRatio.toFixed(2)}
          </span>
        </Row>
      </div>

      {riskPercent > 2 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-2 text-[10px] text-yellow-400 flex items-start gap-2">
          <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
          <span>High risk! Consider reducing to 1-2% per trade</span>
        </div>
      )}

      {metrics.rewardRiskRatio < 1.5 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded p-2 text-[10px] text-red-400 flex items-start gap-2">
          <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
          <span>Low R:R ratio! Aim for at least 1:2</span>
        </div>
      )}

      {metrics.rewardRiskRatio >= 3 && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded p-2 text-[10px] text-emerald-400">
          ✓ Excellent risk:reward ratio!
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
