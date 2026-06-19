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
    expect(lessons[0].embedUrl).toBe(
      "https://www.youtube.com/embed/UuIEbpQms8o?enablejsapi=1&rel=0",
    );
    expect(lessons[0]).toMatchObject({
      captionLanguage: "ko",
      captionLabel: "자체 한글 자막",
    });
    expect(lessons[0].captions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          startSeconds: expect.any(Number),
          endSeconds: expect.any(Number),
          textKo: expect.stringContaining("스크래치"),
        }),
      ]),
    );
    expect(lessons[0].captions.length).toBeGreaterThanOrEqual(4);
    expect(lessons[1].captions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ textKo: expect.stringContaining("C") }),
      ]),
    );
    expect(lessons[10].title).toBe("Week 10: Cybersecurity");
  });
});
