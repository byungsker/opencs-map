import { lessonStudyGuides } from "@/data/lesson-study-guides";
import type { LessonStudyGuide } from "@/data/lesson-study-guides";

export function getLessonStudyGuide(videoId: string): LessonStudyGuide | null {
  return lessonStudyGuides.find((guide) => guide.videoId === videoId) ?? null;
}
