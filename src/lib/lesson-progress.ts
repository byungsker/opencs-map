import type { CourseLesson } from "@/data/lessons";

const STORAGE_KEY = "opencs-map-lesson-progress";

export type LessonProgressState = {
  completedLessonIds: string[];
  watchedUntilEndLessonIds: string[];
  lastWatchedVideoId?: string;
  notesByVideoId: Record<string, string>;
};

export type CourseProgressSummary = {
  completedCount: number;
  totalCount: number;
  percentage: number;
};

type LessonProgressMap = Record<string, LessonProgressState>;

const emptyState = (): LessonProgressState => ({
  completedLessonIds: [],
  watchedUntilEndLessonIds: [],
  notesByVideoId: {},
});

function readLessonProgressMap(): LessonProgressMap {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as LessonProgressMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeLessonProgressMap(progress: LessonProgressMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function getStoredLessonProgress(courseSlug: string): LessonProgressState {
  const state = readLessonProgressMap()[courseSlug];
  return {
    completedLessonIds: Array.isArray(state?.completedLessonIds) ? state.completedLessonIds : [],
    watchedUntilEndLessonIds: Array.isArray(state?.watchedUntilEndLessonIds) ? state.watchedUntilEndLessonIds : [],
    lastWatchedVideoId: state?.lastWatchedVideoId,
    notesByVideoId: state?.notesByVideoId && typeof state.notesByVideoId === "object" ? state.notesByVideoId : {},
  };
}

function updateCourseState(courseSlug: string, updater: (state: LessonProgressState) => LessonProgressState) {
  const progress = readLessonProgressMap();
  progress[courseSlug] = updater(getStoredLessonProgress(courseSlug));
  writeLessonProgressMap(progress);
  return progress[courseSlug];
}

export function setLessonCompleted(courseSlug: string, videoId: string, completed: boolean) {
  return updateCourseState(courseSlug, (state) => {
    const completedSet = new Set(state.completedLessonIds);
    if (completed) {
      completedSet.add(videoId);
    } else {
      completedSet.delete(videoId);
    }

    return {
      ...state,
      completedLessonIds: [...completedSet],
    };
  });
}

export function setLessonWatchedUntilEnd(courseSlug: string, videoId: string, watchedUntilEnd: boolean) {
  return updateCourseState(courseSlug, (state) => {
    const watchedSet = new Set(state.watchedUntilEndLessonIds);
    if (watchedUntilEnd) {
      watchedSet.add(videoId);
    } else {
      watchedSet.delete(videoId);
    }

    return {
      ...state,
      watchedUntilEndLessonIds: [...watchedSet],
    };
  });
}

export function setLastWatchedLesson(courseSlug: string, videoId: string) {
  return updateCourseState(courseSlug, (state) => ({
    ...state,
    lastWatchedVideoId: videoId,
  }));
}

export function getLastWatchedLesson(courseSlug: string, lessons: CourseLesson[]) {
  const { lastWatchedVideoId } = getStoredLessonProgress(courseSlug);
  return lessons.find((lesson) => lesson.videoId === lastWatchedVideoId) ?? lessons[0] ?? null;
}

export function setLessonNote(courseSlug: string, videoId: string, note: string) {
  return updateCourseState(courseSlug, (state) => ({
    ...state,
    notesByVideoId: {
      ...state.notesByVideoId,
      [videoId]: note,
    },
  }));
}

export function getLessonNote(courseSlug: string, videoId: string) {
  return getStoredLessonProgress(courseSlug).notesByVideoId[videoId] ?? "";
}

export function getCourseProgressSummary(courseSlug: string, lessons: CourseLesson[]): CourseProgressSummary {
  const completed = new Set(getStoredLessonProgress(courseSlug).completedLessonIds);
  const completedCount = lessons.filter((lesson) => completed.has(lesson.videoId)).length;
  const totalCount = lessons.length;

  return {
    completedCount,
    totalCount,
    percentage: totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100),
  };
}
