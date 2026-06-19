export type CourseDifficulty = "intro" | "beginner" | "intermediate" | "advanced";
export type KoreanFriendliness = "high" | "medium" | "low";

export type Course = {
  slug: string;
  title: string;
  koreanTitle: string;
  institution: string;
  instructor?: string;
  url: string;
  platform: "YouTube" | "OCW" | "edX" | "Coursera" | "Official" | "Other";
  isFree: boolean;
  difficulty: CourseDifficulty;
  topics: string[];
  prerequisites: string[];
  recommendedFor: string[];
  durationWeeks?: number;
  hasAssignments: boolean;
  hasVideos: boolean;
  hasSubtitles?: boolean;
  koreanFriendliness: KoreanFriendliness;
  summaryKo: string;
  whyTakeThis: string;
  caution?: string;
};

export type CourseFilters = {
  query?: string;
  difficulty?: CourseDifficulty | "all";
  topic?: string | "all";
  institution?: string | "all";
  koreanFriendliness?: KoreanFriendliness | "all";
};
