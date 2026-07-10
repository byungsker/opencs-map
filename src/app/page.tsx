import Link from "next/link";
import { Button } from "@astryxdesign/core/Button";
import { CourseCard } from "@/components/course-card";
import { RoadmapCard } from "@/components/roadmap-card";
import { courses } from "@/data/courses";
import { roadmaps } from "@/data/roadmaps";

const stats = [
  ["20+", "검증된 무료 강의"],
  ["3", "목표별 로드맵"],
  ["6", "해외 기관"],
  ["V1", "진행 관리 중심"],
];

export default function Home() {
  const featured = courses.slice(0, 6);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
      <section className="overflow-hidden rounded-[2rem] border border-[var(--color-border-primary)] bg-[var(--color-background-surface)] shadow-[0_24px_80px_rgb(15_23_42/0.10)]">
        <div className="grid gap-0 lg:grid-cols-[1.06fr_0.94fr]">
          <div className="flex min-h-[560px] flex-col justify-between bg-slate-950 p-7 text-white md:p-12">
            <div>
              <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white/80">
                OpenCS Map · Astryx themed
              </p>
              <h1 className="mt-8 max-w-3xl text-5xl font-black tracking-[-0.06em] text-white md:text-7xl md:leading-[0.94]">
                해외 CS 강의의 학습 경로를 한 화면에.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/70 md:text-lg">
                무료 강의를 고르고, 이어보고, 완료하고, 강의별 노트까지 남기는 한국어 학습 지도입니다.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/roadmaps" label="로드맵 보기" variant="primary" size="lg" />
                <Button href="/courses" label="강의 탐색" variant="secondary" size="lg" />
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10">
              {stats.map(([value, label]) => (
                <div key={label} className="bg-white/[0.06] p-5">
                  <p className="text-3xl font-black text-white">{value}</p>
                  <p className="mt-1 text-sm text-white/60">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative bg-[var(--color-background-muted)] p-5 md:p-8">
            <div className="absolute right-8 top-8 hidden rounded-full border border-[var(--color-border-primary)] bg-[var(--color-background-surface)] px-4 py-2 text-xs font-bold text-[var(--color-text-secondary)] md:block">
              Design system surface
            </div>
            <div className="flex h-full flex-col justify-end gap-4 pt-16">
              {roadmaps.map((roadmap, index) => (
                <div
                  key={roadmap.slug}
                  className="rounded-[1.5rem] border border-[var(--color-border-primary)] bg-[var(--color-background-surface)] p-5 shadow-sm"
                  style={{ transform: `translateX(${index * 14}px)` }}
                >
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--color-text-tertiary)]">
                    {roadmap.estimatedMonths}개월 · {roadmap.steps.length}단계
                  </p>
                  <h2 className="mt-3 text-2xl font-black tracking-tight text-[var(--color-text-primary)]">
                    {roadmap.title}
                  </h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-[var(--color-text-secondary)]">
                    {roadmap.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {roadmap.targetAudience.map((target) => (
                      <span key={target} className="rounded-full bg-[var(--color-background-muted)] px-3 py-1 text-xs font-semibold text-[var(--color-text-secondary)]">
                        {target}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">목표별 추천 경로</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">입문, 주니어 기본기, AI 전환까지 목적별로 첫 강의 순서를 고릅니다.</p>
          </div>
          <Link href="/roadmaps" className="text-sm font-bold text-blue-300">전체 보기 →</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {roadmaps.map((roadmap) => <RoadmapCard key={roadmap.slug} roadmap={roadmap} />)}
        </div>
      </section>

      <section className="mt-16">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">먼저 볼 만한 강의</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">카드형 링크 모음보다 학습 상태가 남는 강의 카탈로그에 가깝게 정리했습니다.</p>
          </div>
          <Link href="/courses" className="text-sm font-bold text-blue-300">전체 탐색 →</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((course) => <CourseCard key={course.slug} course={course} />)}
        </div>
      </section>
    </main>
  );
}
