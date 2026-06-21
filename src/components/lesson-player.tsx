"use client";

import React, { useState } from "react";
import type { CourseLesson } from "@/data/lessons";

export function LessonPlayer({ lessons }: { lessons: CourseLesson[] }) {
  const [selected, setSelected] = useState(lessons[0]);

  if (!selected) return null;

  return (
    <section className="mt-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold text-blue-700">강의 시청</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">{selected.title}</h2>
          <p className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            V1 학습관리 중심
          </p>
        </div>
        <a href={selected.cs50Url ?? selected.sourceUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-700">
          강의 자료 열기 →
        </a>
      </div>

      <div className="mt-5 overflow-hidden rounded-3xl bg-slate-950 shadow-inner">
        <div className="relative aspect-video">
          <iframe
            key={selected.videoId}
            className="h-full w-full"
            src={selected.embedUrl}
            title={selected.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">학습관리</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
          V1은 해외 유명 대학 강의를 한곳에서 고르고, 저장·학습 중·완료 상태로 관리하며 시청하는 데 집중합니다.
        </p>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
          한글 자막과 transcript 기반 학습 레이어는 V2 계획으로 분리했습니다.
        </p>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
          진행 상태는 상단의 저장·학습 중·완료 버튼으로 관리하세요.
        </p>
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
