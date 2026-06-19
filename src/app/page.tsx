import Link from "next/link";
import { CourseCard } from "@/components/course-card";
import { RoadmapCard } from "@/components/roadmap-card";
import { courses } from "@/data/courses";
import { roadmaps } from "@/data/roadmaps";

export default function Home() {
  const featured = courses.slice(0, 6);

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 md:py-16">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">OpenCS Map</p>
          <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-6xl">해외 무료 CS 강의, 어디서부터 들을지 모르겠다면</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">Harvard, MIT, Stanford, Berkeley, CMU의 무료 CS 강의를 한국어 학습자 기준으로 정리했습니다. 목표별 로드맵을 고르고, 내 속도로 따라가세요.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/roadmaps" className="rounded-full bg-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-200">로드맵 보기</Link>
            <Link href="/courses" className="rounded-full border border-slate-300 bg-white px-6 py-3 font-bold text-slate-800">강의 탐색하기</Link>
          </div>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-xl">
          <p className="text-sm font-bold text-slate-500">MVP 데이터셋</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {[['20+', '무료 강의'], ['3', '목표별 로드맵'], ['6', '주요 기관'], ['100%', '무료 링크']].map(([value, label]) => (
              <div key={label} className="rounded-3xl bg-slate-50 p-5"><p className="text-3xl font-black text-slate-950">{value}</p><p className="mt-1 text-sm text-slate-500">{label}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div><p className="text-sm font-bold text-blue-700">Roadmaps</p><h2 className="text-3xl font-black">목표별 추천 경로</h2></div>
          <Link href="/roadmaps" className="text-sm font-bold text-blue-700">전체 보기 →</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">{roadmaps.map((roadmap) => <RoadmapCard key={roadmap.slug} roadmap={roadmap} />)}</div>
      </section>

      <section className="mt-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div><p className="text-sm font-bold text-blue-700">Courses</p><h2 className="text-3xl font-black">먼저 볼 만한 강의</h2></div>
          <Link href="/courses" className="text-sm font-bold text-blue-700">전체 탐색 →</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{featured.map((course) => <CourseCard key={course.slug} course={course} />)}</div>
      </section>
    </main>
  );
}
