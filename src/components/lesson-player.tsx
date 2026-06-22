"use client";

import React, { useMemo, useState } from "react";
import type { CourseLesson } from "@/data/lessons";
import {
  getLastWatchedLesson,
  getLessonNote,
  getStoredLessonProgress,
  setLastWatchedLesson,
  setLessonCompleted,
  setLessonNote,
} from "@/lib/lesson-progress";

export function LessonPlayer({ lessons, courseSlug = "harvard-cs50x" }: { lessons: CourseLesson[]; courseSlug?: string }) {
  const initialLesson = getLastWatchedLesson(courseSlug, lessons) ?? lessons[0];
  const [selected, setSelected] = useState(initialLesson);
  const [progress, setProgress] = useState(() => getStoredLessonProgress(courseSlug));
  const [note, setNote] = useState(() => (initialLesson ? getLessonNote(courseSlug, initialLesson.videoId) : ""));

  const progressSummary = useMemo(() => {
    const completed = new Set(progress.completedLessonIds);
    const completedCount = lessons.filter((lesson) => completed.has(lesson.videoId)).length;
    const totalCount = lessons.length;

    return {
      completedCount,
      totalCount,
      percentage: totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100),
    };
  }, [lessons, progress.completedLessonIds]);
  const completedLessonIds = useMemo(() => new Set(progress.completedLessonIds), [progress.completedLessonIds]);

  if (!selected) return null;

  const selectLesson = (lesson: CourseLesson) => {
    setSelected(lesson);
    setLastWatchedLesson(courseSlug, lesson.videoId);
    setProgress(getStoredLessonProgress(courseSlug));
    setNote(getLessonNote(courseSlug, lesson.videoId));
  };

  const toggleCompleted = () => {
    const nextCompleted = !completedLessonIds.has(selected.videoId);
    setLessonCompleted(courseSlug, selected.videoId, nextCompleted);
    setProgress(getStoredLessonProgress(courseSlug));
  };

  const updateNote = (value: string) => {
    setNote(value);
    setLessonNote(courseSlug, selected.videoId, value);
    setProgress(getStoredLessonProgress(courseSlug));
  };

  const selectedCompleted = completedLessonIds.has(selected.videoId);

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

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.7fr_1fr]">
        <div className="overflow-hidden rounded-3xl bg-slate-950 shadow-inner">
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

        <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">코스 진행률</p>
              <p className="mt-2 text-3xl font-black text-slate-950">{progressSummary.percentage}% 완료</p>
              <p className="mt-1 text-sm font-bold text-slate-600">
                {progressSummary.completedCount} / {progressSummary.totalCount}강 완료
              </p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-600 shadow-sm">
              V1
            </span>
          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200" aria-label="코스 진행률 바">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{ width: `${progressSummary.percentage}%` }}
            />
          </div>

          <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-black text-slate-500">이어볼 위치</p>
            <p className="mt-1 text-sm font-black text-slate-950" aria-label={`이어볼 위치: ${selected.title}`}>
              이어볼 위치: {selected.title}
            </p>
            <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
              마지막으로 누른 강의를 저장해 다음에 같은 위치에서 다시 시작할 수 있게 했습니다.
            </p>
          </div>

          <button
            type="button"
            onClick={toggleCompleted}
            className={selectedCompleted
              ? "mt-4 w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700"
              : "mt-4 w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white shadow-sm"}
          >
            {selectedCompleted ? "완료 취소" : "이 강의 완료"}
          </button>
        </aside>
      </div>

      <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">학습관리</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
          V1은 해외 유명 대학 강의를 한곳에서 고르고, 저장·학습 중·완료 상태로 관리하며 시청하는 데 집중합니다.
        </p>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
          한글 자막과 transcript 기반 학습 레이어는 V2 계획으로 분리했습니다.
        </p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-2 sm:grid-cols-2">
          {lessons.map((lesson) => {
            const active = lesson.videoId === selected.videoId;
            const completed = completedLessonIds.has(lesson.videoId);
            return (
              <button
                key={lesson.videoId}
                type="button"
                onClick={() => selectLesson(lesson)}
                className={active
                  ? "rounded-2xl bg-blue-600 px-4 py-3 text-left text-sm font-bold text-white shadow-sm"
                  : "rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-700"}
              >
                <span className="block text-xs opacity-70">{lesson.order}강</span>
                <span className="block">{lesson.title}</span>
                <span className={completed ? "mt-2 inline-flex rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-black text-emerald-700" : "mt-2 inline-flex rounded-full bg-slate-100 px-2 py-1 text-[11px] font-black text-slate-500"}>
                  {completed ? "완료" : "미완료"}
                </span>
              </button>
            );
          })}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <label htmlFor="lesson-note" className="text-sm font-black text-slate-950">
            선택한 강의 노트
          </label>
          <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
            {selected.title}를 보면서 남길 메모를 브라우저에 저장합니다.
          </p>
          <textarea
            id="lesson-note"
            value={note}
            onChange={(event) => updateNote(event.target.value)}
            placeholder="헷갈린 개념, 다시 볼 timestamp, 과제 메모를 적어두세요."
            className="mt-3 min-h-40 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white"
          />
        </div>
      </div>
    </section>
  );
}
