import Link from "next/link";
import { notFound } from "next/navigation";
import { ProgressButton } from "@/components/progress-button";
import { roadmaps } from "@/data/roadmaps";
import { getRoadmapCourses } from "@/lib/catalog";

export function generateStaticParams() {
  return roadmaps.map((roadmap) => ({ slug: roadmap.slug }));
}

type RoadmapPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: RoadmapPageProps) {
  const { slug } = await params;
  const roadmap = roadmaps.find((item) => item.slug === slug);
  return { title: roadmap ? `${roadmap.title} | OpenCS Map` : "Roadmap | OpenCS Map" };
}

export default async function RoadmapDetailPage({ params }: RoadmapPageProps) {
  const { slug } = await params;
  const roadmap = roadmaps.find((item) => item.slug === slug);
  if (!roadmap) notFound();
  const steps = getRoadmapCourses(roadmap);

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <Link href="/roadmaps" className="text-sm font-bold text-blue-700">← 로드맵 목록으로</Link>
      <section className="mt-6 rounded-[2rem] bg-slate-950 p-8 text-white shadow-xl">
        <p className="text-sm font-bold text-blue-300">약 {roadmap.estimatedMonths}개월 · {steps.length}단계</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">{roadmap.title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{roadmap.description}</p>
        <div className="mt-6 flex flex-wrap gap-2">{roadmap.targetAudience.map((target) => <span key={target} className="rounded-full bg-white/10 px-3 py-1 text-sm">{target}</span>)}</div>
      </section>
      <section className="mt-8 space-y-4">
        {steps.map((step) => (
          <div key={step.course.slug} className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-black text-blue-700">STEP {step.order}{step.optional ? " · 선택" : ""}</p>
                <Link href={`/courses/${step.course.slug}`} className="mt-2 block text-2xl font-black text-slate-950 hover:text-blue-700">{step.course.koreanTitle}</Link>
                <p className="mt-1 text-sm font-semibold text-slate-500">{step.course.title}</p>
                <p className="mt-4 leading-7 text-slate-700">{step.reason}</p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <ProgressButton slug={step.course.slug} status="saved" />
                <ProgressButton slug={step.course.slug} status="done" />
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
