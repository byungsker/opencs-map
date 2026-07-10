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
    <Link
      href={`/courses/${course.slug}`}
      className="group relative flex min-h-[21rem] flex-col justify-between overflow-hidden rounded-[1.75rem] border border-[var(--ocs-line)] bg-[var(--color-background-surface)] p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgb(9_11_18/0.16)]"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-[var(--ocs-ink)] transition group-hover:bg-[var(--ocs-accent)]" />
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[var(--ocs-glow)] blur-2xl" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="grid gap-2 text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text-tertiary)]">
            <span>{course.institution}</span>
            <span className="w-fit rounded-full border border-[var(--ocs-line)] bg-[var(--color-background-muted)] px-3 py-1 tracking-normal text-[var(--color-text-secondary)]">{difficultyLabel[course.difficulty]}</span>
          </div>
          <span className="shrink-0 rounded-full bg-[var(--ocs-ink)] px-3 py-1 text-xs font-black text-white">
            {friendlinessLabel[course.koreanFriendliness]}
          </span>
        </div>
        <h3 className="mt-8 text-2xl font-black tracking-[-0.04em] text-[var(--color-text-primary)] transition group-hover:text-[var(--ocs-accent)]">
          {course.koreanTitle}
        </h3>
        <p className="mt-2 text-sm font-bold text-[var(--color-text-tertiary)]">{course.title}</p>
        <p className="mt-5 line-clamp-3 text-sm leading-6 text-[var(--color-text-secondary)]">{course.summaryKo}</p>
      </div>
      <div className="relative mt-6 border-t border-[var(--ocs-line)] pt-4">
        <div className="flex flex-wrap gap-2">
          {course.topics.slice(0, 4).map((topic) => (
            <span key={topic} className="rounded-full bg-[var(--color-background-muted)] px-2.5 py-1 text-xs font-bold text-[var(--color-text-secondary)]">#{topic}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
