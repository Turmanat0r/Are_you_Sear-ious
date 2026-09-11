const { chromium } = require(
  process.env.SEARIOUS_PLAYWRIGHT_PATH || "playwright",
);
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

(async () => {
  const root = path.resolve(__dirname, "..");
  const output = path.resolve(
    process.argv[2] || path.join(root, "verification"),
  );
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const errors = [];
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1080 },
    });
    page.on("pageerror", (error) => errors.push(error.message));
    const url = pathToFileURL(path.join(root, "index.html")).href;
    await page.goto(url);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.evaluate(() => document.fonts.ready);
    await page.locator(".feature-card img").evaluate((img) => img.decode());
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    );
    await page.screenshot({ path: path.join(output, "desktop.png") });
    const expected = JSON.parse(
      await fs.readFile(
        path.join(root, "provenance/reference-metrics.json"),
        "utf8",
      ),
    );
    const actual = await page.evaluate(
      (selectors) =>
        Object.fromEntries(
          selectors.map((selector) => {
            const element = document.querySelector(selector);
            const style = getComputedStyle(element);
            return [
              selector,
              Object.fromEntries(
                [
                  "backgroundColor",
                  "color",
                  "fontFamily",
                  "fontSize",
                  "fontWeight",
                  "borderRadius",
                  "padding",
                  "gap",
                  "gridTemplateColumns",
                ].map((key) => [key, style[key]]),
              ),
            ];
          }),
        ),
      Object.keys(expected),
    );
    assert.deepEqual(
      actual,
      expected,
      "Computed colors, fonts, spacing, radii and columns match the tri-tip reference",
    );
    assert.equal(
      await page
        .locator(".feature-card img")
        .evaluate((img) => img.complete && img.naturalWidth > 0),
      true,
    );

    assert.equal(await page.locator(".ingredients .ingredient").count(), 10);
    assert.match(
      await page.locator(".ingredients").innerText(),
      /6 tbsp unsalted butter/,
    );
    await page.locator('[aria-labelledby="tail-count-label"]').click();
    await page.getByRole("option", { name: "8 tails", exact: true }).click();
    assert.match(
      await page.locator(".ingredients").innerText(),
      /24 tbsp unsalted butter/,
    );
    assert.match(await page.locator(".recipe-meta").innerText(), /12–16 min/);
    assert.match(
      await page.locator(".timing-note").innerText(),
      /First check at 9 minutes/,
    );
    await page.locator(".ingredients [role=checkbox]").first().click();
    await page.locator('[aria-labelledby="weight-unit-label"]').click();
    await page
      .getByRole("option", { name: "Metric · g / kg", exact: true })
      .click();
    assert.match(await page.locator(".scale-status").innerText(), /1.81 kg/);
    assert.match(
      await page.locator(".ingredients").innerText(),
      /336 g unsalted butter/,
    );
    assert.match(
      await page.locator(".ingredients").innerText(),
      /240 ml dry sparkling wine/,
    );
    assert.equal(
      await page
        .locator(".ingredients [role=checkbox]")
        .first()
        .getAttribute("aria-checked"),
      "true",
    );
    await page.locator('[aria-label="Temperature unit"]').click();
    await page.getByRole("option", { name: "°C", exact: true }).click();
    assert.match(await page.locator(".temp-card").innerText(), /163–177/);
    assert.match(await page.locator("#temperatures").innerText(), /63°C/);
    assert.doesNotMatch(await page.locator(".screen-app").innerText(), /°F/);
    await page.locator('[aria-labelledby="cut-label"]').click();
    await page
      .getByRole("option", { name: "Jumbo · 283–340 g", exact: true })
      .click();
    assert.match(await page.locator(".recipe-meta").innerText(), /16–22 min/);
    assert.match(
      await page.locator(".timing-note").innerText(),
      /First check at 12 minutes/,
    );
    assert.match(
      await page.locator('[aria-labelledby="tail-count-label"]').innerText(),
      /8 tails/,
    );
    assert.match(
      await page.locator(".ingredients").innerText(),
      /462 g unsalted butter/,
    );
    await page.getByRole("button", { name: "All off", exact: true }).click();
    await page.locator('[aria-labelledby="burner-label"]').click();
    await page.getByRole("option", { name: "4 burners", exact: true }).click();
    await page.getByRole("switch", { name: /Left burner 1/ }).click();
    await page.getByRole("switch", { name: /Center 2 burner 3/ }).click();
    assert.match(
      await page.locator(".burner-summary").innerText(),
      /2 of 4 ON/,
    );
    await page.locator('[aria-labelledby="layout-label"]').click();
    await page
      .getByRole("option", { name: "Back to front", exact: true })
      .click();
    assert.equal(await page.locator(".burner-zone.on").count(), 2);
    assert.match(
      await page.locator(".print-recipe").textContent(),
      /ON: 1, 3. OFF: 2, 4/,
    );
    await page
      .getByRole("button", { name: "Save recipe", exact: true })
      .click();
    await page.reload();
    assert.equal(await page.locator(".burner-zone.on").count(), 2);
    assert.equal(
      await page
        .locator('[aria-label="Temperature unit"]')
        .innerText()
        .then((text) => text.includes("°C")),
      true,
    );
    await page
      .getByRole("button", { name: "View saved recipes", exact: true })
      .click();
    assert.match(
      await page.getByRole("dialog").innerText(),
      /Champagne–garlic butter-bath lobster tails/,
    );
    await page.getByRole("button", { name: "Close", exact: true }).click();
    await page.getByRole("button", { name: "Cook mode", exact: true }).click();
    assert.match(await page.getByRole("dialog").innerText(), /Step 1 of 4/);
    await page
      .getByRole("button", { name: "Start timer", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Pause timer", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Reset timer", exact: true })
      .click();
    assert.equal(await page.locator(".timer-digits").textContent(), "03:00");
    for (let i = 0; i < 3; i += 1)
      await page
        .getByRole("button", { name: "Complete step", exact: true })
        .click();
    await page
      .getByRole("button", { name: "Finish cook", exact: true })
      .click();
    assert.match(await page.getByRole("dialog").innerText(), /Cook complete/);
    await page.getByRole("button", { name: "Close", exact: true }).click();
    await page.evaluate(() => {
      window.print = () => {
        window.printWasCalled = true;
      };
    });
    await page.getByRole("button", { name: "Print", exact: true }).click();
    assert.equal(await page.evaluate(() => window.printWasCalled), true);
    await page.emulateMedia({ media: "print" });
    assert.equal(await page.locator(".print-recipe").isVisible(), true);
    assert.equal(await page.locator(".print-recipe ol > li").count(), 4);
    assert.match(
      await page.locator(".print-recipe").innerText(),
      /ON: 1, 3. OFF: 2, 4/,
    );
    await page.pdf({
      path: path.join(output, "print.pdf"),
      format: "Letter",
      printBackground: true,
    });
    await page
      .locator(".print-recipe")
      .screenshot({ path: path.join(output, "print-preview.png") });
    await page.emulateMedia({ media: "screen" });
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: path.join(output, "mobile-" + width + ".png"),
      });
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        "No horizontal overflow at " + width,
      );
    }
    assert.deepEqual(errors, []);
    await fs.writeFile(
      path.join(output, "results.json"),
      JSON.stringify(
        {
          status: "passed",
          referenceStylesMatch: true,
          browser: browser.version(),
          errors,
        },
        null,
        2,
      ),
    );
    assert.deepEqual(errors, []);
    console.log("Reference styling and browser interaction checks passed.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
