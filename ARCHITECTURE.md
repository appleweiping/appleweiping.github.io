# Architecture

## 1. Overview

The current website is a small static academic site built for clarity, speed, and easy maintenance.

It has two production pages:

- `index.html` for the Profile page
- `resume.html` for the Resume page

The architecture is intentionally simple:

- semantic HTML for content structure
- one shared CSS file for layout and visual language
- one small JavaScript file for lightweight interaction
- static assets for portrait and resume
- direct deployment through GitHub Pages

The current implementation also supports a three-language interface:

- English
- Chinese
- Japanese

## 2. Production Surface

### Main files

- `index.html`
- `resume.html`
- `style.css`
- `script.js`
- `assets/profile.jpg`
- `assets/resume.pdf`

### Supporting files

- `server.py` for local static preview
- Markdown documentation files for handoff and maintenance notes

## 3. Page Responsibilities

### `index.html`

Responsible for the narrative profile experience:

- identity and title
- short academic introduction
- portrait block
- academic summary items
- About section
- research directions
- selected experience
- contact links

### `resume.html`

Responsible for the formal record:

- short page intro
- structured summary blocks
- direct file links
- embedded PDF viewer

## 4. Styling System

All styling is centralized in `style.css`.

### Main responsibilities

- color palette and background atmosphere
- typography hierarchy
- spacing rhythm
- navigation styling
- portrait framing
- editorial section layout
- signal-path visuals
- responsive rules
- reduced-motion support

### Design intent

The visual system is meant to feel:

- calm
- airy
- restrained
- academically serious
- slightly atmospheric without becoming noisy

## 5. Interaction Layer

`script.js` is intentionally small and only provides lightweight enhancements.

### Current modules in practice

#### Reveal behavior

Uses `IntersectionObserver` to reveal selected sections as they enter the viewport.

#### Hero pointer wash

Tracks pointer position over the hero section and updates CSS variables that shift the soft radial light wash.

#### Floating spirit companion

Creates a very small fixed visual layer that behaves like an ambient spirit fragment rather than a mascot.

Responsibilities:

- inject a lightweight DOM/SVG node only on desktop-class pointer devices
- follow the cursor with strong delay
- keep motion drifting and quiet instead of reactive or playful
- disable itself for reduced-motion users and smaller screens

#### Language switching

Maintains interface localization without adding a framework or build pipeline.

Responsibilities:

- store the selected language in `localStorage`
- infer a default language from the browser when possible
- replace text and selected attributes through `data-i18n` hooks
- keep the two static HTML pages synchronized with one shared translation table

#### Signal map

Builds and updates the SVG reading path for the Profile page.

Responsibilities:

- compute anchor positions
- build the path geometry
- render the progress line
- highlight the active section based on scroll position
- respond to resize and scroll

## 6. Content and Asset Flow

### Text flow

Most content is stored directly in the HTML files.

This makes updates easy because:

- there is no CMS dependency
- there is no content build step
- text edits are transparent in git diffs

Localized interface strings are stored in `script.js` so that both pages can share one small translation source.

### Asset flow

- portrait is served from `assets/profile.jpg`
- resume is served from `assets/resume.pdf`

## 7. Performance Strategy

The project avoids heavy rendering systems on purpose.

### Explicitly avoided

- WebGL scenes
- canvas-heavy particle systems
- large animation libraries
- parallax-heavy full-screen effects
- build-time frameworks that add runtime overhead

### Performance choices in the current version

- small DOM surface
- CSS-first visual behavior
- tiny JavaScript footprint
- no external runtime dependency
- progressive enhancement instead of required animation
- support for `prefers-reduced-motion`

## 8. Accessibility and Maintainability

### Accessibility

- semantic HTML sections
- visible navigation states
- skip link support
- reduced-motion fallback
- embedded PDF with direct-download fallback

### Maintainability

- only four main production files
- direct text editing in HTML
- no build pipeline needed
- easy GitHub Pages deployment

## 9. Legacy Code Note

The `src/` directory contains older experimental code from earlier iterations of the project.

Important:

- it is not used by the current live site
- it can remain as reference material
- it can also be archived or removed later if the repository should be simplified further

## 10. Deployment Model

Deployment target:

- GitHub Pages

Typical update path:

1. edit the production files
2. commit changes to `main`
3. push to `origin/main`
4. wait for GitHub Pages to refresh

This architecture favors reliability and low maintenance over tool complexity.
