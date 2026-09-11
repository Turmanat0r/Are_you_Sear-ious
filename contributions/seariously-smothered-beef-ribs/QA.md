# Verification scope

This repair uses strict TypeScript checking, ESLint, Vitest model/server-render tests, a production build, inline JavaScript syntax checks, and package/asset verification. A clean extracted source install/build is checked before delivery.

Coverage includes all 20 ingredient amounts in both unit systems; thickness-based (not weight-multiplied) timing; safety versus tenderness; weight boundaries; malformed storage; all 124 burner ON/OFF combinations across 2–6 burners; scaled print output and its burner plan; full-page rendering; controlled cook-session output; and deadline arithmetic.

Artifact checks compare the generated HTML and full-code TXT byte-for-byte, verify the original PNG, exact supplied prompt and both WebP hashes, and compare all four retained CSS files and both fonts against the supplied historical manifest.

The supplied archive's old QA.md claimed browser interaction and screenshot checks. Those claims are not repeated as current work. No fresh visual/interactive browser testing, cross-browser validation, Vercel deployment or physical cooking test is claimed for this repair.
