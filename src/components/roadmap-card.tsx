import Link from "next/link";
import type { Roadmap } from "@/types/roadmap";

export function RoadmapCard({ roadmap }: { roadmap: Roadmap }) {
  return (
    <Link
      href={`/roadmaps/${roadmap.slug}`}
      className="group block overflow-hidden rounded-[1.75rem] ocs-dark-panel transition duration-200 hover:-translate-y-1"
    >
      <div className="border-b border-white/10 p-6">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-white/50">
          약 {roadmap.estimatedMonths}개월 · {roadmap.steps.length}단계
        </p>
        <h3 className="mt-4 text-3xl font-black tracking-[-0.04em] text-white">{roadmap.title}</h3>
        <p className="mt-3 text-sm leading-6 text-white/65">{roadmap.description}</p>
      </div>
      <div className="flex flex-wrap gap-2 p-6">
        {roadmap.targetAudience.map((target) => (
          <span key={target} className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-black text-white/70">
            {target}
          </span>
        ))}
      </div>
    </Link>
  );
}
