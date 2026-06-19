import Link from "next/link";
import type { Roadmap } from "@/types/roadmap";

export function RoadmapCard({ roadmap }: { roadmap: Roadmap }) {
  return (
    <Link href={`/roadmaps/${roadmap.slug}`} className="block rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <p className="text-sm font-semibold text-blue-300">약 {roadmap.estimatedMonths}개월 · {roadmap.steps.length}단계</p>
      <h3 className="mt-3 text-2xl font-black">{roadmap.title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-300">{roadmap.description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {roadmap.targetAudience.map((target) => <span key={target} className="rounded-full bg-white/10 px-3 py-1 text-xs">{target}</span>)}
      </div>
    </Link>
  );
}
