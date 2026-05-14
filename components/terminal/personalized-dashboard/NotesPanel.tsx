"use client";

import { Icon } from "@iconify/react";
import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";
import { useDashboardNotificationStore } from "@/store/dashboardNotificationStore";
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
      removeNote, 
    topBarHeight,
        userMenuOpen,
  } = usePersonalizedDashboardStore();

  const [headerHeight, setHeaderHeight] = useState(
    typeof window !== 'undefined' 
      ? (window.innerWidth >= 1536 ? 56 : window.innerWidth >= 1280 ? 52 : 48)
      : 48
  );

  const [text, setText] = useState("");

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

  const isResizingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  useEffect(() => {
    const updateHeaderHeight = () => {
      const newHeight = window.innerWidth >= 1536 ? 56 : window.innerWidth >= 1280 ? 52 : 48;
      setHeaderHeight(newHeight);
    };

    window.addEventListener("resize", updateHeaderHeight);
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

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
  }, [notesOpen, notesHeight, headerHeight, setNotesBarHeight]); 



/* RESIZE LOGIC */
useEffect(() => {
  const onMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) return;

    const MIN_HEIGHT = window.innerWidth >= 1536 ? 180 : window.innerWidth >= 1280 ? 160 : 140;
    const SAFETY_BUFFER = 16;
    
    const MIN_TOP_CLEARANCE_RATIO = 0.45;
    const dynamicMinClearance = window.innerHeight * MIN_TOP_CLEARANCE_RATIO;

    const mapHeight = window.innerWidth >= 1536 ? 180 : window.innerWidth >= 1280 ? 160 : 140;
    
    const reservedTopSpace = Math.max(
      topBarHeight + mapHeight + SAFETY_BUFFER,
      dynamicMinClearance
    );
    
    const availableHeight = window.innerHeight - reservedTopSpace;

    const delta = startYRef.current - e.clientY;

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

  const onTouchMove = (e: TouchEvent) => {
    if (!isResizingRef.current) return;
    const touch = e.touches[0];

    const MIN_HEIGHT = window.innerWidth >= 1536 ? 180 : window.innerWidth >= 1280 ? 160 : 140;
    const SAFETY_BUFFER = 16;

    const MIN_TOP_CLEARANCE_RATIO = 0.45;
    const dynamicMinClearance = window.innerHeight * MIN_TOP_CLEARANCE_RATIO;

    const mapHeight = window.innerWidth >= 1536 ? 180 : window.innerWidth >= 1280 ? 160 : 140;

    const reservedTopSpace = Math.max(
      topBarHeight + mapHeight + SAFETY_BUFFER,
      dynamicMinClearance
    );

    const availableHeight = window.innerHeight - reservedTopSpace;

    const delta = startYRef.current - touch.clientY;

    const maxHeight = Math.max(MIN_HEIGHT, availableHeight);

    const newHeight = Math.min(
      Math.max(startHeightRef.current + delta, MIN_HEIGHT),
      maxHeight
    );

    setNotesHeight(newHeight);
    e.preventDefault();
  };

  const onTouchEnd = () => {
    isResizingRef.current = false;
  };

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
  window.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("touchend", onTouchEnd);

  return () => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("touchend", onTouchEnd);
  };
}, [setNotesHeight, topBarHeight]);

  useEffect(() => {
    if (userMenuOpen && notesOpen) {
      toggleNotes();
    }
  }, [userMenuOpen]);

  const handleSave = () => {
    if (!text.trim()) {
      setNotification({
        show: true,
        type: "error",
        title: "Empty Note",
        message: "Please write something before saving",
      });
      return;
    }

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
        bg-background backdrop-blur-md
          border-t border-border"
        style={{
          height: notesOpen ? notesHeight : headerHeight,
        }}
      >
        {notesOpen && (
          <div
            className="absolute -top-1 left-0 right-0 h-7 cursor-ns-resize z-50"
            onMouseDown={(e) => {
              e.stopPropagation();
              isResizingRef.current = true;
              startYRef.current = e.clientY;
              startHeightRef.current = notesHeight;
              e.preventDefault();
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              isResizingRef.current = true;
              startYRef.current = e.touches[0].clientY;
              startHeightRef.current = notesHeight;
            }}
          />
        )}

        <div
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => {
          if (usePersonalizedDashboardStore.getState().uiBlocked) return;
            toggleNotes();
       }}
          className="px-6 xl:px-8 2xl:px-12 flex items-center justify-between cursor-pointer select-none"
          style={{ height: headerHeight }}
        >
          <div className="flex items-center gap-2 xl:gap-2.5 2xl:gap-3 text-sm xl:text-[15px] 2xl:text-base font-semibold text-foreground">
            <Icon
              icon="material-symbols:note-alt-outline"
              className="text-foreground w-[1.1em] h-[1.1em] xl:w-[1.15em] xl:h-[1.15em] 2xl:w-[1.2em] 2xl:h-[1.2em]"
            />
            Notes
          </div>

          <div
            className={`text-foreground/60 transition-transform duration-300 text-base xl:text-lg 2xl:text-xl
              ${!notesOpen ? "rotate-180" : ""}`}
          >
            ▲
          </div>
        </div>

        {notesOpen && (
          <div 
            className="flex gap-4 xl:gap-5 2xl:gap-6 px-6 xl:px-8 2xl:px-12 pb-4 xl:pb-5 2xl:pb-6 overflow-hidden select-none"
            style={{ height: `calc(100% - ${headerHeight}px)` }} 
          >
            <div className="flex flex-col w-1/2 gap-2 xl:gap-2.5 2xl:gap-3">
              <div className="flex-1 rounded-lg overflow-hidden border border-border bg-foreground/4">
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
                  className="w-full h-full resize-none
                    bg-transparent
                    p-3 xl:p-3.5 2xl:p-4
                    pr-4 xl:pr-5 2xl:pr-6
                    text-xs xl:text-[13px] 2xl:text-sm text-foreground
                    focus:outline-none
                    
                    [&::-webkit-scrollbar]:w-2
                    [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-foreground/40
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-thumb]:cursor-pointer
               [&::-webkit-scrollbar-thumb:hover]:bg-foreground/60
                    
                    scrollbar-thin
               scrollbar-thumb-foreground/40
                    scrollbar-track-transparent
                  "
                />
              </div>

              <button
                onClick={handleSave}
                className="self-end px-4 xl:px-5 2xl:px-6 py-1.5 xl:py-2 2xl:py-2.5 rounded-md
              bg-[#1A73E8] text-white
                  text-xs xl:text-[13px] 2xl:text-sm font-semibold
                 hover:bg-[#1A73E8]/85 transition cursor-pointer"
              >
                Save Note
              </button>
            </div>

            <div className="flex-1 rounded-lg overflow-hidden">
              <div className="h-full
                overflow-y-auto 
                space-y-2 xl:space-y-2.5 2xl:space-y-3
                pr-3 xl:pr-4 2xl:pr-5

                [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:bg-transparent
               [&::-webkit-scrollbar-thumb]:bg-foreground/40
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb]:cursor-pointer
            [&::-webkit-scrollbar-thumb:hover]:bg-foreground/60

                scrollbar-thin
                scrollbar-thumb-foreground/40
                scrollbar-track-transparent
              ">
                {notes.length === 0 && (
                  <div className="text-xs xl:text-[13px] 2xl:text-sm text-foreground/40">No notes yet</div>
                )}

                {notes.map((n) => (
                  <div
                    key={n.id}
            className="rounded-lg border border-border
              bg-foreground/3 px-3 xl:px-3.5 2xl:px-4 py-2 xl:py-2.5 2xl:py-3 text-xs xl:text-[13px] 2xl:text-sm text-foreground/80
              relative group"
                  >
                    <div className="flex items-start justify-between gap-1 mb-1 xl:mb-1.5 2xl:mb-2">
                      <div className="text-[10px] xl:text-[10.5px] 2xl:text-[11px] text-foreground/40 leading-tight min-w-0 wrap-break-word">
                        {new Date(n.createdAt).toLocaleString()}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNote(n.id);
                          useDashboardNotificationStore.getState().push({
                            type: "info",
                            title: "Note Deleted",
                            description: "Your note has been removed",
                          });
                        }}
                        className="shrink-0
                          w-5 h-5 xl:w-5.5 xl:h-5.5 2xl:w-6 2xl:h-6
                          flex items-center justify-center
                          rounded
                          bg-red-500/20 hover:bg-red-500/30
                          text-red-400 hover:text-red-300
                          text-xs xl:text-sm 2xl:text-base
                          cursor-pointer
                          transition-colors duration-200"
                        title="Delete note"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="break-words whitespace-pre-wrap overflow-hidden">
                      {n.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}