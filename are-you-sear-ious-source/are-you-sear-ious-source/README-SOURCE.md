# Are You Sear-ious — editable source

This is the original editable project, not the previously delivered compiled
`index.html` export. Project files are copied unchanged from commit
`f73e04a5293419e71a5cb84fbfd799f79d5a6651`. Handoff documentation and audit records
have been added separately. No app code was changed for this handoff.

## What is included

- `app/page.tsx`: main interactive page.
- `app/grill-tools.tsx`: recipe controls, burner selection and cooking tools.
- `app/cook-config.ts` and `app/recipes.ts`: cuts, scaling and recipe data.
- `components/ui/`, `hooks/`, `lib/`: original component library and utilities.
- `app/globals.css` and `app/experience.css`: theme and app styling.
- `package.json`, `package-lock.json`, TypeScript and Vite configuration.
- `public/meals/`: all 23 optimized WebP meal illustrations.
- `tests/` and `scripts/optimize-meal-images.mjs`.
- `IMAGE-PROVENANCE.md`, `image-provenance.json` and `SOURCE-FILES.sha256`.

The stack is React 19, Vinext/Vite and Tailwind CSS 4, with shadcn/Base UI
components. The generic package name `sites-project` is unchanged from the scaffold.

## Where is tailwind.config?

There is no `tailwind.config.js` or `tailwind.config.ts` in this project.
Tailwind 4 uses the CSS configuration in `app/globals.css`, including its imports,
`@theme inline`, dark-mode variant and CSS variables. The Tailwind PostCSS plugin
is configured in `vite.config.ts`. `components.json` points to that CSS file and
intentionally has an empty Tailwind config-file field.

## Run locally

Install Node.js 22.13.0 or newer, extract this archive completely, then run these
commands from the folder containing `package.json`:

```sh
npm ci
npm run dev
```

Use the local address printed by the development server. Installing dependencies
requires internet; the first font/build setup may require internet too. This source
archive is not an offline dependency installer. The earlier standalone HTML ZIP
remains the version intended for opening directly without Node or a server.

Other existing project commands:

```sh
npm run build
npm run start
npm run lint
npx tsc --noEmit
node --test tests/cook-config.test.cjs
```

`npm run start` is a local Wrangler preview of the built server; it does not
publish the site. The included `.openai/hosting.json` retains this project's
original Sites identifier and is imported by Vite. It contains no credential.
Do not assume that identifier grants access to publish, or reuse it for a new site.

The optional image optimizer and image tests use `sharp` 0.34.5, which is included
in the dependency lockfile. To regenerate images, supply the
`originals/` directory extracted from the companion image-originals archive:

```sh
node scripts/optimize-meal-images.mjs /path/to/originals
node --test tests/meal-photos.test.cjs
```

The optimizer overwrites `public/meals/*.webp`. Its original conversion does not
preserve the PNGs' C2PA metadata; see the provenance report before reusing it.

## Archive scope and notices

The source snapshot excludes Git history, installed dependencies, compiled output,
local environment files, runtime state and the tracked `tsconfig.tsbuildinfo`
cache. `SOURCE-FILES.sha256` maps every copied original project file to its hash.

`THIRD-PARTY-LICENSES.txt` is the existing software/font notice from the standalone
export. It is not an image license or a complete license inventory for every
development dependency and unused scaffold component. Installed packages retain
their own notices. This handoff does not assign a new open-source license to the app.

All 23 food images were AI-generated, not stock or camera photography. See
`IMAGE-PROVENANCE.md` and the companion `are-you-sear-ious-image-originals.zip`
for the preserved original files and the limits of the available evidence.
