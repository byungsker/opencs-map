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
      captionLabel: "학습 자막 초안",
      captionSource: "youtube-transcript-api",
      captionReviewStatus: "machine",
      syncRisk: "youtube-ads-and-auto-transcript",
      captionsUrl: "/captions/harvard-cs50x/week-0.ko.json",
    });
    expect(lessons[0]).not.toHaveProperty("captions");
    expect(lessons[1]).toMatchObject({
      captionLabel: "학습 자막 초안",
      captionSource: "youtube-transcript-api",
      captionReviewStatus: "machine",
      syncRisk: "youtube-ads-and-auto-transcript",
      captionsUrl: "/captions/harvard-cs50x/week-1.ko.json",
    });
    expect(lessons[1]).not.toHaveProperty("captions");
    expect(lessons[2]).toMatchObject({
      captionLabel: "학습 레이어 준비 중",
    });
    expect(lessons[2]).not.toHaveProperty("captionsUrl");
    expect(lessons[10].title).toBe("Week 10: Cybersecurity");
  });
});
