---
layout: page
locale: en
lang: en
translation_key: cadenza
title: Cadenza
description: A zero-dependency browser rhythm game built around public-domain music and Web Audio synthesis.
img: assets/img/projects/cadenza-banner.svg
importance: 3
category: creative-computing
related_publications: false
permalink: /projects/cadenza/
---

## Experience

Cadenza is a four-lane browser rhythm game implemented in vanilla JavaScript. Each chart encodes pitches and durations, so tiles are both gameplay objects and the score: tapping a tile synthesizes its notes immediately through Web Audio.

<div class="row justify-content-sm-center">
  <div class="col-sm-10 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/cadenza-banner.svg" title="Cadenza project banner" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Original banner from the public Cadenza repository.
</div>

## Implementation

The game has no runtime dependencies or prerecorded audio. A compact chart DSL represents notes, rests, chords, holds, and two-lane events; a validator and continuous-integration check protect the chart library. Deterministic lane assignment makes charts reproducible while applying playability constraints.

## Music, homage, and boundaries

The repository accepts public-domain compositions and traditional melodies, transcribed into its chart format by the author. Cadenza is an **unofficial open-source homage inspired by Piano Tiles 2** and is not affiliated with Cheetah Mobile. It does not contain audio, artwork, code, or other assets from the original game. Public-domain status concerns the underlying compositions; the project's transcriptions and code are provided under the repository license.

## Artifacts and provenance

- [Play online](https://appleweiping.github.io/cadenza/)
- [Source code and chart provenance](https://github.com/appleweiping/cadenza)
- [Displayed banner source](https://github.com/appleweiping/cadenza/blob/main/assets/banner.svg)
- Code and chart data are released under the repository's MIT license; composition credits and public-domain checks remain attached to the song library.
