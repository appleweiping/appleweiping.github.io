import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

// pnpm preserves the conventional `--` separator on some platforms and
// removes it on others, so accept both invocation forms deterministically.
const input = process.argv.slice(2).find((argument) => argument !== "--");
const pdf = resolve(input ?? "public/resume.pdf");
if (!existsSync(pdf)) throw new Error(`CV not found: ${pdf}`);

function run(command: string, args: string[]): string {
  const result = spawnSync(command, args, { encoding: "utf8" });
  if (result.status !== 0) throw new Error(`${command} failed: ${result.stderr || result.stdout}`);
  return result.stdout;
}

const info = run("pdfinfo", [pdf]);
if (!/^Pages:\s+2$/m.test(info)) throw new Error("The academic CV must contain exactly two pages.");
if (!/^Page size:\s+[\d.]+ x [\d.]+ pts \(A4\)$/m.test(info)) {
  throw new Error("The academic CV must use A4 page dimensions.");
}

const text = run("pdftotext", [pdf, "-"]);
for (const required of ["Weiping Yan", "AI for Science Undergraduate Researcher", "University of Minnesota", "Independent research project"]) {
  if (!text.includes(required)) throw new Error(`Selectable CV text is missing: ${required}`);
}

const fonts = run("pdffonts", [pdf]);
const fontRows = fonts.split(/\r?\n/).slice(2).filter((line) => line.trim());
const allFontsEmbedded = fontRows.length > 0 && fontRows.every((line) => line.trim().split(/\s+/).at(-5)?.toLowerCase() === "yes");
if (!allFontsEmbedded) {
  throw new Error("Every CV font must be embedded.");
}

const urls = run("pdfinfo", ["-url", pdf]);
for (const required of ["mailto:", "github.com/appleweiping", "linkedin.com"]) {
  if (!urls.toLowerCase().includes(required)) throw new Error(`Expected clickable CV link is missing: ${required}`);
}

console.log(`Validated two-page CV with selectable text, embedded fonts, and live links: ${pdf}`);
