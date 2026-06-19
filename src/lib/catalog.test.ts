import { describe, expect, it } from "vitest";
import { courses } from "@/data/courses";
import { roadmaps } from "@/data/roadmaps";
import { filterCourses, getCourseBySlug, getRoadmapCourses } from "@/lib/catalog";

describe("course catalog", () => {
  it("starts with at least 20 curated free CS courses", () => {
    expect(courses.length).toBeGreaterThanOrEqual(20);
    expect(courses.every((course) => course.isFree)).toBe(true);
  });

  it("finds a course by slug", () => {
    expect(getCourseBySlug("harvard-cs50x")?.koreanTitle).toContain("컴퓨터과학");
  });

  it("filters courses by difficulty, topic, institution, and search query", () => {
    const result = filterCourses(courses, {
      difficulty: "intro",
      topic: "CS입문",
      institution: "Harvard",
      query: "cs50",
    });

    expect(result.map((course) => course.slug)).toEqual(["harvard-cs50x"]);
  });

  it("returns roadmap steps with resolved course metadata in order", () => {
    const beginner = roadmaps.find((roadmap) => roadmap.slug === "non-cs-beginner")!;
    const steps = getRoadmapCourses(beginner);

    expect(steps).toHaveLength(beginner.steps.length);
    expect(steps[0].course.slug).toBe("harvard-cs50x");
    expect(steps.map((step) => step.order)).toEqual([1, 2, 3, 4]);
  });
});
