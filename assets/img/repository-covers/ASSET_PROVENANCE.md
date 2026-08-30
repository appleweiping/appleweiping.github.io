# Repository cover provenance

The Projects and Repositories pages use one local 960×540 WebP for each of the 178 public repositories in the synchronized catalog. The same cover manifest powers all English, Simplified Chinese, and Japanese routes.

Final cover sources, after visual review:

- 22 browser captures of verified public demos or project pages.
- 76 repository-native screenshots, figures, generated experiment results, or banners pinned to an exact commit and Git blob.
- 80 locally downloaded GitHub repository previews for repositories without a safe, representative visual asset, or where the first candidate was rejected during visual/licensing review.
- 0 image-generation outputs. No synthetic project result is presented as real evidence.

Audit and refresh files:

- `SOURCE_AUDIT.json` records the full 167-project default-branch media scan plus source-pinned assets for three newly synchronized exact forks, with candidate selection, commit/blob pins, upstream attribution, and conservative license-risk notes.
- `GITHUB_OG_SOURCES.json` records the live GraphQL-provided repository preview URL for all 178 repositories.
- `CURATION_OVERRIDES.json` records every manual rejection of an illustration-style, third-party, misleading, or illegible first candidate.
- `_data/repository_covers.json` is the publishing manifest. It records each local path, source type and URL, commit/blob where applicable, capture metadata where applicable, license boundary, input SHA-256, output SHA-256, and dimensions.

The site never hotlinks these images at runtime. `bin/validate_repository_covers.py` verifies catalog coverage, source policy, image type, pixel dimensions, animation status, and every committed output hash.
