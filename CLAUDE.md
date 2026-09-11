# Are You Sear-ious

A grilling app: 19 cuts across beef, pork, poultry and seafood. Pick a cut and a
weight, it scales the seasoning, plans your burner zones, estimates cook time
and walks you through it. Static site, no backend, no network calls at all.

Live at <https://are-you-sear-ious.vercel.app> · repo `Turmanat0r/Are_you_Sear-ious`

## Where things are

The source is **two folders down**, which is confusing but real:

```
are-you-sear-ious-source/are-you-sear-ious-source/     <- run npm here
```

| File | What lives in it |
| --- | --- |
| `app/cook-config.ts` | The 19 cuts, ingredient scaling, recipe assembly, burner heat model, substitutions. The big one. |
| `app/recipes.ts` | Four base recipes, type definitions, °F→°C conversion |
| `app/page.tsx` | Page, cook mode, print sheet, saved recipes |
| `app/grill-tools.tsx` | Weight/cut controls, temperature table, burner planner |
| `app/experience.css` | Almost all styling, including the responsive layer at the bottom |
| `public/meals/<cut-id>.webp` | One photo per cut, exactly 1200×800, under 250 KB |

`index.html` and `images/` at the repo root are a **stale offline build**. They
predate several sessions and are missing recipes. Don't treat them as
current; see TODO.md item 1.

## Commands

Run from the source folder above.

```
npm run dev         # plain Vite dev server
npm test            # 51 tests, node:test
npm run typecheck   # tsc --noEmit, strict + noUncheckedIndexedAccess
npm run lint        # oxlint
npm run format      # oxfmt
npm run build       # vite build -> dist-static/
```

## Two things that will bite you

**1. The linter cannot fully run on this machine.** oxlint's type-aware backend
(`tsgolint.exe`) fails to spawn with EPERM in the local sandbox. A clean local
run does **not** mean a clean Vercel run — this has broken production before.
So: push a branch, wait for the Vercel preview to reach `READY`, and only then
merge. Daniel merges the PR himself; a `main` ruleset blocks direct pushes and
he has chosen to keep it that way.

**2. `git push ... | tail -3 && next-command` hides push failures**, because the
pipeline exits with `tail`'s status. Check `git push` unpiped.

## Adding a recipe

This is the usual request. In `app/cook-config.ts` unless stated:

1. Add an entry to `cuts`. Every field is required except `attribution` and
   `midSentenceName`. `headline` and `description` must be **unique to that
   cut** — a test enforces it, because copy used to be shared per protein and
   all three fish read identically.
   The four proteins are `Beef`, `Pork`, `Poultry` and **`Seafood`** — the
   last covers fish and shellfish together, the way the USDA chart does.
   If two recipes share a cut, `name` is what tells them apart in the picker
   and `midSentenceName` is what the shopping line says you should buy.
2. `baseId` points at one of the four recipes in `recipes.ts` purely for the
   base lookup. Every field gets overridden, so pick any sensible one.
3. Needs its own ingredients? Add a `SeasoningGroup` key and an entry in
   `seasonings`. Amounts use `m(qty, unit, name)` and scale automatically.
   **Do not put ` — ` in a seasoning item**; `measuredPart()` truncates there
   and it is reserved for the meat/salt line.
4. Needs its own steps? Add a branch in `buildRecipe`'s step chain.
5. Drop the photo at `public/meals/<id>.webp`, **exactly 1200×800, under
   250 KB**, and add its hashes to `image-provenance.json`. Contributed
   packages have twice arrived at 1120×747 — check before you copy, and
   re-derive from the original PNG with Sharp if it is wrong.
6. Add substitutions to `swapSets` for any genuinely new ingredient. Matching
   is longest-substring-wins, so check it doesn't shadow an existing set.
7. Bump the cut count in `tests/cook-config.test.cjs` (two places, plus the
   per-protein count).
8. Run the whole gate, then branch → preview → PR.

## Non-negotiables

- **USDA temperatures win.** Poultry 165°F; whole beef and pork 145°F with a
  3-minute rest; fish 145°F with **no** required rest — the 3-minute rule is
  for whole cuts of meat, not fillets. If a source recipe finishes lower,
  raise it and pin it with a test. The tri-tip and the walleye both do.
- **The disclosures stay.** AI-photo badge, safety banner, print-sheet notices,
  bottom legal note. Tests assert each by substance, not wording.
- **No network calls, ever.** The app claims it makes none, and a test greps
  every app module for `fetch(`, `XMLHttpRequest`, `sendBeacon`, `WebSocket`
  and `EventSource`. That claim must stay true.
- **Adapted recipes get visible credit**, including a no-affiliation line, in
  the app and on the print sheet — not just in `NOTICE.md`.

## Read these before proposing work

- `TODO.md` — the live backlog, ordered by what bites first
- `AUDIT.md` — full review record, including corrections to earlier findings
- `NOTICE.md` — licensing, AI-image provenance, the Weber recipe attribution
