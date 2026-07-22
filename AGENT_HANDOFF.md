# OpenCS Map Agent Handoff

## TL;DR

OpenCS Map is byungsker’s Korean-friendly free overseas CS course platform. It is not just a link directory and not a subtitle product for V1. V1 is a learning-management/course-map experience: curated official course catalog, roadmaps, lesson lists, progress, notes, continue-watching, and a visually distinct Astryx-based learning surface.

- Repo: https://github.com/byungsker/opencs-map
- Live site: https://byungsker.github.io/opencs-map/
- Local path: ~/Documents/Github/opencs-map
- Current branch: main
- Current known HEAD when this handoff was written: 5459860 fix: tighten lesson workspace UX

## Product Identity

### What it is

OpenCS Map helps Korean learners find and follow free CS courses from Harvard, MIT, Stanford, Berkeley, CMU, Princeton, and similar institutions.

The product promise:

> 해외 명문대/기관의 무료 CS 강의를 한국 개발자·비전공자·주니어가 길 잃지 않고 학습할 수 있게 큐레이션, 로드맵, 진행 추적, 한국어 학습 메모를 제공하는 플랫폼.

### Target users

- Korean non-CS-background learners starting CS fundamentals
- Junior frontend/product engineers strengthening CS basics
- AI engineer aspirants who need CS/math/ML foundations

### V1 product direction

V1 is a learning-management course platform:

- Complete official lecture/session catalog per listed course
- Course and lesson progress
- Progress percentage and progress bar
- Lesson completion state
- Last watched / continue-learning position
- Per-lesson notes
- Course detail pages and roadmap clarity
- LocalStorage persistence
- Lightweight Korean guidance, summaries, and study notes where helpful

### Explicit non-goals for V1

Do not default to these unless byungsker explicitly changes direction:

- Custom Korean subtitle overlay
- WebVTT generation
- Transcript translation pipeline
- Timestamp-synced subtitle renderer
- Admin subtitle editing UI

Important history: Korean subtitles were explored, but byungsker corrected the scope. For V1, subtitles/transcript layers are deferred to V2. Do not restart subtitle work as the default next task.

## Documentation Structure

Use these files for different readers:

- `README.md`: public-facing and LLM-readable project overview. It should let a human or AI understand the product, V1 scope, stack, live URL, key files, and verification commands quickly.
- `AGENTS.md`: repository-specific instructions for AI agents editing code. Keep it focused on rules, guardrails, workflows, and verification expectations.
- `AGENT_HANDOFF.md`: detailed handoff of current state, historical decisions, known pitfalls, and next work. It can be longer and more operational than the README.

When product direction, architecture, deployment flow, or major implementation state changes, update the relevant docs together.

## Current Architecture

### Stack

From current package.json:

- Next.js 15.5.x
- React 19.2.x
- TypeScript
- Tailwind CSS 3.4.x
- Vitest 1.6.x
- jsdom
- ESLint 9 + eslint-config-next 15
- Astryx Design System:
  - @astryxdesign/core
  - @astryxdesign/theme-neutral
  - @astryxdesign/cli
  - @stylexjs/stylex
- GitHub Pages static export

### Important project rule

Read `AGENTS.md` before changing code. It says this is not the Next.js you know; the project may use newer Next.js APIs and conventions. If modifying Next-specific code, check local Next docs under `node_modules/next/dist/docs/` rather than relying on memory.

### Deployment model

The app is statically exported for GitHub Pages.

Live URL:

```text
https://byungsker.github.io/opencs-map/
```

Course example:

```text
https://byungsker.github.io/opencs-map/courses/harvard-cs50x
```

GitHub Pages base path is `/opencs-map` when `GITHUB_PAGES=true`.

## Codebase Map

### App routes

- `src/app/page.tsx` — homepage / product entry
- `src/app/courses/page.tsx` — course catalog
- `src/app/courses/[slug]/page.tsx` — course detail and lesson workspace
- `src/app/roadmaps/page.tsx` — roadmap index
- `src/app/roadmaps/[slug]/page.tsx` — roadmap detail
- `src/app/layout.tsx` — root layout and providers
- `src/app/globals.css` — Astryx/Tailwind/global styles

### Components

- `src/components/app-providers.tsx` — Astryx Theme + LinkProvider wrapper
- `src/components/course-card.tsx` — course cards
- `src/components/course-explorer.tsx` — course search/filter UI
- `src/components/lesson-player.tsx` — core course lesson/player/workspace UI
- `src/components/progress-button.tsx` — localStorage course progress button/state UI
- `src/components/roadmap-card.tsx` — roadmap cards
- `src/components/astryx-integration.test.tsx` — Astryx smoke tests
- `src/components/lesson-player.test.tsx` — lesson workspace/progress UX tests

### Data and logic

Known important files from previous work:

- `src/data/courses.ts` — curated course metadata
- `src/data/roadmaps.ts` — roadmap metadata and course references
- `src/data/lessons.ts` — official lecture/session lists and lesson metadata
- `src/lib/catalog.ts` — catalog/roadmap/course lookup helpers
- `src/lib/progress.ts` — course-level progress localStorage
- `src/lib/lesson-progress.ts` — lesson-level progress localStorage

## Current Functional State

### Implemented

- Curated free CS course catalog
- Three roadmap tracks:
  - 비전공자 CS 입문
  - 주니어 개발자 기본기 강화
  - AI 엔지니어 준비
- Course catalog page with search/filtering
- Course detail pages
- Roadmap pages
- Harvard CS50x embedded lesson workspace
- Official lesson catalog completion work
- Course progress and lesson progress via localStorage
- Lesson completion confirmation modal
- Watched-until-end versus manually completed distinction
- Continue-learning / last watched state
- Per-lesson notes
- Source-only lesson fallback for courses without verified embed URLs
- Astryx design-system integration and visible design pass
- Tightened lesson workspace UX as of commit `5459860`

### Lesson progress model

Not every lesson has a verified YouTube video ID. Do not assume `videoId` exists.

Required lesson fields:

- `order`
- `title`
- `sourceUrl`

Optional fields:

- `videoId`
- `embedUrl`
- course-specific URLs such as `cs50Url`

Progress IDs should use this pattern:

```ts
export function getLessonProgressId(courseSlug: string, lesson: CourseLesson) {
  return lesson.videoId ?? `${courseSlug}:${lesson.order}`;
}
```

Use this ID everywhere progress is keyed or compared:

- `completedLessonIds`
- `watchedUntilEndLessonIds`
- `lastWatchedVideoId` legacy field value
- `notesByVideoId` legacy field keys
- active/completed state in lesson lists
- course progress completed counts

Legacy localStorage field names may still say `VideoId`; do not rename unless doing a deliberate migration.

### Completion UX rule

Keep these states distinct:

- `watchedUntilEndLessonIds`: video ended / learner watched to the end
- `completedLessonIds`: learner confirmed completion

Do not immediately mark complete when either of these happens:

1. User clicks `이 강의 완료`
2. YouTube emits ended state (`onStateChange`, `info === 0`)

Instead, show a confirmation modal:

```text
강의 완료 확인
강의를 완료 처리할까요?
[완료하고 다음 강의 보기] [완료만 하기] [취소]
```

Expected behavior:

- `완료하고 다음 강의 보기`: mark complete, move to next lesson, update last watched
- `완료만 하기`: mark complete, stay on current lesson
- `취소`: close modal, do not mark complete
- If video ended, add to watched-until-end before opening modal

## Design State and Expectations

Byungsker specifically rejected a weak Astryx pass that only installed dependencies/providers but still looked like the old Slate/Blue Tailwind card UI.

Current expectation:

- Astryx must be visually felt, not just technically present.
- Homepage hero, cards, CTAs, roadmap surfaces, and course workspace should look materially different from the old white-card/blue-button baseline.
- Keep mobile usability central; byungsker checks on phone.
- If a screen still looks like generic Tailwind cards, treat the Astryx work as incomplete.

Known Astryx files/requirements:

- `package.json` includes Astryx packages and React 19 / Next 15.
- `src/app/globals.css` import order should be reset → core CSS → neutral theme CSS → Tailwind.
- `src/components/app-providers.tsx` wraps with `Theme` and `LinkProvider`.
- `src/app/layout.tsx` should use `AppProviders`.
- Prefer explicit light mode unless doing a full dual-mode pass; avoid token contrast bugs on dark sections.

## Launch Gate / Completion Definition

Do not call this “complete as a course platform” unless all listed courses have full official lecture/session lists.

Before launch/deploy claims:

- Every `courses[].slug` has a `courseLessons[slug]` entry.
- Each listed course has the complete official lecture/session list for the chosen representative year/edition.
- Each lesson has at least `order`, `title`, and `sourceUrl`.
- `videoId`/`embedUrl` only when verified.
- Data integrity tests fail if:
  - a course has no lessons
  - lesson orders are not continuous from 1
  - title/sourceUrl is blank

Study guides, Korean summaries, assignments, transcripts, and captions can be follow-up work. The complete lesson list itself is launch-blocking.

Obsidian launch-blocker issue known from prior work:

```text
byungsker-archive/project/opencs-map/issues/OCS-5.md
```

## Verification Commands

Run these before claiming completion:

```bash
npm test
npm run lint
npm run build
GITHUB_PAGES=true npm run build
```

For GitHub Pages deployment state:

```bash
gh api repos/byungsker/opencs-map/pages --jq '{status, html_url, source}'
gh run list --repo byungsker/opencs-map --limit 3 --json databaseId,name,status,conclusion,headSha,createdAt,url
```

Browser/live QA should include:

- Home page visible at live URL
- Course catalog search/filter still works
- CS50 page visible at `/courses/harvard-cs50x`
- Course progress card visible
- Progress percentage/bar visible
- Study Guide panel visible where prepared
- Completion modal opens and updates progress
- `완료하고 다음 강의 보기` advances lesson
- Notes persist in localStorage
- Reload starts from last watched lesson
- Source-only course fallback works, e.g. `/courses/mit-60001-python`

Useful browser console check:

```js
localStorage.getItem('opencs-map-lesson-progress')
```

## Deployment Notes

If publishing static export manually to `gh-pages`, preserve `.nojekyll`.

Pitfall: `rsync --delete out/` into the `gh-pages` worktree can delete `.nojekyll`; always `touch .nojekyll` before committing.

Sample deploy flow:

```bash
set -euo pipefail
GITHUB_PAGES=true npm run build
WORKTREE=/tmp/opencs-map-gh-pages
rm -rf "$WORKTREE"
git fetch origin gh-pages
git worktree add "$WORKTREE" origin/gh-pages
rsync -a --delete --exclude='.git' out/ "$WORKTREE"/
cd "$WORKTREE"
touch .nojekyll
git add -A
if [ -n "$(git status --short)" ]; then
  git commit -m "deploy: publish latest OpenCS Map build"
  git push origin HEAD:gh-pages
else
  echo "No deployment changes to publish"
fi
```

After pushing, wait for Pages to be built before browser QA.

## What Still Needs Building Next

Prioritize in this order unless byungsker says otherwise:

1. Verify current live deployed UI matches latest commits and is not stale.
2. Finish/strengthen full official lesson catalogs for every listed course if any gaps remain.
3. Improve source-only course workspace so non-CS50 courses still feel like a learning platform, not dead links.
4. Expand Korean learning guidance/study notes lightly where high leverage.
5. Strengthen dashboard/roadmap progress views.
6. Only after V1 learning-management feels solid, revisit V2 subtitle/transcript/translation layers.

## Agent Behavior Expectations

- Work in `~/Documents/Github/opencs-map`.
- Do not ask byungsker to repeat context; inspect code, git, session notes, and this handoff first.
- Use TDD for feature work.
- If something fails, do root-cause debugging before patching.
- Always report:
  - live URL
  - what changed in user-facing terms
  - verification commands/results
  - commit hashes for `main` and `gh-pages` if relevant
  - caveats about Pages deployment or cache state
- In final user-facing reports, include the harness/subflow disclosure block in italic if following byungsker’s preference.
