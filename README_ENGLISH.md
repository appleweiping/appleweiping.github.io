# Weiping Yan Academic Website - English Handoff

## Overview

This repository hosts a lightweight personal academic website for Weiping Yan.

The current version is deliberately focused, with only two public-facing pages:

- `Profile`
- `Resume`

The design direction is editorial, calm, and academically serious. It avoids heavy animation systems and instead uses typography, spacing, and a small amount of SVG- and CSS-driven interaction to guide reading.

## Current Site Goals

The website is built to communicate the following clearly:

- who Weiping Yan is academically
- what he studies
- what research direction he is moving toward
- how to contact him
- how to access the formal resume PDF

It is not intended to behave like a generic developer portfolio, a startup landing page, or an animation showcase.

## Current Stack

The live site uses:

- `index.html` for the Profile page
- `resume.html` for the Resume page
- `style.css` for layout, typography, color, and responsive behavior
- `script.js` for small interactions only
- `assets/profile.jpg` as the portrait source
- `assets/resume.pdf` as the canonical resume document

No build tooling is required. The site is static and deploys directly to GitHub Pages.

## Interaction Model

The current interactions are intentionally light:

- reveal-on-scroll for selected sections
- a subtle pointer-responsive light wash in the hero area
- an SVG signal path that guides the reading sequence through the Profile page
- active section highlighting tied to scroll position

These interactions are there to support reading structure, not to dominate attention.

## File Structure

```text
.
|-- index.html
|-- resume.html
|-- style.css
|-- script.js
|-- assets/
|   |-- profile.jpg
|   `-- resume.pdf
|-- server.py
|-- README.md
|-- README_ENGLISH.md
|-- README_PROJECT_HANDOFF.md
|-- ARCHITECTURE.md
|-- IMPLEMENTATION_SUMMARY.md
|-- OPTIMIZATION_SUMMARY.md
`-- src/
```

## What Each Main File Does

### `index.html`

Contains:

- top navigation
- hero section
- portrait block
- academic identity summary
- About section
- research directions
- selected experience
- contact block

### `resume.html`

Contains:

- resume page intro
- structured summary cards
- direct resume links
- embedded PDF viewer

### `style.css`

Responsible for:

- page layout
- type hierarchy
- color system
- atmospheric background treatment
- responsive layout
- signal-path visuals
- card and navigation styling
- reduced-motion behavior

### `script.js`

Responsible for:

- reveal-on-scroll behavior
- hero pointer response
- signal path geometry and scroll progress behavior
- active section highlighting

## Editing Guide

### Update text

Edit the copy directly in:

- `index.html`
- `resume.html`

### Update links

Search for the current contact URLs and replace them in the HTML files.

### Replace portrait

Overwrite:

- `assets/profile.jpg`

A vertical portrait works best.

### Replace resume

Overwrite:

- `assets/resume.pdf`

The embedded viewer and direct links will continue to work as long as the filename stays the same.

### Adjust styling

Edit:

- `style.css`

### Adjust interactions

Edit:

- `script.js`

## Local Development

### Option 1

```bash
python server.py
```

### Option 2

```bash
python -m http.server 8000
```

Then open:

- `http://localhost:8000`

## Deployment

The repository is deployed through GitHub Pages from `main`.

Typical update flow:

```bash
git add .
git commit -m "..."
git push origin main
```

GitHub Pages usually updates within a few minutes.

## Important Maintenance Notes

- The current live site does not require Node.
- The `src/` folder contains legacy experimental work from earlier iterations and is not used by the current production pages.
- If that older code is no longer needed, it can be archived or removed in a future cleanup pass.

## Recommended Next-Step Improvements

- tighten the final homepage copy further for academic applications
- refine mobile spacing after real-device review
- optionally simplify or archive unused legacy source files in `src/`
- add a final favicon and social preview image if desired
