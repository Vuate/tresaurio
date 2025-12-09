"use client";

import { useEffect, useState } from "react";
import Header from "./components/Header";
import LivePrices from "./components/LivePrices";
import QuickStats from "./components/QuickStats";
import Movers from "./components/Movers";
import FearGreed from "./components/FearGreed";
import FreeTierBanner from "./components/FreeTierBanner";

export default function TerminalHome() {
  return (
    <>
      <div className="min-h-screen w-full bg-[#0a0b0f] text-white px-8 py-10 space-y-12">
        <Header />
        <LivePrices />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          <div className="xl:col-span-2">
            <QuickStats />
          </div>
          <FearGreed />
        </div>

        <Movers />
      </div>

      {/* BURADA ARTIK TAM GENİŞLİK ÇALIŞIR */}
      <FreeTierBanner />
    </>
  );
}
