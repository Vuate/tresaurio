"use client";

import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";
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
  } = usePersonalizedDashboardStore();

  const { data: session } = useSession();
  const panelRef = useRef<HTMLDivElement>(null);
  const [templateName, setTemplateName] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

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

  const handleSave = async () => {
    if (!templateName.trim() || saving) return;
    setSaving(true);
    await saveTemplate(templateName.trim());
    setTemplateName("");
    setSaving(false);
  };

  const handleLoad = async (id: string) => {
    setLoadingId(id);
    await loadTemplate(id);
    setLoadingId(null);
    toggleTemplates();
  };

  const handleDelete = async (id: string) => {
    await deleteTemplate(id);
  };

  // Not logged in
  if (!session?.user) {
    return (
      <div
        ref={panelRef}
        style={{ top: topBarHeight + 16, maxHeight: availableHeight }}
        className="fixed left-4 z-40 w-[260px] xl:w-[280px] 2xl:w-[320px] bg-[#041F20]/95 backdrop-blur border border-white/10 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.45)] overflow-hidden select-none"
      >
        <div className="px-3 py-3 border-b border-white/10 bg-[#041F20]/95">
          <div className="text-[13px] xl:text-[13.5px] 2xl:text-sm font-semibold text-white">
            Templates
          </div>
        </div>
        <div className="p-4 text-center">
          <p className="text-xs text-white/50">
            Şablonları kullanmak için giriş yapın.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={panelRef}
      style={{ top: topBarHeight + 16, maxHeight: availableHeight }}
      className="fixed left-4 z-40 w-[260px] xl:w-[280px] 2xl:w-[320px] bg-[#041F20]/95 backdrop-blur border border-white/10 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.45)] overflow-hidden select-none"
    >
      {/* Header */}
      <div className="px-3 py-3 border-b border-white/10 bg-[#041F20]/95">
        <div className="text-[13px] xl:text-[13.5px] 2xl:text-sm font-semibold text-white">
          Templates
        </div>
      </div>

      <div
        className="p-3 space-y-3 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-teal-400/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-teal-400/70"
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Save new template */}
        <div className="space-y-2">
          <div className="text-[10px] xl:text-[10.5px] 2xl:text-[11px] uppercase text-white/40 font-bold px-1">
            Şablon Kaydet
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
              }}
              placeholder="Şablon adı..."
              className="flex-1 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/30 outline-none focus:border-teal-400/40 transition"
            />
            <button
              onClick={handleSave}
              disabled={!templateName.trim() || saving}
              className="px-3 py-1.5 rounded-lg bg-teal-400/15 border border-teal-400/30 text-xs font-semibold text-teal-300 hover:bg-teal-400/25 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? "..." : "Kaydet"}
            </button>
          </div>
        </div>

        {/* Saved templates list */}
        <div className="space-y-2">
          <div className="text-[10px] xl:text-[10.5px] 2xl:text-[11px] uppercase text-white/40 font-bold px-1">
            Kayıtlı Şablonlar
          </div>

          {templates.length === 0 ? (
            <div className="text-xs text-white/30 px-1 py-2">
              Henüz şablon yok.
            </div>
          ) : (
            <div className="space-y-1">
              {templates.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-lg px-3 py-2 bg-white/5 border border-white/10 group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] xl:text-[13.5px] 2xl:text-sm font-semibold text-white truncate">
                      {t.name}
                    </div>
                    <div className="text-[10px] text-white/30">
                      {new Date(t.updatedAt).toLocaleDateString("tr-TR")}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={() => handleLoad(t.id)}
                      disabled={loadingId === t.id}
                      className="px-2 py-1 rounded text-[10px] font-semibold text-teal-300 bg-teal-400/10 hover:bg-teal-400/20 border border-teal-400/20 transition cursor-pointer disabled:opacity-40"
                    >
                      {loadingId === t.id ? "..." : "Yükle"}
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="px-2 py-1 rounded text-[10px] font-semibold text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition cursor-pointer"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
