import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { projectSnapshotSchema } from "../src/types/project";

const forbiddenPrivateRepositories = new Set([
  "appleweiping/CSATG-OPT",
  "appleweiping/BiSCo",
  "appleweiping/DoneBench",
  "appleweiping/DEVTOOLS",
  "appleweiping/workforce-intelligence-platform",
  "appleweiping/citadel-ad",
].map((name) => name.toLowerCase()));

const raw = await readFile(resolve("src/data/projects.snapshot.json"), "utf8");
const snapshot = projectSnapshotSchema.parse(JSON.parse(raw));
if (snapshot.expectedPublicCount !== snapshot.projects.length) {
  throw new Error(`Expected ${snapshot.expectedPublicCount} projects but received ${snapshot.projects.length}.`);
}
const repoIds = new Set<number>();
const slugs = new Set<string>();
const repositories = new Set<string>();
for (const project of snapshot.projects) {
  if (repoIds.has(project.repoId)) throw new Error(`Duplicate repo id ${project.repoId}.`);
  if (slugs.has(project.slug)) throw new Error(`Duplicate slug ${project.slug}.`);
  if (repositories.has(project.repository.toLowerCase())) throw new Error(`Duplicate repository ${project.repository}.`);
  if (forbiddenPrivateRepositories.has(project.repository.toLowerCase())) throw new Error(`Private repository leaked: ${project.repository}.`);
  repoIds.add(project.repoId);
  slugs.add(project.slug);
  repositories.add(project.repository.toLowerCase());
}
console.log(`Validated ${snapshot.projects.length} public project records; no private repositories detected.`);
