import type { Locale } from "@/types/content";

export const localeLabels: Record<Locale, string> = { en: "English", zh: "中文" };

export const ui = {
  en: {
    nav: { home: "Home", research: "Research", works: "Works", cabinet: "Cabinet", resume: "Resume", contact: "Contact" },
    enterCabinet: "Enter the Cabinet",
    viewWorks: "Browse all works",
    viewProject: "View record",
    openGithub: "Open GitHub",
    openDemo: "Open demo",
    noDemo: "No public demo is currently available.",
    pending: "Awaiting curation",
  },
  zh: {
    nav: { home: "首页", research: "研究经历", works: "作品", cabinet: "格物馆", resume: "履历", contact: "联系" },
    enterCabinet: "进入格物馆",
    viewWorks: "浏览全部作品",
    viewProject: "查看档案",
    openGithub: "打开 GitHub",
    openDemo: "打开 Demo",
    noDemo: "当前暂无公开 Demo。",
    pending: "待策展",
  },
} as const;

export function localizePath(path: string, locale: Locale): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === "en") return normalized;
  if (normalized === "/") return "/zh/";
  return `/zh${normalized}`.replace(/\/{2,}/g, "/");
}

export function counterpartPath(pathname: string): { en: string; zh: string } {
  const withoutZh = pathname.replace(/^\/zh(?=\/|$)/, "") || "/";
  return { en: withoutZh, zh: localizePath(withoutZh, "zh") };
}
