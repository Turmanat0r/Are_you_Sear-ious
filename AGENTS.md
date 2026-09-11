# Recipe-app defaults requested by the user

These preferences apply to future recipe-app work in this workspace unless the
user explicitly changes them. Saved at the user's request on 2026-09-07.

Latest delivery clarification (2026-09-08): the requested TXT file must contain
the COMPLETE HTML PAGE CODE, including CSS and JavaScript, not a prose-only
recipe. Package that code TXT with all supporting images/files in one ZIP.
It must work when renamed to index.html. "Sides" means supporting files,
NOT side-dish recipes. Reuse the existing recipe page; do not redesign it
merely to export its code. Include an identical ready-to-run index.html and
clear GitHub/Vercel instructions when requested as a complete package.

- Brand: **Are You Sear-ious**. Recipes are designed for gas grills.
- Deliver each requested individual recipe as one complete, standalone ZIP.
- Include all editable source, components, styles, package.json and lockfile,
  configuration, recipe text, images, notices, tests and setup instructions.
- Target **GitHub and Vercel**, not Cloudflare. Do not include Cloudflare runtime
  dependencies or publish to another host unless explicitly requested.
- Runtime food images must be optimized **WebP** and specific to the recipe.
- Document image origin. For generated images, preserve the original PNG and
  exact generation prompt separately, plus hashes and conversion details. Never
  invent EXIF, licensing, provenance, or claims of signature validation.
- Use conventional, maintainable, industry-standard code: typed recipe data,
  focused components, established build tools, readable formatting, meaningful
  tests and normal package-manager workflows. Avoid bespoke module loaders,
  runtime code compilation tricks and hidden dependencies.
- Preserve ingredient scaling, Fahrenheit/Celsius and pounds/kilograms, manual
  burner selection, protein-specific temperatures, cooking science, cook mode,
  and printing when creating another recipe app with the same treatment.
- Include grill ambient AND safe internal temperatures. Distinguish safety
  targets from preference/tenderness, and do not scale cooking time by meat weight.
- Research close matches when asked; credit sources and clearly label adaptations.
- Mustard is the preferred binder when a binder is appropriate, but honor a
  specific recipe request such as butter/lemon-pepper fish in a foil boat.
- A complete ZIP is not authorization to upload a GitHub repository or deploy.

This is project-local persistent guidance, not a claim of account-wide memory.
