import Link from "next/link";
import { CourseExplorer } from "@/components/course-explorer";
import { courses } from "@/data/courses";

export default function CoursesPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <Link href="/" className="text-sm font-bold text-blue-700">← 홈으로</Link>
      <div className="mb-8 mt-6">
        <p className="text-sm font-bold text-blue-700">Course Catalog</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">무료 해외 CS 강의 탐색</h1>
        <p className="mt-4 max-w-3xl text-slate-700">난이도, 분야, 기관, 한국어 친화도를 기준으로 지금 들을 만한 강의를 골라보세요.</p>
      </div>
      <CourseExplorer courses={courses} />
    </main>
  );
}
