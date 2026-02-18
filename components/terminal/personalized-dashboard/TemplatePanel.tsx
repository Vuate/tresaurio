"use client";

import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";
import { useDashboardNotificationStore } from "@/store/dashboardNotificationStore";
import { useEffect, useRef, useState } from "react";
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
    topBarHeight,
    notesBarHeight,
    notesOpen,
    modules,
  } = usePersonalizedDashboardStore();

  const notify = useDashboardNotificationStore((s) => s.push);
  const { data: session } = useSession();
  const panelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(56);
  const [templateName, setTemplateName] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Confirmation states
  const [confirmLoadId, setConfirmLoadId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmOverwrite, setConfirmOverwrite] = useState(false);

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
  }, [templatesOpen]);

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

    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
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
    return;
  }
};

const handleDelete = async (id: string) => {
  if (confirmDeleteId !== id) {
    setConfirmDeleteId(id);
    setConfirmLoadId(null);
    setConfirmOverwrite(false);
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
  };

  if (!session?.user) {
    return (
<div
  ref={panelRef}
  style={{ top: topBarHeight + 16, maxHeight: availableHeight }}
  className="fixed left-2 sm:left-4 z-40 w-[240px] sm:w-[260px] xl:w-[280px] 2xl:w-[320px] bg-[#041F20]/95 backdrop-blur border border-white/10 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.45)] overflow-hidden select-none"
>
        <div ref={headerRef} className="px-3 py-3 border-b border-white/10 bg-[#041F20]/95">
          <div className="text-[13px] xl:text-[13.5px] 2xl:text-sm font-semibold text-white">
            Templates
          </div>
        </div>
        <div className="p-4 text-center">
          <p className="text-xs text-white/50">Sign in to use templates.</p>
        </div>
      </div>
    );
  }

  return (
<div
  ref={panelRef}
  style={{ top: topBarHeight + 16, maxHeight: availableHeight }}
  className="fixed left-2 sm:left-4 z-40 w-[240px] sm:w-[260px] xl:w-[280px] 2xl:w-[320px] bg-[#041F20]/95 backdrop-blur border border-white/10 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.45)] overflow-hidden select-none"
>
      {/* Header */}
      <div ref={headerRef} className="px-3 py-3 border-b border-white/10 bg-[#041F20]/95">
        <div className="text-[13px] xl:text-[13.5px] 2xl:text-sm font-semibold text-white">
          Templates
        </div>
      </div>

      <div
        style={{
          height: `calc(${availableHeight}px - ${headerHeight}px)`,
        }}
        className="p-3 space-y-3 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-teal-400/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:cursor-pointer [&::-webkit-scrollbar-thumb:hover]:bg-teal-400/70 scrollbar-thin scrollbar-thumb-teal-400/40 scrollbar-track-transparent"
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Save new template */}
        <div className="space-y-2">
          <div className="text-[10px] xl:text-[10.5px] 2xl:text-[11px] uppercase text-white/40 font-bold px-1">
            Save Template
          </div>
          <div className="flex gap-2">
            <input
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
              className="flex-1 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/30 outline-none focus:border-teal-400/40 transition"
            />
            <button
              onClick={handleSave}
              disabled={!templateName.trim() || saving || !hasModules}
              className="px-3 py-1.5 rounded-lg bg-teal-400/15 border border-teal-400/30 text-xs font-semibold text-teal-300 hover:bg-teal-400/25 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? "..." : "Save"}
            </button>
          </div>
          {/* Overwrite warning */}
{confirmOverwrite && (
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:justify-between px-2.5 sm:px-3 py-2 rounded-lg bg-red-400/15 border border-red-400/30">
    <span className="text-[10px] sm:text-[11px] text-red-300">
      Template with this name already exists. Overwrite?
    </span>
    <div className="flex gap-1.5 sm:gap-1 ml-0 sm:ml-2 w-full sm:w-auto">
      <button
        onClick={confirmSaveTemplate}
        className="flex-1 sm:flex-none px-2 py-1 rounded text-[10px] sm:text-[11px] font-semibold text-red-300 bg-red-400/15 border border-red-400/30 hover:bg-red-400/25 transition cursor-pointer whitespace-nowrap"
      >
        Yes
      </button>
      <button
        onClick={handleCancelConfirm}
        className="flex-1 sm:flex-none px-2 py-1 rounded text-[10px] sm:text-[11px] font-semibold text-white/40 hover:text-white/70 border border-white/10 transition cursor-pointer whitespace-nowrap"
      >
        Cancel
      </button>
    </div>
  </div>
)}
          {/* Empty dashboard warning */}
          {!hasModules && (
            <div className="text-[10px] text-white/30 px-1">
              Add modules to save a template.
            </div>
          )}
        </div>

        {/* Saved templates list */}
        <div className="space-y-2">
          <div className="text-[10px] xl:text-[10.5px] 2xl:text-[11px] uppercase text-white/40 font-bold px-1">
            Saved Templates
          </div>

          {templates.length === 0 ? (
            <div className="text-xs text-white/30 px-1 py-2">
              No templates yet.
            </div>
          ) : (
            <div className="space-y-1">
              {templates.map((t) => (
                <div key={t.id} className="space-y-1">
                  <div className="flex items-center justify-between rounded-lg px-3 py-2 bg-white/5 border border-white/10 group">
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] xl:text-[13.5px] 2xl:text-sm font-semibold text-white truncate">
                        {t.name}
                      </div>
                      <div className="text-[10px] text-white/30">
                        {new Date(t.updatedAt).toLocaleDateString("en-US")}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={() => handleLoad(t.id)}
                        disabled={loadingId === t.id}
                        className="px-2 py-1 rounded text-[10px] font-semibold text-teal-300 bg-teal-400/10 hover:bg-teal-400/20 border border-teal-400/20 transition cursor-pointer disabled:opacity-40"
                      >
                        {loadingId === t.id ? "..." : "Load"}
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        disabled={deletingId === t.id}
                        className="px-2 py-1 rounded text-[10px] font-semibold text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition cursor-pointer disabled:opacity-40"
                      >
                        {deletingId === t.id ? "..." : "Delete"}
                      </button>
                    </div>
                  </div>

                  {/* Load confirmation */}
{confirmLoadId === t.id && (
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:justify-between px-2.5 sm:px-3 py-2 rounded-lg bg-red-400/15 border border-red-400/30">
    <span className="text-[10px] sm:text-[11px] text-red-300">
This will replace your current dashboard. Continue? 
To avoid losing changes, you can save as a new template or overwrite your existing template before loading    </span>
    <div className="flex gap-1.5 sm:gap-1 ml-0 sm:ml-2 w-full sm:w-auto">
      <button
        onClick={() => confirmLoadTemplate(t.id)}
        className="flex-1 sm:flex-none px-2 py-1 rounded text-[10px] sm:text-[11px] font-semibold text-red-300 bg-red-400/15 border border-red-400/30 hover:bg-red-400/25 transition cursor-pointer whitespace-nowrap"
      >
        Yes
      </button>
      <button
        onClick={handleCancelConfirm}
        className="flex-1 sm:flex-none px-2 py-1 rounded text-[10px] sm:text-[11px] font-semibold text-white/40 hover:text-white/70 border border-white/10 transition cursor-pointer whitespace-nowrap"
      >
        Cancel
      </button>
    </div>
  </div>
)}

                  {/* Delete confirmation */}
{confirmDeleteId === t.id && (
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:justify-between px-2.5 sm:px-3 py-2 rounded-lg bg-red-400/15 border border-red-400/30">
    <span className="text-[10px] sm:text-[11px] text-red-300">
      Delete this template permanently?
    </span>
    <div className="flex gap-1.5 sm:gap-1 ml-0 sm:ml-2 w-full sm:w-auto">
      <button
        onClick={() => confirmDeleteTemplate(t.id)}
        className="flex-1 sm:flex-none px-2 py-1 rounded text-[10px] sm:text-[11px] font-semibold text-red-300 bg-red-400/15 border border-red-400/30 hover:bg-red-400/25 transition cursor-pointer whitespace-nowrap"
      >
        Yes
      </button>
      <button
        onClick={handleCancelConfirm}
        className="flex-1 sm:flex-none px-2 py-1 rounded text-[10px] sm:text-[11px] font-semibold text-white/40 hover:text-white/70 border border-white/10 transition cursor-pointer whitespace-nowrap"
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