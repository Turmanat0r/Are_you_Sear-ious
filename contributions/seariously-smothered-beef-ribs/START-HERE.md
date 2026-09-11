# Are You Sear-ious · Complete repaired beef-ribs package

This is the standalone **Sear-iously Smothered Beef Ribs** recipe, repaired from `seariously-smothered-beef-ribs-corrected.zip`. The source ZIP and other recipe projects were not overwritten. Nothing has been deployed or uploaded to GitHub.

## Open the recipe

Extract the whole ZIP to a folder. Open the root **index.html**, keeping **images/**, **provenance/**, **licenses/**, the favicon, and accompanying notes beside it. Do not try to run it inside a ZIP viewer.

**beef-ribs-page-code.txt contains the COMPLETE HTML PAGE CODE**, including CSS, JavaScript, icons and embedded fonts. It is byte-for-byte identical to index.html. Rename a copy to `index.html` or `beef-ribs.html` and use it alongside the same files. If Windows hides extensions, make sure it ends in `.html`, not `.html.txt`.

Both responsive food images are optimized WebP. JavaScript must be enabled. Mobile file-preview apps may require opening a hosted browser version for interactivity. RECIPE.md is a separate readable base recipe, not the code TXT.

## Contents

- `index.html` + identical `beef-ribs-page-code.txt`: portable compiled recipe page.
- `images/`: 1200px and 640px WebP versions of the supplied ribs image.
- `favicon.svg`: local icon.
- `provenance/`: preserved original PNG, exact supplied prompt and historical records, plus current image details.
- `source-project/`: actual editable components, typed recipe data, original CSS/fonts, npm manifest and lockfile, build/test configuration, tests, image records and instructions.
- `RECIPE.md`, `SOURCES.md`, `IMAGE-SOURCES.txt`, `QA.md`: recipe, references, image-origin notes and verification limits.
- `licenses/` and `THIRD-PARTY-NOTICES.txt`: software and font license texts.
- `SHA256SUMS.txt`: hashes for every other included file.
- `image-audit.json`: actual image-format/size/hash checks and input-archive identity.

The original PNG and provenance are also inside source-project so that folder can be used independently. Runtime food images remain WebP. Installed dependency folders are not included; npm restores the exact lockfile versions.

## What is fixed

Saved recipes reopen with their own stored weight; changing cuts normally still carries batch weight. The selected cut is remembered. Cook progress and the deadline-based timer survive closing the cook dialog. Ingredient checklist keys/reset and metric-boundary handling are corrected. All cooking stages use indirect heat, with the actual burners always chosen by the user. The written recipe no longer selects an outside burner. Safety and probe tenderness are distinctly labeled in screen, cook mode and print.

The original mustard rub, brown sugar–Worcestershire sauce, four CSS files, two fonts and both responsive WebPs are preserved. Broth scaling is explicitly a starting quantity adjusted for pan depth; times never scale by batch weight. This is for individual English-cut bone-in short ribs, not thin flanken, back ribs or boneless pieces.

## GitHub → Vercel

Recommended: use the editable source.

1. Commit the extracted package to GitHub.
2. Import the repository in Vercel and set **Root Directory: source-project**.
3. Framework: **Vite**. Install: **npm ci**. Build: **npm run build**. Output: **dist**. Use Node 22.13+ (22 LTS or 24 LTS).
4. No environment variables, functions, database or account secrets are needed.

If committing only source-project's contents, use the repository root instead. The folder's `vercel.json` sets the Vite options. Read source-project/README.md for editing and build instructions. Tailwind 4 uses the original CSS-first theme and official Vite plugin; no legacy Tailwind config is needed.

For an optional no-build static deployment, select the ZIP root, framework **Other**, no build/install commands, and output `.`. The ZIP-root `vercel.json` supplies those settings. This static alternative publishes the packaged files as-is; the recommended Vite option publishes only the built runtime. [Vercel configuration reference](https://vercel.com/docs/project-configuration).

## Continuing in another chat

Upload this entire ZIP and say: “Continue this repaired Are You Sear-ious beef-ribs recipe. Read START-HERE.md and source-project/AGENTS.md. Work from the actual source-project. Preserve its existing appearance, recipe, manual burners, scaling, units, cooking science, printing, and cook mode. Deliver a complete ZIP with the full-page-code TXT, identical HTML, WebPs, editable source and Vercel instructions. Do not deploy unless I ask.”

This individual-recipe ZIP does not replace the full multi-recipe site. Integrate it into that site's existing catalog or link the standalone page without overwriting the main homepage.

## Verification and rights

Automated model/server-render tests, type checking, lint, build, artifact identity, image hashes and original CSS/font hashes are checked. See QA.md for limits. No current interactive-browser/screenshot QA, live Vercel deployment or physical cooking test is claimed.

The supplied image-generation record is preserved, but no separate image license was provided. Hashes prove file identity, not authenticity, authorship or ownership. No image signature/C2PA or EXIF validation is claimed. Third-party software/font licenses do not assign a license to user-owned recipe code or imagery.
