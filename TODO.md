# Needs attention

Live backlog as of 2026-09-11, after the burgers and lobster tails. Ordered by what
actually bites you first, not by how hard it is. `AUDIT.md` has the full
review record; this is the shorter list of what is still open.

Current state: lint 0 errors · strict typecheck passes (**including the
type-aware pass, which now runs locally**) · 58 tests pass · build passes · 0
npm advisories · client CSS 197.7 KB, of which 119.5 KB is the five
base64-inlined font faces and 78.2 KB is actual stylesheet. Meal photos are
2.85 MB across 22 files, but only one is ever loaded.

The repository moved out of iCloud Drive to `C:\Users\Danie\repos` on
2026-09-11. Do not move it back; see `CLAUDE.md`.

---

## Recently closed

### ~~1. The offline `index.html` cannot be rebuilt~~ — done 2026-09-11

The packaging step now exists: `scripts/build-offline.mjs`, run by
`npm run build`. It inlines the stylesheet and script, rewrites `/meals/` to
`./images/`, and syncs the photo folder. A test asserts the result names every
cut and holds no absolute asset paths, so skipping the step fails the gate
instead of shipping a stale file.

Went from 12 recipes and 1.63 MB to 22 recipes and 709 KB — smaller with ten
more recipes, because the old file bundled 1,767 lucide icons where the build
emits 26.

### ~~Dependency advisories~~ — done, and staying done

`npm audit` reports 0. Re-check after any dependency change.

---

## Correctness and robustness

### 3. No error boundary

`app/page.tsx` calls `buildRecipe(...)` in the render body, and it throws on an
unknown cut or an out-of-range weight. Every current path is validated, so this
is latent — but if it ever throws, React unmounts the tree and the user gets a
blank page with no recovery. One boundary around the app fixes it.

### 4. Zero component tests

All 29 tests cover pure logic. Nothing exercises React at all, and the last two
sessions added a lot of interactive surface that is now untested:

- the cook timer's pause/resume and expiry
- burner level changes and the `boolean[]` → `BurnerLevel[]` storage migration
- ingredient swap selection, persistence, and revert
- `WeightField` validation and its draft-sync effect
- the two Web MCP tools

This is the biggest single gap in the project. The logic tests are genuinely
good; the UI has no net under it.

### 5. Two `localStorage` prefixes, and a stale key name

`searline-unit` and `searline-saved` still sit alongside `searious-weight-unit`,
`searious-weights`, `searious-grill` and `searious-swaps` — a half-finished
rename from an earlier project name. Nothing is broken.

Also: `searious-grill` stores its per-zone settings under a field still called
`states`, which held booleans before levels existed. The migration reads both
shapes correctly, but the name now lies about its contents.

Settling on one versioned prefix (`ays:v1:*`) needs a migration so nobody loses
saved recipes or burner layouts.

### 6. Remaining non-null assertions

`cuts.find(...)!` twice in `page.tsx`, `recipes.find(...)!` in `cook-config.ts`.
All hold today. The third is the riskiest — adding a cut with a typo'd `baseId`
is an easy mistake with no type-level guard. (The related `seasonings` lookup is
now type-safe.)

### 7. Most of `recipes.ts` is dead data

`buildRecipe` spreads the base recipe then overrides **every field of the
`Recipe` type**. Only `base.title`, `base.description`, `base.headline` and
`base.tip` are ever read, and only on some branches. All four recipes' full
ingredient lists and step-by-step methods never render.

Left alone deliberately: it is a sizeable deletion whose payoff is
maintainability, and the replacement shape is a judgement call. But it is a live
trap — the next person to correct a temperature there will change nothing and
not know why.

Related: temperatures are stated three times — numerically in `cuts`,
numerically in `recipes`, and as prose inside step text. The prose copies are
the only reason the regex-based Celsius conversion has to exist.

---

## Responsive follow-ups

The breakpoint pass is done — the scale is declared once in `globals.css` and
every query in `experience.css` matches it. What it did not cover:

### 8. The meal photos have no `srcset`

**This one has got sharper.** There are now 22 photos averaging 133 KB, and a
360px phone still downloads the full 1200×800 for whichever cut it shows.

Every device downloads the same 1200×800 WebP, roughly 133 KB. A 360px phone
needs about a quarter of that. Generating 480/800/1200 variants in
`scripts/optimize-meal-images.mjs` and adding `srcset`/`sizes` would cut the
mobile payload substantially — the photos are 2.85 MB of the 3.7 MB deploy, so
this is the largest remaining weight win now that the CSS is fixed. (The 1.28 MB
figure this item used to quote was left over from the twelve-recipe build.)

### 9. The temperature table still scrolls awkwardly on phones

Four columns of temperature data in a `<table>` at 360px. It shrinks the padding
at `md` but never restructures. The usual fix is a stacked card layout per row
below `sm`, with the header cells becoming inline labels.

### 10. Nothing has been checked in a real browser

Everything above is verified by build, types, lint and unit tests. **No visual
check has been run at any width, on any device.** The breakpoints are reasoned
from the layout rules, not observed. Worth an actual pass across a phone, a
tablet and a desktop before release — particularly the burner diagram, which
changed shape twice this session.

---

## Product gaps

### 11. A grill timer with no alarm

No audio, no vibration, no notification, and no Wake Lock — so the screen sleeps
mid-cook and a finished timer is silent. For an app whose entire premise is
standing at a grill with your phone on the side table, this is the most valuable
missing feature on the list.

### 12. Metadata for sharing and installing

`themeColor` and `viewport-fit` are now set. Still missing: Open Graph and
Twitter card tags, a canonical URL, `apple-touch-icon`, and a web manifest.
Without them the app cannot be installed to a home screen and shares as a bare
link.

### 13. Dark-only, but it says otherwise

`<html class="dark">` is hardcoded with no toggle and no `prefers-color-scheme`
handling, while `colorScheme` advertises dark. Either honour the system
preference or keep the single theme deliberately — it is currently neither.

### 14. Substitutions are display-only

Choosing "Garlic salt" tells you to cut the measured salt by about a third, but
the app does not do it for you — the gram figure on the salt line stays put.
Recalculating it would mean modelling the salt content of each substitute, which
is a real feature rather than a tweak. The current behaviour is honest, but a
cook following the checklist literally could still over-salt.

The tri-tip widened this: its sauce carries a second, separate salt line, and
three of its new swaps (`Taco or fajita seasoning` among them) are pre-salted.
The lines say so, but nothing recalculates.

### 15. The tri-tip is the only recipe with two grain directions

`buildRecipe` has no concept of carving geometry, so the guidance lives in the
step prose alone. That is fine for one cut. If a second such cut is ever added,
it should become structured data rather than a third copy of the same paragraph.
