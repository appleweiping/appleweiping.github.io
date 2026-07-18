import { expect, test } from "@playwright/test";
import { wings } from "../../src/data/wings";

test.describe.configure({ mode: "serial", timeout: 300_000 });

function visualOnly(projectName: string) {
  test.skip(process.env.VISUAL_REGRESSION !== "1" || projectName !== "chromium", "Dedicated Windows Chromium visual gate.");
}

test("the eight themed galleries match their approved visual records", async ({ page }, testInfo) => {
  visualOnly(testInfo.project.name);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/cabinet/", { waitUntil: "domcontentloaded" });
  const collection = page.getByTestId("cabinet-fallback");
  await expect(collection).toBeVisible();
  await page.addStyleTag({ content: ".cabinet-fallback__grid{max-height:520px!important;overflow:hidden!important}.cabinet-fallback *{animation:none!important;transition:none!important}" });

  const gallerySelect = page.getByLabel("Filter by gallery");
  for (const wing of wings) {
    await gallerySelect.selectOption(wing.id);
    await expect(page.locator("[data-fallback-project]:visible").first()).toBeVisible();
    await expect(collection).toHaveScreenshot(`gallery-${wing.id}.png`, {
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.08,
    });
  }
});

test("external and no-demo project dialogs match their approved visual records", async ({ page }, testInfo) => {
  visualOnly(testInfo.project.name);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/cabinet/?project=art-history-museum", { waitUntil: "domcontentloaded" });
  await page.addStyleTag({ content: "*{animation:none!important;transition:none!important}" });
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveScreenshot("dialog-external-demo.png", { animations: "disabled", caret: "hide", maxDiffPixelRatio: 0.08, timeout: 20_000 });

  await page.getByRole("button", { name: "Close exhibit" }).click();
  await page.locator("#cabinet-project-search").fill("topo-flow-limits");
  await page.locator(".cabinet-search-results button").filter({ hasText: "topo-flow-limits" }).click();
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveScreenshot("dialog-no-demo.png", { animations: "disabled", caret: "hide", maxDiffPixelRatio: 0.08, timeout: 20_000 });
});
