"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";
import { useDashboardNotificationStore } from "@/store/dashboardNotificationStore"; 
import NotificationPopup from "@/components/terminal/personalized-dashboard/NotificationPopup";

export default function NotesModule() {
  const { 
    notes, 
    addNote,
    removeNote
   } = usePersonalizedDashboardStore();
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
        <h3 className="text-sm font-bold text-teal-400 mb-2 shrink-0">
          Notes
        </h3>

        <div
          className="
            flex-1
            min-h-[120px]
            overflow-y-auto
            space-y-2
            pr-1

            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-transparent
     [&::-webkit-scrollbar-thumb]:bg-black/20 dark:[&::-webkit-scrollbar-thumb]:bg-white/20
            [&::-webkit-scrollbar-thumb]:rounded-full
[&::-webkit-scrollbar-thumb:hover]:bg-black/30 dark:[&::-webkit-scrollbar-thumb:hover]:bg-white/40
            scrollbar-thin
scrollbar-thumb-foreground/20            scrollbar-track-transparent
          "
        >
          {notes.length === 0 && (
            <div className="text-xs text-muted-foreground">
              No notes yet
            </div>
          )}

          {notes.map((n) => (
            <div
              key={n.id}
              className="rounded-lg border border-border bg-input p-2 pr-8 relative overflow-hidden"
            >
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
                className="absolute top-1.5 right-1.5
                  w-5 h-5
                  flex items-center justify-center
                  rounded
                  bg-red-500/20 hover:bg-red-500/30
                  text-red-400 hover:text-red-300
                  text-[10px]
                  cursor-pointer
                  transition-colors duration-200
                  flex-shrink-0
                  z-10
                "
                title="Delete note"
              >
                <X className="w-3 h-3" />
              </button>

              <div className="flex flex-col gap-0.5 min-w-0 pr-1">
                <div className="text-[10px] text-muted-foreground truncate">
                  {new Date(n.createdAt).toLocaleDateString("tr-TR")}
                </div>
                <div className="text-[10px] text-muted-foreground truncate">
                  {new Date(n.createdAt).toLocaleTimeString("tr-TR")}
                </div>
              </div>
              
              <div className="mt-1.5 text-xs text-foreground break-words whitespace-pre-wrap overflow-hidden">
                {n.text}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 shrink-0">
          <textarea
            className="
              h-[44px]
              resize-none
              rounded-lg
              border border-border
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
  className="self-end px-4 py-1.5 rounded-md bg-[#1A73E8] text-white text-xs font-semibold hover:bg-[#1A73E8]/85 transition cursor-pointer"
>
  Save Note
</button>
          </div>
        </div>
      </div>
    </>
  );
}