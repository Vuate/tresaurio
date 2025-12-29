"use client";

import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";
import { useState } from "react";

export default function NotesPanel() {
  const { notesOpen, toggleNotes, notes, addNote } =
    usePersonalizedDashboardStore();

  const [text, setText] = useState("");

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40
        bg-[#031A1C]/95 backdrop-blur
        border-t border-white/10
        transition-all duration-300 ease-in-out
        ${notesOpen ? "h-[260px]" : "h-[48px]"}`}
    >
      {/* HEADER */}
      <div
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

      {/* CONTENT */}
      {notesOpen && (
        <div className="h-[calc(100%-48px)] flex gap-4 px-6 pb-4">
          {/* INPUT */}
          <div className="flex flex-col w-1/2 gap-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your trading notes…"
              className="flex-1 resize-none rounded-lg
                bg-black/30 border border-white/10
                p-3 text-xs text-white
                focus:outline-none focus:border-teal-400"
            />

            <button
              onClick={() => {
                if (!text.trim()) return;
                addNote(text);
                setText("");
              }}
              className="self-end px-4 py-1.5 rounded-md
                bg-teal-400/20 text-teal-300
                text-xs font-semibold
                hover:bg-teal-400/30 transition"
            >
              Save Note
            </button>
          </div>

          {/* LIST */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
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
  );
}
