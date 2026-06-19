import Link from "next/link";
import { RoadmapCard } from "@/components/roadmap-card";
import { roadmaps } from "@/data/roadmaps";

export default function RoadmapsPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <Link href="/" className="text-sm font-bold text-blue-700">← 홈으로</Link>
      <div className="mb-8 mt-6">
        <p className="text-sm font-bold text-blue-700">Roadmaps</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">목표별 CS 학습 로드맵</h1>
        <p className="mt-4 max-w-3xl text-slate-700">완주보다 방향이 먼저입니다. 현재 목표에 맞는 경로를 하나 골라 시작하세요.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">{roadmaps.map((roadmap) => <RoadmapCard key={roadmap.slug} roadmap={roadmap} />)}</div>
    </main>
  );
}
