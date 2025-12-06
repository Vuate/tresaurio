"use client";

import { useState } from "react";
import { Check, X, Lock, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { PRICING_TABLE } from "@/data/pricingTable";

function renderCell(value: string) {
  if (value === "check") return <Check className="text-emerald-400 w-5 h-5" />;
  if (value === "x") return <X className="text-gray-500 w-5 h-5" />;
  if (value === "lock") return <Lock className="text-gray-400 w-5 h-5" />;
  if (value === "plus") return <Plus className="text-teal-300 w-5 h-5" />;
  return <span className="text-gray-300">–</span>;
}

export default function ComparisonTable() {
  const [open, setOpen] = useState(false);

  const visibleCount = 5;

  const allRows = PRICING_TABLE.flatMap((cat) =>
    cat.rows.map((row) => ({ ...row, category: cat.category }))
  );

  const visibleRows = open ? allRows : allRows.slice(0, visibleCount);

  return (
    <section className="w-full pt-40 pb-32 bg-[#031A1C] text-white">
      {/* FULL WIDTH – NO CONTAINER */}
      <div className="w-full px-0">
        {/* TITLE */}
        <h2 className="text-5xl font-bold text-center mb-20">
          Özellikleri <span className="text-teal-400">kıyasla</span>
        </h2>

        {/* TABLE CONTAINER */}
        <div className="w-full bg-[#041F20] border-t border-white/10 p-2">
          {/* HEADER */}
          <div
            className="
              grid grid-cols-[3fr_repeat(4,1fr)_3fr]
              py-8 px-6
              text-gray-100 text-lg font-semibold
              border-b border-white/10
              sticky top-[80px]
              z-50
              bg-[#041F20]
            "
          >
            <div>Özellik</div>
            <div className="text-center">Trader</div>
            <div className="text-center">Pro Trader</div>
            <div className="text-center">Enterprise</div>
            <div className="text-center">Add-on</div>
            <div className="text-center">Açıklama</div>
          </div>

          {/* ROWS */}
          {visibleRows.map((row, i) => (
            <div
              key={i}
              className="
                grid grid-cols-[3fr_repeat(4,1fr)_3fr]
                py-6 px-6
                border-b border-white/5
              "
            >
              <div className="font-medium text-gray-200">{row.feature}</div>
              <div className="flex justify-center">
                {renderCell(row.trader)}
              </div>
              <div className="flex justify-center">
                {renderCell(row.proTrader)}
              </div>
              <div className="flex justify-center">
                {renderCell(row.enterprise)}
              </div>
              <div className="flex justify-center">{renderCell(row.addOn)}</div>
              <div className="text-gray-400 text-sm leading-relaxed">
                {row.desc}
              </div>
            </div>
          ))}
        </div>

        {/* BUTTON */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => setOpen(!open)}
            className="
              px-12 py-5 rounded-xl text-lg font-semibold 
              text-white 
              bg-gradient-to-r from-[#064b48] to-[#0b6b67]
              hover:from-[#0b6b67] hover:to-[#129187]
              border border-teal-400/30
              shadow-lg shadow-black/40
              flex items-center gap-3
            "
          >
            {open ? "Daha az göster" : "Tüm özellikleri göster"}
            {open ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
