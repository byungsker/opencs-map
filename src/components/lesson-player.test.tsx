import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LessonPlayer } from "@/components/lesson-player";
import { getCourseLessons } from "@/lib/catalog";

const captions = [
  {
    startSeconds: 0,
    endSeconds: 15,
    textKo: "컴퓨터과학을 배우기 위한 첫 번째 학습 자막 초안입니다.",
    textEn: "This is the first learning caption draft.",
  },
];

describe("LessonPlayer", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => captions,
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("presents machine-generated captions as a reviewed learning-layer draft, not guaranteed synced subtitles", async () => {
    render(<LessonPlayer lessons={getCourseLessons("harvard-cs50x")} />);

    await waitFor(() => expect(screen.getByText(captions[0].textKo)).toBeInTheDocument());

    expect(screen.getByText("학습 자막 초안")).toBeInTheDocument();
    expect(screen.getByText(/YouTube transcript timestamp를 기준으로 만든 한국어 학습 자막 초안/)).toBeInTheDocument();
    expect(screen.getByText(/자동 생성·기계번역·광고 구간 때문에 일부 싱크와 번역이 다를 수 있습니다/)).toBeInTheDocument();
    expect(screen.getByText(/전체 자막 보장보다 챕터·요약·용어·퀴즈 중심의 학습 레이어를 우선합니다/)).toBeInTheDocument();
    expect(screen.queryByText(/실제 강의 transcript timestamp에 맞춘 자체 한글 자막/)).not.toBeInTheDocument();
  });
});
