import { describe, expect, it, beforeEach } from "vitest";
import {
  getCourseProgressSummary,
  getLessonNote,
  getLastWatchedLesson,
  getStoredLessonProgress,
  setLastWatchedLesson,
  setLessonCompleted,
  setLessonNote,
  setLessonWatchedUntilEnd,
} from "@/lib/lesson-progress";
import { getCourseLessons } from "@/lib/catalog";

describe("lesson-level learning progress", () => {
  const courseSlug = "harvard-cs50x";
  const lessons = getCourseLessons(courseSlug);

  beforeEach(() => {
    localStorage.clear();
  });

  it("calculates course progress from completed lessons", () => {
    setLessonCompleted(courseSlug, lessons[0].videoId, true);
    setLessonCompleted(courseSlug, lessons[1].videoId, true);

    expect(getCourseProgressSummary(courseSlug, lessons)).toEqual({
      completedCount: 2,
      totalCount: lessons.length,
      percentage: Math.round((2 / lessons.length) * 100),
    });
  });

  it("stores the last watched lesson so the resume position is visible", () => {
    setLastWatchedLesson(courseSlug, lessons[3].videoId);

    expect(getLastWatchedLesson(courseSlug, lessons)?.title).toBe("Week 3: Algorithms");
  });

  it("stores notes per course lesson without marking the lesson complete", () => {
    setLessonNote(courseSlug, lessons[0].videoId, "Scratch 이벤트랑 반복문 복습하기");

    expect(getLessonNote(courseSlug, lessons[0].videoId)).toBe("Scratch 이벤트랑 반복문 복습하기");
    expect(getStoredLessonProgress(courseSlug).completedLessonIds).toEqual([]);
  });

  it("tracks watched-until-end separately from explicit completion", () => {
    setLessonWatchedUntilEnd(courseSlug, lessons[0].videoId, true);

    expect(getStoredLessonProgress(courseSlug).watchedUntilEndLessonIds).toEqual([lessons[0].videoId]);
    expect(getStoredLessonProgress(courseSlug).completedLessonIds).toEqual([]);
  });
});
