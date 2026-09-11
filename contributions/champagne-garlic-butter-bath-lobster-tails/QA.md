# Corrected lobster package verification

Checked 2026-09-09.

- All four reference CSS files and both Geist font files match the original dark layout byte for byte.
- Type checking and production build passed.
- All nine package/model tests passed: original amounts and controls, all 18 size/count combinations in both unit systems, timing independence from count, temperature conversion, invalid counts, 124 burner combinations, image hashes, identical full-code TXT/HTML outputs, and Vercel static configuration.
- Chrome interaction checks passed for scaling, metric units, complete Fahrenheit/Celsius switching, tail-size changes without losing count, ingredient checkboxes across unit changes, saved preferences, burner selection/orientation, cook mode's four steps and timer, completion, and printing.
- Browser-computed colors, typography, sizes, spacing, radii, and columns match the tri-tip reference at 1440 px for the main reference components.
- No JavaScript errors or horizontal overflow at 390/320 px were detected.
- Print view contains the selected batch, current burner plan, complete ingredients, four steps, and science.
- Desktop, 390/320 px mobile screens, and the complete print view were visually checked. The preserved WebP was decoded before capturing the final desktop image.

These checks verify software and layout, not kitchen performance or a live deployment.
