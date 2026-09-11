# Are You Sear-ious: Steakhouse beef-or-bison burgers

Standalone GitHub/Vercel recipe package in the approved dark Are You Sear-ious visual format. Choose beef or bison, patty count, patty size, pounds/kilograms, and Fahrenheit/Celsius. Ingredients scale with total meat weight; cooking time does not.

## Run locally

Open `index.html` directly in a modern browser, or serve this folder with any static web server. The page has no runtime dependency on a package manager.

## GitHub and Vercel

Commit the package to a GitHub repository. Import that repository into Vercel as a static project with the repository root as the project root; no build command is required and the output directory is the root. Do not deploy this package from iCloud.

## Included files

- `index.html` and `burger-page-code.txt` are byte-for-byte identical, complete runnable page code.
- `src/` contains the editable recipe and source boundaries; the standalone page intentionally inlines its CSS and JavaScript.
- `images/` contains the runtime WebP; `provenance/` preserves the original PNG, exact prompt, hashes, and conversion details.
- `tests/smoke-test.mjs` checks identity, recipe controls, safety temperature, and image presence. Run with `npm run check`.

Ground-meat safety minimum is 160°F / 71°C in the center of every patty. Tenderness/finish guidance is also 160°F+ for this ground-meat recipe; pink color is not a doneness test.
