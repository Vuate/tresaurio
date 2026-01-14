"use client";

import { useState } from "react";
import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";
import { useDashboardNotificationStore } from "@/store/dashboardNotificationStore";


export default function NotesModule() {
  const { notes, addNote } = usePersonalizedDashboardStore();
  const [text, setText] = useState("");

const handleSave = () => {
  if (!text.trim()) {
    useDashboardNotificationStore.getState().push({
      type: "error",
      title: "Empty Note",
      description: "Please write something before saving",
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
    <div className="h-full flex flex-col gap-3">
      <h3 className="text-sm font-bold text-teal-400">Notes</h3>

      {/* NOTE LIST */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
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

      {/* INPUT */}
      <textarea
        className="h-20 resize-none rounded-lg border border-white/10 bg-transparent p-2 text-xs"
        placeholder="Write a note..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={handleSave}
        className="self-end rounded-md bg-teal-500/20 px-3 py-1 text-xs text-teal-400 hover:bg-teal-500/30"
      >
        Save
      </button>
    </div>
  );
}
