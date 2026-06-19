import { describe, expect, it } from "vitest";
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
    expect(lessons[0].embedUrl).toBe("https://www.youtube.com/embed/UuIEbpQms8o");
    expect(lessons[10].title).toBe("Week 10: Cybersecurity");
  });
});
