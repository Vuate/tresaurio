
import { useMemo } from "react";
import { usePortfolioStore } from "@/store/portfolioStore";
import { useFuturesPositionStore } from "@/store/futuresPositionStore";
import { usePriceStore } from "@/store/priceStore";

export function usePnL() {
  const { spotPositions } = usePortfolioStore();
  const futuresPositionsFromStore = useFuturesPositionStore((s) => s.positions);
  const prices = usePriceStore((s) => s.prices);

  // Convert futuresPositionStore format to match portfolioStore format
  const futuresPositions = futuresPositionsFromStore.map((p) => ({
    ...p,
    quantity: p.size,
    markPrice: prices[p.symbol] || p.entryPrice,
    totalCost: p.entryPrice * p.size / p.leverage, // Margin
  }));

  return useMemo(() => {
    /* -------- SPOT -------- */
    const spotUnrealized = spotPositions.reduce((sum, p) => {
      const currentPrice = prices[p.symbol] || p.currentPrice;
      const pnl = (currentPrice - p.entryPrice) * p.quantity;
      return sum + pnl;
    }, 0);

    /* -------- FUTURES -------- */
    const futuresUnrealized = futuresPositions.reduce((sum, p) => {
      const priceDiff =
        p.side === "long"
          ? p.markPrice - p.entryPrice
          : p.entryPrice - p.markPrice;

      const pnl = priceDiff * p.quantity;
      return sum + pnl;
    }, 0);

    const totalUnrealized = spotUnrealized + futuresUnrealized;

    // Spot investment (cost basis)
    const spotInvestment = spotPositions.reduce(
      (sum, p) => sum + p.totalCost,
      0
    );

    // Futures margin
    const futuresMargin = futuresPositions.reduce(
      (sum, p) => sum + p.totalCost,
      0
    );

    // Current values
    const spotValue = spotPositions.reduce(
      (sum, p) => {
        const currentPrice = prices[p.symbol] || p.currentPrice;
        return sum + currentPrice * p.quantity;
      },
      0
    );
    const futuresValue = spotValue + futuresUnrealized; // Futures value = spot value + unrealized

    // Total portfolio
    const totalInvestment = spotInvestment + futuresMargin;
    const totalValue = spotValue + futuresMargin + futuresUnrealized;
    const totalPnLPercent =
      totalInvestment > 0 ? (totalUnrealized / totalInvestment) * 100 : 0;

    return {
      // Unrealized PnL
      spotUnrealized,
      futuresUnrealized,
      totalUnrealized,

      // Investment & Value
      spotInvestment,
      spotValue,
      futuresMargin,
      futuresValue,
      totalInvestment,
      totalValue,
      totalPnLPercent,

      // İleride açacağız
      realized: 0,
      todayPnL: totalUnrealized,
    };
  }, [spotPositions, futuresPositions, prices]);
}
