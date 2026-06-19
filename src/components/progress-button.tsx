"use client";

import { useEffect, useState } from "react";
import { getStoredProgress, toggleStoredProgress, type ProgressStatus } from "@/lib/progress";

const labels: Record<ProgressStatus, string> = {
  saved: "저장",
  "in-progress": "학습 중",
  done: "완료",
};

export function ProgressButton({ slug, status }: { slug: string; status: ProgressStatus }) {
  const [current, setCurrent] = useState<ProgressStatus | null>(null);

  useEffect(() => {
    setCurrent(getStoredProgress(slug));
  }, [slug]);

  const active = current === status;

  return (
    <button
      type="button"
      onClick={() => setCurrent(toggleStoredProgress(slug, status))}
      className={active
        ? "rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm"
        : "rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-700"}
    >
      {labels[status]}
    </button>
  );
}
