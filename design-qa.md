# Projects grid design QA

## Comparison target

- Source visual truth: `D:\Temp\codex-clipboard-8b1001f8-8e52-47fa-86b9-4e96b10f5333.png`
- Desktop implementation capture: `D:\Temp\projects-grid-desktop-v3.png`
- Mobile implementation capture: `D:\Temp\projects-grid-mobile-v4.png`
- Side-by-side comparison: `D:\Temp\projects-grid-comparison-v3.png`
- State: dark theme, complete project index scrolled to **Graphics, Games & Creative Computing**.
- Source pixels: 1401 × 716 PNG.
- Desktop capture: 1386 × 890 JPEG from a 1401 × 900 browser viewport at device scale 1; normalized to a 1401 × 716 crop for the comparison board.
- Mobile capture: 375 × 811 JPEG from a 390 × 844 browser viewport at device scale 1.

## Full-view comparison evidence

The comparison board shows the reference on the left and the implementation on the right. Both use a dark page, a right-aligned category heading with a divider, three equal-width desktop columns, image-first cards, subdued shadows, large lightweight titles, and short descriptions. The implementation intentionally retains the site's persistent navigation, 930px content width, exact GitHub repository names, and a compact provenance/language line.

The original visual checkpoint rendered 166 cards in eight `row-cols-1 row-cols-md-3` category grids. At the final desktop checkpoint the first creative row measured three 350px cards at x=138, 518, and 898 with equal 408px height and equal 197px media frames. The full page height fell from the pre-fix 64,882px single-column rendering to 21,304px. At 390px the cards formed one 345px column with no horizontal overflow. The 2026-08-30 GitHub synchronization added one formal project without changing the card template or grid CSS, bringing the current catalog to 167 project cards.

Focused-region comparison was not needed: the source and implementation cards are legible at full-view scale, and the separate mobile capture covers the responsive state.

## Findings

- No actionable P0, P1, or P2 visual differences remain.
- The former Featured section is absent. The complete categorized grid is now the only Projects collection on the page.
- All 167 formal projects, all 178 public repositories in the full catalog, and all six pinned repository cards render a locally hosted 960×540 WebP cover.
- Cover provenance is complete: 22 real demo screenshots, 76 commit/blob-pinned repository assets, and 80 locally cached GitHub repository previews. No generated or runtime-hotlinked image is published.
- The original 11 cover contact sheets and all four 2026-08-30 additions were visually reviewed. Illustration-style banners, logos, badges, icons, sprites, course merchandise, test plates, unrelated photos, blank frames, and the known GPT-image banner were rejected or replaced with an attributable repository preview.

## Comparison history

1. Earlier P1: the complete catalog used unavailable `row-cols-lg-2` / `col-lg-6` classes and rendered as a 64,882px single column of verbose metadata cards.
2. Fix: the catalog-only project mode now reuses the Featured structure (`projects`, category headings, `row-cols-md-3`, `card h-100 hoverable`) and a compact title/description card include.
3. Intermediate P1: the new grid remained about 890px wide while the reference was about 1125px, and the three verified creative covers had mismatched media heights. Fix: center the project grid at a responsive 1110px content width and place verified covers in equal 16:9 `object-fit: contain` frames.
4. Intermediate P2: the fixed footer covered mobile card content and the first width correction created a narrow horizontal scrollbar. Fix: return the mobile footer to normal document flow and reset the widened grid to its parent width below 768px.
5. Post-fix evidence: 166 cards, eight responsive category grids, 350px desktop cards, equal 197px media frames, one 345px mobile column, a static mobile footer, zero duplicate IDs, zero horizontal overflow, and no browser console warnings or errors.

## Interaction and accessibility checks

- All eight category links move to their prefixed category anchors.
- All 167 current cards are whole-card GitHub links with `target="_blank"` and `rel="noopener noreferrer"`.
- Covers lazy-load, reserve intrinsic dimensions, use a consistent 16:9 frame, and have localized, meaningful alt text.
- English, Chinese, and Japanese output contains the same 167 current card IDs and eight category grids.
- The full repository catalog contains 178 covered cards in all three languages. The pinned view contains exactly six covered cards, with `appleweiping.github.io` as the current sixth GitHub pin.

## Source and build evidence

- Publishing manifest: `_data/repository_covers.json`
- Source audit: `assets/img/repository-covers/SOURCE_AUDIT.json`
- GitHub preview pins: `assets/img/repository-covers/GITHUB_OG_SOURCES.json`
- Manual curation overrides: `assets/img/repository-covers/CURATION_OVERRIDES.json`
- Human-readable provenance: `assets/img/repository-covers/ASSET_PROVENANCE.md`
- Original local structural build: successful with a temporary Windows-only ImageMagick disable override; the three Projects pages rendered in 1.07–2.01 seconds each, all six complete Projects/Catalog index pages completed without a single-page stall, and the cover/catalog validators passed at 174/174. The 2026-08-30 incremental synchronization passed catalog, translation, policy, and cover validation at 178/178 before deployment. The Ubuntu deployment workflow remains the authority for the production responsive-image (`srcset`) check because the Windows system `convert.exe` is not ImageMagick.

final result: passed
