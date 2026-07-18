import { describe, expect, it } from "vitest";
import snapshot from "../../src/data/projects.snapshot.json";
import { projectSnapshotSchema } from "../../src/types/project";

describe("project snapshot", () => {
  const parsed = projectSnapshotSchema.parse(snapshot);

  it("contains every expected public repository exactly once", () => {
    expect(parsed.projects).toHaveLength(parsed.expectedPublicCount);
    expect(new Set(parsed.projects.map((project) => project.repoId)).size).toBe(parsed.projects.length);
    expect(new Set(parsed.projects.map((project) => project.slug)).size).toBe(parsed.projects.length);
  });

  it("contains no private repositories", () => {
    const privateNames = ["CSATG-OPT", "BiSCo", "DoneBench", "DEVTOOLS", "workforce-intelligence-platform", "citadel-ad"];
    expect(parsed.projects.filter((project) => privateNames.some((name) => project.repository.toLowerCase() === `appleweiping/${name}`.toLowerCase()))).toEqual([]);
  });

  it("assigns one gallery and one honest demo state to every project", () => {
    for (const project of parsed.projects) {
      expect(project.wing).toBeTruthy();
      expect(["embed", "external", "media", "none"]).toContain(project.demo.kind);
      if (project.demo.kind === "none") expect(project.demo.url).toBeUndefined();
      if (project.demo.url) expect(project.demo.url.startsWith("https://")).toBe(true);
    }
  });
});
