import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ProjectDemo } from "../../src/components/cabinet/ProjectDialog";
import { projectRecordSchema, type ProjectRecord } from "../../src/types/project";

const base: Omit<ProjectRecord, "demo" | "media"> = {
  repoId: 1,
  slug: "demo-fixture",
  repository: "appleweiping/demo-fixture",
  title: "Demo fixture",
  summary: { en: "A fixture used to verify presentation states.", zh: "用于验证展示状态的测试记录。" },
  sourceKind: "experiment",
  wing: "ai-agents",
  topics: [],
  languages: ["TypeScript"],
  status: "active",
  curationStatus: "curated",
  createdAt: "2026-07-18T00:00:00Z",
  updatedAt: "2026-07-18T00:00:00Z",
};

function render(project: ProjectRecord) {
  return renderToStaticMarkup(<ProjectDemo project={project} locale="en" />);
}

describe("Cabinet demo evidence states", () => {
  it("gates an approved embed behind an explicit load action", () => {
    const html = render({ ...base, media: [], demo: { kind: "embed", url: "https://www.youtube-nocookie.com/embed/example", embedAllowed: true } });
    expect(html).toContain("Load interactive demo");
    expect(html).not.toContain("<iframe");
  });

  it("rejects an embed origin that has not been reviewed", () => {
    const candidate = { ...base, media: [], demo: { kind: "embed", url: "https://example.com/embed", embedAllowed: true } };
    expect(projectRecordSchema.safeParse(candidate).success).toBe(false);
    const html = render(candidate as ProjectRecord);
    expect(html).toContain("demonstration metadata is incomplete");
  });

  it("opens an external deployment without embedding it", () => {
    const html = render({ ...base, media: [], demo: { kind: "external", url: "https://example.com/app", embedAllowed: false } });
    expect(html).toContain("Open demo in a new tab");
    expect(html).toContain("target=\"_blank\"");
  });

  it("renders recorded media as evidence", () => {
    const html = render({ ...base, media: [{ kind: "screenshot", src: "/demo.png", attribution: "Project repository" }], demo: { kind: "media", embedAllowed: false } });
    expect(html).toContain("/demo.png");
    expect(html).toContain("Project repository");
  });

  it("rejects unsafe media source schemes", () => {
    const candidate = { ...base, media: [{ kind: "screenshot", src: "javascript:alert(1)" }], demo: { kind: "media", embedAllowed: false } };
    expect(projectRecordSchema.safeParse(candidate).success).toBe(false);
  });

  it("states plainly when no public demo exists", () => {
    const html = render({ ...base, media: [], demo: { kind: "none", embedAllowed: false } });
    expect(html).toContain("No public demonstration is currently available");
  });
});
