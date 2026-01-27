"use client";

import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";
import { useDashboardNotificationStore } from "@/store/dashboardNotificationStore"; // 🔥 EKLE
import { useEffect, useRef, useState } from "react";
import NotificationPopup from "@/components/terminal/personalized-dashboard/NotificationPopup"; 

export default function NotesPanel() {
  const notesPanelRef = useRef<HTMLDivElement>(null);
  const {
    notesOpen,
    toggleNotes,
    notes,
    addNote,
    notesHeight,
    setNotesHeight,
    setNotesBarHeight,
    topBarHeight,
  } = usePersonalizedDashboardStore();

  const [text, setText] = useState("");

  // 🔥 ERROR POPUP için LOCAL STATE
  const [notification, setNotification] = useState<{
    show: boolean;
    type: "success" | "error" | "info";
    title: string;
    message: string;
  }>({
    show: false,
    type: "info",
    title: "",
    message: "",
  });

  /* ================= RESIZE REFS ================= */
  const isResizingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  /* 🔥 Yükseklik ölçümü */
  useEffect(() => {
    const measureHeight = () => {
      if (notesPanelRef.current) {
        const height = notesPanelRef.current.getBoundingClientRect().height;
        setNotesBarHeight(height);
      }
    };

    measureHeight();
    window.addEventListener("resize", measureHeight);
    return () => window.removeEventListener("resize", measureHeight);
  }, [notesOpen, notesHeight, setNotesBarHeight]);

/* ================= RESIZE LOGIC ================= */
useEffect(() => {
  const onMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) return;

    const MIN_HEIGHT = 140;
    const SAFETY_BUFFER = 16;
    
    // 🔥 EKRAN YÜKSEKLİĞİNE ORANLI MİNİMUM CLEARANCE
    const MIN_TOP_CLEARANCE_RATIO = 0.40; // Ekranın %40'si her zaman boş kalacak
    const dynamicMinClearance = window.innerHeight * MIN_TOP_CLEARANCE_RATIO;

    // 🔥 DİNAMİK UI ÖLÇÜMÜ
    const topBarElement = document.querySelector('[class*="TopBar"]') || 
                          document.querySelector('header') ||
                          document.querySelector('[class*="topBar"]');
    
    const mapElement = document.querySelector('[class*="WorkspaceControls"]') ||
                       document.querySelector('[class*="minimap"]');
    
    // Gerçek yükseklikleri ölç
    const measuredTopBarHeight = topBarElement?.getBoundingClientRect().height || topBarHeight || 64;
    const measuredMapHeight = mapElement?.getBoundingClientRect().height || 0;
    
    // 🔥 GERÇEKLEŞTİRİLEN CLEARANCE: Ölçülen + Dinamik minimum'dan büyük olanı
    const measuredClearance = measuredTopBarHeight + measuredMapHeight + SAFETY_BUFFER;
    const reservedTopSpace = Math.max(measuredClearance, dynamicMinClearance);
    
    // Ekranın kullanılabilir yüksekliğini hesapla
    const availableHeight = window.innerHeight - reservedTopSpace;

    const delta = startYRef.current - e.clientY;

    // 🔥 DİNAMİK MAKSIMUM
    const maxHeight = Math.max(MIN_HEIGHT, availableHeight);

    const newHeight = Math.min(
      Math.max(startHeightRef.current + delta, MIN_HEIGHT),
      maxHeight
    );

    setNotesHeight(newHeight);
  };

  const onMouseUp = () => {
    isResizingRef.current = false;
  };

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);

  return () => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };
}, [setNotesHeight, topBarHeight]);

  // 🔥 SAVE HANDLER
  const handleSave = () => {
    // 1️⃣ BOŞSA - ERROR POPUP (NotificationPopup)
    if (!text.trim()) {
      setNotification({
        show: true,
        type: "error",
        title: "Empty Note",
        message: "Please write something before saving",
      });
      return;
    }

    // 2️⃣ BAŞARILI - SUCCESS TOAST (DashboardNotifications)
    addNote(text);
    
    useDashboardNotificationStore.getState().push({
      type: "success",
      title: "Note Saved",
      description: "Your note has been added",
    });

    setText("");
  };

  return (
    <>
      {/* 🔥 ERROR POPUP */}
      <NotificationPopup
        show={notification.show}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification({ ...notification, show: false })}
      />

      <div
        ref={notesPanelRef}
        className="fixed bottom-0 left-0 right-0 z-40
          bg-[#031A1C]/95 backdrop-blur
          border-t border-white/10"
        style={{
          height: notesOpen ? notesHeight : 48,
        }}
      >
        {/* ================= RESIZE HANDLE ================= */}
        {notesOpen && (
          <div
            className="absolute -top-1 left-0 right-0 h-2 cursor-ns-resize z-50"
            onMouseDown={(e) => {
              e.stopPropagation();
              isResizingRef.current = true;
              startYRef.current = e.clientY;
              startHeightRef.current = notesHeight;
              e.preventDefault();
            }}
          />
        )}

        {/* ================= HEADER ================= */}
        <div
          onMouseDown={(e) => e.stopPropagation()}
          onClick={toggleNotes}
          className="h-[48px] px-6 flex items-center justify-between
            cursor-pointer select-none"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            📝 Notes
          </div>

          <div
            className={`text-white/60 transition-transform duration-300
              ${notesOpen ? "rotate-180" : ""}`}
          >
            ▼
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        {notesOpen && (
          <div className="h-[calc(100%-48px)] flex gap-4 px-6 pb-4 overflow-hidden select-none">
            {/* INPUT */}
            <div className="flex flex-col w-1/2 gap-2">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSave();
                  }
                }}
                placeholder="Write your trading notes…"
                className="flex-1 resize-none rounded-lg
                  bg-black/30 border border-white/10
                  p-3 text-xs text-white
                  focus:outline-none focus:border-teal-400"
              />

              <button
                onClick={handleSave}
                className="self-end px-4 py-1.5 rounded-md
                  bg-teal-400/20 text-teal-300
                  text-xs font-semibold
                  hover:bg-teal-400/30 transition"
              >
                Save Note
              </button>
            </div>

            {/* LIST */}
            <div className="
              flex-1 
              overflow-y-auto 
              space-y-2 
              pr-2

              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-teal-400/40
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb:hover]:bg-teal-400/70

              scrollbar-thin
              scrollbar-thumb-teal-400/40
              scrollbar-track-transparent
            ">
              {notes.length === 0 && (
                <div className="text-xs text-white/40">No notes yet</div>
              )}

              {notes.map((n) => (
                <div
                  key={n.id}
                  className="rounded-lg border border-white/10
                    bg-white/5 px-3 py-2 text-xs text-white/80"
                >
                  <div className="text-[10px] text-white/40 mb-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                  {n.text}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}