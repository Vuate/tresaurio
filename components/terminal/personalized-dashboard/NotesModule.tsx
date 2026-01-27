"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";
import { useDashboardNotificationStore } from "@/store/dashboardNotificationStore"; // 🔥 EKLE
import NotificationPopup from "@/components/terminal/personalized-dashboard/NotificationPopup";

export default function NotesModule() {
  const { notes, addNote } = usePersonalizedDashboardStore();
  const [text, setText] = useState("");

  // 🔥 ERROR POPUP için LOCAL STATE (NotificationPopup - ekranın ortasında)
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

  const handleSave = () => {
    // 1️⃣ TEXTAREA BOŞSA - ERROR POPUP (NotificationPopup - ekranın ortasında)
    if (!text.trim()) {
      setNotification({
        show: true,
        type: "error",
        title: "Empty Note",
        message: "Please write something before saving",
      });
      return;
    }

    // 2️⃣ NOT KAYDEDILDI - SUCCESS TOAST (DashboardNotifications - sağ üstte)
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
      {/* 🔥 ERROR POPUP - PORTAL ile ekranın ortasında */}
      {typeof window !== "undefined" &&
        createPortal(
          <NotificationPopup
            show={notification.show}
            type={notification.type}
            title={notification.title}
            message={notification.message}
            onClose={() => setNotification({ ...notification, show: false })}
          />,
          document.body
        )}

      <div className="h-full min-h-0 flex flex-col">
        {/* HEADER */}
        <h3 className="text-sm font-bold text-teal-400 mb-2 shrink-0">
          Notes
        </h3>

        {/* NOTE LIST */}
        <div
          className="
            flex-1
            min-h-[120px]
            overflow-y-auto
            space-y-2
            pr-1

            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-teal-400/40
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb:hover]:bg-teal-400/70

            scrollbar-thin
            scrollbar-thumb-teal-400/40
            scrollbar-track-transparent
          "
        >
          {notes.length === 0 && (
            <div className="text-xs text-white/40">
              No notes yet
            </div>
          )}

          {notes.map((n) => (
            <div
              key={n.id}
              className="rounded-lg border border-white/10 bg-white/5 p-2"
            >
              <div className="mb-1 text-[10px] text-white/40">
                {new Date(n.createdAt).toLocaleString("tr-TR")}
              </div>
              <div className="text-xs text-white/80">
                {n.text}
              </div>
            </div>
          ))}
        </div>

        {/* INPUT + SAVE */}
        <div className="mt-2 shrink-0">
          <textarea
            className="
              h-[44px]
              resize-none
              rounded-lg
              border border-white/10
              bg-transparent
              p-2
              text-xs
              w-full
            "
            placeholder="Write a note..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSave();
              }
            }}
          />

          <div className="mt-2 mb-3 flex justify-end">
            <button
              onClick={handleSave}
              className="rounded-md bg-teal-500/20 px-3 py-1 text-xs text-teal-400 hover:bg-teal-500/30 cursor-pointer"
            >
              Save Note
            </button>
          </div>
        </div>
      </div>
    </>
  );
}