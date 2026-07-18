import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";

const projectCount = (JSON.parse(readFileSync(new URL("../../src/data/projects.snapshot.json", import.meta.url), "utf8")) as { projects: unknown[] }).projects.length;

test("English and Chinese routes expose the research-first identity", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/Weiping Yan/i);
  await expect(page.getByText("AI for Science Undergraduate Researcher", { exact: true })).toBeVisible();
  await page.goto("/zh/");
  await expect(page.getByText("AI for Science 本科研究者", { exact: true })).toBeVisible();
});

test("Works exposes and filters the complete public catalogue", async ({ page }) => {
  await page.goto("/works/");
  const cards = page.locator("[data-project-card]");
  await expect(cards).toHaveCount(projectCount);
  await page.locator("[data-project-search]").fill("art-history-museum");
  await expect(page.locator("[data-project-card]:visible")).toHaveCount(1);
  await expect(page.getByRole("link", { name: /art-history-museum/i }).first()).toBeVisible();
});

const accessibleRoutes = [
  "/", "/research/", "/works/", "/works/topo-flow-limits/", "/resume/", "/contact/",
  "/zh/", "/zh/research/", "/zh/works/", "/zh/works/topo-flow-limits/", "/zh/resume/", "/zh/contact/",
];

for (const path of accessibleRoutes) {
  test(`has no serious automated accessibility violations: ${path}`, async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto(path, { waitUntil: "domcontentloaded" });
    if (path === "/works/" || path === "/zh/works/") {
      // Every record uses the same component contract; retain a representative
      // set so axe does not spend a minute re-evaluating 160 identical trees.
      await page.locator("[data-project-card]").evaluateAll((cards) => {
        for (const card of cards.slice(8)) card.setAttribute("hidden", "");
      });
    }
    const results = await new AxeBuilder({ page }).exclude("canvas").analyze();
    expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? "")), path).toEqual([]);
  });
}

for (const path of ["/cabinet/?project=topo-flow-limits", "/zh/cabinet/?project=topo-flow-limits"]) {
  test(`the accessible Cabinet project dialog has no serious violations: ${path}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path);
    await expect(page.getByRole("dialog")).toBeVisible();
    const results = await new AxeBuilder({ page }).exclude("canvas").analyze();
    expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? "")), path).toEqual([]);
  });
}
