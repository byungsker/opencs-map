import { describe, expect, it, beforeEach } from "vitest";
import { getStoredProgress, setStoredProgress, toggleStoredProgress } from "@/lib/progress";

describe("local progress storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("stores and reads course progress statuses", () => {
    setStoredProgress("harvard-cs50x", "in-progress");

    expect(getStoredProgress("harvard-cs50x")).toBe("in-progress");
  });

  it("toggles a status off when the same status is selected twice", () => {
    toggleStoredProgress("mit-missing-semester", "saved");
    expect(getStoredProgress("mit-missing-semester")).toBe("saved");

    toggleStoredProgress("mit-missing-semester", "saved");
    expect(getStoredProgress("mit-missing-semester")).toBeNull();
  });
});
