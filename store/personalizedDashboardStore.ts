import { create } from "zustand";
import type {
  ModuleInstance,
  NoteItem,
  ModuleId,
  AlertItem,
} from "@/lib/personalized-dashboard/types";
import { moduleRegistry } from "@/lib/personalized-dashboard/moduleRegistry";
import { defaultModules } from "@/lib/personalized-dashboard/defaultModules";

/* WORLD CONSTANTS */
export const MAX_ZOOM = 3;
export const WORLD_WIDTH = 4000;
export const WORLD_HEIGHT = 2250;

/* Calculate minimum zoom to fit entire world in viewport */
export function calculateMinZoom(viewportW: number, viewportH: number): number {
  const minZoomX = viewportW / WORLD_WIDTH;
  const minZoomY = viewportH / WORLD_HEIGHT;
  return Math.max(minZoomX, minZoomY);
}

/* STATE TYPES */
type State = {
  zoom: number;
  panX: number;
  panY: number;

  notesOpen: boolean;
  notes: NoteItem[];
  notesHeight: number;

  topBarHeight: number;
  notesBarHeight: number;

  activeModuleId: ModuleId | null;
  modules: ModuleInstance[];

  addToolOpen: boolean;
  sidebarOpen: boolean;

  alerts: AlertItem[];
  uiBlocked: boolean;
};

type Actions = {
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  resetView: () => void;

  toggleNotes: () => void;
  addNote: (text: string) => void;
  setNotesHeight: (h: number) => void;

  setTopBarHeight: (h: number) => void;
  setNotesBarHeight: (h: number) => void;
  removeNote: (id: string) => void;

  setActiveModule: (id: ModuleId | null) => void;
  addModule: (m: ModuleInstance) => void;
  addModuleByType: (type: string, x?: number, y?: number) => void;
  updateModule: (id: ModuleId, patch: Partial<ModuleInstance>) => void;
  removeModule: (id: ModuleId) => void;

  toggleAddTool: () => void;
  toggleSidebar: () => void;

  addAlert: (a: Omit<AlertItem, "id">) => void;
  toggleAlert: (id: string) => void;
  removeAlert: (id: string) => void;

  setUIBlocked: (v: boolean) => void;
};

/* ZUSTAND STORE */
export const usePersonalizedDashboardStore = create<State & Actions>(
  (set, get) => ({
    /* INITIAL STATE */
    uiBlocked: false,
    zoom: 1,
    panX: 0,
    panY: 0,

    notesOpen: true,
    notes: [],
    notesHeight: 260,

    topBarHeight: 0,
    notesBarHeight: 0,

    activeModuleId: null,
    modules: defaultModules,

    addToolOpen: false,
    sidebarOpen: false,
    alerts: [],

    /* ACTIONS */
    setUIBlocked: (v) => set({ uiBlocked: v }),

    /* Set zoom with min/max bounds based on viewport */
    setZoom: (zoom) => {
      if (typeof window === "undefined") {
        set({ zoom: Math.min(MAX_ZOOM, Math.max(0.1, zoom)) });
        return;
      }

      const { topBarHeight, notesBarHeight } = get();
      const viewportW = window.innerWidth;
      const viewportH = window.innerHeight - topBarHeight - notesBarHeight;
      const minZoom = calculateMinZoom(viewportW, viewportH);

      set({ zoom: Math.min(MAX_ZOOM, Math.max(minZoom, zoom)) });
    },

    setPan: (panX, panY) => set({ panX, panY }),
    resetView: () => set({ zoom: 1, panX: 0, panY: 0 }),

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
    removeNote: (id) =>
      set({
        notes: get().notes.filter((n) => n.id !== id),
      }),

    /* UI DIMENSIONS */
    setTopBarHeight: (h) => set({ topBarHeight: h }),
    setNotesBarHeight: (h) => set({ notesBarHeight: h }),

    /* MODULES */
    setActiveModule: (activeModuleId) => set({ activeModuleId }),

    addModule: (m) =>
      set({
        modules: [m, ...get().modules],
        activeModuleId: m.id,
      }),

    /* Add module at viewport center or specified position */
    addModuleByType: (type, x, y) => {
      const def = moduleRegistry[type];
      if (!def) return;

      const id = crypto.randomUUID();

      const viewportWidth = window.innerWidth;
      const viewportHeight =
        window.innerHeight - get().topBarHeight - get().notesBarHeight;

      // Calculate world coordinates of viewport center
      const worldCenterX = (-get().panX + viewportWidth / 2) / get().zoom;
      const worldCenterY = (-get().panY + viewportHeight / 2) / get().zoom;

      const moduleX = worldCenterX - def.defaultSize.width / 2;
      const moduleY = worldCenterY - def.defaultSize.height / 2;

      set((state) => ({
        modules: [
          {
            id,
            type: def.type,
            title: def.title,
            category: def.category,
            x: x ?? moduleX,
            y: y ?? moduleY,
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

    /* UI PANELS */
    toggleAddTool: () =>
      set((s) => ({
        addToolOpen: !s.addToolOpen,
        sidebarOpen: false,
      })),

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