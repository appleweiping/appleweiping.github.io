module.exports = {
  ci: {
    collect: {
      startServerCommand: "pnpm preview --host 127.0.0.1",
      startServerReadyPattern: "Local",
      startServerReadyTimeout: 30000,
      numberOfRuns: 1,
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
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.9 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
      },
    },
    upload: { target: "filesystem", outputDir: "./lighthouse-report" },
  },
};
