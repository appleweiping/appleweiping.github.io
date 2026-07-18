# Weiping Yan — Portfolio v3

Research-first bilingual portfolio for Weiping Yan, built as a static Astro site and published at [appleweiping.github.io](https://appleweiping.github.io/).

## Architecture

- English is canonical; complete Chinese routes live under `/zh/`.
- Astro renders every content route and all public project records at build time.
- React and Three.js are isolated to the lazy `/cabinet/` island.
- `src/data/projects.snapshot.json` contains the curated public repository record. Build-time GitHub synchronization updates facts without overwriting bilingual summaries.
- `/resume/print/` generates the authoritative two-page selectable-text PDF with Playwright.
- Browsers never receive a GitHub token or call the GitHub API.

## Local development

```bash
pnpm install --frozen-lockfile
pnpm dev
```

The full release gate is:

```bash
pnpm verify
```

Individual checks are available through `lint`, `typecheck`, `test`, `validate:data`, `build`, `validate:dist`, `check:budget`, `cv:build`, `cv:verify`, `test:e2e`, `test:visual`, and `check:lighthouse`.

## GitHub synchronization

`pnpm sync:github` retrieves every public repository with paginated GitHub REST requests, verifies the public count, refreshes stable GitHub facts by `repoId`, removes records only after a complete successful sync, and gives newly public repositories a truthful `metadata-only` New Acquisitions record. Private repositories are explicitly rejected by validation.

## Deployment

GitHub Actions validates the schema, TypeScript, unit tests, production build, performance budgets, two-page CV, accessibility, and Playwright browser suite before uploading an immutable Pages artifact. Failed builds never invoke Pages deployment. See `.github/workflows/` for deployment and artifact rollback procedures.

## Content policy

Confirmed user-provided facts take precedence over the source profile PDF, verified GitHub data, and legacy copy. Coursework, reproductions, experiments, forks, and incomplete repositories remain visibly attributed; the catalogue does not infer publications, awards, performance metrics, affiliations, or fabrication outcomes.
