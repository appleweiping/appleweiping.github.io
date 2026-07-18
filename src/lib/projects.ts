import snapshotJson from "@/data/projects.snapshot.json";
import { projectSnapshotSchema, type ProjectRecord, type ProjectSnapshot } from "@/types/project";

let parsedSnapshot: ProjectSnapshot | undefined;

export function getProjectSnapshot(): ProjectSnapshot {
  parsedSnapshot ??= projectSnapshotSchema.parse(snapshotJson);
  return parsedSnapshot;
}

export function getProjects(): ProjectRecord[] {
  return getProjectSnapshot().projects;
}

export function getProjectBySlug(slug: string): ProjectRecord | undefined {
  return getProjects().find((project) => project.slug === slug);
}

export function getProjectsByWing(wing: string): ProjectRecord[] {
  return getProjects().filter((project) => project.wing === wing);
}

export function getProjectCover(project: ProjectRecord): string | undefined {
  return project.media.find((item) => item.kind === "image" || item.kind === "screenshot")?.src;
}
