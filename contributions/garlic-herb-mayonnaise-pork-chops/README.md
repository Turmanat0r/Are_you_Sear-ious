# Are You Sear-ious · Garlic-herb mayonnaise pork chops

Standalone React, TypeScript, Vite and Tailwind CSS recipe page for a three-burner gas grill. Choose bone-in or boneless chops, scale the batch, choose burners manually, switch US/metric measures and Fahrenheit/Celsius, follow cook mode, or print the configured recipe.

## Run locally

Use Node 22.13+ and run `npm ci`, then `npm run dev`. Build with `npm run build`; Vercel is configured for Vite with `dist` as the output directory. No Cloudflare runtime is included.

The production build exports an identical self-contained HTML-code TXT file in `dist/`, plus recipe/source documents, licenses and the WebP image. The TXT can be renamed to `index.html`.

The photo is recipe-specific and its original PNG, exact generation prompt, conversion details and hashes are bundled under `provenance/`.
