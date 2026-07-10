"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@astryxdesign/core/Button";
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
    <Button
      label={labels[status]}
      variant={active ? "primary" : "secondary"}
      size="md"
      onClick={() => setCurrent(toggleStoredProgress(slug, status))}
    />
  );
}
