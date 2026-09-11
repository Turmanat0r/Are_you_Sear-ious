# Are You Sear-ious — Champagne–Garlic Butter-Bath Lobster Tails

This is the supplied lobster recipe rewritten in the original dark Are You Sear-ious / tri-tip page format. The four style sources and both Geist fonts are unchanged. It retains the charcoal background, orange accents, green control strip, blended photo card, adjacent temperatures, ingredient column, numbered method, science notes, manual burner planner, and print styling.

## Open the page

Extract the complete ZIP and open index.html in a current desktop browser. Keep images/ beside it. HTML, CSS, JavaScript, icons, and fonts are embedded; the recipe-specific WebP is local. No internet connection is needed to run the prebuilt page.

lobster-page-code.txt is the COMPLETE HTML/CSS/JavaScript code, byte-for-byte identical to index.html and dist/index.html. It is not a written-out recipe. A copy renamed to index.html works with the same adjacent images/ folder.

Local-file previews on phones may not run JavaScript. A browser-hosted version provides the full interactive experience.

## Recipe and controls

- Choose 1, 2, 3, 4, 6, or 8 tails, and small (4–6 oz), medium (7–9 oz), or jumbo (10–12 oz) individual tails.
- The original calculation uses size midpoints of 5, 8, and 11 oz per tail. Ingredients scale by estimated total weight divided by 16 oz. Timing follows individual tail size, not batch quantity.
- US quantities are retained from the attachment. Metric mode converts tail weights to g/kg, butter to grams, and liquid/herb/seasoning volumes to ml. Garlic stays in cloves. Culinary conversions use 15 ml/tbsp, 5 ml/tsp, 240 ml/cup, and approximately 14 g/tbsp butter. Salt is kept as volume instead of assuming a brand-dependent gram density.
- Fahrenheit/Celsius changes every cooking temperature, including method, science, cook mode, and print.
- Choose 2–6 burners, orientation, and each burner's ON/OFF state. The initial four-burner plan matches the attachment, with burners 2 and 3 ON. Change it to match your grill. All pans must fit entirely above unlit burners.
- Ingredient checklists, saved tail sizes, cook mode, a check-in timer, and printing use the original theme's controls. Cook mode opens with a three-minute basting reminder; it resets when closed.
- Tail count/size, units, saved sizes, and the burner plan persist in browser storage when available. Checklists last for the open session. This is not a cross-device account.
- Printing includes the selected count, size, units, ingredients, all four steps, science, and current burner plan. Paper output is intentionally white, matching the reference's print styling.

The original seasoning quantities have not changed. Method wording clarifies dividing the measured salt, paprika, and chives rather than adding them twice. Reserve a clean portion of butter before raw lobster enters the bath, then use that for serving and discard the used bath.

## Edit and build

Node.js 22.13.0 or later:

~~~text
npm ci
npm run typecheck
npm run build
npm test
npm start
~~~

- src/lobster.ts: typed tail sizes, original quantities, scaling, steps, and science.
- src/cook-config.ts: validation and burner guidance.
- src/App.tsx: the reference page structure, saved sizes, cook mode, timer, and print.
- src/grill-tools.tsx: themed recipe selectors, temperature table, and manual burners.
- src/components/ui/: included component source.
- src/globals.css, src/experience.css, src/fonts.css, src/shadcn-variants.css: unchanged reference styling.
- scripts/build.mjs: normal esbuild-wasm and Tailwind/PostCSS build; produces all three identical HTML/TXT outputs.

esbuild-wasm is only a build-time compiler. No runtime compiler, custom module loader, or development server runs inside the delivered page.

Optional browser checks: install Playwright separately and run node tests/browser-check.cjs with Chrome installed. SEARIOUS_PLAYWRIGHT_PATH can point to an existing Playwright installation. Screenshots and a print PDF are written to verification/. These checks compare computed styling against the original tri-tip baseline.

## GitHub and Vercel

Commit the extracted package into a GitHub repository, or a recipe subdirectory in an existing repository. In Vercel, select that directory as the project root. Framework: Other; install: npm ci; build: npm run build; output: dist. vercel.json supplies these values.

The ZIP includes a prebuilt dist/ for convenience; rebuild it after edits. Source files and provenance are not part of the public static output. No deployment has been performed, and this corrected ZIP has not been copied into the user's iCloud or site folder.

## Provenance and supporting files

The WebP, original PNG, exact generation prompt, and original image provenance were copied unchanged from the attachment. No image was generated or edited for this correction. Image origin is separate from software/font licensing.

provenance/package-origin.json identifies the input ZIP and HTML hashes and records the correction. provenance/layout-reference.json records the unchanged style/font hashes. THIRD-PARTY-LICENSES.txt contains bundled software and font notices.

scripts/convert-images.py documents a reproducible WebP conversion to a new output file using the pinned Pillow dependency. It does not alter the preserved files unless you explicitly choose their paths, which it refuses when they already exist.

SHA256SUMS.txt hashes every delivered file except the manifest itself. Refresh with node scripts/hash-package.mjs after edits or rebuilding. Installed node_modules/ and optional verification output are excluded from the ZIP.

See SOURCES.md and recipe-notes.md. This recipe has not been kitchen-tested; time ranges remain estimates.
