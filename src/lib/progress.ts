export type ProgressStatus = "saved" | "in-progress" | "done";

const STORAGE_KEY = "opencs-map-progress";

type ProgressMap = Record<string, ProgressStatus>;

function readProgressMap(): ProgressMap {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};

  try {
    return JSON.parse(raw) as ProgressMap;
  } catch {
    return {};
  }
}

function writeProgressMap(progress: ProgressMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function getStoredProgress(slug: string): ProgressStatus | null {
  return readProgressMap()[slug] ?? null;
}

export function setStoredProgress(slug: string, status: ProgressStatus) {
  const progress = readProgressMap();
  progress[slug] = status;
  writeProgressMap(progress);
}

export function removeStoredProgress(slug: string) {
  const progress = readProgressMap();
  delete progress[slug];
  writeProgressMap(progress);
}

export function toggleStoredProgress(slug: string, status: ProgressStatus): ProgressStatus | null {
  const current = getStoredProgress(slug);
  if (current === status) {
    removeStoredProgress(slug);
    return null;
  }
  setStoredProgress(slug, status);
  return status;
}
