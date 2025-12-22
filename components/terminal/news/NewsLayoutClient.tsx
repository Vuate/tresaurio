"use client";

import FiltersPanel from "./FiltersPanel";
import NewsFeed from "./NewsFeed";
import InsightsPanel from "./InsightsPanel";

export default function NewsLayoutClient() {
  return (
    <div className="grid h-full grid-cols-[280px_1fr_320px]">
      <FiltersPanel />
      <NewsFeed />
      <InsightsPanel />
    </div>
  );
}
