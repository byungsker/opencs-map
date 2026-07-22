# OpenCS Map

OpenCS Map is a Korean-friendly map for free overseas Computer Science courses. It helps Korean learners find, sequence, and keep going through high-quality official CS courses from institutions such as Harvard, MIT, Stanford, Berkeley, CMU, and Princeton.

Live site: https://byungsker.github.io/opencs-map/

Repository: https://github.com/byungsker/opencs-map

## LLM-readable summary

OpenCS Map is **not** just a link directory and **not** a Korean subtitle product for V1. V1 is a learning-management/course-map experience for Korean learners:

- curated official CS course catalog,
- roadmap tracks for different learner goals,
- course detail pages,
- full official lecture/session lists for listed courses,
- lesson progress and completion state,
- continue-learning position,
- per-lesson notes,
- lightweight Korean guidance and study notes where useful.

If you are an AI coding agent working on this repository, read these files before editing:

1. `AGENTS.md` — repository-specific agent rules and guardrails.
2. `AGENT_HANDOFF.md` — detailed current project handoff, decisions, known pitfalls, and next work.
3. Relevant local Next.js docs under `node_modules/next/dist/docs/` before changing Next.js-specific code.

## Product promise

> 해외 명문대/기관의 무료 CS 강의를 한국 개발자·비전공자·주니어가 길 잃지 않고 학습할 수 있게 큐레이션, 로드맵, 진행 추적, 한국어 학습 메모를 제공하는 플랫폼.

## Target users

- Korean non-CS-background learners starting CS fundamentals.
- Junior frontend/product engineers strengthening CS basics.
- AI engineer aspirants who need CS, math, and ML foundations.

## V1 scope

V1 should feel like a course platform and learning-management surface.

Prioritize:

- complete official lecture/session catalog for every listed course,
- course and lesson progress,
- progress percentage and progress bar,
- lesson completion state,
- last watched / continue-learning position,
- per-lesson notes,
- course detail pages and roadmap clarity,
- LocalStorage-based persistence,
- lightweight Korean guidance, summaries, and study notes where high leverage.

## Explicit non-goals for V1

Do not default to the following unless the product direction is explicitly changed:

- custom Korean subtitle overlay,
- WebVTT generation,
- timestamp-synchronized subtitle renderer,
- transcript translation pipeline,
- admin subtitle editing UI.

Those are V2/subtitle-layer candidates, not V1 launch blockers.

## Current feature set

- Curated free CS course catalog.
- Roadmap tracks:
  - 비전공자 CS 입문,
  - 주니어 개발자 기본기 강화,
  - AI 엔지니어 준비.
- Course catalog search/filter UI.
- Course detail and roadmap pages.
- Harvard CS50x embedded lesson workspace.
- Source-only lesson fallback for courses without verified embed URLs.
- Course/lesson progress via LocalStorage.
- Lesson completion confirmation modal.
- Watched-until-end vs learner-confirmed-complete distinction.
- Continue-learning / last watched state.
- Per-lesson notes.
- Astryx-based visible design-system pass.
- GitHub Pages static deployment.

## Tech stack

- Next.js 15.x App Router
- React 19.x
- TypeScript
- Tailwind CSS 3.4.x
- Vitest + jsdom
- ESLint 9 + `eslint-config-next`
- Astryx Design System:
  - `@astryxdesign/core`
  - `@astryxdesign/theme-neutral`
  - `@astryxdesign/cli`
  - `@stylexjs/stylex`
- GitHub Pages static export

## Important files

```txt
src/app/page.tsx                    # homepage / product entry
src/app/courses/page.tsx            # course catalog
src/app/courses/[slug]/page.tsx     # course detail and lesson workspace
src/app/roadmaps/page.tsx           # roadmap index
src/app/roadmaps/[slug]/page.tsx    # roadmap detail
src/app/layout.tsx                  # root layout and providers
src/app/globals.css                 # Astryx/Tailwind/global styles

src/components/app-providers.tsx    # Astryx Theme + LinkProvider wrapper
src/components/course-card.tsx      # course cards
src/components/course-explorer.tsx  # course search/filter UI
src/components/lesson-player.tsx    # lesson/player/workspace UI
src/components/progress-button.tsx  # course progress button/state UI
src/components/roadmap-card.tsx     # roadmap cards

src/data/courses.ts                 # curated course metadata
src/data/lessons.ts                 # official lecture/session lists
src/data/roadmaps.ts                # roadmap metadata and course references
src/lib/catalog.ts                  # catalog/roadmap/course lookup helpers
src/lib/progress.ts                 # course-level progress LocalStorage
src/lib/lesson-progress.ts          # lesson-level progress LocalStorage
```

## Getting started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Scripts

```bash
npm test       # Vitest test suite
npm run lint   # ESLint over src
npm run build  # Next.js build
```

For GitHub Pages static export checks:

```bash
GITHUB_PAGES=true npm run build
```

## Verification before claiming completion

Before reporting that product work is complete, run:

```bash
npm test
npm run lint
npm run build
GITHUB_PAGES=true npm run build
```

For deployment state:

```bash
gh api repos/byungsker/opencs-map/pages --jq '{status, html_url, source}'
gh run list --repo byungsker/opencs-map --limit 3 --json databaseId,name,status,conclusion,headSha,createdAt,url
```

## GitHub Pages

Production URL:

```txt
https://byungsker.github.io/opencs-map/
```

Example course page:

```txt
https://byungsker.github.io/opencs-map/courses/harvard-cs50x
```

When `GITHUB_PAGES=true`, the app uses the `/opencs-map` base path for static export.

Manual `gh-pages` publishing must preserve `.nojekyll`; otherwise GitHub Pages can mishandle `_next` asset paths.

## Documentation map

- `README.md`: public, human-readable, and LLM-readable project overview.
- `AGENTS.md`: rules for AI agents editing this repository.
- `AGENT_HANDOFF.md`: detailed handoff of current project context, past decisions, remaining work, and pitfalls.

Keep these three files in sync when product direction, architecture, verification commands, or deployment behavior changes.
