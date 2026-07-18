import { readdir, readFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import snapshot from "../src/data/projects.snapshot.json" with { type: "json" };

const dist = resolve("dist");
const forbiddenPrivateRepositories = [
  "CSATG-OPT",
  "BiSCo",
  "DoneBench",
  "DEVTOOLS",
  "workforce-intelligence-platform",
  "citadel-ad",
].map((name) => `appleweiping/${name}`.toLowerCase());

async function detailDirectories(path: string): Promise<string[]> {
  return (await readdir(path, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

async function walk(path: string): Promise<string[]> {
  const entries = await readdir(path, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => {
    const child = join(path, entry.name);
    return entry.isDirectory() ? walk(child) : [child];
  }))).flat();
}

const expected = snapshot.projects.length;
const englishDetails = await detailDirectories(join(dist, "works"));
const chineseDetails = await detailDirectories(join(dist, "zh", "works"));
if (englishDetails.length !== expected || chineseDetails.length !== expected) {
  throw new Error(`Expected ${expected}/${expected} project details, built ${englishDetails.length}/${chineseDetails.length}.`);
}
if (englishDetails.join("\n") !== chineseDetails.join("\n")) {
  throw new Error("English and Chinese project detail slugs do not form a complete mirror.");
}

const generatedFiles = await walk(dist);
for (const path of generatedFiles.filter((item) => [".html", ".js", ".json", ".xml", ".txt"].includes(extname(item)))) {
  const source = (await readFile(path, "utf8")).toLowerCase();
  const leaked = forbiddenPrivateRepositories.find((repository) => source.includes(repository));
  if (leaked) throw new Error(`Private repository leaked into generated output: ${leaked} in ${path}.`);
}

const sitemap = (await Promise.all(generatedFiles.filter((path) => /sitemap-\d+\.xml$/.test(path)).map((path) => readFile(path, "utf8")))).join("\n");
if (sitemap.includes("/resume/print/") || !sitemap.includes("hreflang=\"zh-Hans\"") || !sitemap.includes("hreflang=\"en\"")) {
  throw new Error("Sitemap must exclude print routes and include paired English/Chinese hreflang links.");
}

const cabinet = await readFile(join(dist, "cabinet", "index.html"), "utf8");
if (!cabinet.includes("CabinetApp") || !cabinet.includes(`Collection`) || !cabinet.includes(`&quot;projects&quot;`)) {
  throw new Error("Cabinet island did not receive the generated public project collection.");
}

console.log(`Validated generated output: ${expected}/${expected} bilingual project details, sitemap mirrors, and 0 private repositories.`);
