# Weiping Yan Academic Website

This repository contains the source for Weiping Yan's personal academic website, deployed with GitHub Pages.

## Live Site

https://appleweiping.github.io/

## Current Scope

The site is intentionally compact and keeps only two main pages:

- `Profile`: identity, academic direction, research interests, selected experience, and contact
- `Resume`: a structured summary plus an embedded PDF resume viewer

## Tech Stack

- Semantic HTML
- Hand-written CSS
- Small vanilla JavaScript for lightweight interaction
- Static assets for portrait and resume
- No build step required

## Project Structure

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
|-- ARCHITECTURE.md
|-- IMPLEMENTATION_SUMMARY.md
|-- OPTIMIZATION_SUMMARY.md
|-- README_ENGLISH.md
|-- README_PROJECT_HANDOFF.md
`-- src/
```

## Local Preview

You can preview locally with either command:

```bash
python server.py
```

or

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Where To Edit

- Update homepage text in `index.html`
- Update resume-page summary in `resume.html`
- Update the visual system in `style.css`
- Update small interactions in `script.js`
- Replace portrait in `assets/profile.jpg`
- Replace resume in `assets/resume.pdf`

## Notes

- The `src/` directory contains older experimental code and is not required by the current live site.
- The current website is designed for GitHub Pages and does not depend on Node or a bundler.
- The current desktop experience includes a very subtle floating spirit-like companion implemented as a lightweight DOM/SVG layer.
