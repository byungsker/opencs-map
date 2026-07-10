import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppProviders } from "@/components/app-providers";
import { ProgressButton } from "@/components/progress-button";

describe("Astryx integration", () => {
  it("wraps the app in the Astryx theme provider", () => {
    render(
      <AppProviders>
        <main>OpenCS Map content</main>
      </AppProviders>
    );

    expect(screen.getByTestId("astryx-app-provider")).toBeInTheDocument();
    expect(screen.getByText("OpenCS Map content")).toBeInTheDocument();
  });

  it("renders progress actions through the Astryx Button component", () => {
    render(<ProgressButton slug="harvard-cs50x" status="saved" />);

    const button = screen.getByRole("button", { name: "저장" });
    expect(button).toHaveClass("astryx-button");
    expect(button).toHaveAttribute("data-variant", "secondary");
  });
});
