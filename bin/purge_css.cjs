#!/usr/bin/env node

const fs = require("node:fs/promises");
const path = require("node:path");
const { PurgeCSS } = require("purgecss");
const config = require("../purgecss.config.js");

async function main() {
  const repositoryRoot = path.resolve(__dirname, "..");
  const outputDirectory = path.resolve(repositoryRoot, config.output);
  const results = await new PurgeCSS().purge(config);

  let totalBytes = 0;
  for (const result of results) {
    const outputPath = path.resolve(repositoryRoot, result.file);
    if (path.dirname(outputPath) !== outputDirectory) {
      throw new Error(`Refusing to write PurgeCSS output outside ${outputDirectory}: ${outputPath}`);
    }

    await fs.writeFile(outputPath, result.css, "utf8");
    totalBytes += Buffer.byteLength(result.css);
  }

  process.stdout.write(`Purged ${results.length} CSS files (${totalBytes} bytes).${require("node:os").EOL}`);
}

main().catch((error) => {
  process.stderr.write(`PurgeCSS failed: ${error.message}${require("node:os").EOL}`);
  process.exitCode = 1;
});
