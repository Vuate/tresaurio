"use client";

import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";

export default function TopBar() {
  const toggleAddTool = usePersonalizedDashboardStore((s) => s.toggleAddTool);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-14
        flex items-center justify-between px-6
        bg-[#031A1C]/95 backdrop-blur
        border-b border-white/10"
    >
      <div className="flex items-center gap-4">
        <div className="text-lg font-extrabold text-teal-400">💎 Treasurio</div>

        <button
          onClick={toggleAddTool}
          className="px-4 py-1.5 rounded-lg
            bg-teal-400/10 border border-teal-400/30
            text-teal-300 text-sm font-semibold
            hover:bg-teal-400/20 transition"
        >
          + Add Tool
        </button>
      </div>

      <div />
    </div>
  );
}
