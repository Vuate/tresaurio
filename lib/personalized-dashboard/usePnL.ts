import { useMemo } from "react";
import { usePortfolioStore } from "@/store/portfolioStore";

export function usePnL() {
  const { spotPositions, futuresPositions } = usePortfolioStore();

  return useMemo(() => {
    /* -------- SPOT -------- */
    const spotUnrealized = spotPositions.reduce((sum, p) => {
      return sum + (p.currentPrice - p.entryPrice) * p.qty;
    }, 0);

    /* -------- FUTURES -------- */
    const futuresUnrealized = futuresPositions.reduce((sum, p) => {
      const direction = p.side === "long" ? 1 : -1;
      return (
        sum + direction * (p.markPrice - p.entryPrice) * p.qty * p.leverage
      );
    }, 0);

    const totalUnrealized = spotUnrealized + futuresUnrealized;

    return {
      spotUnrealized,
      futuresUnrealized,
      totalUnrealized,

      // ileride açacağız
      realized: 0,
      todayPnL: totalUnrealized,
    };
  }, [spotPositions, futuresPositions]);
}
