import { expect, test } from "@playwright/test";
import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

test("generate the authoritative two-page English CV", async ({ page }) => {
  await page.goto("/resume/print/");
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".cv-page")).toHaveCount(2);
  const pageMetrics = await page.locator(".cv-page").evaluateAll((pages) => pages.map((sheet) => {
    const footer = sheet.querySelector<HTMLElement>(".cv-page-footer");
    const flowChildren = Array.from(sheet.children).filter((child) => child !== footer);
    const contentBottom = Math.max(...flowChildren.map((child) => child.getBoundingClientRect().bottom));
    const footerTop = footer?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
    return {
      clientHeight: sheet.clientHeight,
      scrollHeight: sheet.scrollHeight,
      overlapsFooter: contentBottom > footerTop - 2,
    };
  }));
  for (const metrics of pageMetrics) {
    expect(metrics.scrollHeight, "CV content must not be clipped by the fixed A4 sheet").toBeLessThanOrEqual(metrics.clientHeight + 1);
    expect(metrics.overlapsFooter, "CV content must not overlap the page footer").toBe(false);
  }
  const output = resolve(process.env.CV_OUTPUT ?? "public/resume.pdf");
  await mkdir(dirname(output), { recursive: true });
  await page.pdf({
    path: output,
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    tagged: true,
    outline: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  });
  if (!process.env.CV_OUTPUT) {
    await copyFile(output, resolve("dist/resume.pdf"));
    await copyFile(output, resolve("assets/resume.pdf"));
  }
});
