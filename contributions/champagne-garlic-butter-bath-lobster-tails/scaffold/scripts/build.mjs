import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { build } from "esbuild-wasm";
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";

const root = fileURLToPath(new URL("../", import.meta.url));
const src = path.join(root, "src");
const dist = path.join(root, "dist");
await fs.mkdir(dist, { recursive: true });

// Standard esbuild resolution uses the package lock and tsconfig path alias.
const bundle = await build({
  absWorkingDir: root,
  entryPoints: [path.join(src, "main.tsx")],
  bundle: true,
  write: false,
  format: "iife",
  platform: "browser",
  target: "es2022",
  minify: true,
  metafile: true,
  legalComments: "inline",
  define: { "process.env.NODE_ENV": '"production"' },
  tsconfig: path.join(root, "tsconfig.json"),
});
assert.equal(bundle.outputFiles.length, 1);
assert(
  Object.values(bundle.metafile.outputs).every(
    (output) => output.imports.length === 0,
  ),
);
const javascript = bundle.outputFiles[0].text;
new vm.Script(javascript);

// Keep the reference CSS as the source of truth; compile its Tailwind utilities.
const cssInput = "@import './globals.css';\n@import './experience.css';";
const processed = await postcss([
  tailwindcss({ base: src, optimize: true }),
]).process(cssInput, { from: path.join(src, "build-entry.css"), map: false });
let fonts = await fs.readFile(path.join(src, "fonts.css"), "utf8");
for (const match of [...fonts.matchAll(/url\('([^']+)'\)/g)]) {
  const bytes = await fs.readFile(path.resolve(src, match[1]));
  fonts = fonts.replace(
    match[0],
    "url(data:font/woff2;base64," + bytes.toString("base64") + ")",
  );
}
const css = processed.css + "\n" + fonts;
assert(!/@import|url\(\s*['"]?https?:/i.test(css));
assert(css.includes("@media print") && css.includes(".feature-card"));
const favicon = await fs.readFile(path.join(root, "assets/favicon.svg"));
const html = [
  "<!doctype html>",
  '<html lang="en" class="dark"><head><meta charset="utf-8">',
  '<meta name="viewport" content="width=device-width,initial-scale=1">',
  '<meta name="color-scheme" content="dark light">',
  "<title>Champagne–Garlic Butter-Bath Lobster Tails | Are You Sear-ious</title>",
  '<meta name="description" content="Champagne–garlic butter-bath lobster tails for a gas grill. Scale ingredients, select your burners, follow cooking science, and print.">',
  '<link rel="icon" href="data:image/svg+xml;base64,' +
    favicon.toString("base64") +
    '">',
  "<style>" + css.replaceAll("</style", "<\\/style") + "</style>",
  '</head><body><div id="root"></div>',
  "<noscript>Enable JavaScript to use this recipe. RECIPE.md contains the complete base recipe.</noscript>",
  "<script>" +
    javascript.replaceAll("</script", "<\\/script") +
    "</script></body></html>",
].join("\n");
assert(!/<script[^>]+src=|type=["']module|<link[^>]+stylesheet/i.test(html));
for (const name of ["index.html", "lobster-page-code.txt", "dist/index.html"]) {
  await fs.writeFile(path.join(root, name), html);
}
await fs.cp(path.join(root, "images"), path.join(dist, "images"), {
  recursive: true,
});

// Include the actual bundled dependency and font notices with both deliverables.
const dependencyRoots = new Set();
for (const input of Object.keys(bundle.metafile.inputs)) {
  const absolute = path.resolve(root, input);
  const normalized = absolute.replaceAll("\\", "/");
  const match = normalized.match(/^(.*\/node_modules\/(?:@[^/]+\/)?[^/]+)/);
  if (match) dependencyRoots.add(match[1]);
}
for (const name of ["tailwindcss", "tw-animate-css"])
  dependencyRoots.add(path.join(root, "node_modules", name));
const notices = [
  "THIRD-PARTY SOFTWARE AND FONT NOTICES\nImage origin is documented separately in provenance/.",
];
for (const directory of [...dependencyRoots].sort()) {
  const metadata = JSON.parse(
    await fs.readFile(path.join(directory, "package.json"), "utf8"),
  );
  const licenseFiles = (await fs.readdir(directory)).filter((name) =>
    /^licen[cs]e(?:\.[^/]+)?$/i.test(name),
  );
  assert(licenseFiles.length > 0, "Missing license for " + metadata.name);
  const licenseTexts = await Promise.all(
    licenseFiles.map((name) => fs.readFile(path.join(directory, name), "utf8")),
  );
  notices.push(
    metadata.name + " " + metadata.version + "\n" + licenseTexts.join("\n"),
  );
}
for (const name of ["shadcn-MIT.txt", "geist-OFL.txt"]) {
  notices.push(await fs.readFile(path.join(root, "licenses", name), "utf8"));
}
const noticeText = notices.join("\n\n------------------------------\n\n");
await fs.writeFile(path.join(root, "THIRD-PARTY-LICENSES.txt"), noticeText);
await fs.writeFile(path.join(dist, "THIRD-PARTY-LICENSES.txt"), noticeText);
console.log(
  "Built matching dark-layout HTML and complete code TXT. Fonts, styles, and JavaScript are embedded; runtime images are local WebP.",
);
