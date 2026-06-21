"use client";

import React, { useEffect, useRef, useState } from "react";
import type { CourseLesson, LessonCaption } from "@/data/lessons";

type YouTubePlayer = {
  getCurrentTime: () => number;
};

type YouTubeNamespace = {
  Player: new (element: HTMLIFrameElement) => YouTubePlayer;
};

declare global {
  interface Window {
    YT?: YouTubeNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<YouTubeNamespace> | null = null;

function loadYouTubeApi() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("YouTube API is only available in the browser"));
  }

  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  if (!youtubeApiPromise) {
    youtubeApiPromise = new Promise((resolve) => {
      const previousReady = window.onYouTubeIframeAPIReady;

      window.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        if (window.YT) resolve(window.YT);
      };

      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(script);
      }
    });
  }

  return youtubeApiPromise;
}

function findActiveCaption(captions: LessonCaption[], currentTime: number) {
  return captions.find((caption) => currentTime >= caption.startSeconds && currentTime < caption.endSeconds);
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function LessonPlayer({ lessons }: { lessons: CourseLesson[] }) {
  const [selected, setSelected] = useState(lessons[0]);
  const [currentTime, setCurrentTime] = useState(0);
  const [captions, setCaptions] = useState<LessonCaption[]>([]);
  const [captionStatus, setCaptionStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!selected?.captionsUrl) {
      setCaptions([]);
      setCaptionStatus("idle");
      return;
    }

    let cancelled = false;
    setCaptions([]);
    setCaptionStatus("loading");

    fetch(selected.captionsUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load captions: ${response.status}`);
        return response.json() as Promise<LessonCaption[]>;
      })
      .then((loadedCaptions) => {
        if (cancelled) return;
        setCaptions(loadedCaptions);
        setCaptionStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setCaptions([]);
        setCaptionStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [selected]);

  useEffect(() => {
    if (!selected || !iframeRef.current) return;

    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | undefined;

    setCurrentTime(0);

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled || !iframeRef.current) return;

        const player = new YT.Player(iframeRef.current);
        timer = setInterval(() => {
          try {
            setCurrentTime(player.getCurrentTime());
          } catch {
            // The iframe can briefly be unavailable while YouTube remounts.
          }
        }, 500);
      })
      .catch(() => {
        // Keep the curated Korean captions visible even if YouTube's JS API is blocked.
        setCurrentTime(0);
      });

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [selected]);

  if (!selected) return null;

  const activeCaption = findActiveCaption(captions, currentTime);
  const overlayCaption = currentTime > 1 ? activeCaption : undefined;
  const hasTimedCaptions = captions.length > 0;

  return (
    <section className="mt-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold text-blue-700">바로 보기</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">{selected.title}</h2>
          <p className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            {selected.captionLabel ?? "자체 한글 자막"}
          </p>
        </div>
        <a href={selected.cs50Url ?? selected.sourceUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-700">
          강의 자료 열기 →
        </a>
      </div>

      <div className="mt-5 overflow-hidden rounded-3xl bg-slate-950 shadow-inner">
        <div className="relative aspect-video">
          <iframe
            ref={iframeRef}
            key={selected.videoId}
            className="h-full w-full"
            src={selected.embedUrl}
            title={selected.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
          {overlayCaption ? (
            <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-2xl bg-slate-950/85 px-4 py-3 text-center text-sm font-bold leading-relaxed text-white shadow-lg backdrop-blur sm:text-base">
              <span className="mr-2 rounded-full bg-emerald-400/20 px-2 py-1 text-[11px] text-emerald-100">
                학습 자막 초안 {formatTime(overlayCaption.startSeconds)}
              </span>
              {overlayCaption.textKo}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Custom Korean captions</p>
        {hasTimedCaptions ? (
          <>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
              YouTube transcript timestamp를 기준으로 만든 한국어 학습 자막 초안입니다. 자동 생성·기계번역·광고 구간 때문에 일부 싱크와 번역이 다를 수 있습니다.
            </p>
            <div className="mt-3 grid gap-2 text-xs font-bold text-slate-700 sm:grid-cols-3">
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2">
                검수 상태: 기계 생성 초안
              </div>
              <div className="rounded-2xl border border-sky-200 bg-sky-50 px-3 py-2">
                기준: transcript timestamp
              </div>
              <div className="rounded-2xl border border-violet-200 bg-violet-50 px-3 py-2">
                목표: 학습 레이어 우선
              </div>
            </div>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-800">
              전체 자막 보장보다 챕터·요약·용어·퀴즈 중심의 학습 레이어를 우선합니다.
            </p>
            <ol className="mt-3 max-h-96 space-y-2 overflow-y-auto pr-2 text-sm text-slate-700">
              {captions.map((caption) => {
                return (
                  <li
                    key={`${selected.videoId}-${caption.startSeconds}`}
                    className={activeCaption && caption.startSeconds === activeCaption.startSeconds ? "rounded-xl bg-white px-3 py-2 font-bold text-emerald-800 shadow-sm" : "px-3 py-2"}
                  >
                    <span className="mr-2 font-mono text-xs text-slate-500">{formatTime(caption.startSeconds)}</span>
                    {caption.textKo}
                  </li>
                );
              })}
            </ol>
          </>
        ) : captionStatus === "loading" ? (
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
            자체 한글 자막을 불러오는 중입니다.
          </p>
        ) : captionStatus === "error" ? (
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
            자막 파일을 불러오지 못했습니다. 영상은 그대로 볼 수 있고, 학습 레이어는 다시 시도해 주세요.
          </p>
        ) : (
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
            이 강의는 아직 전체 자막을 제공하지 않습니다. 앞으로는 자막을 일일이 코드에 넣지 않고, 검수 가능한 챕터·요약·용어 학습 레이어로 확장합니다.
          </p>
        )}
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
