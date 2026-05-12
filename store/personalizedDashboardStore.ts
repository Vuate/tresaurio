import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ModuleInstance,
  NoteItem,
  ModuleId,
  AlertItem,
} from "@/lib/personalized-dashboard/types";
import { moduleRegistry } from "@/lib/personalized-dashboard/moduleRegistry";
import { defaultModules } from "@/lib/personalized-dashboard/defaultModules";
import { useDashboardNotificationStore } from "@/store/dashboardNotificationStore";
import { apiFetch } from "@/lib/api-client";

export const MAX_ZOOM = 2;
export const WORLD_WIDTH = 8000;
export const WORLD_HEIGHT = 4500;

// Calculates the minimum zoom level so the world always fills the viewport.
export function calculateMinZoom(viewportW: number, viewportH: number): number {
  const minZoomX = viewportW / WORLD_WIDTH;
  const minZoomY = viewportH / WORLD_HEIGHT;
  return Math.max(minZoomX, minZoomY);
}

type State = {
  zoom: number;
  panX: number;
  panY: number;
  
lockedModules: Set<ModuleId>;

  notesOpen: boolean;
  notes: NoteItem[];
  notesHeight: number;

  topBarHeight: number;
  notesBarHeight: number;

  activeModuleId: ModuleId | null;
  modules: ModuleInstance[];

  addToolOpen: boolean;
  sidebarOpen: boolean;
  userMenuOpen: boolean;
  templatesOpen: boolean;

  alerts: AlertItem[];
  uiBlocked: boolean;
  swapSourceId: string | null;
  sizeSourceId: string | null;

  favorites: { type: string; favoritedAt: number }[];

  // Templates
  templates: { id: string; name: string; createdAt: string; updatedAt: string }[];

  lastResetAt: number;
};

type Actions = {
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  resetView: () => void;

  toggleModuleLock: (id: ModuleId) => void; 
  isModuleLocked: (id: ModuleId) => boolean; 

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
  setUserMenuOpen: (open: boolean) => void;
  toggleTemplates: () => void;

  addAlert: (a: Omit<AlertItem, "id">) => void;
  toggleAlert: (id: string) => void;
  removeAlert: (id: string) => void;

  setUIBlocked: (v: boolean) => void;
  setSwapSource: (id: string | null) => void;
  swapModules: (id1: string, id2: string) => void;
  resetDashboard: () => Promise<void>;
  setSizeSource: (id: string | null) => void;
  applySizeFromSource: (sourceId: string, targetId: string) => void;

  _hydrated: boolean;
  setHydrated: (v: boolean) => void;
  loadFromDB: () => Promise<void>;
  saveToDB: () => Promise<void>;

  fetchTemplates: () => Promise<void>;
  saveTemplate: (name: string) => Promise<void>;
  loadTemplate: (id: string) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  clearAllTemplates: () => Promise<void>;
  closeAllPanels: () => void;
  loadFavoritesFromDB: () => Promise<void>;
  toggleFavorite: (type: string) => void;
  clearFavorites: () => void;

};

// Debounces DB save calls — waits 3 seconds after the last change before saving.
// Prevents excessive API calls on rapid state updates (e.g. dragging modules).
let saveTimeout: NodeJS.Timeout | null = null;
function debouncedSaveToDB() {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    usePersonalizedDashboardStore.getState().saveToDB();
  }, 3000);
}

export const usePersonalizedDashboardStore = create<State & Actions>()(
  persist(
  (set, get) => ({
    lockedModules: new Set(),
    uiBlocked: false,
    swapSourceId: null,
    sizeSourceId: null,
    zoom: 0,
    panX: 0,
    panY: 0,

    notesOpen: false,
    notes: [],
    notesHeight: 260,

    topBarHeight: 0,
    notesBarHeight: 0,

    activeModuleId: null,
    modules: defaultModules,

    addToolOpen: false,
    sidebarOpen: false,
    userMenuOpen: false,
    templatesOpen: false,
    alerts: [],
    favorites: [],
    templates: [],
    lastResetAt: 0,

// Toggles the locked state of a module. Locked modules cannot be moved or resized.
toggleModuleLock: (id) => {
  const locked = new Set(get().lockedModules);
      if (locked.has(id)) {
        locked.delete(id);
      } else {
        locked.add(id);
      }
      set({ lockedModules: locked });
        debouncedSaveToDB();
    },

    isModuleLocked: (id) => get().lockedModules.has(id),
    
    setUIBlocked: (v) => set({ uiBlocked: v }),
    setSwapSource: (id) => set({ swapSourceId: id }),
    setSizeSource: (id) => set({ sizeSourceId: id }),
    // Copies the width and height of a source module to a target module.
// Clamps position to ensure the resized module stays within world boundaries.
    applySizeFromSource: (sourceId, targetId) => {
  const modules = get().modules;
  const source = modules.find(m => m.id === sourceId);
  const target = modules.find(m => m.id === targetId);
  if (!source || !target) return;
  set({
    modules: modules.map(m =>
      m.id === targetId ? {
        ...m,
        width: source.width,
        height: source.height,
        x: Math.max(0, Math.min(target.x, WORLD_WIDTH - source.width)),
        y: Math.max(0, Math.min(target.y, WORLD_HEIGHT - source.height)),
      } : m
    ),
    sizeSourceId: null,
  });
},

// Swaps the positions of two modules on the canvas.
// Boundary checks ensure neither module goes out of the world bounds after swap.
swapModules: (id1, id2) => {
  const modules = get().modules;
  const m1 = modules.find(m => m.id === id1);
  const m2 = modules.find(m => m.id === id2);
  if (!m1 || !m2) return;

 
  const newX1 = Math.max(0, Math.min(m2.x, WORLD_WIDTH - m1.width));
  const newY1 = Math.max(0, Math.min(m2.y, WORLD_HEIGHT - m1.height));

  const newX2 = Math.max(0, Math.min(m1.x, WORLD_WIDTH - m2.width));
  const newY2 = Math.max(0, Math.min(m1.y, WORLD_HEIGHT - m2.height));

  set({
    modules: modules.map(m => {
      if (m.id === id1) return { ...m, x: newX1, y: newY1 };
      if (m.id === id2) return { ...m, x: newX2, y: newY2 };
      return m;
    }),
    swapSourceId: null,
  });
},

// Clears all modules, notes, and alerts. Resets zoom to fit the viewport and syncs to DB.
resetDashboard: async () => {
  const { topBarHeight, notesBarHeight } = get();
  
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight - topBarHeight - notesBarHeight;
  const minZoom = calculateMinZoom(viewportW, viewportH);
  const centerPanX = (viewportW - WORLD_WIDTH * minZoom) / 2;
  const centerPanY = (viewportH - WORLD_HEIGHT * minZoom) / 2;
    set({
      modules: [],
      lockedModules: new Set(),
      notes: [],
      alerts: [],
      zoom: minZoom,
      panX: centerPanX,
      panY: centerPanY,
      activeModuleId: null,
      lastResetAt: Date.now(),
    });
    try {
      await apiFetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          layout: {
            modules: [],
            notes: [],
            alerts: [],
            zoom: minZoom,
            panX: centerPanX,
            panY: centerPanY,
            lockedModules: [],
          },
        }),
      });
            useDashboardNotificationStore.getState().push({
        type: "info",
        title: "Dashboard Reset",
        description: "Dashboard has been reset to default.",
      });
    } catch {
      useDashboardNotificationStore.getState().push({
        type: "error",
        title: "Reset Failed",
        description: "Dashboard could not be reset.",
      });
    }
  },
    _hydrated: false,
    setHydrated: (v) => set({ _hydrated: v }),

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

    toggleNotes: () => set({       notesOpen: !get().notesOpen,
      userMenuOpen: false }),
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

    setTopBarHeight: (h) => set({ topBarHeight: h }),
    setNotesBarHeight: (h) => set({ notesBarHeight: h }),

    setActiveModule: (activeModuleId) => set({ activeModuleId }),

    addModule: (m) =>
      set({
        modules: [m, ...get().modules],
        activeModuleId: m.id,
      }),
      
// Creates a new module instance from the registry and places it at the center of the current viewport.
// Falls back to provided x/y coordinates if given.
    addModuleByType: (type, x, y) => {
      const def = moduleRegistry[type];
      if (!def) return;

      const id = crypto.randomUUID();

      const viewportWidth = window.innerWidth;
      const viewportHeight =
        window.innerHeight - get().topBarHeight - get().notesBarHeight;

      const worldCenterX = (-get().panX + viewportWidth / 2) / get().zoom;
      const worldCenterY = (-get().panY + viewportHeight / 2) / get().zoom;

      const moduleX = Math.max(0, Math.min(worldCenterX - def.defaultSize.width / 2, WORLD_WIDTH - def.defaultSize.width));
      const moduleY = Math.max(0, Math.min(worldCenterY - def.defaultSize.height / 2, WORLD_HEIGHT - def.defaultSize.height));

      set((state) => ({
        modules: [
          {
            id,
            type: def.type,
            title: def.title,
            category: def.category,
            x: Math.max(0, Math.min(x ?? moduleX, WORLD_WIDTH - def.defaultSize.width)),
            y: Math.max(0, Math.min(y ?? moduleY, WORLD_HEIGHT - def.defaultSize.height)),
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
    swapSourceId: get().swapSourceId === id ? null : get().swapSourceId,
    sizeSourceId: get().sizeSourceId === id ? null : get().sizeSourceId,
      }),

    toggleAddTool: () =>
      set((s) => ({
        addToolOpen: !s.addToolOpen,
        sidebarOpen: false,
        templatesOpen: false, 
      })),

    toggleSidebar: () =>
      set((s) => ({
        sidebarOpen: !s.sidebarOpen,
        addToolOpen: false,
        templatesOpen: false, 
      })),

    toggleTemplates: () =>
      set((s) => ({
        templatesOpen: !s.templatesOpen,
        addToolOpen: false,
        sidebarOpen: false,
      })),


    // Opening the user menu automatically closes the notes panel to prevent overlap.
    setUserMenuOpen: (userMenuOpen) => set({ 
      userMenuOpen,
      notesOpen: userMenuOpen ? false : get().notesOpen 
    }),


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

    // Adds to the front of the favorites list with a timestamp, or removes if already favorited.
    toggleFavorite: (type) => {
      const existing = get().favorites.find((f) => f.type === type);
      const updated = existing
        ? get().favorites.filter((f) => f.type !== type)
        : [{ type, favoritedAt: Date.now() }, ...get().favorites];
      set({ favorites: updated });
      apiFetch("/api/dashboard/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorites: updated }),
      }).catch((err) => console.error("[Favorites] Save failed:", err));
    },

    clearFavorites: () => {
      set({ favorites: [] });
      apiFetch("/api/dashboard/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorites: [] }),
      }).catch((err) => console.error("[Favorites] Clear failed:", err));
    },

    loadFavoritesFromDB: async () => {
      try {
        const res = await fetch("/api/dashboard/favorites");
        if (!res.ok) return;
        const { favorites } = await res.json();
        if (Array.isArray(favorites)) set({ favorites });
      } catch (err) {
        console.error("[Favorites] Load failed:", err);
      }
    },


    // DB sync — load (only if localStorage is empty, DB takes over)
loadFromDB: async () => {
  try {
    // Wait for persist hydration to complete
    const waitForHydration = () =>
      new Promise<void>((resolve) => {
        const check = () => {
          if (get()._hydrated) return resolve();
          setTimeout(check, 50);
        };
        check();
      });
    await waitForHydration();

    // If localStorage already has modules (not default), skip DB load
    const currentModules = get().modules;
    const hasLocalData =
      currentModules.length > 0 &&
      JSON.stringify(currentModules) !== JSON.stringify(defaultModules);

    if (hasLocalData) {
      console.log("[Dashboard] Using localStorage data");
      return;
    }

    // No local data → try DB
    const res = await fetch("/api/dashboard");
    if (!res.ok) return;
    const { layout } = await res.json();
    if (!layout) return;

const { modules, notes, alerts, lockedModules, uiBlocked } = layout;
if (modules && modules.length > 0) {
  const { topBarHeight, notesBarHeight } = get();
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight - topBarHeight - notesBarHeight;
  const minZoom = calculateMinZoom(viewportW, viewportH);
  const centerPanX = (viewportW - WORLD_WIDTH * minZoom) / 2;
  const centerPanY = (viewportH - WORLD_HEIGHT * minZoom) / 2;
  const restoredZoom = Math.max(minZoom, layout.zoom ?? minZoom);
  const scaledWorldW = WORLD_WIDTH * restoredZoom;
  const scaledWorldH = WORLD_HEIGHT * restoredZoom;
  const minPanX = viewportW - scaledWorldW;
  const minPanY = viewportH - scaledWorldH;

  let restoredPanX = layout.panX ?? centerPanX;
  let restoredPanY = layout.panY ?? centerPanY;
  restoredPanX = Math.min(0, Math.max(minPanX, restoredPanX));
  restoredPanY = Math.min(0, Math.max(minPanY, restoredPanY));
  if (scaledWorldW < viewportW) restoredPanX = (viewportW - scaledWorldW) / 2;
  if (scaledWorldH < viewportH) restoredPanY = (viewportH - scaledWorldH) / 2;

  set({
    modules,
    ...(notes && { notes }),
    ...(alerts && { alerts }),
    zoom: restoredZoom,
    panX: restoredPanX,
    panY: restoredPanY,
    ...(lockedModules && { lockedModules: new Set(lockedModules) }),
    ...(typeof uiBlocked === "boolean" && { uiBlocked }),
  });

      console.log("[Dashboard] Loaded from DB");
    }
  } catch (err) {
    console.error("[Dashboard] DB load failed:", err);
  }
},

    // DB sync — save
saveToDB: async () => {
  try {
    const { modules, notes, alerts, zoom, panX, panY, lockedModules, uiBlocked } = get();
    await apiFetch("/api/dashboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
layout: {
          modules,
          notes,
          alerts,
          zoom,
          panX,
          panY,
          lockedModules: Array.from(lockedModules),
          uiBlocked,
        },

      }),
    });
  } catch (err) {
    console.error("[Dashboard] DB save failed:", err);
  }
},

    // Templates
    fetchTemplates: async () => {
      try {
        const res = await fetch("/api/dashboard/templates");
        if (!res.ok) return;
        const { templates } = await res.json();
        set({ templates: templates || [] });
      } catch (err) {
        console.error("[Dashboard] Fetch templates failed:", err);
      }
    },

    saveTemplate: async (name: string) => {
      try {
        const { modules, zoom, panX, panY, lockedModules, uiBlocked  } = get();
        const res = await apiFetch("/api/dashboard/templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            layout: { modules, zoom, panX, panY, lockedModules: Array.from(lockedModules), uiBlocked, canvasWidth: WORLD_WIDTH, canvasHeight: WORLD_HEIGHT },
          }),
        });
if (!res.ok) throw new Error("Failed to save template");
        // Refresh list
        await get().fetchTemplates();
      } catch (err) {
        console.error("[Dashboard] Save template failed:", err);
          throw err;
      }
    },

loadTemplate: async (id: string) => {
  try {
    const res = await fetch(`/api/dashboard/templates/${id}`);
if (!res.ok) throw new Error("Failed to load template");
    const { template } = await res.json();
    if (!template?.layout) return;

    // If the template was saved on a different canvas size, scale all module positions and sizes proportionally.
    const { modules: rawModules, lockedModules, uiBlocked, canvasWidth: savedW, canvasHeight: savedH } = template.layout;

    const sourceW = savedW ?? WORLD_WIDTH;
    const sourceH = savedH ?? WORLD_HEIGHT;
    const scaleX = WORLD_WIDTH / sourceW;
    const scaleY = WORLD_HEIGHT / sourceH;

    const modules = rawModules?.map((m: any) => {
      const newWidth = m.width * scaleX;
      const newHeight = m.height * scaleY;
      return {
        ...m,
        x: Math.max(0, Math.min(m.x * scaleX, WORLD_WIDTH - newWidth)),
        y: Math.max(0, Math.min(m.y * scaleY, WORLD_HEIGHT - newHeight)),
        width: newWidth,
        height: newHeight,
      };
    });

    const { topBarHeight, notesBarHeight } = get();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight - topBarHeight - notesBarHeight;
    const minZoom = calculateMinZoom(viewportW, viewportH);

     const centerPanX = (viewportW - WORLD_WIDTH * minZoom) / 2;
    const centerPanY = (viewportH - WORLD_HEIGHT * minZoom) / 2;
    set({
      ...(modules && { modules }),
        lockedModules: lockedModules ? new Set(lockedModules) : new Set(),
      ...(typeof uiBlocked === "boolean" && { uiBlocked }),
      zoom: minZoom,
      panX: centerPanX,
      panY: centerPanY,
    });
  } catch (err) {
    console.error("[Dashboard] Load template failed:", err);
      throw err;
  }
},

    deleteTemplate: async (id: string) => {
      try {
        const res = await apiFetch(`/api/dashboard/templates/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) return;
        set({ templates: get().templates.filter((t) => t.id !== id) });
      } catch (err) {
        console.error("[Dashboard] Delete template failed:", err);
      }
    },

    clearAllTemplates: async () => {
      const ids = get().templates.map((t) => t.id);
      for (const id of ids) {
        await apiFetch(`/api/dashboard/templates/${id}`, { method: "DELETE" });
      }
      set({ templates: [] });
    },


    closeAllPanels: () =>
  set({
    sidebarOpen: false,
    addToolOpen: false,
    templatesOpen: false,
  }),

  }),
  {
    // Only these fields are persisted to localStorage. Transient UI state is excluded.
    name: "dashboard-layout",
    partialize: (state) => ({
      modules: state.modules,
      notes: state.notes,
      alerts: state.alerts,
      zoom: state.zoom,
      panX: state.panX,
      panY: state.panY,
      lockedModules: Array.from(state.lockedModules),
      uiBlocked: state.uiBlocked,
    }),

        storage: {
      getItem: (name) => {
        const str = localStorage.getItem(name);
        if (!str) return null;
        const parsed = JSON.parse(str);
        if (parsed?.state?.lockedModules) {
          parsed.state.lockedModules = new Set(parsed.state.lockedModules);
        }
        return parsed;
      },
      setItem: (name, value) => {
        localStorage.setItem(name, JSON.stringify(value));
      },
      removeItem: (name) => {
        localStorage.removeItem(name);
      },
    },
onRehydrateStorage: () => {
  return (state, error) => {
    if (error) {
      console.error("[Dashboard] localStorage hydration failed:", error);
    }
    
    // Mark hydration as complete
    state?.setHydrated(true);
    
   // Clamp zoom to saved value or minimum (whichever is larger), restore saved pan within valid bounds
    if (state && typeof window !== "undefined") {
      const topBarHeight = state.topBarHeight || 0;
      const notesBarHeight = state.notesBarHeight || 0;
      const viewportW = window.innerWidth;
      const viewportH = window.innerHeight - topBarHeight - notesBarHeight;
      const minZoom = calculateMinZoom(viewportW, viewportH);
      const centerPanX = (viewportW - WORLD_WIDTH * minZoom) / 2;
      const centerPanY = (viewportH - WORLD_HEIGHT * minZoom) / 2;
      
      const clampedZoom = Math.max(minZoom, state.zoom ?? minZoom);
      state.zoom = clampedZoom;

      const scaledW = WORLD_WIDTH * clampedZoom;
      const scaledH = WORLD_HEIGHT * clampedZoom;

      state.panX = Math.min(0, Math.max(viewportW - scaledW, state.panX ?? centerPanX));
      state.panY = Math.min(0, Math.max(viewportH - scaledH, state.panY ?? centerPanY));

    }
  };
},


  },
  )
);

// Watches for state changes and triggers a debounced DB save whenever
// modules, notes, alerts, or uiBlocked change — but only after hydration is complete.
usePersonalizedDashboardStore.subscribe(
  (state, prevState) => {
    if (!state._hydrated) return;

    const changed =
      state.modules !== prevState.modules ||
      state.notes !== prevState.notes ||
      state.alerts !== prevState.alerts ||
      state.uiBlocked !== prevState.uiBlocked;

    if (changed) {
      debouncedSaveToDB();
    }
  }
);
