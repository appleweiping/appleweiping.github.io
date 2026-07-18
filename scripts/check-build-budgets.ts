import { createReadStream, existsSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { createGzip, gzipSync } from "node:zlib";

const dist = resolve("dist");

async function gzipSize(path: string): Promise<number> {
  return new Promise((resolveSize, reject) => {
    let bytes = 0;
    createReadStream(path)
      .pipe(createGzip({ level: 9 }))
      .on("data", (chunk: Buffer) => { bytes += chunk.length; })
      .on("end", () => resolveSize(bytes))
      .on("error", reject);
  });
}

const loadableExtensions = new Set([".js", ".css", ".wasm", ".glb", ".gltf", ".ktx2", ".hdr", ".png", ".jpg", ".jpeg", ".webp", ".avif"]);

function resolveReference(parent: string, reference: string): string | undefined {
  const clean = reference.split(/[?#]/, 1)[0];
  if (!clean || /^(?:https?:|data:|mailto:|#)/.test(clean)) return undefined;
  const candidate = normalize(clean.startsWith("/") ? join(dist, clean.slice(1)) : resolve(dirname(parent), clean));
  return candidate.startsWith(dist) && existsSync(candidate) ? candidate : undefined;
}

function referencesFromHtml(path: string, html: string): string[] {
  return Array.from(html.matchAll(/(?:src|href|component-url|renderer-url)="([^"]+)"/g), (match) => match[1]!)
    .map((reference) => resolveReference(path, reference))
    .filter((reference): reference is string => Boolean(reference));
}

function referencesFromAsset(path: string, source: string): string[] {
  const references = [
    ...Array.from(source.matchAll(/(?:from\s*|import\s*\()\s*["'`]([^"'`]+)["'`]/g), (match) => match[1]!),
    ...Array.from(source.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g), (match) => match[1]!),
  ];
  return references
    .map((reference) => resolveReference(path, reference))
    .filter((reference): reference is string => Boolean(reference));
}

async function dependencyGraph(htmlPath: string): Promise<Set<string>> {
  const html = await readFile(htmlPath, "utf8");
  const pending = referencesFromHtml(htmlPath, html);
  const graph = new Set<string>();
  while (pending.length > 0) {
    const path = pending.pop()!;
    if (graph.has(path) || !loadableExtensions.has(extname(path))) continue;
    graph.add(path);
    if ([".js", ".css"].includes(extname(path))) {
      const source = await readFile(path, "utf8");
      pending.push(...referencesFromAsset(path, source));
    }
  }
  return graph;
}

const cabinetPath = join(dist, "cabinet", "index.html");
const cabinetHtml = await readFile(cabinetPath, "utf8");
const entryFiles = [...await dependencyGraph(cabinetPath)];
const inlineScripts = Array.from(cabinetHtml.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g), (match) => match[1]!);
const cabinetEntryBytes = (await stat(cabinetPath)).size
  + (await Promise.all(entryFiles.map(async (path) => (await stat(path)).size))).reduce((a, b) => a + b, 0);
const cabinetEntryGzip = (await Promise.all(entryFiles.filter((path) => extname(path) === ".js").map(gzipSize))).reduce((a, b) => a + b, 0)
  + inlineScripts.reduce((total, source) => total + gzipSync(source, { level: 9 }).length, 0);

if (cabinetEntryBytes > 4 * 1024 * 1024) {
  throw new Error(`Cabinet entry resources exceed 4 MB: ${(cabinetEntryBytes / 1024 / 1024).toFixed(2)} MB.`);
}
if (cabinetEntryGzip > 450 * 1024) {
  throw new Error(`Cabinet entry JavaScript exceeds 450 KB gzip: ${(cabinetEntryGzip / 1024).toFixed(1)} KB.`);
}

for (const page of ["index.html", "research/index.html", "works/index.html", "resume/index.html", "contact/index.html"]) {
  const path = join(dist, page);
  const html = await readFile(path, "utf8");
  if (/<astro-island\b|\bcomponent-url=|\brenderer-url=/.test(html)) {
    throw new Error(`${page} contains a hydrated island; ordinary pages must remain framework-free.`);
  }
  for (const asset of await dependencyGraph(path)) {
    if (extname(asset) === ".js" && /react-dom|three(?:\.module)?|@react-three/i.test(await readFile(asset, "utf8"))) {
      throw new Error(`${page} downloads React or Three.js through ${asset}.`);
    }
  }
}

console.log(`Cabinet entry: ${(cabinetEntryGzip / 1024).toFixed(1)} KB JS gzip, ${(cabinetEntryBytes / 1024 / 1024).toFixed(2)} MB referenced resources.`);
