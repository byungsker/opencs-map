import { describe, expect, it } from "vitest";
import { getLessonStudyGuide } from "@/lib/lesson-study-guide";

describe("lesson study guides", () => {
  it("returns the Korean study guide for CS50 Week 0", () => {
    const guide = getLessonStudyGuide("UuIEbpQms8o");

    expect(guide?.title).toBe("Scratch로 컴퓨터과학의 감각 잡기");
    expect(guide?.keyConcepts).toContain("알고리즘");
    expect(guide?.checklist).toContain("조건문과 반복문이 프로그램 흐름을 어떻게 바꾸는지 말로 설명할 수 있다.");
  });

  it("returns null for lessons without a guide yet", () => {
    expect(getLessonStudyGuide("unknown-video-id")).toBeNull();
  });
});
