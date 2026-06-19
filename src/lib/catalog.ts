import { courses } from "@/data/courses";
import { courseLessons } from "@/data/lessons";
import type { Course, CourseFilters } from "@/types/course";
import type { Roadmap } from "@/types/roadmap";

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((course) => course.slug === slug);
}

export function filterCourses(source: Course[], filters: CourseFilters = {}): Course[] {
  const query = filters.query?.trim().toLowerCase();

  return source.filter((course) => {
    const matchesQuery = !query || [
      course.title,
      course.koreanTitle,
      course.institution,
      course.summaryKo,
      ...course.topics,
    ].join(" ").toLowerCase().includes(query);

    const matchesDifficulty = !filters.difficulty || filters.difficulty === "all" || course.difficulty === filters.difficulty;
    const matchesTopic = !filters.topic || filters.topic === "all" || course.topics.includes(filters.topic);
    const matchesInstitution = !filters.institution || filters.institution === "all" || course.institution === filters.institution;
    const matchesKoreanFriendliness = !filters.koreanFriendliness || filters.koreanFriendliness === "all" || course.koreanFriendliness === filters.koreanFriendliness;

    return matchesQuery && matchesDifficulty && matchesTopic && matchesInstitution && matchesKoreanFriendliness;
  });
}

export function getRoadmapCourses(roadmap: Roadmap) {
  return roadmap.steps.map((step) => {
    const course = getCourseBySlug(step.courseSlug);
    if (!course) {
      throw new Error(`Roadmap ${roadmap.slug} references missing course ${step.courseSlug}`);
    }
    return { ...step, course };
  });
}

export function getUniqueTopics(source: Course[] = courses): string[] {
  return Array.from(new Set(source.flatMap((course) => course.topics))).sort();
}

export function getUniqueInstitutions(source: Course[] = courses): string[] {
  return Array.from(new Set(source.map((course) => course.institution))).sort();
}

export function getCourseLessons(slug: string) {
  return courseLessons[slug] ?? [];
}
