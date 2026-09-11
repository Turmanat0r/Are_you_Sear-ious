const assert = require("node:assert/strict");
const { createHash } = require("node:crypto");
const fs = require("node:fs/promises");
const path = require("node:path");
const vm = require("node:vm");
const { test, before } = require("node:test");
const { build } = require("esbuild-wasm");
const root = path.resolve(__dirname, "..");
const read = (name) => fs.readFile(path.join(root, name));
let config, lobster, recipes;
async function compileModel(filename) {
  const result = await build({
    absWorkingDir: root,
    entryPoints: [path.join(root, "src", filename)],
    bundle: true,
    write: false,
    platform: "node",
    format: "cjs",
  });
  const module = { exports: {} };
  vm.runInNewContext(result.outputFiles[0].text, {
    module,
    exports: module.exports,
    require,
  });
  return module.exports;
}
before(async () => {
  config = await compileModel("cook-config.ts");
  lobster = await compileModel("lobster.ts");
  recipes = await compileModel("recipes.ts");
});
test("four CSS sources and two fonts match the original dark reference", async () => {
  const reference = JSON.parse(await read("provenance/layout-reference.json"));
  assert.equal(reference.files.length, 6);
  for (const file of reference.files)
    assert.equal(
      createHash("sha256")
        .update(await read(file.path))
        .digest("hex"),
      file.sha256,
      file.path,
    );
});
test("full code TXT, runnable HTML, and deployment HTML are byte-identical", async () => {
  const html = await read("index.html");
  assert.deepEqual(html, await read("lobster-page-code.txt"));
  assert.deepEqual(html, await read("dist/index.html"));
  assert.match(html.toString(), /class="dark"/);
  assert.doesNotMatch(
    html.toString(),
    /<script[^>]+src=|<link[^>]+rel=["']stylesheet/,
  );
  assert.match(html.toString(), /data:font\/woff2;base64/);
});
test("all original base amounts and size/count options are preserved", () => {
  assert.equal(lobster.tailCounts.join(","), "1,2,3,4,6,8");
  assert.equal(
    lobster.bathIngredients.map((item) => item.amount).join(","),
    "6,0.25,2,1,1,1,0.25,0.5,1",
  );
  assert.equal(config.cuts.map((cut) => cut.tailOz).join(","), "5,8,11");
  const base = config.buildRecipe("lobster-medium", 2);
  assert.equal(base.ingredients.flatMap((group) => group.items).length, 10);
  assert(base.ingredients[1].items.includes("6 tbsp unsalted butter"));
  assert(base.ingredients[1].items.includes("¼ cup dry sparkling wine"));
  assert.equal(base.scale, 1);
});
test("all 18 size/count combinations scale every bath ingredient in both unit systems", () => {
  for (const cut of config.cuts)
    for (const count of lobster.tailCounts) {
      for (const unit of ["lb", "kg"]) {
        const recipe = config.buildRecipe(cut.id, count, unit);
        const scale = (count * cut.tailOz) / 16;
        assert.equal(recipe.scale, scale);
        assert.equal(recipe.tailCount, count);
        assert.match(
          recipe.ingredients[0].items[0],
          new RegExp("^" + count + " lobster"),
        );
        for (const item of lobster.bathIngredients)
          assert.equal(
            lobster.scaledIngredient(item, scale, unit).amount,
            (unit === "kg" ? item.metricAmount : item.amount) * scale,
          );
        assert.equal(recipe.time, cut.time);
        assert.match(
          recipe.timingNote,
          new RegExp("First check at " + cut.firstCheck + " minutes"),
        );
        assert.equal(recipe.grill.join(","), "325,350");
        assert.equal(recipe.internal.join(","), "145");
        assert.equal(recipe.steps.length, 4);
      }
    }
  const large = config.buildRecipe("lobster-medium", 8, "kg");
  assert(large.ingredients[1].items.includes("336 g unsalted butter"));
  assert(large.ingredients[1].items.includes("240 ml dry sparkling wine"));
  assert.equal(large.sizeLabel, "about 1.81 kg total");
});
test("invalid tail counts and unknown sizes are rejected", () => {
  for (const value of [0, -1, 1.5, 5, 9, NaN, Infinity]) {
    assert.equal(config.validateCount(value), false);
    assert.throws(() => config.buildRecipe("lobster-medium", value));
  }
  assert.throws(() => config.buildRecipe("unknown", 2));
});
test("Celsius converts every method, science, ambient, and internal temperature", () => {
  assert.equal(recipes.temp([325, 350], "C"), "163–177°C");
  assert.equal(recipes.temp([145], "C"), "63°C");
  const recipe = config.buildRecipe("lobster-medium", 2);
  for (const step of recipe.steps)
    assert.doesNotMatch(recipes.unitText(step.cue + step.body, "C"), /°F/);
  for (const note of [
    lobster.shellScience,
    lobster.butterScience,
    config.zoneScience,
    ...recipe.extraScience.map((item) => item.note),
  ])
    assert.doesNotMatch(recipes.unitText(note.body + note.takeaway, "C"), /°F/);
});
test("124 manual burner combinations flag missing heat or missing indirect space", () => {
  for (let count = 2; count <= 6; count++)
    for (let mask = 0; mask < 2 ** count; mask++) {
      const states = Array.from({ length: count }, (_, i) =>
        Boolean(mask & (1 << i)),
      );
      const lit = states.filter(Boolean).length;
      const message = config.burnerMessage(states, "indirect");
      assert.match(
        message,
        !lit
          ? /No burners/
          : lit === count
            ? /Every burner is ON/
            : /OFF zones/,
      );
    }
  assert.match(
    config.burnerMessage([true, false], "direct"),
    /needs an unlit zone/,
  );
  assert.match(
    config.grillPlanSummary({
      count: 4,
      states: [true, false, true, false],
      orientation: "vertical",
      method: "indirect",
    }),
    /back to front. ON: 1, 3. OFF: 2, 4/,
  );
});
test("original PNG and WebP are unchanged from attached provenance", async () => {
  const provenance = JSON.parse(await read("provenance/image-provenance.json"));
  for (const file of [provenance.original, provenance.webAsset]) {
    const bytes = await fs.readFile(
      path.resolve(root, "provenance", file.path),
    );
    assert.equal(createHash("sha256").update(bytes).digest("hex"), file.sha256);
  }
  const webp = await read(
    "images/champagne-garlic-butter-bath-lobster-tails.webp",
  );
  assert.equal(webp.subarray(0, 4).toString(), "RIFF");
  assert.equal(webp.subarray(8, 12).toString(), "WEBP");
  assert(webp.length < 250000);
});
test("Vercel targets static dist with conventional build tooling", async () => {
  const vercel = JSON.parse(await read("vercel.json"));
  assert.equal(vercel.outputDirectory, "dist");
  assert.equal(vercel.framework, null);
  assert.doesNotMatch(
    (await read("scripts/build.mjs")).toString(),
    /onResolve|onLoad|plugins:/,
  );
});
