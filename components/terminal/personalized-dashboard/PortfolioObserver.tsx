"use client";

import { useEffect } from "react";
import { usePriceStore } from "@/store/priceStore";
import { usePortfolioStore } from "@/store/portfolioStore";

export default function PortfolioObserver() {
  const prices = usePriceStore((s) => s.prices);
  const updateSpotPrice = usePortfolioStore((s) => s.updateSpotPrice);
  const updateFuturesPrice = usePortfolioStore((s) => s.updateFuturesPrice);

  useEffect(() => {
    if (!prices || Object.keys(prices).length === 0) return;

    Object.entries(prices).forEach(([symbol, price]) => {
      updateSpotPrice(symbol, price);
      updateFuturesPrice(symbol, price);
    });
  }, [prices, updateSpotPrice, updateFuturesPrice]);

  return null;
}
