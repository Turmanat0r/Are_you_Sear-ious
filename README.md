# Are You Sear-ious

A gas-grill recipe planner. Pick a protein and cut, enter the raw weight, and the
app scales the seasoning, shows cut-specific grill and internal temperatures,
plans a burner layout, and prints a clean recipe card. It runs entirely in the
browser with no network calls.

Each burner is set to OFF, LO, MED or HI. The planner estimates the chamber
temperature that layout produces and how it shifts the cook time, and that
estimate follows through to the recipe card and the printed sheet — a planning
aid only; a probe still decides doneness.

Ingredients can be swapped when you have run out. Substitutions carry the amount
adjustment, and anything pre-salted (garlic salt, onion salt, salted butter) is
flagged, because the dry brine is measured once at 0.5% of raw weight and a
salted stand-in stacks on top of it.

**Fourteen cuts across four proteins** — beef, pork, poultry and fish — each with
its own photo, temperature targets, method and step-by-step cook mode with a
check-in timer.

## Repository contents

This repository holds two things: the editable source project, and a
self-contained offline build of it.

```
index.html                  Offline build — one 1.6 MB file, opens with no server
images/                     13 meal photos for the offline build (no tri-tip yet)
README.txt                  End-user instructions for the offline build
THIRD-PARTY-LICENSES.txt    Full license text for every bundled library and font
LICENSE                     MIT — covers the application code
NOTICE.md                   What MIT does and does not cover, incl. image terms
are-you-sear-ious-source/   The editable React/Vite project
```

> **Layout note.** `are-you-sear-ious-source/` is currently nested one level
> deeper than it needs to be (`are-you-sear-ious-source/are-you-sear-ious-source/`),
> and the `.zip` archives beside it are ignored by `.gitignore` rather than
> committed. Flatten the source directory before the first commit — see
> "Before you publish" below.

## Running the offline build

Open `index.html` in any modern browser. Keep the `images/` folder beside it. No
install, server, account, or internet connection is required. Saved recipes and
preferences live in that browser's local storage; some browsers restrict storage
for `file://` pages, in which case the app still works but settings may not
persist.

## Running the source project

Requires Node.js 22.13.0 or newer.

```sh
cd are-you-sear-ious-source
npm ci
npm run dev
```

Other commands:

```sh
npm run build       # production build
npm run start       # local Wrangler preview of the built server (does not publish)
npm run lint        # oxlint
npm run format      # oxfmt
npx tsc --noEmit    # type check
node --test tests/  # unit tests
```

### Stack

React 19, Vinext (Vite), Tailwind CSS 4, and shadcn components built on Base UI.
There is no `tailwind.config.*` — Tailwind 4 is configured from CSS in
`app/globals.css`, and the PostCSS plugin is wired up in `vite.config.ts`.

### Source layout

| Path | What it holds |
| --- | --- |
| `app/page.tsx` | Main page, cook mode, print view, saved-recipe dialog |
| `app/grill-tools.tsx` | Weight and cut controls, temperature table, burner planner |
| `app/cook-config.ts` | The 14 cuts, ingredient scaling, per-cut recipe assembly |
| `app/recipes.ts` | Base recipe data, temperature formatting and F→C conversion |
| `app/globals.css`, `app/experience.css` | Theme tokens and application styling |
| `components/ui/` | The 8 shadcn components the app actually uses |
| `tests/` | Node test-runner suites for the pure logic and the images |
| `scripts/optimize-meal-images.mjs` | Regenerates `public/meals/*.webp` from PNGs |

## Licensing

The MIT license covers the application code. It does **not** cover the bundled
third-party libraries and fonts, which keep their own terms, and it does **not**
cover the meal images, which were AI-generated and whose copyright status is
unsettled. Read [`NOTICE.md`](NOTICE.md) before reusing anything from here.

## Before you publish

Lint is at zero, the type checker runs strict, 29 tests and the build pass, and
the responsive scale is consistent. The open backlog lives in
[`TODO.md`](TODO.md); [`AUDIT.md`](AUDIT.md) has the full review record.

The two that block a public repo: the prebuilt `index.html` cannot be rebuilt
from this source and is now several features out of date, and `npm audit`
reports dev-dependency advisories that need a deliberate upgrade pass.

## Safety

This is a planning aid, not a grill controller. The burner diagram does not
connect to any hardware — follow your grill manufacturer's lighting sequence.
Doneness is decided by measured internal temperature, not by the app's time
estimates. Temperature guidance follows the
[USDA FSIS Safe Minimum Internal Temperature Chart](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart).
