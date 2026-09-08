# Weiping Yan — Academic Portfolio

Source for [appleweiping.github.io](https://appleweiping.github.io/), a trilingual academic portfolio built with
[al-folio v1](https://github.com/alshedivat/al-folio/releases/tag/v1.0). English is served at `/`, Simplified Chinese at
`/zh/`, and Japanese at `/ja/`.

## Content

- About, publications, 17 project detail pages, repositories, CV, news, and 404 pages are published in all three languages using
  al-folio's native Jekyll content model.
- The full catalog of public repositories is synchronized from the paginated GitHub API before production builds;
  repository names, topics, languages, and URLs remain verbatim while descriptions and classifications are localized.
- The CV is maintained in RenderCV format and published as three HTML pages and three language-specific PDFs.
- Legacy English, Chinese, and Japanese routes are generated as lightweight static redirects after the Jekyll build.

## Development

```bash
npm ci
bundle install
ruby bin/sync_repository_catalog.rb
ruby bin/validate_repository_catalog.rb
npm run lint:prettier
npm run lint:style-contract
npm run test:translations
npm run test:redirects
npm run test:catalog-policy
bundle exec al-folio upgrade audit --no-fail
bundle exec al-folio upgrade overrides audit --fail-on-stale
JEKYLL_ENV=production bundle exec jekyll build
ruby bin/generate_legacy_redirects.rb --destination _site
npm run build:purge-css
ruby bin/validate_production_site.rb --destination _site
```

The GitHub Actions deployment uploads the validated `_site` directory as an official GitHub Pages artifact and deploys
it through the protected `github-pages` environment. GitHub API credentials are used only during the build and are never
written to browser assets.

## Upstream baseline

- Repository: `alshedivat/al-folio`
- Fixed upstream commit: `309112cd689d821b25b0f9dc271e172cd2cf8b1f`
- Imported baseline commit in this repository: `d743bc13add3f148f34a513b7a01a819743d1cf0`
- Upstream archive SHA-256: `BAC3D44A5B33A01F04EE86F278BFAB548A3925F8C830340135574988B5028AC3`

For future upgrades, compare a newer upstream release against the fixed commit above, preserve site-owned content and
configuration, and run both al-folio upgrade audits before accepting changes. Runtime fixes belong in their owning
al-folio plugin repositories; this site intentionally avoids local runtime overrides.

## License and attribution

al-folio is distributed under the MIT License; the upstream license is retained in [LICENSE](LICENSE). Project pages
include asset-specific provenance and attribution where applicable. Personal text, photographs, and project media remain
subject to their stated ownership and source licenses.
