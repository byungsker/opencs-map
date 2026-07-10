import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@astryxdesign/core/Button";
import { ProgressButton } from "@/components/progress-button";
import { LessonPlayer } from "@/components/lesson-player";
import { courses } from "@/data/courses";
import { roadmaps } from "@/data/roadmaps";
import { getCourseBySlug, getCourseLessons } from "@/lib/catalog";

export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

type CoursePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  return { title: course ? `${course.koreanTitle} | OpenCS Map` : "Course | OpenCS Map" };
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const includedRoadmaps = roadmaps.filter((roadmap) => roadmap.steps.some((step) => step.courseSlug === course.slug));
  const lessons = getCourseLessons(course.slug);

  return (
    <main className="ocs-frame mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <Link href="/courses" className="ocs-kicker">Course catalog</Link>

      <section className="mt-5 overflow-hidden rounded-[2.25rem] ocs-dark-panel">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="relative p-7 md:p-10 lg:p-12">
            <div className="absolute right-8 top-8 hidden h-24 w-24 rounded-full border border-white/10 lg:block" />
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black text-white/80">{course.institution}</span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black text-white/70">{course.platform}</span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[var(--ocs-ink)]">무료 공식 강의</span>
            </div>
            <p className="mt-8 text-xs font-black uppercase tracking-[0.28em] text-white/50">Astryx learning surface</p>
            <h1 className="mt-4 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.06em] text-white md:text-7xl">
              {course.koreanTitle}
            </h1>
            <p className="mt-5 text-xl font-semibold text-white/70">{course.title}</p>
            <p className="mt-7 max-w-3xl text-base leading-8 text-white/75 md:text-lg">{course.summaryKo}</p>

            <div className="mt-8 flex flex-wrap gap-2">
              {course.topics.map((topic) => (
                <span key={topic} className="rounded-full border border-white/12 bg-white/10 px-3 py-1 text-sm font-bold text-white/70">#{topic}</span>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button href={course.url} target="_blank" rel="noreferrer" label="원문 강의 열기" variant="primary" size="lg" />
              <ProgressButton slug={course.slug} status="saved" />
              <ProgressButton slug={course.slug} status="in-progress" />
              <ProgressButton slug={course.slug} status="done" />
            </div>
          </div>

          <aside className="border-t border-white/10 bg-white/10 p-6 backdrop-blur md:p-8 lg:border-l lg:border-t-0">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-white/50">Course dossier</p>
            <div className="mt-5 grid gap-3">
              <Metric label="강의 수" value={`${lessons.length || "?"}`} />
              <Metric label="기간" value={`${course.durationWeeks ?? "?"}주`} />
              <Metric label="과제" value={course.hasAssignments ? "있음" : "적음"} />
              <Metric label="영상" value={course.hasVideos ? "있음" : "없음"} />
            </div>
          </aside>
        </div>
      </section>

      {lessons.length > 0 ? <LessonPlayer lessons={lessons} courseSlug={course.slug} /> : null}

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <Info title="추천 대상" items={course.recommendedFor} />
        <Info title="선행 지식" items={course.prerequisites} />
        <Info title="학습 정보" items={[`${course.durationWeeks ?? "?"}주`, course.hasAssignments ? "과제 있음" : "과제 적음/없음", course.hasVideos ? "영상 있음" : "영상 없음"]} />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] p-6 ocs-panel md:p-7">
          <p className="ocs-kicker">Why this course</p>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-[var(--color-text-primary)]">왜 들어야 하나요?</h2>
          <p className="mt-3 leading-7 text-[var(--color-text-secondary)]">{course.whyTakeThis}</p>
          {course.caution ? <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold leading-6 text-amber-900">주의: {course.caution}</p> : null}
        </div>

        {includedRoadmaps.length > 0 ? (
          <div className="rounded-[2rem] p-6 ocs-panel md:p-7">
            <p className="ocs-kicker">Roadmap links</p>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-[var(--color-text-primary)]">포함된 로드맵</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {includedRoadmaps.map((roadmap) => <Link key={roadmap.slug} href={`/roadmaps/${roadmap.slug}`} className="rounded-full bg-[var(--ocs-ink)] px-4 py-2 text-sm font-black text-white">{roadmap.title}</Link>)}
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-white/40">{label}</p>
      <p className="mt-1 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function Info({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[1.75rem] p-5 ocs-panel">
      <h2 className="text-sm font-black uppercase tracking-[0.16em] text-[var(--color-text-tertiary)]">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm font-semibold text-[var(--color-text-secondary)]">
        {items.map((item) => <li key={item} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--ocs-accent)]" />{item}</li>)}
      </ul>
    </div>
  );
}
