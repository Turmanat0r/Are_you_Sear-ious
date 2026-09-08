# Pre-release audit — Are You Sear-ious

Reviewed 2026-09-07 against the offline build (`index.html`, `images/`) and the
editable source (`are-you-sear-ious-source/`).

The first pass was static analysis only. Dependencies were then installed and
everything below was re-checked against the real toolchain, which **corrected
three findings** and surfaced one the static pass missed. Fixes were applied and
verified; nothing was committed.

## Verification status

| Check | Before | After |
| --- | --- | --- |
| `npm run lint` | 46 errors | **0 errors** |
| `npx tsc --noEmit` | passes (loose config) | **passes (strict config)** |
| `npm test` | 22 pass, no `test` script | **22 pass** |
| `npm run build` | succeeds | **succeeds** |
| Client CSS | 203.0 KB | **69.1 KB** |
| Source files | 103 | 65 |
| Runtime dependencies | 19 | 11 |

---

## Corrections to the first pass

Building the source disproved three findings. All three turn out to be defects
of the **offline packaging step, not the source project** — which makes the
unreproducible build (open item 1) the most consequential issue here, not a
housekeeping one.

| Claim | Reality |
| --- | --- |
| lucide-react is not tree-shaken (630 KB, 1,767 icons) | The source build emits **24 icons**. Only the offline `index.html` carries 1,767. |
| Fonts ship Cyrillic and Vietnamese unnecessarily | `app/layout.tsx` already declares `subsets: ['latin']`. The 11 over-broad faces exist only in `index.html`. |
| Base UI dev tooling ships in production | Not present in the source build. Only in `index.html`. |

The source project's own build is sound. The artifact you actually ship is
produced by a tool that is not in the repository, and that tool is what inflates
it — the offline file is roughly 2.6× the size of what your own build produces.

## Found only by running the tools

**`page.tsx` wrote a ref during render.** `stateRef.current = { protein, unit, recipe }`
sat in the render body, which React does not support under concurrent rendering
and which `react-compiler` flags as an error. The ref now updates in an effect,
and the `select_grilling_recipe` tool returns the values it just validated
instead of reading the ref back after `flushSync` — it no longer depends on
passive effects having flushed.

**Enabling `noUncheckedIndexedAccess` exposed five latent crashes** — array and
record accesses that TypeScript had been silently widening. Fixed by encoding the
real invariants in the types rather than adding casts:

- `Temperatures = [number, ...number[]]` — a range always has a low bound.
- `steps: [Step, ...Step[]]` — a recipe always has at least one step, so the
  cook-mode fallback `recipe.steps[step] ?? recipe.steps[0]` is provably safe.
- `seasonings: Record<SeasoningGroup, Group[]>` — a mistyped group name is now a
  compile error instead of a runtime `undefined.map`.

**`sharp` had high-severity libvips CVEs.** It was pinned at 0.34.5 when first
declared; now `0.35.4`. See the open security note below.

---

## Fixed

**Build and tooling**

1. `package.json` renamed from the scaffold's `sites-project`; added
   `description` and `license: MIT`.
2. Added `test` (`node --test tests/`) and `typecheck` (`tsc --noEmit`) scripts.
3. Declared `sharp` explicitly — it had been arriving only through
   `@cloudflare/vite-plugin` → `miniflare`.
4. Deleted `next.config.ts`. It imported `NextConfig` from `next`, which is
   absent from the 699-package lockfile; the project builds with vinext.
5. `tsconfig.json`: target `ES2017` → `ES2022`; added `noUncheckedIndexedAccess`,
   `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`; dropped
   the `next-env.d.ts` and `.next/types/**` includes this build never produces.
6. Added `.github/workflows/ci.yml` running lint, typecheck, test and build.

**Dead code — CSS down 66%**

7. Deleted **52 of 60** `components/ui/` components. Only 8 are reachable:
   `checkbox`, `dialog`, `input`, `progress`, `select`, `table`, `tabs`, and
   `button` via `dialog`. Tailwind 4 scans source for class names, so the
   unused components were the direct cause of the 203 KB stylesheet.
8. Removed 8 dependencies that existed only to serve them: `recharts`, `cmdk`,
   `date-fns`, `embla-carousel-react`, `input-otp`, `react-day-picker`,
   `react-resizable-panels`, `react-server-dom-webpack`.
9. Removed the unused `guide` export from `recipes.ts` and the unused
   `hooks/use-mobile.ts`.

**Formatting**

10. Ran `oxfmt` across 84 files. `.oxfmtrc.json` had always set `printWidth: 80`
    while `globals.css` carried a 5,193-character line and `grill-tools.tsx` a
    3,272-character one. Quote style was split between files.
11. Rewrote the two tests that asserted on exact source strings — the formatter
    would have broken them. They now assert behaviour through `buildRecipe`, and
    the one genuinely structural check uses a whitespace-tolerant pattern. This
    was done **before** formatting, and the `<img>` it guards was indeed
    reflowed across seven lines, so the original assertion would have failed.
12. Extracted the duplicated TypeScript test loader into `tests/load-ts.cjs`.
13. Tightened the image test from `width <= 1200 && >= 1000, height > 500` to the
    exact 1200×800 the `<img>` tag declares.

**Accessibility**

14. The countdown was announced every second. `<output>` carries an implicit
    `role="status"`, so screen-reader users heard the timer and nothing else.
    Now `aria-live="off"`, with the adjacent `role="status"` reporting completion.
15. Five bare `<label id="…">` elements labelled nothing — they name Base UI
    Select triggers through `aria-labelledby`. Now `<span className="field-label">`,
    with the CSS updated in step so the styling is unchanged.
16. Added a "Skip to main content" link (WCAG 2.4.1, Level A).
17. `rel="noreferrer"` → `rel="noopener noreferrer"` on both USDA links.
18. Added explicit `type="button"` to all 12 buttons.

**Correctness**

19. With exactly 3 burners the middle position rendered as `"Center "` with a
    trailing space.

**Licensing**

20. `LICENSE` now names Turmanator as the copyright holder (MIT, 2026), and
    `package.json` carries a matching `author` and `license` field.

---

## Open — needs your decision

### 1. The offline build still cannot be reproduced

`index.html` differs from what this source produces — title, description, image
paths (`./images/` vs `/meals/`), an inline favicon, and inlined fonts — and no
script in the repository performs that transformation. As the corrections above
show, that tool is also where the real bloat comes from. Either commit the
packaging step, or drop the prebuilt `index.html` and publish it as a release
asset. Keeping both copies without the step between them guarantees drift.

### 2. A transitive `sharp` still carries the libvips CVEs

The direct dependency is now `0.35.4`, but `@cloudflare/vite-plugin@1.37.1` →
`miniflare` pins `sharp@0.34.5`. Clearing it needs `@cloudflare/vite-plugin@1.54.5`,
outside the stated range, so I did not force it. `npm audit` also reports high-
severity advisories against `vite@8.0.13` (a `server.fs.deny` bypass and an
NTLM disclosure, both dev-server only), plus `undici`, `ws`, `esbuild` and
`image-size`. All are development dependencies — none reaches the shipped
bundle — but they warrant a deliberate upgrade pass.

### 3. Most of `recipes.ts` is still dead data

`buildRecipe` spreads the base recipe then overrides **every field of the
`Recipe` type**. Only `base.title`, `base.description`, `base.headline` and
`base.tip` are ever read, and only on some branches. All four recipes' full
ingredient lists and step-by-step methods are never rendered.

I left this alone: it is a sizeable data deletion whose payoff is
maintainability rather than correctness, and the shape of the replacement is a
judgement call. But it is a live trap — the next person to correct a temperature
there will change nothing and have no idea why.

Related: temperatures are stated three times — numerically in `cuts`,
numerically in `recipes`, and as prose inside step text. The prose copies are
the only reason the regex-based Celsius conversion exists.

### 4. No error boundary

`app/page.tsx` calls `buildRecipe(...)` in the render body, and it throws on an
unknown cut or out-of-range weight. Every current path is validated, so this is
latent — but if it ever throws, React unmounts the tree and the user gets a
blank page.

### 5. Two `localStorage` prefixes

`searline-unit` and `searline-saved` sit alongside `searious-weight-unit`,
`searious-weights` and `searious-grill` — a half-finished rename. Nothing is
broken, but settling on one versioned prefix needs a migration so existing users
keep their saved recipes.

### 6. Remaining non-null assertions

`cuts.find(...)!` in `page.tsx` (twice) and `recipes.find(...)!` in
`cook-config.ts`. All hold today. The third is the riskiest: adding a cut with a
typo'd `baseId` is an easy mistake with no type-level guard. (The related
`seasonings` lookup is now type-safe — see the corrections above.)

### 7. Double-labelled controls

Ingredient checkboxes and burner switches wrap a Base UI control in a `<label>`
**and** set `aria-label` with the same text, so the visible text is not what
names the control. The bare-`<label>` half of this is fixed; this half remains.

### 8. Product gaps

- **A grill timer with no alarm** — no audio, vibration, notification, or Wake
  Lock, so the screen sleeps mid-cook and a finished timer is silent. For an app
  whose premise is standing at a grill, this is the most valuable gap on the list.
- No `theme-color`, Open Graph, canonical URL, `apple-touch-icon` or manifest.
- `color-scheme: dark light` overpromises — `<html class="dark">` is hardcoded
  with no toggle and no `prefers-color-scheme` handling.
- `measured()` converts cup→tbsp→tsp downward but never upward, so a large batch
  renders "12 tbsp butter" rather than "¾ cup".

---

## What was already right

Independently re-verified, and worth stating because it narrows where risk lives.

- **The domain maths is correct.** All 74 Fahrenheit tokens were extracted and
  re-converted independently — none is missed or half-converted. Pound↔kilogram
  uses the exact avoirdupois factor. The project's own test suite asserts the
  same invariant and agrees.
- **Food-safety data is accurate** — 145 °F whole beef/pork/fish, 165 °F all
  poultry, 195–205 °F pull-tender, with tenderness targets kept visibly separate
  from safety minimums.
- **The cook timer is built the right way** — an absolute deadline recomputed
  each tick, so it does not drift, survives background-tab throttling, and pauses
  and resumes correctly.
- **Security posture is genuinely clean** — zero network calls of any kind, no
  `eval`, no `innerHTML` in application code, no secrets, no analytics, no source
  maps. The only outbound link is the USDA chart.
- **`localStorage` access is fully guarded** and restored values are re-validated
  against the cut list and weight ranges before use.
- **The logic tests are good** — they exhaust the burner state space (now 4ⁿ for
  n = 2…6, since each zone has four settings), round-trip weight boundaries
  through kilograms, and guard against `NaN`/`Infinity` leaking into output.
- **The Web MCP integration is careful** — feature-detected, strict schemas with
  `additionalProperties: false`, unknown keys rejected, cut-belongs-to-protein
  verified, and `AbortController` cleanup.
- **Images are consistent** — all 12 exactly 1200×800 WebP, one per cut, no
  orphans, none missing, no EXIF.
- **The print stylesheet is properly done** — `@page` margins, forced light
  colours, `break-after`/`break-inside` control, point units.

## Note on the environment

`npm run lint` cannot complete here: oxlint's type-aware backend
(`@oxlint-tsgolint/win32-x64/tsgolint.exe`) fails to spawn with `EPERM` from this
sandbox. Lint results above come from the same config with `typeAware` disabled;
`tsc --noEmit` covers the type-aware ground and passes. Expect the full linter to
work on a normal workstation and in CI. Running the project from an
iCloud-synced folder is a plausible contributor and is worth avoiding for a
repository anyway.
