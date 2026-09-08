# Notices and attribution

This project combines three categories of material with different terms. The
`LICENSE` file (MIT) covers the **first category only**.

| Material | Terms |
| --- | --- |
| Application source and build output | MIT — see [`LICENSE`](LICENSE) |
| Bundled third-party libraries and fonts | Their own licenses — see [`THIRD-PARTY-LICENSES.txt`](THIRD-PARTY-LICENSES.txt) |
| The 12 meal images in `images/` | AI-generated — see below |

## Third-party software and fonts

`THIRD-PARTY-LICENSES.txt` carries the full license text for every library and
font redistributed inside `index.html`. The bundle was audited against that file
and no undeclared runtime dependency was found. Nineteen packages plus the Geist
and Geist Mono typefaces are covered:

- **MIT** — React, React DOM, scheduler, use-sync-external-store, Base UI,
  Floating UI, clsx, class-variance-authority, tailwind-merge, reselect,
  `@babel/runtime`, Tailwind CSS, tw-animate-css, shadcn
- **ISC** — lucide-react 1.31.0
- **SIL Open Font License 1.1** — Geist and Geist Mono, © 2023 Vercel in
  collaboration with basement.studio

The OFL requires that the fonts are not sold on their own and that a modified
version does not reuse the reserved font names. Redistribution inside this
application is permitted; the license text travels with it in
`THIRD-PARTY-LICENSES.txt`.

Development-only dependencies (Vite, Wrangler, oxlint, TypeScript, and the
unused shadcn scaffold components) are **not** covered by that file. They are
not redistributed in the build output. If you publish a dependency inventory for
compliance purposes, generate it from `package-lock.json` rather than from
`THIRD-PARTY-LICENSES.txt`.

## The meal images

All 12 WebP images in `images/` (and `public/meals/` in the source project) were
**generated with an AI image model**, not photographed and not obtained from a
stock library. No stock license was purchased and no photographer attribution is
owed. Full details, including the preserved prompts for 8 of the 12 images, are
in `IMAGE-PROVENANCE.md` and `image-provenance.json` in the source archive.

Two things follow from that, and both are deliberate:

**These images are not licensed under MIT.** The MIT license in this repository
applies to software. It is left unstated whether the images may be reused,
because their copyright status is genuinely unsettled: works produced by a
generative model without sufficient human authorship have been held
uncopyrightable in the United States, which means there may be no exclusive
right here to grant or withhold. Anyone wanting to reuse them should seek their
own advice rather than rely on the code license.

**The delivered files no longer carry their provenance metadata.** The original
PNGs each contained a C2PA (`caBX`) manifest identifying them as AI-generated.
The optimization step in `scripts/optimize-meal-images.mjs` resizes to 1200×800
and re-encodes to WebP via Sharp without preserving metadata, so the shipped
WebPs contain no EXIF, XMP, or C2PA data. This was verified by inspection: each
file is a single `VP8 ` chunk with nothing else.

If you want the disclosure to travel with the files, either re-run the optimizer
with metadata retention enabled or keep this notice alongside any redistribution.
The original PNGs with their manifests intact are preserved in the companion
`are-you-sear-ious-image-originals` archive.

## Food safety information

Temperature guidance in this app is drawn from the USDA FSIS Safe Minimum
Internal Temperature Chart, which is linked from the application and is a work of
the United States federal government. The app is a planning aid: the burner
diagram does not control a real grill, and doneness is determined by measured
internal temperature, not by the app's time estimates.
