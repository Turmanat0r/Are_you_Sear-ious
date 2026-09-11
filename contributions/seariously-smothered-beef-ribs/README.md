# Are You Sear-ious · Sear-iously Smothered Beef Ribs

Complete editable source for the repaired standalone beef-rib page. The user's supplied dark layout, four CSS files, both Geist font files, mustard rub, sauce quantities, and responsive WebP images are preserved. This is not the whole multi-recipe site.

## Run locally

Use Node 22.13+ (22 LTS or 24 LTS) and npm:

```sh
npm ci
npm run dev
```

Open the local address printed by Vite. To produce the portable page:

```sh
npm run check
npm run preview
```

`check` runs strict type checking, ESLint, Vitest, a production build, and artifact verification. `npm run build` produces `dist/index.html` and a byte-identical `dist/beef-ribs-page-code.txt`, with the complete CSS, JavaScript and local fonts embedded. It copies required images, notices, and recipe/source notes alongside them. Source `index.html` is the Vite entry, not the complete-code export.

The ZIP root already contains the built HTML, complete-code TXT and supporting files. Extract everything and open that HTML in a modern browser. Renaming a copy of the TXT to `.html` works in the same folder. JavaScript must be enabled; phone file-preview apps may require a hosted browser version.

## Editable source

- `src/ribs.ts`: typed recipe, ingredients, cut/thickness options, steps and science.
- `src/cook-config.ts`: quantities, unit/weight validation and burner guidance.
- `src/App.tsx`: page composition and recipe/session state.
- `src/components/RecipePrint.tsx` and `CookMode.tsx`: real print and cook-mode components.
- `src/grill-tools.tsx`: input controls, protein-specific temperature guide and manual burner planner.
- `src/hooks/useTimer.ts`: deadline-based timer owned by the page, not the dialog.
- `src/globals.css`, `experience.css`, `fonts.css`, `shadcn-variants.css`: original supplied styles, unchanged.
- `assets/fonts/`, `public/images/`, `provenance/`: local fonts, responsive WebPs, preserved original PNG/prompt/records.
- `vite.config.ts`, `vitest.config.ts`, `eslint.config.js`, TypeScript config, package manifest and lockfile: ordinary build/test tooling.

React/TypeScript/Vite now matches the established recipe-source workflow. The former custom build server and esbuild-wasm test-compilation scripts are replaced by Vite and Vitest. No compiler, bespoke module loader, API, CDN font or server runtime is required in the browser. Tailwind 4 uses the retained CSS-first configuration and official Vite plugin; no legacy `tailwind.config.js` is needed. Vendored UI components are retained.

## Repairs and behavior

- Opening a saved recipe no longer copies the currently viewed cut's weight into it. Changing the cut through the normal selector still carries the current batch weight, as intended.
- The selected cut is remembered, and a valid `?recipe=...` link takes priority.
- Cook progress and the check timer survive closing/reopening cook mode. New weight/cut selections reset the cook session. A page reload resets it; no closed-browser/background alarm is guaranteed.
- Each recipe has its own stored burner plan. All burners start off; choose 2–6, arrangement, and individual ON/OFF states. Direct searing is not an offered method for this recipe. The diagram controls no actual hardware.
- Checklist keys are stable across display-unit changes, reset correctly, and clear when quantities change.
- Four-decimal metric boundary inputs normalize to the exact supported 2–12 lb range instead of drifting outside it. Invalid entries keep the last valid recipe and disable the page's print/cook buttons until corrected.
- Screen, cook mode and print distinguish the **145°F / 63°C + 3-minute rest safety minimum** from the **200–205°F / 93–96°C probe-tender range**. Grill ambient is **275–300°F / 135–149°C**, with the covered stage around 300°F / 149°C.
- All 20 ingredient quantities scale. Metric mode uses practical metric equivalents, not laboratory density measurements. Salt remains weighed. Broth quantity is a starting point; pan area determines actual liquid depth. Cooking time follows meat thickness, never the weight multiplier.

Storage is device/browser-local and optional, not cross-device sync. These instructions are for individual English-cut bone-in short ribs, not thin flanken or back ribs. The formula is not physically kitchen-tested.

## GitHub and Vercel

Commit this folder's contents to GitHub and import the repository in Vercel. If uploading the whole delivered ZIP, set Vercel's **Root Directory to `source-project`** instead.

- Framework: **Vite**
- Install: `npm ci`
- Build: `npm run build`
- Output: `dist`
- No environment variables, database or account secrets needed.

The included `vercel.json` provides these values. `node_modules`, `dist`, logs and secrets are ignored. The static ZIP-root alternative is explained in START-HERE.md. Nothing is deployed or uploaded automatically.

## Provenance and verification limits

See IMAGE-SOURCES.txt, SOURCES.md, QA.md and THIRD-PARTY-NOTICES.txt. Original image records are supplied historical claims; hashes prove byte identity, not image authorship, licensing or signature validity. No new image license or open-source license for user-owned code is assigned here.

The supplied historical layout metrics are retained only as context. Current verification checks the unchanged CSS/font bytes and automated rendering/model/build behavior; no fresh interactive-browser or screenshot comparison is claimed. No Vercel deployment or kitchen test was performed.
