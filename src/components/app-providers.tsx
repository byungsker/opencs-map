"use client";

import React from "react";
import Link from "next/link";
import { Theme } from "@astryxdesign/core/theme";
import { LinkProvider } from "@astryxdesign/core/Link";
import { neutralTheme } from "@astryxdesign/theme-neutral/built";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Theme theme={neutralTheme} mode="light">
      <LinkProvider component={Link}>
        <div data-testid="astryx-app-provider">{children}</div>
      </LinkProvider>
    </Theme>
  );
}
