"use client";

import { useEffect } from "react";
import { usePriceStore } from "@/store/priceStore";
import { useAlertStore } from "@/store/alertStore";

export default function AlertObserver() {
  const prices = usePriceStore((s) => s.prices);
  const checkAlerts = useAlertStore((s) => s.checkAlerts);

  useEffect(() => {
    if (!prices || Object.keys(prices).length === 0) return;
    checkAlerts(prices);
  }, [prices, checkAlerts]);

  return null;
}
