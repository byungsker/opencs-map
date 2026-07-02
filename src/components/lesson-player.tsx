"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { CourseLesson } from "@/data/lessons";
import { getLessonStudyGuide } from "@/lib/lesson-study-guide";
import {
  getLastWatchedLesson,
  getLessonNote,
  getLessonProgressId,
  getStoredLessonProgress,
  setLastWatchedLesson,
  setLessonCompleted,
  setLessonNote,
  setLessonWatchedUntilEnd,
} from "@/lib/lesson-progress";

function safeParseYouTubeMessage(data: string) {
  try {
    return JSON.parse(data) as { event?: string; info?: number };
  } catch {
    return null;
  }
}

export function LessonPlayer({ lessons, courseSlug = "harvard-cs50x" }: { lessons: CourseLesson[]; courseSlug?: string }) {
  const initialLesson = getLastWatchedLesson(courseSlug, lessons) ?? lessons[0];
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [selected, setSelected] = useState(initialLesson);
  const [progress, setProgress] = useState(() => getStoredLessonProgress(courseSlug));
  const [note, setNote] = useState(() => (initialLesson ? getLessonNote(courseSlug, getLessonProgressId(courseSlug, initialLesson)) : ""));
  const [completionPrompt, setCompletionPrompt] = useState<"manual" | "watched-until-end" | null>(null);

  const progressSummary = useMemo(() => {
    const completed = new Set(progress.completedLessonIds);
    const completedCount = lessons.filter((lesson) => completed.has(getLessonProgressId(courseSlug, lesson))).length;
    const totalCount = lessons.length;

    return {
      completedCount,
      totalCount,
      percentage: totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100),
    };
  }, [courseSlug, lessons, progress.completedLessonIds]);
  const completedLessonIds = useMemo(() => new Set(progress.completedLessonIds), [progress.completedLessonIds]);
  const watchedUntilEndLessonIds = useMemo(
    () => new Set(progress.watchedUntilEndLessonIds),
    [progress.watchedUntilEndLessonIds]
  );

  useEffect(() => {
    const handleYouTubeMessage = (event: MessageEvent) => {
      if (!event.origin.includes("youtube.com") || !selected) return;

      const data = typeof event.data === "string" ? safeParseYouTubeMessage(event.data) : event.data;
      if (data?.event !== "onStateChange" || data.info !== 0) return;
      const selectedId = getLessonProgressId(courseSlug, selected);
      if (completedLessonIds.has(selectedId)) return;

      setLessonWatchedUntilEnd(courseSlug, selectedId, true);
      setProgress(getStoredLessonProgress(courseSlug));
      setCompletionPrompt("watched-until-end");
    };

    window.addEventListener("message", handleYouTubeMessage);
    return () => window.removeEventListener("message", handleYouTubeMessage);
  }, [completedLessonIds, courseSlug, selected]);

  const registerYouTubeStateListener = () => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: "addEventListener", args: ["onStateChange"] }),
      "https://www.youtube.com"
    );
  };

  if (!selected) return null;

  const selectLesson = (lesson: CourseLesson) => {
    setSelected(lesson);
    setCompletionPrompt(null);
    setLastWatchedLesson(courseSlug, getLessonProgressId(courseSlug, lesson));
    setProgress(getStoredLessonProgress(courseSlug));
    setNote(getLessonNote(courseSlug, getLessonProgressId(courseSlug, lesson)));
  };

  const selectedIndex = lessons.findIndex((lesson) => getLessonProgressId(courseSlug, lesson) === getLessonProgressId(courseSlug, selected));
  const nextLesson = selectedIndex >= 0 ? lessons[selectedIndex + 1] : undefined;

  const openCompletionPrompt = () => {
    const selectedId = getLessonProgressId(courseSlug, selected);
    if (completedLessonIds.has(selectedId)) {
      setLessonCompleted(courseSlug, selectedId, false);
      setProgress(getStoredLessonProgress(courseSlug));
      return;
    }

    setCompletionPrompt("manual");
  };

  const completeSelectedLesson = (moveNext: boolean) => {
    setLessonCompleted(courseSlug, getLessonProgressId(courseSlug, selected), true);
    setProgress(getStoredLessonProgress(courseSlug));
    setCompletionPrompt(null);

    if (moveNext && nextLesson) {
      selectLesson(nextLesson);
    }
  };

  const closeCompletionPrompt = () => {
    setCompletionPrompt(null);
  };

  const updateNote = (value: string) => {
    setNote(value);
    setLessonNote(courseSlug, getLessonProgressId(courseSlug, selected), value);
    setProgress(getStoredLessonProgress(courseSlug));
  };

  const selectedId = getLessonProgressId(courseSlug, selected);
  const selectedCompleted = completedLessonIds.has(selectedId);
  const selectedStudyGuide = selected.videoId ? getLessonStudyGuide(selected.videoId) : null;

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
            {selected.embedUrl ? (
              <iframe
                ref={iframeRef}
                key={selectedId}
                className="h-full w-full"
                src={selected.embedUrl}
                title={selected.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onLoad={registerYouTubeStateListener}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4 bg-slate-950 p-8 text-center text-white">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-200">공식 강의 자료</p>
                <h3 className="text-2xl font-black">{selected.title}</h3>
                <p className="max-w-xl text-sm font-semibold leading-6 text-slate-300">
                  이 강의는 공식 페이지/슬라이드/강의 자료 링크로 제공돼요. 아래 버튼으로 원문 강의를 열고, 완료 상태와 노트는 OpenCS Map에서 계속 관리할 수 있어요.
                </p>
                <a
                  href={selected.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-sm"
                >
                  공식 강의 열기 →
                </a>
              </div>
            )}
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
            onClick={openCompletionPrompt}
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
            const lessonId = getLessonProgressId(courseSlug, lesson);
            const active = lessonId === selectedId;
            const completed = completedLessonIds.has(lessonId);
            const watchedUntilEnd = watchedUntilEndLessonIds.has(lessonId);
            return (
              <button
                key={lessonId}
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
                {watchedUntilEnd && !completed ? (
                  <span className="ml-2 mt-2 inline-flex rounded-full bg-amber-100 px-2 py-1 text-[11px] font-black text-amber-700">
                    끝까지 시청
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="grid gap-4">
          <div className="rounded-3xl border border-indigo-100 bg-indigo-50/70 p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-700">CS50 Study Guide</p>
            {selectedStudyGuide ? (
              <div className="mt-3">
                <h3 className="text-xl font-black text-slate-950">{selectedStudyGuide.title}</h3>
                <div className="mt-4 grid gap-4">
                  <section>
                    <h4 className="text-sm font-black text-slate-950">이번 강의에서 얻어야 할 것</h4>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-semibold leading-6 text-slate-700">
                      {selectedStudyGuide.outcomes.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </section>
                  <section>
                    <h4 className="text-sm font-black text-slate-950">핵심 개념</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedStudyGuide.keyConcepts.map((concept) => (
                        <span key={concept} className="rounded-full bg-white px-3 py-1 text-xs font-black text-indigo-700 shadow-sm">
                          {concept}
                        </span>
                      ))}
                    </div>
                  </section>
                  <section>
                    <h4 className="text-sm font-black text-slate-950">비전공자 주의 포인트</h4>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-semibold leading-6 text-slate-700">
                      {selectedStudyGuide.confusingPoints.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </section>
                  <section>
                    <h4 className="text-sm font-black text-slate-950">다음 강의로 넘어가기 전 체크리스트</h4>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-semibold leading-6 text-slate-700">
                      {selectedStudyGuide.checklist.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </section>
                  <section>
                    <h4 className="text-sm font-black text-slate-950">다음 액션</h4>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-semibold leading-6 text-slate-700">
                      {selectedStudyGuide.nextActions.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </section>
                </div>
              </div>
            ) : (
              <div className="mt-3 rounded-2xl bg-white p-4 shadow-sm">
                <h3 className="text-base font-black text-slate-950">이 강의의 학습 가이드는 준비 중이에요.</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                  Week 0~2부터 검증한 뒤 확장합니다. 지금은 강의를 시청하고 노트에 헷갈린 지점을 남겨두세요.
                </p>
              </div>
            )}
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
      </div>

      {completionPrompt ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="강의 완료 확인"
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
          >
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-700">강의 완료 확인</p>
            <h3 className="mt-3 text-2xl font-black text-slate-950">강의를 완료 처리할까요?</h3>
            {completionPrompt === "watched-until-end" ? (
              <>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">끝까지 시청한 강의예요.</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                  완료 처리한 뒤 다음 강의로 넘어갈까요?
                </p>
              </>
            ) : (
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
                완료 버튼을 눌렀어요. 완료 처리한 뒤 다음 강의로 넘어갈까요?
              </p>
            )}
            <p className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-700">{selected.title}</p>
            <div className="mt-5 grid gap-2">
              {nextLesson ? (
                <button
                  type="button"
                  onClick={() => completeSelectedLesson(true)}
                  className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white shadow-sm"
                >
                  완료하고 다음 강의 보기
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => completeSelectedLesson(false)}
                className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700"
              >
                완료만 하기
              </button>
              <button
                type="button"
                onClick={closeCompletionPrompt}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-600"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
