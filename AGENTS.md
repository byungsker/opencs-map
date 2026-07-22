<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This repository uses newer Next.js/React APIs and conventions that may differ from model memory. Before changing Next.js-specific code, read the relevant local docs under `node_modules/next/dist/docs/` and heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# OpenCS Map Agent Instructions

These instructions are for AI agents editing this repository. For product overview, read `README.md`. For detailed current project handoff, read `AGENT_HANDOFF.md`.

## Required first steps

Before editing code or making product claims:

```bash
git status --short --branch
git log --oneline -8
```

Then read:

1. `README.md`
2. `AGENT_HANDOFF.md`
3. Relevant source/test files for the area being changed
4. Relevant Next.js docs under `node_modules/next/dist/docs/` for Next-specific edits

Do not ask byungsker to repeat context that can be recovered from these files or the repository.

## Product direction

OpenCS Map is byungsker’s Korean-friendly free overseas CS course platform.

V1 is a **learning-management/course-map experience**, not a subtitle product and not just a link directory.

Prioritize:

- complete official lecture/session catalog for every listed course,
- roadmaps and course detail clarity,
- lesson progress,
- completion state,
- continue-learning position,
- per-lesson notes,
- LocalStorage persistence,
- lightweight Korean study guidance where useful,
- mobile usability.

Do **not** default to these for V1 unless byungsker explicitly changes direction:

- custom Korean subtitle overlay,
- WebVTT generation,
- timestamp-synchronized subtitle renderer,
- transcript translation pipeline,
- admin subtitle editing UI.

## Launch/completion gate

Do not call OpenCS Map “complete as a course platform” while any listed course lacks a full official lecture/session list.

Before launch/deploy completion claims, verify:

- every `courses[].slug` has a corresponding `courseLessons[slug]` entry,
- every listed course has the complete official lecture/session list for the chosen representative year/edition,
- every lesson has at least `order`, `title`, and `sourceUrl`,
- `videoId`/`embedUrl` are only present when verified,
- data integrity tests fail on missing lessons, discontinuous orders, or blank title/source URL.

Study guides, Korean summaries, assignments, transcripts, and captions can be follow-up work. The full official lesson list is the launch-blocking catalog requirement.

## Lesson data and progress rules

Not every official lesson has a verified YouTube video ID. Do not require `videoId` or `embedUrl` for catalog completion.

Required lesson fields:

- `order`
- `title`
- `sourceUrl`

Optional lesson fields:

- `videoId`
- `embedUrl`
- course-specific URLs such as `cs50Url`

Use this progress ID pattern everywhere lesson progress is keyed or compared:

```ts
export function getLessonProgressId(courseSlug: string, lesson: CourseLesson) {
  return lesson.videoId ?? `${courseSlug}:${lesson.order}`;
}
```

Use the progress ID for:

- `completedLessonIds`
- `watchedUntilEndLessonIds`
- `lastWatchedVideoId` legacy field value
- `notesByVideoId` legacy field keys
- active/completed lesson-list state
- course progress completed counts

Legacy LocalStorage field names may still say `VideoId`. Do not rename them unless doing a deliberate migration.

## Lesson completion UX rule

Keep these states distinct:

- `watchedUntilEndLessonIds`: video ended / learner watched to the end
- `completedLessonIds`: learner confirmed completion

Do not mark a lesson complete immediately when:

1. the user clicks `이 강의 완료`, or
2. YouTube emits ended state (`onStateChange`, `info === 0`).

Instead show confirmation:

```txt
강의 완료 확인
강의를 완료 처리할까요?
[완료하고 다음 강의 보기] [완료만 하기] [취소]
```

Expected behavior:

- `완료하고 다음 강의 보기`: mark complete, move to next lesson, update last watched
- `완료만 하기`: mark complete, stay on current lesson
- `취소`: close modal, do not mark complete
- if video ended, add to watched-until-end before opening modal

## Design expectations

Byungsker rejected a weak Astryx pass that only installed dependencies/providers while the UI still looked like generic Slate/Blue Tailwind cards.

Current expectation:

- Astryx must be visually felt, not just technically present.
- Homepage hero, cards, CTAs, roadmaps, and lesson workspace should look materially different from a generic white-card/blue-button baseline.
- Keep mobile usability central; byungsker often checks on phone.
- If a screen still looks like generic Tailwind cards, treat the design-system pass as incomplete.
- Prefer explicit light mode unless doing a full dual-mode pass; avoid token contrast bugs.

## Development workflow

For feature work, use test-driven development:

1. Add/update focused tests first.
2. Run focused tests and confirm they fail for the intended reason.
3. Implement the smallest correct change.
4. Run focused tests again.
5. Run full verification before reporting completion.

If any test/build/UI behavior fails, debug the root cause before patching symptoms.

## Verification commands

Before reporting completion for code/product changes, run:

```bash
npm test
npm run lint
npm run build
GITHUB_PAGES=true npm run build
```

For documentation-only changes, at minimum run:

```bash
git diff --check
```

## GitHub Pages deployment notes

Live site:

```txt
https://byungsker.github.io/opencs-map/
```

Course example:

```txt
https://byungsker.github.io/opencs-map/courses/harvard-cs50x
```

The repository uses static export for GitHub Pages. When `GITHUB_PAGES=true`, paths are built under `/opencs-map`.

If manually publishing `out/` to the `gh-pages` branch, always preserve `.nojekyll`:

```bash
touch .nojekyll
```

`rsync --delete out/` can delete `.nojekyll`; restore it before committing/pushing `gh-pages`.

After pushing a Pages deployment, wait until the latest run is `completed:success` and the Pages API status is `built` before browser QA.

## Browser QA expectations

For product/UI changes, verify at least:

- home page visible at the live URL or local preview,
- course catalog search/filter works,
- CS50 page visible at `/courses/harvard-cs50x`,
- progress percentage/bar visible,
- completion modal opens and updates progress,
- `완료하고 다음 강의 보기` advances lesson,
- notes persist in LocalStorage,
- reload starts from last watched lesson,
- source-only course fallback works, e.g. `/courses/mit-60001-python`.

## Documentation maintenance

Keep documentation roles distinct:

- `README.md`: public-facing and LLM-readable project overview.
- `AGENTS.md`: rules for agents editing this repository.
- `AGENT_HANDOFF.md`: detailed current handoff, prior decisions, next work, known pitfalls.

When product direction, architecture, important commands, deployment flow, or major implementation state changes, update the relevant docs in the same change.
