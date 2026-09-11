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

## Session addendum — 2026-09-07, after a first look on a real phone

The first visual check of this project finally happened, on a phone. One layout
defect was reported and fixed; two features were added and given the same
treatment as the rest.

### The burner diagram reflowed when it should not have

A 3-burner grill rendered as 2-above-1 below 768px, because the diagram used
`repeat(auto-fit, minmax(112px, 1fr))` on narrow screens. That rule exists for a
real reason — six zones cannot each hold a tappable four-way control across a
phone — but it was applied to every burner count.

The diagram is a top view. Reflowing it stops it matching the grill in front of
you, which is the only job it has. Fixed by tagging the container with
`data-count` and keeping counts of 2 and 3 in one row at every width. The
attribute selector outranks the reflow rules, so a single declaration holds
across all six breakpoints instead of being repeated in each. Counts of 4 and up
still reflow.

Zone internals were retuned for the ~80px column that results at 320px: the
level control stacks 2×2 rather than 4-across, and labels are allowed to wrap.

### Kosher salt now carries a volume equivalent

The salt line was grams only, which is useless at a grill with no scale.
`saltVolumes()` adds a spoon equivalent, and `spoonLabel()` walks tsp → tbsp →
cup and rounds to quarter-spoons, because "about 0.94 tsp" helps nobody.

**Both brands are quoted, deliberately.** Diamond Crystal is 2.84 g/tsp and
Morton is 4.80 g/tsp — a factor of 1.7. A single spoon figure would be wrong by
about 70% for whoever owns the other box, which is exactly the error the app's
weigh-don't-spoon design exists to avoid. Grams remain the authoritative figure
and the line says "no scale?" so the fallback reads as a fallback.

The equivalents live only on the shopping line. The step prose interpolates the
same `salt` variable and would have become unreadable with them inlined; a test
now pins that both quote the same weight.

### `measured()` converts upward as well as down (was TODO #14)

Same helper, same session, so it was fixed here: a scaled-up batch rendered
"12 tbsp butter". It now climbs to "¾ cup" — **but only when the larger unit
lands on a printable fraction.** A naive conversion turns a perfectly good
"4 tsp" into "1.33 tbsp", which is worse than what it replaced. `printsAsFraction()`
shares its rule with `amountLabel()` so the two cannot drift apart.

### The tri-tip

Supplied as a second, restructured copy of the whole app (`src/App.tsx`, its own
`scripts/build.mjs`). It was not merged. The recipe content was extracted and
ported onto this project's own types; the duplicate app was discarded.

It is the first cut that is not generated from a template, and the first adapted
from someone else's published work. Both facts needed handling:

- **Attribution is rendered, not just recorded.** It appears beside the recipe
  and on the printed sheet, since the sheet is what leaves the site.
- **The finish temperature was raised and pinned.** The source recipe finishes
  below USDA guidance for whole beef. This app takes it off at 145°F minimum,
  and a test asserts no lower figure can reappear in `finish` or `safety`.
- **The copyright split is documented in `NOTICE.md`** — proportions taken as
  fact, prose rewritten, with the citation for why that line falls where it does.
- **The beef safety string was wrong for it.** It read "Whole beef steaks"; a
  tri-tip is a roast. Now "steaks, roasts and chops alike", which is what the
  USDA figure actually covers.
- **Six substitution sets were added** so every rub and sauce ingredient can be
  swapped. A test asserts *every* tri-tip ingredient resolves one, and that the
  roast itself never does.
- **Provenance was verified, not asserted.** The original PNG carries a C2PA
  `caBX` manifest with OpenAI markers; the shipped WebP is a bare `VP8 ` chunk.
  The documented Sharp pipeline was re-run and reproduces the delivered file
  byte for byte. `image-provenance.json` records the hashes.

The cut borrows `pepper-ribeye` as its base-recipe lookup and then replaces every
field. That is commented at the definition, and a test asserts no ribeye copy or
method reaches the rendered output.

### Correction to an earlier figure

`TODO.md` recorded "client CSS 71.5 KB". The built stylesheet is 197.6 KB. That
is not a regression — the live site already served 196 KB — it is that the
earlier figure counted only the stylesheet and not the 119.5 KB of base64
font faces inlined into the same file. Both numbers are now stated separately.

## Session addendum — 2026-09-08, the walleye

Second supplied recipe, and the first that arrived as a plain text file with a
provenance package rather than a duplicate copy of the app. Much easier to work
with.

### Provenance was verified, not accepted

The package asserted SHA-256 hashes, dimensions, and a conversion recipe. All of
it was re-checked before anything was committed:

- Both claimed hashes match the delivered files.
- The WebP is exactly 1200×800 and 116,780 bytes, inside the 250 KB budget.
- The original PNG carries a C2PA `caBX` manifest (23,617 bytes) with the
  `c2pa`, `OpenAI` and `trainedAlgorithmicMedia` markers; the shipped WebP is a
  bare `VP8 ` chunk with the manifest gone, consistent with the other thirteen.
- Re-running the documented Sharp pipeline reproduces the delivered WebP byte
  for byte.

The supplied `(2)`-suffixed files are byte-identical iCloud sync duplicates and
were ignored rather than committed.

### A new family, because it is genuinely a different cook

The walleye shares the Fish protein with salmon, cod and halibut, but nothing
else: no mustard binder, no flipping, no direct heat, no basket. Reusing the
`fish` family would have handed it a Dijon-and-dill ingredient list and steps
telling the cook to turn it. So it gets `family: 'foil-boat'`, the way the
tri-tip got its own.

A test now asserts none of the fish template leaks in — no Dijon, no dill, no
fish basket — because that is the failure mode a future refactor would produce.

### The salt line was lying to this recipe

Two wordings were wrong once a foil boat existed:

- It said **"not again in the rub"**. This recipe has no rub. Worse, its actual
  double-salting risk is the lemon-pepper jar, which is salt-first in most
  supermarket blends. The line now names that risk instead, and the first step
  sends the cook to the label before they measure anything.
- It said **"total for the meat"** on a fillet. Now "fish" for the Fish protein,
  which also fixes the three fish cuts that had the same wording all along.

The dry-brine salt is still measured and still shown, because that is the app's
contract and every cut asserts it. What changed is that the walleye now says
plainly when *not* to use it.

### A test encoded an assumption that stopped being true

The per-cut suite asserted every recipe contains "mustard", which held for
thirteen cuts because every template used a mustard binder. The walleye's whole
premise is that it has no binder. The assertion was narrowed rather than
deleted: the other thirteen still must carry it, and the exemption says why.

### Correction carried into CLAUDE.md

`CLAUDE.md` stated the USDA rule as "whole beef/pork/fish 145°F with a 3-minute
rest". The rest requirement applies to whole cuts of beef and pork, **not** to
fish. The supplied recipe was right and the project instruction was wrong; it
has been fixed, and the walleye's `finish` says fish needs no rest at this
target.

## Session addendum — 2026-09-08, three at once

Prime rib, jerk turkey tenderloin and chimichurri-orange shrimp. Three recipes,
one of which forced a schema change.

### Shrimp is not a fish

The app had four proteins: Beef, Pork, Poultry, **Fish**. Shrimp is a
crustacean, so filing it under "Fish" would have put a wrong word on the tab a
cook actually reads. The USDA chart settles the grouping — its row is
**"Fish & Shellfish", 145°F** — so the category is right and only the name was
wrong. `Protein` is now `'Seafood'`.

The rename touched 17 quoted literals plus one unquoted `defaultCuts` key. It
was safe to do because **protein is never persisted**: `localStorage` holds
saved cut ids and per-cut weights, nothing keyed by protein. A test now asserts
no cut can reintroduce `'Fish'`.

Two related wordings followed it. The salt line said "total for the meat" over a
bowl of shrimp, and the ingredient group header said "Your meat & salt". Both
now take the same per-cut noun: meat, fish, or shrimp.

### Temperatures checked, and one that did not need fixing

- **Prime rib — 145°F, already correct.** The supplied recipe explicitly states
  the USDA endpoint and says a pinker preference "is not the safety endpoint".
  Nothing to override. What it did need was care in the method: reverse sear
  takes the roast off indirect heat at 135–140°F on purpose, and that is a
  *technique*, not a lower endpoint. The steps say to confirm at least 145°F
  after the sear and go back to indirect heat if it has not got there. A test
  pins both halves of that.
- **Turkey — 165°F, correct**, and the recipe itself flags the risk of reaching
  for the 145°F figure used by the beef and pork recipes beside it. A test
  asserts no stray 145°F target appears anywhere in the turkey method.
- **Shrimp — 145°F, correct**, matching the same USDA row as the fish.

### Math checked

- **Prime rib salt: the source is 1.25–2.1× the app's.** It lists 4 tsp for a
  4 lb roast. At Diamond Crystal that is 11.4 g (0.63% of raw weight); at
  Morton, 19.2 g (1.06%). The app's own formula gives 9.07 g (0.5%), which is
  brand-independent and the more conservative figure, so the app's number wins.
  A test pins it to the formula rather than to the source.
- **Prime rib horseradish is a strong ratio.** ½ cup prepared horseradish to
  1 cup sour cream is roughly double what most versions of this sauce use. It
  is a preference rather than an error, and the recipe's own instruction is to
  pass more at the table, so the amount stands with a note telling the cook to
  start lower.
- Shrimp: 2 min + 2–4 min matches the stated 4–6 min total. Turkey: 12–15 min a
  side plus the sear matches 24–32 min. Both consistent.

### Two of the three images were the wrong size

The supplied WebPs for the shrimp and the prime rib were **1120×747**, not the
1200×800 every other image uses and the photo test requires. Their own
provenance sidecars said so, which is how it was caught before the test failed.

All three originals verified — supplied SHA-256 hashes matched, each PNG carries
a C2PA `caBX` manifest with the OpenAI markers. So the delivered files were
re-derived from those verified originals with this project's Sharp pipeline.
The turkey was regenerated too, for consistency, and came out **smaller**:
240,856 → 187,154 bytes, because the package used quality 86 where this project
uses 80. `image-provenance.json` records what each superseded file hashed to.

### One refactor, because the ladder was getting silly

Step 0 was two parallel ternary ladders — one for the title, one for the body —
that had to be kept in the same order by hand, and three new families would have
made each of them six arms deep. They are now a single
`Partial<Record<Cut['family'], Step>>` lookup with the templated cuts falling
through to a default. Adding a bespoke family is now one entry instead of two
edits in two places that must agree.

The remaining ladders (`title`, `finish`, `wood`, `tip`, `portionLb`) are now
five to eight arms each and want the same treatment. Left alone deliberately:
that is a mechanical refactor best done on its own, not underneath three new
recipes.

## Session addendum — 2026-09-11, two chicken recipes

Achiote-lime and sauce-heavy BBQ, both on boneless skinless thighs. Nineteen
cuts. Temperatures were already right on both — 165°F, stated plainly, with the
BBQ one adding that sauce colour is not a doneness reading. Nothing to override.

### Two recipes, one cut

This is the first time two recipes share a cut of meat, and it breaks an
assumption the data model never had to state: that `cut.name` identifies both
the thing you buy *and* the entry you pick. Those are now different jobs.

The picker lists `cut.name`, filtered by protein. Two entries reading "Boneless
chicken thighs" would be literally unpickable. So `name` names the treatment —
"Achiote-lime boneless thighs", "BBQ boneless thighs" — and `midSentenceName`,
which already existed for "New York strip", carries what the shopping line
should actually tell you to buy: "boneless, skinless chicken thighs", identical
for both. A test asserts the names differ and the shopping lines match.

### The image budget was measuring the wrong thing

`npm test` failed on `bytes < 2_500_000` across all meal photos — 19 images now
total 2.59 MB.

That cap was wrong in principle, not just in value. Only one `<img>` is ever
mounted, keyed by recipe id, so **a visitor downloads one photo (~136 KB), not
the set.** The aggregate was never what anybody waited for; it is a deploy-weight
guard, and a fixed number that every new recipe walks toward is a tripwire
rather than a budget.

It now scales: mean under 160 KB, total under `cuts.length × 175 KB`. The
per-image 250 KB cap is untouched, because that one *is* what a visitor waits
for, and it is the assertion that actually protects the page.

### Four contributed images have now arrived at the wrong size

Both chicken WebPs were 1120×747 again, same as two of the three on 2026-09-08.
Originals verified both times — hashes matched their sidecars, C2PA manifests
present — so the delivered files were re-derived from the verified originals
with this project's pipeline. Four out of the last five. `CLAUDE.md` now says to
check before copying.

### Still waiting

`images/` also holds photos for two recipes that do not exist yet —
`steakhouse-beef-bison-burgers` and `champagne-garlic-butter-bath-lobster-tails`
— with `burger-page-code.txt` and `lobster-page-code.txt` beside them. Left
untracked and unbuilt, because they were not what was asked for.

Worth noting before they land: a bison burger is **ground** beef, and ground
meat is 160°F, not the 145°F this app uses for every whole beef cut so far. That
is the single most important thing to get right when that one is added.

## Session addendum — 2026-09-11, burgers, lobster, and a repository rescue

Twenty-one cuts. Six per protein except pork. The two recipes were the small
part of this session.

### iCloud was corrupting the repository

Git reported 83 files staged for deletion and no `origin` remote. The cause was
`.git/config`, which iCloud had renamed to `.git/config 2`. Git therefore ran
with no remote, no branch tracking and no `core.*` settings, which is what made
the entire tracked tree look deleted. The file was intact and restoring it fixed
everything, but that is luck rather than resilience: the next file iCloud
decides to rename could be a loose object, and no amount of copying gets that
back.

The repository now lives at `C:\Users\Danie\repos\are-you-sear-ious`. `git fsck`
is clean, every branch and the remote survived, and the full gate passes there.

**It also settled a question this audit has carried since the first session.**
`AUDIT.md` recorded that oxlint's type-aware backend failed to spawn with EPERM
and named iCloud as "a plausible contributor". It was the cause. The backend runs
on a local disk — verified by planting a floating promise in a scratch file and
watching `no-floating-promises` catch it, then deleting it.

So the constraint that shaped four sessions of workflow is gone. Branch previews
are still the process, but now because a ruleset requires a PR, not because this
machine was blind to half the lint rules.

### 121 loose files, grouped by reading them

The root had accumulated nine contribution packages' worth of debris, most of it
iCloud-numbered: seven `README.md`, seven `SOURCES.md`, nine
`image-provenance.json`, four `vercel.json`, four `src/main.ts`.

Each file was classified by **content**, not by its number — the numbering is an
artefact of sync order and trusting it would have mis-filed the paperwork behind
recipes people cook from. `SOURCES (2..5).md` carried no recipe name at all and
had to be told apart by which USDA row they cited. Seventeen files were deleted
only after confirming each was byte-identical to a copy being kept.

Everything now sits under `contributions/<recipe-id>/` with canonical names, and
the root is 13 entries instead of thirty-odd.

### The burger is the only 160°F cut in the app

It arrived already correct, and it is worth saying why that matters. Ground meat
has no protected centre: grinding takes what was on the surface and distributes
it throughout, so the 145°F that is defensible for a whole steak is not
defensible here. The burger sits in a Beef list where five other cuts are 145°F,
which is exactly the arrangement in which somebody copies the wrong number.

A test asserts it is the **only** cut in the app at 160°F, and that every other
beef cut is still 145°F. Its `finish` string is asserted to contain no 145 at
all.

Two knock-on corrections came with it:

- **Salt goes on at the grill, not ahead.** Every other cut here says to salt in
  advance, and for ground meat that is actively wrong — salt dissolves myosin
  and gives a springy, sausage texture. Its opener says so and a test pins it.
- **SPG is salt-first in most jars**, so it gets the pre-salted treatment the
  lemon pepper already had.

The source recipe references a "steakhouse sauce" it never actually provides an
ingredient list for. Rather than inventing one, the build list says to use your
preferred steakhouse or peppercorn sauce.

### The lobster bath never reaches the table

Same split-sauce shape as the shrimp and the BBQ chicken: butter that has sat
with raw lobster for the whole cook is not a serving sauce. A test asserts the
steps say so, that the pan stays over an unlit burner, and that the tails are
never turned.

A lobster is also not a fish, so the salt line and ingredient header say
"lobster" rather than inheriting the Seafood default of "fish" — the same
correction shrimp needed.
