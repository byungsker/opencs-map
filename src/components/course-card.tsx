import Link from "next/link";
import type { Course } from "@/types/course";

const difficultyLabel = {
  intro: "입문",
  beginner: "초급",
  intermediate: "중급",
  advanced: "고급",
};

const friendlinessLabel = {
  high: "한국어 친화도 높음",
  medium: "한국어 친화도 보통",
  low: "한국어 친화도 낮음",
};

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.slug}`} className="group block rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-blue-700">
        <span className="rounded-full bg-blue-50 px-3 py-1">{course.institution}</span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{difficultyLabel[course.difficulty]}</span>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{friendlinessLabel[course.koreanFriendliness]}</span>
      </div>
      <h3 className="text-lg font-bold text-slate-950 group-hover:text-blue-700">{course.koreanTitle}</h3>
      <p className="mt-1 text-sm font-medium text-slate-500">{course.title}</p>
      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-700">{course.summaryKo}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {course.topics.slice(0, 4).map((topic) => (
          <span key={topic} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">#{topic}</span>
        ))}
      </div>
    </Link>
  );
}
