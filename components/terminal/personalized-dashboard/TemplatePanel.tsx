"use client";

import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";
import { useDashboardNotificationStore } from "@/store/dashboardNotificationStore";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

export default function TemplatePanel() {
  const {
    templatesOpen,
    toggleTemplates,
    templates,
    fetchTemplates,
    saveTemplate,
    loadTemplate,
    deleteTemplate,
    clearAllTemplates,
    topBarHeight,
    notesBarHeight,
    notesOpen,
    modules,
    lastResetAt,
  } = usePersonalizedDashboardStore();

  const notify = useDashboardNotificationStore((s) => s.push);
  const { data: session } = useSession();
  const panelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const savedScrollRef = useRef(0);
  const [headerHeight, setHeaderHeight] = useState(56);
  const [templateName, setTemplateName] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const templateInputRef = useRef<HTMLInputElement>(null);

  // Confirmation states
  const [confirmLoadId, setConfirmLoadId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmOverwrite, setConfirmOverwrite] = useState(false);
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [clearingAll, setClearingAll] = useState(false);

  const effectiveNotesHeight = notesOpen
    ? notesBarHeight
    : typeof window !== "undefined"
      ? window.innerWidth >= 1536
        ? 56
        : window.innerWidth >= 1280
          ? 52
          : 48
      : 48;

  const [availableHeight, setAvailableHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      setAvailableHeight(
        window.innerHeight - topBarHeight - effectiveNotesHeight - 32
      );
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [topBarHeight, effectiveNotesHeight]);

  useEffect(() => {
    if (templatesOpen && headerRef.current) {
      const height = headerRef.current.getBoundingClientRect().height;
      setHeaderHeight(height);
    }
    if (templatesOpen) {
      setTimeout(() => templateInputRef.current?.focus(), 50);
    }
  }, [templatesOpen]);

  useLayoutEffect(() => {
    if (templatesOpen && scrollRef.current) {
      scrollRef.current.scrollTop = savedScrollRef.current;
    }
  }, [templatesOpen]);

   useEffect(() => {
    if (!lastResetAt) return;
    setTemplateName("");
    setConfirmLoadId(null);
    setConfirmDeleteId(null);
    setConfirmOverwrite(false);
    setConfirmClearAll(false);
    savedScrollRef.current = 0;
  }, [lastResetAt]);

  // Fetch templates when panel opens
  useEffect(() => {
    if (templatesOpen && session?.user) {
      fetchTemplates();
    }
  }, [templatesOpen, session?.user, fetchTemplates]);

  // Click outside to close
  useEffect(() => {
    if (!templatesOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;

      const topBar = document.querySelector("[data-topbar]");
      if (topBar?.contains(target)) return;

      toggleTemplates();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") toggleTemplates();
    };

    const handleTouchOutside = (e: TouchEvent) => {
      if (e.touches.length > 1) return;
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      const topBar = document.querySelector("[data-topbar]");
      if (topBar?.contains(target)) return;
      toggleTemplates();
    };
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("touchstart", handleTouchOutside);
    }, 100);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("touchstart", handleTouchOutside);
    };
  }, [templatesOpen, toggleTemplates]);

  if (!templatesOpen) return null;

  const hasModules = modules.length > 0;


  const confirmSaveTemplate = async () => {
  if (!templateName.trim() || saving) return;
  setSaving(true);
  try {
    await saveTemplate(templateName.trim());
    notify({ type: "success", title: "Template Saved", description: `"${templateName.trim()}" saved successfully.` });
    setTemplateName("");
    setConfirmOverwrite(false);
  } catch {
    notify({ type: "error", title: "Save Failed", description: "Could not save template." });
  }
  setSaving(false);
};

const confirmLoadTemplate = async (id: string) => {
  setLoadingId(id);
  setConfirmLoadId(null);
  try {
    await loadTemplate(id);
    const name = templates.find((t) => t.id === id)?.name || "Template";
    notify({ type: "success", title: "Template Loaded", description: `"${name}" applied to dashboard.` });
    toggleTemplates();
  } catch {
    notify({ type: "error", title: "Load Failed", description: "Could not load template." });
  }
  setLoadingId(null);
};

const handleSave = async () => {
  if (!templateName.trim() || saving || !hasModules) return;

const existing = templates.find(
    (t) => t.name.toLowerCase() === templateName.trim().toLowerCase()
  );
  if (existing && !confirmOverwrite) {
    setConfirmOverwrite(true);
    setConfirmLoadId(null);
    setConfirmDeleteId(null);
    setConfirmClearAll(false);
    return;
  }

  if (confirmOverwrite) return;

  await confirmSaveTemplate();

};

const handleLoad = async (id: string) => {
  if (confirmLoadId !== id) {
    setConfirmLoadId(id);
    setConfirmDeleteId(null);
    setConfirmOverwrite(false);
    setConfirmClearAll(false);
    return;
  }
};

const handleDelete = async (id: string) => {
  if (confirmDeleteId !== id) {
    setConfirmDeleteId(id);
    setConfirmLoadId(null);
    setConfirmOverwrite(false);
    setConfirmClearAll(false);
    return;
  }
};


  const confirmDeleteTemplate = async (id: string) => {
    setDeletingId(id);
    setConfirmDeleteId(null);
    try {
      const name = templates.find((t) => t.id === id)?.name || "Template";
      await deleteTemplate(id);
      notify({ type: "success", title: "Template Deleted", description: `"${name}" deleted.` });
    } catch {
      notify({ type: "error", title: "Delete Failed", description: "Could not delete template." });
    }
    setDeletingId(null);
  };

  const handleCancelConfirm = () => {
    setConfirmLoadId(null);
    setConfirmDeleteId(null);
    setConfirmOverwrite(false);
    setConfirmClearAll(false);
  };

  if (!session?.user) {
    return (
<div
  ref={panelRef}
  style={{ top: topBarHeight + 16, maxHeight: availableHeight }}
className="fixed left-2 sm:left-4 z-40 w-[240px] sm:w-[260px] xl:w-[280px] 2xl:w-[320px] bg-[#0C0E12] border border-white/[0.06] rounded-xl shadow-[0_12px_48px_rgba(0,0,0,0.6)] overflow-hidden select-none"
>
<div ref={headerRef} className="px-3 py-3 border-b border-white/[0.06]">
          <div className="text-[13px] xl:text-[13.5px] 2xl:text-sm font-semibold text-white">
            Templates
          </div>
        </div>
        <div className="p-4 text-center">
          <p className="text-sm text-white/50">Sign in to use templates.</p>
        </div>
      </div>
    );
  }

  return (
<div
  ref={panelRef}
  style={{ top: topBarHeight + 16, maxHeight: availableHeight }}
className="fixed left-2 sm:left-4 z-40 w-[240px] sm:w-[260px] xl:w-[280px] 2xl:w-[320px] bg-[#0C0E12] border border-white/[0.06] rounded-xl shadow-[0_12px_48px_rgba(0,0,0,0.6)]

 overflow-hidden select-none"
>
      {/* Header */}
<div ref={headerRef} className="px-3 py-3 border-b border-white/6">
        <div className="text-[13px] xl:text-[13.5px] 2xl:text-sm font-semibold text-white">
          Templates
        </div>
      </div>

<div
  style={{
    height: `calc(${availableHeight}px - ${headerHeight}px)`,
  }}
ref={scrollRef}
className="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:cursor-pointer [&::-webkit-scrollbar-thumb:hover]:bg-white/40 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
  onWheel={(e) => e.stopPropagation()}
  onScroll={() => { savedScrollRef.current = scrollRef.current?.scrollTop ?? 0; }}
>
  {/* Save new template */}
<div className="sticky top-0 z-10 px-3 pt-3 pb-2 bg-[#0C0E12] space-y-2 border-b border-white/[0.06]">   <div className="text-[10px] xl:text-[10.5px] 2xl:text-[11px] uppercase text-white/50 font-bold tracking-wider px-1">
            Save Template
          </div>
          <div className="flex gap-2">
            <input
              ref={templateInputRef}
              type="text"
              value={templateName}
              onChange={(e) => {
                setTemplateName(e.target.value);
                setConfirmOverwrite(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
              }}
              placeholder="Template name..."
              className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg bg-white/4 border border-white/8 text-xs text-white placeholder:text-white/30 outline-none focus:border-[#1A73E8]/50 transition"
            />
            <button
              onClick={handleSave}
              disabled={!templateName.trim() || saving || !hasModules}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-[#1A73E8] text-xs font-semibold text-white whitespace-nowrap hover:bg-[#1A73E8]/85 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"            >
              {saving ? "..." : "Save"}
            </button>
          </div>
          {/* Overwrite warning */}
{confirmOverwrite && (
<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:justify-between px-2.5 sm:px-3 py-2 rounded-lg bg-white/3 border border-white/8">
  <span className="text-[12px] sm:text-[13px] text-white/80">
A template with this name already exists. Overwrite it?
  </span>

    <div className="flex gap-1.5 sm:gap-1 ml-0 sm:ml-2 w-full sm:w-auto">
      <button
        onClick={confirmSaveTemplate}
        className="flex-1 sm:flex-none px-2 py-1 rounded text-[10px] sm:text-[11px] font-semibold text-white bg-[#1A73E8] hover:bg-[#1A73E8]/85 transition cursor-pointer whitespace-nowrap"
      >
        Yes
      </button>
      <button
        onClick={handleCancelConfirm}
        className="flex-1 sm:flex-none px-2 py-1 rounded text-[10px] sm:text-[11px] font-semibold text-white/40 hover:text-white/65 border border-white/[0.08] transition cursor-pointer whitespace-nowrap"
      >
        Cancel
      </button>
    </div>
  </div>
)}
          {/* Empty dashboard warning */}
          {!hasModules && (
            <div className="text-[12px] text-white/30 px-1">
              Add modules to save a template.
            </div>
          )}
        </div>

        {/* Saved templates list */}
        <div className="px-3 pb-3 pt-1 space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="text-[10px] xl:text-[10.5px] 2xl:text-[11px] uppercase text-white/50 font-bold tracking-wider">
              Saved Templates
            </div>
            {templates.length > 0 && (
              <button
      onClick={() => { setConfirmClearAll(v => !v); setConfirmLoadId(null); setConfirmDeleteId(null); setConfirmOverwrite(false); }}          
      className="text-[12px] text-white/30 hover:text-red-400 transition cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>

          {confirmClearAll && (
            <div className="flex flex-col gap-2 px-2.5 py-2 rounded-lg bg-red-500/6 border border-red-400/20">
              <span className="text-[12px] text-white/80">Delete all templates permanently?</span>
              <div className="flex gap-1.5">
                <button
                  onClick={async () => {
                    setClearingAll(true);
                    setConfirmClearAll(false);
                    try {
                      await clearAllTemplates();
                      notify({ type: "success", title: "Templates Cleared", description: "All templates deleted." });
                    } catch {
                      notify({ type: "error", title: "Failed", description: "Could not clear templates." });
                    }
                    setClearingAll(false);
                  }}
                  disabled={clearingAll}
                  className="flex-1 px-2 py-1 rounded text-[10px] font-semibold text-white bg-red-500/80 hover:bg-red-500 transition cursor-pointer disabled:opacity-40"
                >
                  {clearingAll ? "..." : "Yes, Delete All"}
                </button>
                <button
                  onClick={handleCancelConfirm}
                  className="flex-1 px-2 py-1 rounded text-[10px] font-semibold text-white/40 hover:text-white/65 border border-white/8 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}


          {templates.length === 0 ? (
            <div className="text-xs text-white/30 px-1 py-2">
              No templates yet.
            </div>
          ) : (
            <div className="space-y-1">
              {templates.map((t) => (
                <div key={t.id} className="space-y-1">
            <div className="flex items-center justify-between rounded-lg px-3 py-2 bg-white/3 border border-white/6">
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] xl:text-[15px] 2xl:text-base font-semibold text-white truncate">
                        {t.name}
                      </div>
                      <div className="text-[11px] text-white/60">
                        {new Date(t.updatedAt).toLocaleDateString("en-US")}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 ml-2">

                      <button
                        onClick={() => handleLoad(t.id)}
                        disabled={loadingId === t.id}
                    className="px-2 py-1 rounded text-[10px] font-semibold text-white bg-[#1A73E8] hover:bg-[#1A73E8]/85 transition cursor-pointer disabled:opacity-40"
                      >
                        {loadingId === t.id ? "..." : "Load"}
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        disabled={deletingId === t.id}
                      className="px-2 py-1 rounded text-[10px] font-semibold text-white/40 bg-white/4 border border-white/8 hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/8 transition cursor-pointer disabled:opacity-40"
                      >
                        {deletingId === t.id ? "..." : "Delete"}
                      </button>
                    </div>
                  </div>

                  {/* Load confirmation */}
          {confirmLoadId === t.id && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:justify-between px-2.5 sm:px-3 py-2 rounded-lg bg-white/3 border border-white/8">
            <span className="text-[12px] sm:text-[13px] text-white/80">
          This will replace your current dashboard. Continue?
          To avoid losing changes, you can save as a new template or overwrite your existing template before loading. </span>

    <div className="flex gap-1.5 sm:gap-1 ml-0 sm:ml-2 w-full sm:w-auto">
      <button
        onClick={() => confirmLoadTemplate(t.id)}
        className="flex-1 sm:flex-none px-2 py-1 rounded text-[10px] sm:text-[11px] font-semibold text-white bg-[#1A73E8] hover:bg-[#1A73E8]/85 transition cursor-pointer whitespace-nowrap"
      >
        Yes
      </button>
      <button
        onClick={handleCancelConfirm}
        className="flex-1 sm:flex-none px-2 py-1 rounded text-[10px] sm:text-[11px] font-semibold text-white/40 hover:text-white/65 border border-white/8 transition cursor-pointer whitespace-nowrap"
      >
        Cancel
      </button>
    </div>
  </div>
)}

                  {/* Delete confirmation */}
        {confirmDeleteId === t.id && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:justify-between px-2.5 sm:px-3 py-2 rounded-lg bg-red-500/6 border border-red-400/20">
          <span className="text-[12px] sm:text-[13px] text-white/80">
            Delete this template permanently?
          </span>

            <div className="flex gap-1.5 sm:gap-1 ml-0 sm:ml-2 w-full sm:w-auto">
              <button
                onClick={() => confirmDeleteTemplate(t.id)}
                className="flex-1 sm:flex-none px-2 py-1 rounded text-[10px] sm:text-[11px] font-semibold text-white bg-red-500/80 hover:bg-red-500 transition cursor-pointer whitespace-nowrap"
              >
                Yes
              </button>
              <button
                onClick={handleCancelConfirm}
                className="flex-1 sm:flex-none px-2 py-1 rounded text-[10px] sm:text-[11px] font-semibold text-white/40 hover:text-white/65 border border-white/8 transition cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
            </div>
          </div>
)}

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}