import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LessonPlayer } from "@/components/lesson-player";
import { getCourseLessons } from "@/lib/catalog";

describe("LessonPlayer", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps v1 focused on watching lectures and course progress while moving Korean captions to v2", () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    render(<LessonPlayer lessons={getCourseLessons("harvard-cs50x")} />);

    expect(screen.getByText("강의 시청" )).toBeInTheDocument();
    expect(screen.getByText(/V1은 해외 유명 대학 강의를 한곳에서 고르고, 저장·학습 중·완료 상태로 관리하며 시청하는 데 집중합니다/)).toBeInTheDocument();
    expect(screen.getByText(/한글 자막과 transcript 기반 학습 레이어는 V2 계획으로 분리했습니다/)).toBeInTheDocument();
    expect(screen.getByText("학습관리")).toBeInTheDocument();
    expect(screen.getByText("코스 진행률")).toBeInTheDocument();
    expect(screen.getByText("선택한 강의 노트")).toBeInTheDocument();
    expect(screen.queryByText(/Custom Korean captions/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/학습 자막 초안/)).not.toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("shows course progress, the visible resume lesson, and lesson notes", () => {
    const lessons = getCourseLessons("harvard-cs50x");

    render(<LessonPlayer lessons={lessons} />);

    expect(screen.getByText("코스 진행률")).toBeInTheDocument();
    expect(screen.getByText("0% 완료")).toBeInTheDocument();
    expect(screen.getByLabelText("이어볼 위치: Week 0: Scratch")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Week 1: C/ }));
    expect(screen.getByLabelText("이어볼 위치: Week 1: C")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "이 강의 완료" }));
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
});
