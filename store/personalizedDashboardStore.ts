import { create } from "zustand";
import type {
  ModuleInstance,
  NoteItem,
  ModuleId,
  AlertItem,
} from "@/lib/personalized-dashboard/types";
import { moduleRegistry } from "@/lib/personalized-dashboard/moduleRegistry";
import { defaultModules } from "@/lib/personalized-dashboard/defaultModules";

type State = {
  zoom: number;
  panX: number;
  panY: number;

  activeModuleId: ModuleId | null;
  modules: ModuleInstance[];

  notesOpen: boolean;
  notes: NoteItem[];

  // 🔥 ADD TOOL PANEL
  addToolOpen: boolean;

  // 🔥 SIDEBAR
  sidebarOpen: boolean;

  // 🔥 ALERTS
  alerts: AlertItem[];
};

type Actions = {
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;

  setActiveModule: (id: ModuleId | null) => void;

  addModule: (m: ModuleInstance) => void;
  updateModule: (id: ModuleId, patch: Partial<ModuleInstance>) => void;
  removeModule: (id: ModuleId) => void;

  addModuleByType: (type: string) => void;

  toggleNotes: () => void;
  addNote: (text: string) => void;

  // 🔥 ADD TOOL PANEL
  toggleAddTool: () => void;

  // 🔥 SIDEBAR
  toggleSidebar: () => void;

  // 🔥 ALERT ACTIONS
  addAlert: (a: Omit<AlertItem, "id">) => void;
  toggleAlert: (id: string) => void;
  removeAlert: (id: string) => void;

  resetView: () => void;
};

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

export const usePersonalizedDashboardStore = create<State & Actions>(
  (set, get) => ({
    /* ---------------- VIEW ---------------- */
    zoom: 1,
    panX: -4500,
    panY: -4500,

    /* ---------------- MODULES ---------------- */
    activeModuleId: null,
    modules: defaultModules,

    /* ---------------- NOTES ---------------- */
    notesOpen: true,
    notes: [],

    /* ---------------- ADD TOOL ---------------- */
    addToolOpen: false,

    /* ---------------- SIDEBAR ---------------- */
    sidebarOpen: false,

    /* ---------------- ALERTS ---------------- */
    alerts: [],

    /* ---------------- ACTIONS ---------------- */
    setZoom: (zoom) => set({ zoom: clamp(zoom, 0.1, 2) }),
    setPan: (panX, panY) => set({ panX, panY }),

    setActiveModule: (activeModuleId) => set({ activeModuleId }),

    addModule: (m) =>
      set({
        modules: [m, ...get().modules],
        activeModuleId: m.id,
      }),

    addModuleByType: (type) => {
      const def = moduleRegistry[type];
      if (!def) return;

      const id = crypto.randomUUID();

      set((state) => ({
        modules: [
          {
            id,
            type: def.type,
            title: def.title,
            category: def.category,
            x: 4800 + Math.random() * 400,
            y: 4800 + Math.random() * 400,
            width: def.defaultSize.width,
            height: def.defaultSize.height,
          },
          ...state.modules,
        ],
        activeModuleId: id,
      }));
    },

    updateModule: (id, patch) =>
      set({
        modules: get().modules.map((m) =>
          m.id === id ? { ...m, ...patch } : m
        ),
      }),

    removeModule: (id) =>
      set({
        modules: get().modules.filter((m) => m.id !== id),
        activeModuleId:
          get().activeModuleId === id ? null : get().activeModuleId,
      }),

    toggleNotes: () => set({ notesOpen: !get().notesOpen }),

    addNote: (text) =>
      set({
        notes: [
          { id: crypto.randomUUID(), text, createdAt: Date.now() },
          ...get().notes,
        ],
      }),

    /* 🔥🔥 ASIL OLAY BURASI 🔥🔥 */
    toggleAddTool: () =>
      set((s) => ({
        addToolOpen: !s.addToolOpen,
        sidebarOpen: false, // 👈 Add Tool açılınca Sidebar kapanır
      })),

    toggleSidebar: () =>
      set((s) => ({
        sidebarOpen: !s.sidebarOpen,
        addToolOpen: false, // 👈 Sidebar açılınca Add Tool kapanır
      })),

    /* ---------------- ALERT ACTIONS ---------------- */
    addAlert: (a) =>
      set({
        alerts: [
          {
            id: crypto.randomUUID(),
            ...a,
          },
          ...get().alerts,
        ],
      }),

    toggleAlert: (id) =>
      set({
        alerts: get().alerts.map((a) =>
          a.id === id ? { ...a, active: !a.active } : a
        ),
      }),

    removeAlert: (id) =>
      set({
        alerts: get().alerts.filter((a) => a.id !== id),
      }),

    resetView: () => set({ zoom: 1, panX: -4500, panY: -4500 }),
  })
);
