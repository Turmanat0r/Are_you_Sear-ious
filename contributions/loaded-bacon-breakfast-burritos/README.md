# Loaded bacon breakfast burritos

Supplied by Daniel on 2026-09-12 as a written recipe in a Claude Code session,
with a ChatGPT image dropped into the repo root's `images/` folder.
`recipe.md` is the request exactly as sent. As with the griddle vegetables,
there was no scaffold, sources file or prompt.

## How it was ported

Twenty-sixth cut, family `breakfast-burrito`, and the first in a new
**Breakfast** category. The request named the category, and a burrito filed
behind pork shoulder and chops would be hard to find. It is also the reason
the category grid went from four columns to three.

- **Counted by the burrito**, like the stuffed peppers: 2–12, one each. The
  first shopping-list heading used to be hard-coded to "Your peppers & salt";
  it now uses the counted noun.
- **Salt is 0.5% of the potatoes and eggs**, 0.3 lb a burrito, which is
  4.08 g for six (about ¾ tsp Morton). The bacon and cheese bring their own,
  so none goes on them. The card's split (half on the potatoes, a pinch in the
  eggs) is kept, and the rest goes on with the peppers.
- **A griddle recipe.** `isGriddle()` now covers it and the vegetables, so the
  temperature card says the heat is read on the steel and the dry-brine card
  is hidden.

## What changed from the card, and why

- **The eggs go to 160°F.** The card said to keep them soft and let the toasting
  finish them. USDA's figure for egg dishes is 160°F, and 60–90 seconds a side
  through a rolled tortilla will not carry eggs that far. The steps pull them
  at 160°F, and explain that low heat keeps them tender there. The Cook's Tip
  was rewritten to match. That makes this the second 160°F cut after the
  burger, so the test that pinned the burger as the only one now names both.
- `butter` became `unsalted butter`, as elsewhere.
- Butter amounts in the steps are proportions ("about half the measured
  butter") so they still hold when the batch is scaled.
- Added: patting the potatoes dry, lifting the dome away from you, a
  substitute for the dome, washing hands after cracking eggs, and the
  leftovers note (refrigerate within 2 hours, reheat to 165°F).
- "Category: Blackstone Griddle" is not used. The steps say any gas flat-top,
  so no brand is named and no disclaimer is needed.

## The photo

Generated in ChatGPT and described as a WebP, but supplied as a PNG,
`ChatGPT Image Sep 12, 2026, 05_15_23 PM.png`. It was moved here as
`original.png` (hash checked first) and converted. See `image-provenance.json`.

It is square, with ragged cut-out edges along the top and corners, and its
whole image sits under a mottled alpha vignette. The crop starts 230 px down to
miss the edges, and the image is flattened onto the feature card's background
before encoding. With the alpha left in, the WebP was 375 KB, and lowering the
quality barely moved it; flattened, it is 175 KB at the standard quality 80.

**The prompt was not supplied.**
