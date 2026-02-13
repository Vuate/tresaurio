"use client";

import { useState } from "react";
import {
  Check,
  X,
  Lock,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { PRICING_TABLE } from "@/data/pricingTable";

function renderCell(value: string) {
  if (value === "check") return <Check className="text-emerald-400 w-4 h-4 xl:w-5 xl:h-5 2xl:w-5 2xl:h-5" />;
  if (value === "x") return <X className="text-gray-500 w-4 h-4 xl:w-5 xl:h-5 2xl:w-5 2xl:h-5" />;
  if (value === "lock") return <Lock className="text-gray-400 w-4 h-4 xl:w-5 xl:h-5 2xl:w-5 2xl:h-5" />;
  if (value === "plus") return <Plus className="text-teal-300 w-4 h-4 xl:w-5 xl:h-5 2xl:w-5 2xl:h-5" />;
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
    <section className="w-full pt-8 xl:pt-10 2xl:pt-12 pb-20 xl:pb-24 2xl:pb-28 bg-[#031A1C] text-white">
      <div className="w-full px-0">
        <h2 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold text-center mb-8 xl:mb-10 2xl:mb-12">
           Compare <span className="text-teal-400">features</span>
        </h2>

        <div className="w-full bg-[#041F20] border-t border-white/10">
          <div
            className="
              sticky
              top-[64px] xl:top-[72px] 2xl:top-[80px]
              z-50
              bg-[#041F20]
              border-b border-white/10
            "
          >
            <div
              className="
                grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr_2.5fr]
                py-4 xl:py-5 2xl:py-6
                px-4 xl:px-6 2xl:px-8
                text-gray-100 
                text-sm xl:text-base 2xl:text-lg
                font-semibold
              "
            >
              <div>Feature</div>
              <div className="text-center">Trader</div>
              <div className="text-center">Pro Trader</div>
              <div className="text-center">Enterprise</div>
              <div className="text-center">Add-on</div>
              <div className="text-center">Description</div>
            </div>
          </div>

          <div>
            {visibleRows.map((row, i) => (
              <div
                key={i}
                className="
                  grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr_2.5fr]
                  py-4 xl:py-5 2xl:py-6
                  px-4 xl:px-6 2xl:px-8
                  border-b border-white/5
                "
              >
                <div className="font-medium text-xs xl:text-sm 2xl:text-base text-gray-200">
                  {row.feature}
                </div>

                <div className="flex justify-center items-center">
                  {renderCell(row.trader)}
                </div>

                <div className="flex justify-center items-center">
                  {renderCell(row.proTrader)}
                </div>

                <div className="flex justify-center items-center">
                  {renderCell(row.enterprise)}
                </div>

                <div className="flex justify-center items-center">
                  {renderCell(row.addOn)}
                </div>

                <div className="text-gray-400 text-xs xl:text-sm 2xl:text-base leading-relaxed">
                  {row.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BUTTON */}
        <div className="flex justify-center mt-8 xl:mt-10 2xl:mt-12">
          <button
            onClick={() => setOpen(!open)}
            className="
              px-8 xl:px-10 2xl:px-12
              py-3 xl:py-4 2xl:py-5
              rounded-xl xl:rounded-2xl 2xl:rounded-2xl
              text-sm xl:text-base 2xl:text-lg
              font-semibold
              text-white
              bg-black/20
              border border-white/20
              hover:bg-white/10
              transition-all duration-300
              flex items-center gap-2 xl:gap-2.5 2xl:gap-3
              cursor-pointer
            "
          >
            {open ? "Show less" : "Show all features"}

            {open ? (
              <ChevronUp className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-5 2xl:h-5" />
            ) : (
              <ChevronDown className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-5 2xl:h-5" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}