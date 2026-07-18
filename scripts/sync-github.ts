import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { projectSnapshotSchema, type ProjectRecord } from "../src/types/project";

const owner = "appleweiping";
const token = process.env.GITHUB_TOKEN;
const headers: HeadersInit = {
  Accept: "application/vnd.github+json",
  "User-Agent": "appleweiping-portfolio-sync",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

async function github<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(20_000) });
  if (!response.ok) throw new Error(`GitHub ${response.status} for ${url}`);
  return response.json() as Promise<T>;
}

interface GitHubProfile { public_repos: number }
interface GitHubRepo {
  id: number; name: string; full_name: string; private: boolean; fork: boolean; archived: boolean;
  description: string | null; language: string | null; topics?: string[]; homepage: string | null;
  html_url: string; languages_url: string; created_at: string; updated_at: string;
}

const profile = await github<GitHubProfile>(`https://api.github.com/users/${owner}`);
const repos: GitHubRepo[] = [];
for (let page = 1; ; page += 1) {
  const batch = await github<GitHubRepo[]>(`https://api.github.com/users/${owner}/repos?type=owner&sort=full_name&direction=asc&per_page=100&page=${page}`);
  repos.push(...batch.filter((repo) => !repo.private));
  if (batch.length < 100) break;
}
if (repos.length !== profile.public_repos) throw new Error(`Public repository count mismatch: profile=${profile.public_repos}, fetched=${repos.length}`);

const path = resolve("src/data/projects.snapshot.json");
const current = projectSnapshotSchema.parse(JSON.parse(await readFile(path, "utf8")));
const existingById = new Map(current.projects.map((project) => [project.repoId, project]));
const existingByRepository = new Map(current.projects.map((project) => [project.repository.toLowerCase(), project]));
const slugSet = new Set(current.projects.map((project) => project.slug));

const languagesByRepoId = new Map<number, string[]>();
for (let index = 0; index < repos.length; index += 12) {
  const batch = repos.slice(index, index + 12);
  const languages = await Promise.all(batch.map(async (repo) => {
    const usage = await github<Record<string, number>>(repo.languages_url);
    return [repo.id, Object.entries(usage).sort((left, right) => right[1] - left[1]).map(([language]) => language)] as const;
  }));
  for (const [repoId, names] of languages) languagesByRepoId.set(repoId, names);
}

function slugify(name: string, id: number): string {
  let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `repository-${id}`;
  if (slugSet.has(slug)) slug = `${slug}-${id}`;
  slugSet.add(slug);
  return slug;
}

const projects: ProjectRecord[] = repos.map((repo) => {
  const curated = existingById.get(repo.id) ?? existingByRepository.get(repo.full_name.toLowerCase());
  const languages = languagesByRepoId.get(repo.id) ?? [];
  if (curated) {
    return {
      ...curated,
      repoId: repo.id,
      repository: repo.full_name,
      title: curated.title || repo.name,
      topics: repo.topics ?? curated.topics,
      languages,
      status: repo.archived ? "archived" : "active",
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
    };
  }
  const summary = repo.description?.trim() || "New public repository awaiting a full curatorial review.";
  return {
    repoId: repo.id,
    slug: slugify(repo.name, repo.id),
    repository: repo.full_name,
    title: repo.name,
    summary: { en: summary, zh: summary },
    // Metadata alone cannot establish authorship or whether a repository is
    // coursework/reproduction. Keep new records neutral until reviewed.
    sourceKind: repo.fork ? "fork" : "meta",
    wing: "new-acquisitions",
    topics: repo.topics ?? [],
    languages,
    status: repo.archived ? "archived" : "active",
    media: [],
    demo: { kind: "none", embedAllowed: false },
    curationStatus: "metadata-only",
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
  };
});

const next = projectSnapshotSchema.parse({ owner, expectedPublicCount: profile.public_repos, syncedAt: new Date().toISOString(), projects });
await writeFile(path, `${JSON.stringify(next, null, 2)}\n`, "utf8");
console.log(`Synced ${next.projects.length} public repositories.`);
