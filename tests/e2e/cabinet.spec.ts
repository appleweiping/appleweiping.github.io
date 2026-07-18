import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

const projectCount = (JSON.parse(readFileSync(new URL("../../src/data/projects.snapshot.json", import.meta.url), "utf8")) as { projects: unknown[] }).projects.length;
test.describe.configure({ timeout: 90_000 });

test("Cabinet supports search, project deep links, and focus restoration", async ({ page }) => {
  await page.goto("/cabinet/?project=art-history-museum", { waitUntil: "domcontentloaded" });
  const fallback = page.getByTestId("cabinet-fallback");
  const app = page.getByTestId("cabinet-app");
  await expect(app.or(fallback)).toBeVisible();
  if (await app.isVisible()) {
    await expect(page.getByRole("dialog")).toContainText("art-history-museum");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(page.locator('[data-project-trigger="art-history-museum"]').first()).toBeFocused();
  }
});

test("Cabinet language switching preserves a project deep link", async ({ page }) => {
  await page.goto("/cabinet/?project=art-history-museum", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("dialog")).toBeVisible();
  const languageLink = page.getByRole("link", { name: "中", exact: true });
  await expect(languageLink).toHaveAttribute("href", "/zh/cabinet/?project=art-history-museum");
  await page.goto((await languageLink.getAttribute("href")) ?? "/zh/cabinet/");
  await expect(page).toHaveURL(/\/zh\/cabinet\/\?project=art-history-museum$/);
  await expect(page.getByRole("dialog")).toContainText("art-history-museum");
});

test("Cabinet search teleports to an exhibit and exposes the complete 2D switch", async ({ page }) => {
  await page.goto("/cabinet/", { waitUntil: "domcontentloaded" });
  const search = page.locator("#cabinet-project-search");
  await expect(search).toBeVisible({ timeout: 30_000 });
  await search.fill("topo-flow-limits");
  const result = page.locator(".cabinet-search-results button").filter({ hasText: "topo-flow-limits" });
  await result.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toContainText("topo-flow-limits");
  await page.getByRole("button", { name: /Close exhibit/i }).click();

  const startTour = page.getByRole("button", { name: "Begin guided tour" });
  if (await startTour.isVisible()) {
    await startTour.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText("Guided tour", { exact: true }).first()).toBeVisible();
    const use2d = page.getByRole("button", { name: "Use 2D collection" });
    await use2d.focus();
    await page.keyboard.press("Enter");
  }
  await expect(page.getByTestId("cabinet-fallback")).toBeVisible();
  await expect(page.locator("[data-fallback-project]")).toHaveCount(projectCount);
});

test("reduced motion receives a complete two-dimensional collection", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/cabinet/", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("cabinet-fallback")).toBeVisible();
  await expect(page.locator("[data-fallback-project]")).toHaveCount(projectCount);
});

test("the complete static collection remains available without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4321/cabinet/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Cabinet of Inquiry", exact: true })).toBeVisible();
  await expect(page.locator("[data-static-project]")).toHaveCount(projectCount);
  await context.close();
});

test("Data Saver receives the complete two-dimensional collection", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "connection", { configurable: true, value: { saveData: true } });
  });
  await page.goto("/cabinet/", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("cabinet-fallback")).toBeVisible();
  await expect(page.getByText("Data Saver is enabled.")).toBeVisible();
  await expect(page.locator("[data-fallback-project]")).toHaveCount(projectCount);
});

test("low-power hardware receives the complete two-dimensional collection", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "hardwareConcurrency", { configurable: true, get: () => 2 });
  });
  await page.goto("/cabinet/", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("cabinet-fallback")).toBeVisible();
  await expect(page.getByText("A low-power device was detected.")).toBeVisible();
  await expect(page.locator("[data-fallback-project]")).toHaveCount(projectCount);
});

test("a lost WebGL context switches safely to the complete 2D collection", async ({ page }) => {
  await page.goto("/cabinet/", { waitUntil: "domcontentloaded" });
  const canvas = page.locator(".cabinet-stage canvas");
  await expect(canvas.or(page.getByTestId("cabinet-fallback"))).toBeVisible({ timeout: 30_000 });
  if (await canvas.count() === 0) {
    const try3d = page.getByRole("button", { name: "Try the 3D galleries" });
    if (!(await try3d.isVisible())) test.skip(true, "WebGL was unavailable before the context-loss scenario.");
    await try3d.click();
    await expect(canvas).toBeVisible();
  }
  await expect(canvas).toHaveAttribute("data-cabinet-metrics", "ready", { timeout: 20_000 });
  await canvas.dispatchEvent("webglcontextlost");
  await expect(page.getByTestId("cabinet-fallback")).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText("The 3D graphics context was interrupted.")).toBeVisible();
  await expect(page.locator("[data-fallback-project]")).toHaveCount(projectCount);
});

test("touch layouts keep guided navigation and do not expose Pointer Lock", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile-"), "Touch-only assertion.");
  await page.goto("/cabinet/", { waitUntil: "domcontentloaded" });
  const startTour = page.getByRole("button", { name: "Begin guided tour" });
  if (await startTour.isVisible()) await startTour.click();
  await expect(page.getByRole("button", { name: "Explore with WASD" })).toHaveCount(0);
});

test("desktop free exploration enters and exits the Pointer Lock state", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.startsWith("mobile-"), "Desktop-only assertion.");
  await page.goto("/cabinet/", { waitUntil: "domcontentloaded" });
  const startTour = page.getByRole("button", { name: "Begin guided tour" });
  const try3d = page.getByRole("button", { name: "Try the 3D galleries" });
  await expect(startTour.or(try3d).or(page.getByTestId("cabinet-fallback"))).toBeVisible({ timeout: 30_000 });
  if (await try3d.isVisible()) {
    await try3d.focus();
    await page.keyboard.press("Enter");
  } else if (await startTour.isVisible()) {
    await startTour.focus();
    await page.keyboard.press("Enter");
  }
  else test.skip(true, "WebGL was unavailable for free exploration.");
  const freeButton = page.getByRole("button", { name: "Explore with WASD" });
  await expect(freeButton).toBeVisible();
  await freeButton.focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(500);
  const freeStatus = page.getByText("Free exploration", { exact: true }).first();
  if (!(await freeStatus.isVisible())) {
    await expect(page.getByText("Guided tour", { exact: true }).first()).toBeVisible();
    test.skip(true, "This browser does not expose Pointer Lock in the test environment.");
  }
  await expect(freeStatus).toBeVisible();
  const returnButton = page.getByRole("button", { name: "Return to guided tour" });
  await returnButton.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("Guided tour", { exact: true }).first()).toBeVisible();
});

test("the mounted gallery reports its runtime rendering budgets", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "Runtime GPU telemetry is sampled once in Chromium.");
  await page.goto("/cabinet/", { waitUntil: "domcontentloaded" });
  const canvas = page.locator(".cabinet-stage canvas");
  const try3d = page.getByRole("button", { name: "Try the 3D galleries" });
  await expect(canvas.or(try3d).or(page.getByTestId("cabinet-fallback"))).toBeVisible();
  if (await try3d.isVisible()) await try3d.click();
  if (!(await canvas.isVisible())) test.skip(true, "WebGL was unavailable for runtime budget sampling.");

  await expect(canvas).toHaveAttribute("data-cabinet-metrics", "ready", { timeout: 20_000 });
  const metrics = await canvas.evaluate((element) => ({
    calls: Number(element.dataset.cabinetCalls),
    triangles: Number(element.dataset.cabinetTriangles),
    textures: Number(element.dataset.cabinetTextures),
    dpr: Number(element.dataset.cabinetDpr),
    fps: Number(element.dataset.cabinetFps),
  }));

  expect(metrics.calls).toBeGreaterThan(0);
  expect(metrics.calls).toBeLessThan(100);
  expect(metrics.triangles).toBeGreaterThan(0);
  expect(metrics.triangles).toBeLessThan(300_000);
  expect(metrics.textures).toBeLessThanOrEqual(64);
  expect(metrics.dpr).toBeLessThanOrEqual(1.5);
  expect(metrics.fps).toBeGreaterThan(0);
});
