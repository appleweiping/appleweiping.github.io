import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://appleweiping.github.io",
  output: "static",
  trailingSlash: "always",
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes("/resume/print/"),
      i18n: {
        defaultLocale: "en",
        locales: { en: "en", zh: "zh-Hans" },
      },
    }),
  ],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh"],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  vite: {
    build: {
      target: "es2022",
    },
  },
});
