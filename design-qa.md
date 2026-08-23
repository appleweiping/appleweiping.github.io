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

The complete index renders 166 cards in eight `row-cols-1 row-cols-md-3` category grids. At the final desktop checkpoint the first creative row measured three 350px cards at x=138, 518, and 898 with equal 408px height and equal 197px media frames. The full page height fell from the pre-fix 64,882px single-column rendering to 21,304px. At 390px the cards form one 345px column with no horizontal overflow.

Focused-region comparison was not needed: the source and implementation cards are legible at full-view scale, and the separate mobile capture covers the responsive state.

## Findings

- No actionable P0, P1, or P2 visual differences remain.
- P3 follow-up: 12 projects currently have verified, locally hosted cover art. The other projects use the same card component without a fabricated image. Add project-specific covers only when their source, license, crop, and attribution have been audited.

## Comparison history

1. Earlier P1: the complete catalog used unavailable `row-cols-lg-2` / `col-lg-6` classes and rendered as a 64,882px single column of verbose metadata cards.
2. Fix: the catalog-only project mode now reuses the Featured structure (`projects`, category headings, `row-cols-md-3`, `card h-100 hoverable`) and a compact title/description card include.
3. Intermediate P1: the new grid remained about 890px wide while the reference was about 1125px, and the three verified creative covers had mismatched media heights. Fix: center the project grid at a responsive 1110px content width and place verified covers in equal 16:9 `object-fit: contain` frames.
4. Intermediate P2: the fixed footer covered mobile card content and the first width correction created a narrow horizontal scrollbar. Fix: return the mobile footer to normal document flow and reset the widened grid to its parent width below 768px.
5. Post-fix evidence: 166 cards, eight responsive category grids, 350px desktop cards, equal 197px media frames, one 345px mobile column, a static mobile footer, zero duplicate IDs, zero horizontal overflow, and no browser console warnings or errors.

## Interaction and accessibility checks

- All eight category links move to their prefixed category anchors without colliding with Featured anchors.
- All 166 cards are whole-card GitHub links with `target="_blank"` and `rel="noopener noreferrer"`.
- Reused covers lazy-load and have localized, meaningful alt text.
- English, Chinese, and Japanese output contains the same 166 card IDs and eight category grids.

final result: passed
