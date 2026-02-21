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

export const MAX_ZOOM = 3;
export const WORLD_WIDTH = 8000;
export const WORLD_HEIGHT = 4500;

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

  // Templates
  templates: { id: string; name: string; createdAt: string; updatedAt: string }[];
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
  closeAllPanels: () => void;
};

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
    zoom: 1,
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
    templates: [],

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


swapModules: (id1, id2) => {
  const modules = get().modules;
  const m1 = modules.find(m => m.id === id1);
  const m2 = modules.find(m => m.id === id2);
  if (!m1 || !m2) return;

  // m1 → m2'nin yerine gidecek, sınır kontrolü yap
  const newX1 = Math.max(0, Math.min(m2.x, WORLD_WIDTH - m1.width));
  const newY1 = Math.max(0, Math.min(m2.y, WORLD_HEIGHT - m1.height));

  // m2 → m1'in yerine gidecek, sınır kontrolü yap
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
    });
    try {
      await fetch("/api/dashboard", {
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
    } catch {}
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
  set({
    modules,
    ...(notes && { notes }),
    ...(alerts && { alerts }),
    zoom: minZoom,
    panX: centerPanX,
    panY: centerPanY,
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
    const { modules, notes, alerts, zoom, panX, panY, lockedModules, uiBlocked  } = get();
    await fetch("/api/dashboard", {
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
          uiBlocked
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
        const res = await fetch("/api/dashboard/templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            layout: { modules, zoom, panX, panY, lockedModules: Array.from(lockedModules), uiBlocked },
          }),
        });
        if (!res.ok) return;
        // Refresh list
        await get().fetchTemplates();
      } catch (err) {
        console.error("[Dashboard] Save template failed:", err);
      }
    },

loadTemplate: async (id: string) => {
  try {
    const res = await fetch(`/api/dashboard/templates/${id}`);
    if (!res.ok) return;
    const { template } = await res.json();
    if (!template?.layout) return;

    const { modules, lockedModules, uiBlocked  } = template.layout;

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
  }
},

    deleteTemplate: async (id: string) => {
      try {
        const res = await fetch(`/api/dashboard/templates/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) return;
        set({ templates: get().templates.filter((t) => t.id !== id) });
      } catch (err) {
        console.error("[Dashboard] Delete template failed:", err);
      }
    },

    closeAllPanels: () =>
  set({
    sidebarOpen: false,
    addToolOpen: false,
    templatesOpen: false,
  }),

  }),
  {
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
    
    // Reset zoom and pan to min values after hydration
    if (state && typeof window !== "undefined") {
      const topBarHeight = state.topBarHeight || 0;
      const notesBarHeight = state.notesBarHeight || 0;
      const viewportW = window.innerWidth;
      const viewportH = window.innerHeight - topBarHeight - notesBarHeight;
      const minZoom = calculateMinZoom(viewportW, viewportH);
      const centerPanX = (viewportW - WORLD_WIDTH * minZoom) / 2;
      const centerPanY = (viewportH - WORLD_HEIGHT * minZoom) / 2;
      
      state.zoom = minZoom;
      state.panX = centerPanX;
      state.panY = centerPanY;
    }
  };
},


  },
  )
);

// Subscribe to state changes → debounced DB save (only after hydration)
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