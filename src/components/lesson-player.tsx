"use client";

import { useState } from "react";
import type { CourseLesson } from "@/data/lessons";

export function LessonPlayer({ lessons }: { lessons: CourseLesson[] }) {
  const [selected, setSelected] = useState(lessons[0]);

  if (!selected) return null;

  return (
    <section className="mt-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold text-blue-700">바로 보기</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">{selected.title}</h2>
          {selected.captionLabel ? (
            <p className="mt-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
              {selected.captionLabel}
            </p>
          ) : null}
        </div>
        <a href={selected.cs50Url ?? selected.sourceUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-700">
          강의 자료 열기 →
        </a>
      </div>

      <div className="mt-5 aspect-video overflow-hidden rounded-3xl bg-slate-950 shadow-inner">
        <iframe
          key={selected.videoId}
          className="h-full w-full"
          src={selected.embedUrl}
          title={selected.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => {
          const active = lesson.videoId === selected.videoId;
          return (
            <button
              key={lesson.videoId}
              type="button"
              onClick={() => setSelected(lesson)}
              className={active
                ? "rounded-2xl bg-blue-600 px-4 py-3 text-left text-sm font-bold text-white shadow-sm"
                : "rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-700"}
            >
              <span className="block text-xs opacity-70">{lesson.order}강</span>
              {lesson.title}
            </button>
          );
        })}
      </div>
    </section>
  );
}
