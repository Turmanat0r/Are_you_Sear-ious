# Contribution packages

One folder per recipe, holding exactly what was delivered for it. Nothing here
is built or imported by the app — `app/cook-config.ts` is the live data. This
is the paper trail: where each recipe came from, what was claimed about its
image, and what the original page looked like before it was ported.

## Layout

```
<recipe-id>/
  recipe.html            the delivered page code, as supplied
  README.md              the package's own readme
  SOURCES.md             the research and USDA citations it cites
  IMAGE-SOURCES.txt      where the illustration came from
  recipe-notes.md        the author's notes
  generation-prompt.txt  the exact image prompt, preserved verbatim
  image-provenance.json  hashes, dimensions and conversion details
  original.png           the unconverted 1536x1024 original (not tracked)
  scaffold/              the package's own build files, unused here
```

Folder names match the `id` in `app/cook-config.ts`, so a recipe in the app and
its paperwork are always one search apart.

## What is deliberately not tracked

`original.png`, the first twelve originals, the tri-tip's full package copy, and
each scaffold's `dist/` and font binaries. They are large, rebuildable, or
belong in the `are-you-sear-ious-image-originals` archive. See `.gitignore`.

## Reading the provenance

Every delivered image has been independently re-verified before being accepted:
supplied SHA-256 hashes checked against the files, C2PA markers inspected in the
original PNG, and the documented conversion re-run to confirm it reproduces the
shipped WebP. Where a supplied image did not meet the project's 1200x800
requirement it was re-derived here from the verified original, and
`are-you-sear-ious-source/.../image-provenance.json` records which ones and what
the superseded file hashed to.

Six of the last eight supplied images arrived at 1120x747, and a seventh was the
right size but built with a different encoder. Check both before copying.
