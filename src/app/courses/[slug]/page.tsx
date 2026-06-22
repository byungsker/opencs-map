import Link from "next/link";
import { notFound } from "next/navigation";
import { ProgressButton } from "@/components/progress-button";
import { LessonPlayer } from "@/components/lesson-player";
import { courses } from "@/data/courses";
import { roadmaps } from "@/data/roadmaps";
import { getCourseBySlug, getCourseLessons } from "@/lib/catalog";

export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const course = getCourseBySlug(params.slug);
  return { title: course ? `${course.koreanTitle} | OpenCS Map` : "Course | OpenCS Map" };
}

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = getCourseBySlug(params.slug);
  if (!course) notFound();

  const includedRoadmaps = roadmaps.filter((roadmap) => roadmap.steps.some((step) => step.courseSlug === course.slug));
  const lessons = getCourseLessons(course.slug);

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <Link href="/courses" className="text-sm font-bold text-blue-700">← 강의 목록으로</Link>
      <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-xl">
        <div className="flex flex-wrap gap-2 text-xs font-bold text-blue-700">
          <span className="rounded-full bg-blue-50 px-3 py-1">{course.institution}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{course.platform}</span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">무료</span>
        </div>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950">{course.koreanTitle}</h1>
        <p className="mt-2 text-lg font-semibold text-slate-500">{course.title}</p>
        <p className="mt-6 text-lg leading-8 text-slate-700">{course.summaryKo}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {course.topics.map((topic) => <span key={topic} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">#{topic}</span>)}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={course.url} target="_blank" rel="noreferrer" className="rounded-full bg-blue-600 px-5 py-3 font-bold text-white">원문 강의 열기</a>
          <ProgressButton slug={course.slug} status="saved" />
          <ProgressButton slug={course.slug} status="in-progress" />
          <ProgressButton slug={course.slug} status="done" />
        </div>
      </section>

      {lessons.length > 0 ? <LessonPlayer lessons={lessons} courseSlug={course.slug} /> : null}

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <Info title="추천 대상" items={course.recommendedFor} />
        <Info title="선행 지식" items={course.prerequisites} />
        <Info title="학습 정보" items={[`${course.durationWeeks ?? "?"}주`, course.hasAssignments ? "과제 있음" : "과제 적음/없음", course.hasVideos ? "영상 있음" : "영상 없음"]} />
      </section>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white/90 p-6">
        <h2 className="text-xl font-black">왜 들어야 하나요?</h2>
        <p className="mt-3 leading-7 text-slate-700">{course.whyTakeThis}</p>
        {course.caution ? <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">주의: {course.caution}</p> : null}
      </section>

      {includedRoadmaps.length > 0 ? (
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white/90 p-6">
          <h2 className="text-xl font-black">포함된 로드맵</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {includedRoadmaps.map((roadmap) => <Link key={roadmap.slug} href={`/roadmaps/${roadmap.slug}`} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white">{roadmap.title}</Link>)}
          </div>
        </section>
      ) : null}
    </main>
  );
}

function Info({ title, items }: { title: string; items: string[] }) {
  return <div className="rounded-3xl border border-slate-200 bg-white/90 p-5"><h2 className="font-black text-slate-950">{title}</h2><ul className="mt-3 space-y-2 text-sm text-slate-700">{items.map((item) => <li key={item}>• {item}</li>)}</ul></div>;
}
