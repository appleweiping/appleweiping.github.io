module.exports = {
  ci: {
    collect: {
      startServerCommand: "pnpm preview --host 127.0.0.1",
      startServerReadyPattern: "Local",
      startServerReadyTimeout: 30000,
      // A median of three runs filters out transient shared-runner CPU contention
      // without relaxing any of the production thresholds below the agreed 90.
      numberOfRuns: 3,
      url: [
        "http://127.0.0.1:4321/",
        "http://127.0.0.1:4321/research/",
        "http://127.0.0.1:4321/works/",
        "http://127.0.0.1:4321/resume/",
        "http://127.0.0.1:4321/contact/",
        "http://127.0.0.1:4321/zh/",
      ],
      settings: {
        chromeFlags: "--headless --no-sandbox --disable-dev-shm-usage",
        onlyCategories: ["performance", "accessibility", "seo"],
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9, aggregationMethod: "median-run" }],
        "categories:accessibility": ["error", { minScore: 0.9, aggregationMethod: "median-run" }],
        "categories:seo": ["error", { minScore: 0.9, aggregationMethod: "median-run" }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500, aggregationMethod: "median-run" }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1, aggregationMethod: "median-run" }],
      },
    },
    upload: { target: "filesystem", outputDir: "./lighthouse-report" },
  },
};
