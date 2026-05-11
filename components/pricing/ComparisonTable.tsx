"use client";

import { useState } from "react";
import { Check, X, Lock, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { PRICING_TABLE } from "@/data/pricingTable";

function renderCell(value: string) {
  if (value === "check") return <Check className="text-[#2563EB] w-4 h-4" />;
  if (value === "x") return <X className="text-red-400/50 w-4 h-4" />;
  if (value === "lock") return <Lock className="text-[#71717A]/50 w-4 h-4" />;
  if (value === "plus") return <Plus className="text-[#2563EB]/50 w-4 h-4" />;
  return <span className="text-foreground/15 text-sm">—</span>;
}

const COLS = ["Trader", "Pro Trader", "Enterprise", "Add-on"];

export default function ComparisonTable() {
  const [open, setOpen] = useState(false);
  const visibleCount = 8;

  const allRows = PRICING_TABLE.flatMap((cat) =>
    cat.rows.map((row) => ({ ...row, category: cat.category }))
  );

  const visibleRows = open ? allRows : allRows.slice(0, visibleCount);

  /* group visible rows by category for separator headers */
  const grouped: { category: string; rows: typeof allRows }[] = [];
  for (const row of visibleRows) {
    const last = grouped[grouped.length - 1];
    if (last && last.category === row.category) {
      last.rows.push(row);
    } else {
      grouped.push({ category: row.category, rows: [row] });
    }
  }

  return (
    <section className="w-full pt-10 pb-20 bg-background text-foreground">
      {/* Section header */}
      <div className="text-center mb-10 px-4">
        <span
          className="font-bold uppercase text-[#2563EB]"
          style={{ fontSize: "0.68rem", letterSpacing: "0.16em" }}
        >
          Plans
        </span>
        <h2
          className="font-extrabold text-foreground mt-2"
          style={{ fontSize: "clamp(1.75rem, 3.8vw, 2.7rem)", letterSpacing: "-0.025em", lineHeight: 1.15 }}
        >
          Compare{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #2563EB 0%, #00C8FF 100%)" }}
          >
            features
          </span>
        </h2>
      </div>

      <div className="w-full rounded-xl border border-border-sub">

        {/* ── Mobile header (< sm) ── */}
        <div className="sm:hidden sticky top-16 z-50 border-b border-border-sub bg-surface/95 backdrop-blur-md rounded-t-xl">
          <div className="grid px-3 py-3" style={{ gridTemplateColumns: "1.8fr 1fr 1fr 1fr 1fr" }}>
            <div className="font-bold text-[#71717A] uppercase" style={{ fontSize: "0.6rem", letterSpacing: "0.1em" }}>
              Feature
            </div>
            {[["Trader", "Trader"], ["Pro Trader", "Pro"], ["Enterprise", "Ent."], ["Add-on", "Add-on"]].map(([, short]) => (
              <div key={short} className="text-center font-bold text-foreground" style={{ fontSize: "0.65rem" }}>
                {short}
              </div>
            ))}
          </div>
        </div>

        {/* ── Desktop header (≥ sm) ── */}
        <div className="hidden sm:block sticky top-16 lg:top-20 z-50 border-b border-border-sub bg-surface/95 backdrop-blur-md rounded-t-xl">
          <div className="grid px-5 xl:px-8 py-4" style={{ gridTemplateColumns: "2.5fr 1fr 1fr 1fr 1fr 2fr" }}>
            <div className="font-bold text-[#71717A] uppercase" style={{ fontSize: "0.68rem", letterSpacing: "0.12em" }}>
              Feature
            </div>
            {COLS.map((col) => (
              <div key={col} className="text-center font-bold text-foreground" style={{ fontSize: "0.78rem" }}>
                {col}
              </div>
            ))}
            <div className="text-center font-bold text-[#71717A] uppercase" style={{ fontSize: "0.68rem", letterSpacing: "0.12em" }}>
              Description
            </div>
          </div>
        </div>

        {/* Rows grouped by category */}
        <div className="rounded-b-xl overflow-hidden">
          {grouped.map((group) => (
            <div key={group.category}>
              {/* Category separator */}
              <div
                className="px-3 sm:px-5 xl:px-8 py-2.5 border-b border-border-sub"
                style={{ background: "rgba(37,99,235,0.06)" }}
              >
                <span className="font-bold uppercase text-[#2563EB]" style={{ fontSize: "0.65rem", letterSpacing: "0.14em" }}>
                  {group.category}
                </span>
              </div>

              {/* Feature rows */}
              {group.rows.map((row, i) => (
                <div key={i} className="border-b border-border-sub last:border-b-0 hover:bg-foreground/2 transition-colors">

                  {/* Mobile row (< sm): description below feature name */}
                  <div
                    className="sm:hidden grid px-3 py-3 items-start"
                    style={{ gridTemplateColumns: "1.8fr 1fr 1fr 1fr 1fr" }}
                  >
                    <div className="pr-2">
                      <div className="text-[0.75rem] font-medium text-foreground/85 leading-snug">{row.feature}</div>
                      {row.desc && (
                        <div className="text-[0.65rem] text-[#71717A] leading-snug mt-0.5">{row.desc}</div>
                      )}
                    </div>
                    <div className="flex justify-center pt-0.5">{renderCell(row.trader)}</div>
                    <div className="flex justify-center pt-0.5">{renderCell(row.proTrader)}</div>
                    <div className="flex justify-center pt-0.5">{renderCell(row.enterprise)}</div>
                    <div className="flex justify-center pt-0.5">{renderCell(row.addOn)}</div>
                  </div>

                  {/* Desktop row (≥ sm): full 6-col with description */}
                  <div
                    className="hidden sm:grid px-5 xl:px-8 py-3.5"
                    style={{ gridTemplateColumns: "2.5fr 1fr 1fr 1fr 1fr 2fr" }}
                  >
                    <div className="text-[0.82rem] font-medium text-foreground/85 flex items-center">
                      {row.feature}
                    </div>
                    <div className="flex justify-center items-center">{renderCell(row.trader)}</div>
                    <div className="flex justify-center items-center">{renderCell(row.proTrader)}</div>
                    <div className="flex justify-center items-center">{renderCell(row.enterprise)}</div>
                    <div className="flex justify-center items-center">{renderCell(row.addOn)}</div>
                    <div className="text-[0.78rem] text-[#71717A] leading-[1.6] flex items-center pl-4">
                      {row.desc}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Show more/less button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1a7ee8] px-6 py-3 rounded-lg text-white font-semibold text-[0.9rem] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(37,99,235,0.38)] cursor-pointer"
        >
          {open ? "Show less" : "Show all features"}
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
    </section>
  );
}
