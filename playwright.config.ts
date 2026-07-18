import { defineConfig, devices } from "@playwright/test";

const localChromiumChannel = process.env.PLAYWRIGHT_CHANNEL as "chrome" | "msedge" | undefined;
const chromiumChannel = localChromiumChannel ? { channel: localChromiumChannel } : {};
const chromiumWebGl = {
  launchOptions: {
    args: ["--enable-webgl", "--ignore-gpu-blocklist", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
  },
};

export default defineConfig({
  testDir: "./tests",
  testIgnore: ["**/unit/**"],
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  // The Cabinet intentionally allocates a WebGL context; bounding parallelism
  // prevents local and CI GPU-process exhaustion from masquerading as app bugs.
  workers: 2,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["junit", { outputFile: "test-results/playwright.xml" }],
  ],
  use: {
    baseURL: process.env.BASE_URL ?? "http://127.0.0.1:4321",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: process.env.CI ? "retain-on-failure" : "off",
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"], ...chromiumChannel, ...chromiumWebGl } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "mobile-chrome", use: { ...devices["Pixel 7"], ...chromiumChannel, ...chromiumWebGl } },
    { name: "mobile-safari", use: { ...devices["iPhone 15 Pro"] } },
  ],
  webServer: {
    command: "pnpm preview --host 127.0.0.1 --port 4321",
    url: "http://127.0.0.1:4321",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
