import UseCaseList from "./UseCaseList";
import { Icon } from "@iconify/react";

export default function UseCasesSection() {
  return (
    <section className="section px-6">
      {/* SADECE CONTAINER FIX */}
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-12 text-center">
<span className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-400/10 px-4 py-1 text-sm font-bold text-purple-400">
  <Icon icon="mdi:lightbulb-outline" className="text-base" />
  KULLANIM SENARYOLARI
</span>
          <h2 className="mt-4 text-3xl font-extrabold">
            Treasurio Kimler İçin?
          </h2>
        </div>

        {/* GRID — AYNEN KALDI */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <UseCaseList />
        </div>
      </div>
    </section>
  );
}
