# Are You Sear-ious — image provenance

Prepared for the source handoff on 2026-09-07. This is an unsigned retrospective
audit record, not a replacement for signed Content Credentials.

## Origin

All 23 food images used by this app were generated with an AI image model.
Twelve were made during the original task, the coffee-ancho tri-tip was added
on 2026-09-07, the lemon-pepper walleye plus the prime rib, jerk turkey and
chimichurri shrimp on 2026-09-08, and the two boneless-thigh chicken recipes,
the steakhouse burgers, the butter-bath lobster tails, the garlic-herb
mayonnaise pork chops and the smothered beef ribs on 2026-09-11, all using
OpenAI's built-in `image_gen` tool. They are photorealistic illustrations, not
camera photographs of meals actually prepared. They were not downloaded from a
stock-photo site or a recipe publisher. No stock photographer attribution or
stock-image license was obtained. The exact underlying image-model identifier
was not exposed in the available tool record and is not asserted here.

The preserved generation manifest contains the exact submitted prompts for eight
images: strip steak, sirloin, pork chop, pork tenderloin, chicken breast, chicken
drumsticks, cod and halibut. Those prompts are included unchanged in the JSON audit.
The manifest does not contain the exact prompts for the four earlier images:
ribeye, pork shoulder, chicken thighs and salmon. Those fields are explicitly null;
no reconstructed prompts are presented as originals.

## Why the delivered files lack metadata

All original PNGs are 1536 × 1024. Inspection found no EXIF, XMP or ICC metadata,
but each PNG contains a `caBX` chunk. The C2PA specification identifies `caBX` as
the PNG container for a C2PA Manifest Store. Each inspected payload contains
`c2pa`, `OpenAI` and `trainedAlgorithmicMedia` string markers.

Reference: [C2PA Content Credentials, Appendix A.3.2](https://spec.c2pa.org/specifications/specifications/2.2/specs/ContentCredentials.html).

The existing optimization script resized each PNG to 1200 × 800 and encoded
WebP using Sharp, quality 80 and effort 6. It did not retain metadata. The app's
WebPs therefore contain neither EXIF nor an embedded C2PA manifest. Their lack
of metadata does not mean the original files lacked a provenance container.

The original software/font licensing text did not document these generated
images. That was an omission in the earlier ZIP, corrected by this separate report.

## What was checked

- All 23 original PNGs and all 23 delivered WebPs were hashed with SHA-256.
- Each PNG's chunk structure and provenance-container presence were inspected.
- Each original was re-encoded in memory with the existing conversion settings.
  All 23 results matched the delivered WebP files byte for byte. Seven supplied
  images have now arrived at 1120x747 rather than the required 1200x800 — two
  on 2026-09-08, and the two chicken plus the burger, the lobster and the pork
  chops on 2026-09-11
  — so their delivered WebPs were re-derived here from the verified originals
  using the pipeline above. The beef ribs were re-derived for a different
  reason: that image did arrive at 1200x800, but its package documents a Pillow
  quality-82 conversion, so the supplied file could not be reproduced with the
  pipeline above and would have been the one asset in this manifest whose
  delivered bytes nothing here could regenerate. `image-provenance.json` records which, and what
  each superseded file hashed to.
- The WebPs in the source project and the standalone export match byte for byte.
- The originals in the companion archive are unchanged copies, not newly generated
  or metadata-edited replacements.

`image-provenance.json` records per-image filenames, hashes, sizes, dimensions,
metadata observations, exact available prompts and the Sharp/library versions
used for the reproduction check. Paths are relative, not tied to one computer.

## Limits

The C2PA cryptographic signatures and certificate trust chains were **not
validated**. Finding a container and recognizable markers is not the same as
authenticating its claims. The hash and reproduction checks establish the mapping
between the supplied PNGs and WebPs, not signature validity or ownership.

This report does not assert public-domain status, exclusive copyright, stock
licensing or guaranteed third-party rights clearance. It is an origin and
processing record, not a legal opinion or a new image-license grant.

No original C2PA data has been pasted into the modified WebPs, and no new
credentials have been signed. Keep the unchanged PNGs for provenance review;
continue using the small WebPs to run the existing app.

## Companion archive

`are-you-sear-ious-image-originals.zip` contains this report, the JSON audit and
12 of the 23 PNGs under `originals/`. Every original delivered since then is
kept beside its recipe in `contributions/<recipe-id>/original.png`, untracked by
git but present on disk. Both were re-verified on arrival:
their supplied SHA-256 hashes matched, and re-running the conversion pipeline
reproduced each delivered WebP byte for byte. The editable-source ZIP includes the same report
and audit, with the production WebPs under `public/meals/`. The standalone HTML
ZIP uses the identical WebPs under `images/`, but it predates the tri-tip and so
still carries only 12.
