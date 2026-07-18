import { expect, test, type APIRequestContext } from "@playwright/test";
import { readFileSync } from "node:fs";

interface DemoRecord {
  slug: string;
  demo: {
    kind: "embed" | "external" | "media" | "none";
    url?: string;
  };
}

const productionSmoke = process.env.PRODUCTION_SMOKE === "1";
const productionOrigin = new URL(
  process.env.PRODUCTION_BASE_URL ?? "https://appleweiping.github.io",
).origin;
const expectedReleaseSha = process.env.EXPECTED_RELEASE_SHA;
const expectedReleaseRunId = process.env.EXPECTED_RELEASE_RUN_ID;
const snapshot = JSON.parse(
  readFileSync(new URL("../../src/data/projects.snapshot.json", import.meta.url), "utf8"),
) as { projects: DemoRecord[] };
const externalDemos = snapshot.projects.filter(
  (project) => project.demo.kind === "external" && typeof project.demo.url === "string",
);

function productionUrl(path: string): string {
  return new URL(path, `${productionOrigin}/`).toString();
}

async function waitForExpectedRelease(request: APIRequestContext): Promise<void> {
  expect(expectedReleaseSha, "EXPECTED_RELEASE_SHA is required").toMatch(/^[0-9a-f]{40}$/);
  expect(expectedReleaseRunId, "EXPECTED_RELEASE_RUN_ID is required").toMatch(/^\d+$/);

  await expect
    .poll(
      async () => {
        const response = await request.get(
          productionUrl(`/release.json?run=${expectedReleaseRunId}&t=${Date.now()}`),
          { headers: { "cache-control": "no-cache" } },
        );
        if (!response.ok()) return `HTTP ${response.status()}`;
        const release = (await response.json()) as { commit?: string; runId?: string };
        return `${release.commit ?? "missing"}:${release.runId ?? "missing"}`;
      },
      {
        message: "GitHub Pages did not publish the requested release marker",
        timeout: 180_000,
        intervals: [2_000, 5_000, 10_000],
      },
    )
    .toBe(`${expectedReleaseSha}:${expectedReleaseRunId}`);
}

test.describe("deployed production release", () => {
  test.skip(!productionSmoke, "Runs only after an intentional Pages deployment.");
  test.describe.configure({ timeout: 240_000 });

  test.beforeEach(async ({ request }) => {
    await waitForExpectedRelease(request);
  });

  test("the deployed release marker reaches the expected immutable build", async ({ request }) => {
    await waitForExpectedRelease(request);
  });

  const essentialRoutes = [
    "/",
    "/zh/",
    "/cabinet/",
    "/zh/cabinet/",
    "/resume/",
    "/zh/resume/",
    "/works/art-history-museum/",
    "/zh/works/art-history-museum/",
    "/cabinet/?project=art-history-museum",
  ];

  for (const path of essentialRoutes) {
    test(`serves ${path} from the real domain`, async ({ page }) => {
      const response = await page.goto(productionUrl(path), {
        waitUntil: "domcontentloaded",
        timeout: 45_000,
      });
      expect(response, `${path} returned no navigation response`).not.toBeNull();
      expect(response?.status(), `${path} returned an error`).toBeLessThan(400);
      await expect(page.locator("body")).not.toBeEmpty();
    });
  }

  test("serves a valid CV PDF", async ({ request }) => {
    const response = await request.get(productionUrl(`/resume.pdf?t=${Date.now()}`));
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"] ?? "").toContain("application/pdf");
    const body = await response.body();
    expect(body.byteLength).toBeGreaterThan(10_000);
    expect(body.subarray(0, 5).toString("ascii")).toBe("%PDF-");
  });

  test("the curated online-demo inventory remains the expected 18", () => {
    expect(externalDemos).toHaveLength(18);
  });

  for (const project of externalDemos) {
    test(`HTTP and browser smoke: ${project.slug}`, async ({ page, request }) => {
      test.setTimeout(90_000);
      const demoUrl = project.demo.url as string;
      expect(new URL(demoUrl).protocol).toBe("https:");

      const httpResponse = await request.get(demoUrl, {
        failOnStatusCode: false,
        timeout: 30_000,
      });
      expect(httpResponse.status(), `${demoUrl} failed its HTTP smoke test`).toBeGreaterThanOrEqual(200);
      expect(httpResponse.status(), `${demoUrl} failed its HTTP smoke test`).toBeLessThan(400);

      const browserResponse = await page.goto(demoUrl, {
        waitUntil: "domcontentloaded",
        timeout: 45_000,
      });
      expect(browserResponse, `${demoUrl} returned no browser navigation response`).not.toBeNull();
      expect(browserResponse?.status(), `${demoUrl} failed its browser smoke test`).toBeLessThan(400);
      await expect(page.locator("body")).not.toBeEmpty();
    });
  }
});
