import { describe, expect, it } from "vitest";
import { courses } from "@/data/courses";
import { courseLessons } from "@/data/lessons";
import { getCourseLessons } from "@/lib/catalog";

describe("course lessons", () => {
  it("exposes CS50 lectures as playable embedded lessons", () => {
    const lessons = getCourseLessons("harvard-cs50x");

    expect(lessons).toHaveLength(11);
    expect(lessons[0]).toMatchObject({
      order: 1,
      title: "Week 0: Scratch",
      videoId: "UuIEbpQms8o",
    });
    expect(lessons[0].embedUrl).toBe(
      "https://www.youtube.com/embed/UuIEbpQms8o?enablejsapi=1&rel=0",
    );
    for (const lesson of lessons) {
      expect(lesson).not.toHaveProperty("captions");
      expect(lesson).not.toHaveProperty("captionsUrl");
      expect(lesson).not.toHaveProperty("captionLabel");
      expect(lesson).not.toHaveProperty("captionSource");
      expect(lesson).not.toHaveProperty("captionReviewStatus");
      expect(lesson).not.toHaveProperty("syncRisk");
    }
    expect(lessons[10].title).toBe("Week 10: Cybersecurity");
  });

  it("launch catalog includes non-empty lesson lists for every course", () => {
    const slugs = courses.map((course) => course.slug);

    expect(Object.keys(courseLessons).sort()).toEqual(slugs.sort());

    for (const slug of slugs) {
      expect(getCourseLessons(slug).length, `${slug} should have lessons`).toBeGreaterThan(0);
    }
  });

  it("keeps every course lesson list ordered and linkable", () => {
    for (const course of courses) {
      const lessons = getCourseLessons(course.slug);
      lessons.forEach((lesson, index) => {
        expect(lesson.order, `${course.slug} lesson ${index + 1} order`).toBe(index + 1);
        expect(lesson.title.trim(), `${course.slug} lesson ${index + 1} title`).not.toBe("");
        expect(lesson.sourceUrl.trim(), `${course.slug} lesson ${index + 1} sourceUrl`).toMatch(/^https:\/\//);
        if (lesson.videoId) {
          expect(lesson.embedUrl, `${course.slug} lesson ${index + 1} embedUrl`).toBe(
            `https://www.youtube.com/embed/${lesson.videoId}?enablejsapi=1&rel=0`,
          );
        }
      });
    }
  });
});
