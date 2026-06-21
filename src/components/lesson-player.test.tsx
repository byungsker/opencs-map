import React from "react";
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LessonPlayer } from "@/components/lesson-player";
import { getCourseLessons } from "@/lib/catalog";

describe("LessonPlayer", () => {
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
    expect(screen.getByText("진행 상태는 상단의 저장·학습 중·완료 버튼으로 관리하세요.")).toBeInTheDocument();
    expect(screen.queryByText(/Custom Korean captions/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/학습 자막 초안/)).not.toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
