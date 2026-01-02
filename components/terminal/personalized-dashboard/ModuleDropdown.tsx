"use client";

import { moduleRegistry } from "@/lib/personalized-dashboard/moduleRegistry";
import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";
import type { ModuleCategory } from "@/lib/personalized-dashboard/types";
import type { ModuleDefinition } from "@/lib/personalized-dashboard/moduleRegistry";

export default function ModuleDropdown({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const addModuleByType = usePersonalizedDashboardStore(
    (s) => s.addModuleByType
  );

  if (!open) return null;

  const grouped = Object.values(moduleRegistry).reduce<
    Record<ModuleCategory, ModuleDefinition[]>
  >((acc, mod) => {
    if (!acc[mod.category]) {
      acc[mod.category] = [];
    }
    acc[mod.category].push(mod);
    return acc;
  }, {} as Record<ModuleCategory, ModuleDefinition[]>);

  return (
    <div
      className="fixed top-16 left-6 z-50 w-80 max-h-[70vh]
      rounded-xl border border-white/10 bg-[#031A1C]/95 backdrop-blur
      shadow-xl overflow-y-auto"
    >
      {Object.entries(grouped).map(([category, mods]) => (
        <div key={category} className="p-2">
          <div className="px-2 py-1 text-[11px] uppercase text-white/40 font-bold">
            {category}
          </div>

          {mods.map((m) => (
            <button
              key={m.type}
              onClick={() => {
                addModuleByType(m.type);
                onClose();
              }}
              className="w-full text-left px-3 py-2 rounded-md
                hover:bg-teal-400/10 transition"
            >
              <div className="text-sm font-semibold text-white">{m.title}</div>
              <div className="text-xs text-white/50">{m.description}</div>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
