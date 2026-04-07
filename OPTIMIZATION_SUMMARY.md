# Optimization Summary

## Optimization Goal

The current project prioritizes:

- fast loading
- smooth interaction
- low maintenance cost
- clear academic presentation
- direct GitHub Pages deployment

This document summarizes the optimization strategy for the current version of the website.

## What Has Already Been Simplified

### Removed dependence on heavy visual systems

The live site no longer depends on the earlier canvas-heavy animation approach.

### Reduced runtime complexity

The current implementation uses:

- static HTML for structure
- shared CSS for most visual behavior
- a small amount of vanilla JavaScript only where necessary

### Kept the information architecture narrow

Only two public pages are maintained:

- `Profile`
- `Resume`

This reduces both user friction and maintenance surface.

## Current Performance-Friendly Choices

### 1. No build step required

This improves maintainability and keeps deployment straightforward.

### 2. No framework runtime

The site does not ship a framework bundle.

### 3. CSS-first presentation

Most of the visual system is handled by CSS rather than JavaScript.

### 4. Lightweight JavaScript only

`script.js` handles:

- reveal-on-scroll
- pointer-responsive hero wash
- SVG signal path updates
- active section highlighting
- the floating spirit companion, implemented as a tiny DOM/SVG layer instead of a heavy rendering system

### 5. Static assets only where needed

The project currently uses only:

- one portrait image
- one resume PDF

## Areas That Still Deserve Attention

### 1. Legacy repository cleanup

The `src/` directory contains old experimental code that is not used by the live site.

Possible improvement:

- archive it
- move it to a `legacy/` folder
- remove it if no longer needed

### 2. Asset optimization

The portrait and resume are already reasonably small, but future optimization could include:

- portrait compression review
- optional modern image format export if quality remains acceptable
- PDF size review when the resume is updated

### 3. Metadata polish

Potential improvements:

- favicon
- Open Graph image
- richer social metadata

### 4. Real-device QA

Recommended checks:

- mobile spacing
- sticky header behavior
- PDF embed behavior across browsers
- readability on high-resolution and low-resolution screens
- whether the spirit companion remains subtle enough on different desktop displays

## Ongoing Optimization Principles

When extending this project, prefer:

- semantic HTML over complex abstractions
- CSS transitions over JS-heavy animation
- SVG and transforms over heavy rendering pipelines
- narrow scope over unnecessary new pages
- direct editability over clever but fragile tooling

Avoid reintroducing:

- WebGL-only hero effects
- particle-heavy backgrounds
- large animation libraries
- template-driven portfolio sections that dilute the academic focus

## Recommended Next Optimization Pass

A sensible future pass would focus on:

1. archiving or removing unused legacy code
2. polishing metadata and browser presentation details
3. checking image and PDF asset sizes after future content updates
4. doing a final mobile-specific spacing review

## Summary

The current site is already optimized around the right priorities for this repository:

- small code surface
- fast static delivery
- restrained interaction
- low maintenance overhead
- clear academic positioning

Any future optimization should preserve those strengths rather than adding complexity.
