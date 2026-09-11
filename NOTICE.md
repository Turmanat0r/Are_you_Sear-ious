# Notices and attribution

This project combines four categories of material with different terms. The
`LICENSE` file (MIT) covers the **first category only**.

| Material | Terms |
| --- | --- |
| Application source and build output | MIT — see [`LICENSE`](LICENSE) |
| Bundled third-party libraries and fonts | Their own licenses — see [`THIRD-PARTY-LICENSES.txt`](THIRD-PARTY-LICENSES.txt) |
| The meal images (18 in `images/`, 19 in `public/meals/`) | AI-generated — see below |
| Recipes drawn from published sources | Credited — see below |

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

Every WebP meal image — 19 in `public/meals/` in the source project, and the 18
in `images/` that the older offline build loads — was **generated with an AI
image model**, not photographed and not obtained from a stock library. No stock
license was purchased and no photographer attribution is owed. Full details,
including the preserved prompts for 10 of the 19, are in `IMAGE-PROVENANCE.md`
and `image-provenance.json` in the source archive.

The counts differ because `images/` belongs to the stale offline `index.html`,
which has not been regenerated since the tri-tip was added. See `TODO.md`.

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

## Recipes drawn from published sources

Seventeen of the nineteen recipes are this project's own work, owing nothing to
anyone. Two have a relationship with published material, and the two are not
the same kind of relationship. The prime rib, the jerk turkey tenderloin, the
chimichurri shrimp and both boneless-thigh chicken recipes are all original,
citing only USDA guidance for their temperatures.

### Adapted: the tri-tip

**Coffee–ancho tri-tip with chipotle-lime sauce** is adapted from Jamie
Purviance's tri-tip roast published by Weber, at
<https://www.weber.com/US/en/recipes/red-meat/tri-tip-roast/weber-2071757.html>.
The credit appears in the app beside the recipe and on the printed sheet, not
only here.

What was taken and what was not:

- **Taken: the rub and sauce proportions.** A list of ingredients and their
  quantities is a statement of fact. US courts have held that such a listing is
  not protected by copyright — *Publications International v. Meredith Corp.*,
  88 F.3d 473 (7th Cir. 1996).
- **Not taken: the expressive text.** Copyright does subsist in the descriptive
  and explanatory prose that surrounds a recipe. Every step, cue and note in
  this app is written from scratch, for a gas grill rather than the original
  setup.
- **Deliberately changed: the finish temperature.** The source finishes below
  USDA guidance for whole beef. This app takes the roast off at a minimum of
  145°F with a 3-minute rest, and a regression test pins that so it cannot be
  quietly reverted to the original's lower target.
- **Not Weber's: the photograph.** That illustration is AI-generated like every
  other image here, and is not their photography.

No affiliation with, or endorsement by, Weber-Stephen Products LLC is claimed or
implied. Removing the adaptation is a one-line change: delete the
`coffee-ancho-tri-tip` entry from `cuts` in `app/cook-config.ts`.

### Independently written, with research credits: the walleye

**Butter & lemon-pepper walleye** was written for this app rather than adapted
from anyone. Two published recipes were consulted while writing it and are
credited in the app for that reason, not because anything was taken from them:

- *Fishing Addiction Gear*, "Walleye Recipe – Grilled in Foil" — the nearest
  published method. It **seals** its foil into a packet and seasons it
  differently; this version keeps the boat open over an unlit zone.
- *Lake of the Woods*, "Walleye Delight" — the nearest butter-and-lemon-pepper
  flavour reference.

Nothing was copied from either: not their wording, not their images, and not
their proportions. The credit is a research citation. No affiliation with or
endorsement by either publisher is claimed or implied, and neither link is a
licence to reuse those publishers' photographs or text.

As with the tri-tip, the finish temperature follows current USDA/FDA guidance
(145°F in every fillet) rather than the lower figure in the older texture
research that informed the "why it works" note.

## Food safety information

Temperature guidance in this app is drawn from the USDA FSIS Safe Minimum
Internal Temperature Chart, which is linked from the application and is a work of
the United States federal government. The app is a planning aid: the burner
diagram does not control a real grill, and doneness is determined by measured
internal temperature, not by the app's time estimates.
