import { create } from "zustand";
import type {
  ModuleInstance,
  NoteItem,
  ModuleId,
  AlertItem,
} from "@/lib/personalized-dashboard/types";
import { moduleRegistry } from "@/lib/personalized-dashboard/moduleRegistry";
import { defaultModules } from "@/lib/personalized-dashboard/defaultModules";

/* ================= TYPES ================= */

type State = {
  zoom: number;
  panX: number;
  panY: number;

  /* NOTES */
  notesOpen: boolean;
  notes: NoteItem[];
  notesHeight: number;

  /* MODULES */
  activeModuleId: ModuleId | null;
  modules: ModuleInstance[];

  /* ADD TOOL */
  addToolOpen: boolean;

  /* SIDEBAR */
  sidebarOpen: boolean;

  /* ALERTS */
  alerts: AlertItem[];
};

type Actions = {
  /* VIEW */
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  resetView: () => void;

  /* NOTES */
  toggleNotes: () => void;
  addNote: (text: string) => void;
  setNotesHeight: (h: number) => void;

  /* MODULES */
  setActiveModule: (id: ModuleId | null) => void;
  addModule: (m: ModuleInstance) => void;
  addModuleByType: (type: string, x?: number, y?: number) => void;
  updateModule: (id: ModuleId, patch: Partial<ModuleInstance>) => void;
  removeModule: (id: ModuleId) => void;

  /* ADD TOOL */
  toggleAddTool: () => void;

  /* SIDEBAR */
  toggleSidebar: () => void;

  /* ALERTS */
  addAlert: (a: Omit<AlertItem, "id">) => void;
  toggleAlert: (id: string) => void;
  removeAlert: (id: string) => void;
};

/* ================= HELPERS ================= */

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

/* ================= STORE ================= */

export const usePersonalizedDashboardStore = create<State & Actions>(
  (set, get) => ({
    /* ---------- VIEW ---------- */
    zoom: 1,
    panX: -4500,
    panY: -4500,

    /* ---------- NOTES ---------- */
    notesOpen: true,
    notes: [],
    notesHeight: 260,

    /* ---------- MODULES ---------- */
    activeModuleId: null,
    modules: defaultModules,

    /* ---------- ADD TOOL ---------- */
    addToolOpen: false,

    /* ---------- SIDEBAR ---------- */
    sidebarOpen: false,

    /* ---------- ALERTS ---------- */
    alerts: [],

    /* ================= ACTIONS ================= */

    /* VIEW */
    setZoom: (zoom) => set({ zoom: clamp(zoom, 0.1, 2) }),
    setPan: (panX, panY) => set({ panX, panY }),
    resetView: () => set({ zoom: 1, panX: -4500, panY: -4500 }),

    /* NOTES */
    toggleNotes: () => set({ notesOpen: !get().notesOpen }),
    setNotesHeight: (h) => set({ notesHeight: h }),
    addNote: (text) =>
      set({
        notes: [
          { id: crypto.randomUUID(), text, createdAt: Date.now() },
          ...get().notes,
        ],
      }),

    /* MODULES */
    setActiveModule: (activeModuleId) => set({ activeModuleId }),

    addModule: (m) =>
      set({
        modules: [m, ...get().modules],
        activeModuleId: m.id,
      }),

    addModuleByType: (type, x, y) => {
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
            x: x ?? 4800 + Math.random() * 400,
            y: y ?? 4800 + Math.random() * 400,
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

    /* ADD TOOL */
    toggleAddTool: () =>
      set((s) => ({
        addToolOpen: !s.addToolOpen,
        sidebarOpen: false,
      })),

    /* SIDEBAR */
    toggleSidebar: () =>
      set((s) => ({
        sidebarOpen: !s.sidebarOpen,
        addToolOpen: false,
      })),

    /* ALERTS */
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
  })
);
