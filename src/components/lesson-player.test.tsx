import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LessonPlayer } from "@/components/lesson-player";
import { getCourseLessons } from "@/lib/catalog";
import { getStoredLessonProgress } from "@/lib/lesson-progress";

describe("LessonPlayer", () => {
  const courseSlug = "harvard-cs50x";
  const lessons = getCourseLessons(courseSlug);

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps v1 focused on watching lectures and course progress while moving Korean captions to v2", () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    render(<LessonPlayer lessons={lessons} courseSlug={courseSlug} />);

    expect(screen.getByText("강의 시청")).toBeInTheDocument();
    expect(screen.getByText(/강의를 선택하고 시청 상태를 관리하세요/)).toBeInTheDocument();
    expect(screen.getByText(/한글 자막과 transcript 학습 레이어는 V2에서 다룹니다/)).toBeInTheDocument();
    expect(screen.getByText("학습관리")).toBeInTheDocument();
    expect(screen.getByText("코스 진행률")).toBeInTheDocument();
    expect(screen.getByText("선택한 강의 노트")).toBeInTheDocument();
    expect(screen.queryByText(/Custom Korean captions/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/학습 자막 초안/)).not.toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("reserves stable viewport space for the player and keeps the study guide sticky", () => {
    render(<LessonPlayer lessons={lessons} courseSlug={courseSlug} />);

    expect(screen.getByTestId("lesson-video-frame")).toHaveClass("aspect-video", "min-h-[260px]");
    expect(screen.getByTestId("lesson-workspace-grid")).toHaveClass("lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.75fr)]");
    expect(screen.getByTestId("study-guide-panel")).toHaveClass("lg:sticky", "lg:top-6", "lg:max-h-[calc(100dvh-3rem)]", "lg:overflow-auto");
  });

  it("keeps the learning management guidance compact and action-oriented", () => {
    render(<LessonPlayer lessons={lessons} courseSlug={courseSlug} />);

    expect(screen.getByText("학습관리").closest(".ocs-learning-notice")).not.toBeNull();
    expect(screen.getByText(/강의를 선택하고 시청 상태를 관리하세요/)).toBeInTheDocument();
    expect(screen.queryByText(/V1은 해외 유명 대학 강의를 한곳에서 고르고/)).not.toBeInTheDocument();
  });

  it("shows course progress, the visible resume lesson, and lesson notes", () => {
    render(<LessonPlayer lessons={lessons} courseSlug={courseSlug} />);

    expect(screen.getByText("코스 진행률")).toBeInTheDocument();
    expect(screen.getByText("0% 완료")).toBeInTheDocument();
    expect(screen.getByLabelText("이어볼 위치: Week 0: Scratch")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Week 1: C/ }));
    expect(screen.getByLabelText("이어볼 위치: Week 1: C")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "이 강의 완료" }));
    fireEvent.click(screen.getByRole("button", { name: "완료만 하기" }));
    expect(screen.getByText("9% 완료")).toBeInTheDocument();
    expect(screen.getByText("1 / 11강 완료")).toBeInTheDocument();

    const note = screen.getByLabelText("선택한 강의 노트") as HTMLTextAreaElement;
    fireEvent.change(note, { target: { value: "C 포인터 전까지 복습" } });
    expect(note.value).toBe("C 포인터 전까지 복습");

    fireEvent.click(screen.getByRole("button", { name: /Week 0: Scratch/ }));
    expect(screen.getByLabelText("선택한 강의 노트")).toHaveValue("");

    fireEvent.click(screen.getByRole("button", { name: /Week 1: C/ }));
    expect(screen.getByLabelText("선택한 강의 노트")).toHaveValue("C 포인터 전까지 복습");
  });

  it("asks for confirmation before completing a lesson from the complete button and can move to the next lesson", () => {
    render(<LessonPlayer lessons={lessons} courseSlug={courseSlug} />);

    fireEvent.click(screen.getByRole("button", { name: "이 강의 완료" }));

    expect(screen.getByRole("dialog", { name: "강의 완료 확인" })).toBeInTheDocument();
    expect(screen.getByText("강의를 완료 처리할까요?")).toBeInTheDocument();
    expect(getStoredLessonProgress(courseSlug).completedLessonIds).toEqual([]);

    fireEvent.click(screen.getByRole("button", { name: "완료하고 다음 강의 보기" }));

    expect(getStoredLessonProgress(courseSlug).completedLessonIds).toContain(lessons[0].videoId);
    expect(screen.queryByRole("dialog", { name: "강의 완료 확인" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: lessons[1].title })).toBeInTheDocument();
  });

  it("stores that a lesson was watched until the end when the YouTube player emits an ended event", () => {
    render(<LessonPlayer lessons={lessons} courseSlug={courseSlug} />);

    fireEvent(
      window,
      new MessageEvent("message", {
        origin: "https://www.youtube.com",
        data: JSON.stringify({ event: "onStateChange", info: 0 }),
      })
    );

    expect(getStoredLessonProgress(courseSlug).watchedUntilEndLessonIds).toContain(lessons[0].videoId);
    expect(getStoredLessonProgress(courseSlug).completedLessonIds).toEqual([]);
    expect(screen.getByRole("dialog", { name: "강의 완료 확인" })).toBeInTheDocument();
    expect(screen.getByText("끝까지 시청한 강의예요."));
  });

  it("shows a Korean study guide for CS50 Week 0 and changes the guide when the lesson changes", () => {
    render(<LessonPlayer lessons={lessons} courseSlug={courseSlug} />);

    expect(screen.getByText("CS50 Study Guide")).toBeInTheDocument();
    expect(screen.getByText("Scratch로 컴퓨터과학의 감각 잡기")).toBeInTheDocument();
    expect(screen.getByText("이번 강의에서 얻어야 할 것")).toBeInTheDocument();
    expect(screen.getByText("알고리즘")).toBeInTheDocument();
    expect(screen.getByText("조건문과 반복문이 프로그램 흐름을 어떻게 바꾸는지 말로 설명할 수 있다.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Week 1: C/ }));

    expect(screen.getByText("C로 컴퓨터가 실제로 일하는 방식 보기")).toBeInTheDocument();
    expect(screen.getByText("컴파일"));
  });

  it("shows a fallback when a lesson does not have a study guide yet", () => {
    render(<LessonPlayer lessons={lessons} courseSlug={courseSlug} />);

    fireEvent.click(screen.getByRole("button", { name: /Week 3: Algorithms/ }));

    expect(screen.getByText("이 강의의 학습 가이드는 준비 중이에요.")).toBeInTheDocument();
    expect(screen.getByText(/Week 0~2부터 검증한 뒤 확장합니다/)).toBeInTheDocument();
  });
});
