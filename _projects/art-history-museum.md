---
layout: page
locale: en
lang: en
translation_key: art-history-museum
title: Art History Museum
description: A zoomable art-history timeline connected to first-person, source-attributed 3D galleries.
img: assets/img/projects/art-history-museum-live.webp
importance: 1
category: creative-computing
related_publications: false
permalink: /projects/art-history-museum/
---

## Experience

This browser-based museum turns art history into a spatial journey. A semantic-zoom timeline places periods and artists on real dates; selecting an artist opens a first-person React Three Fiber gallery whose works can be inspected individually.

<div class="row justify-content-sm-center">
  <div class="col-sm-11 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/art-history-museum-live.webp" title="Live art-history timeline" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  A real-browser capture of the deployed semantic-zoom timeline, verified on 19 July 2026; it is not a generated mock-up.
</div>

## Data and attribution

Biographies, dates, images, stories, and related records are seeded from English Wikipedia, Wikidata, and Wikimedia Commons. The importer accepts only Commons-hosted material with a supported free license or public-domain status. The deployed inspect view retains each work's license, creator attribution, and Commons source page. Gallery wall and floor textures and the HDRI are sourced from [Poly Haven](https://polyhaven.com/) under CC0.

## Boundaries

Free licensing is a hard content gate, so the museum intentionally omits rooms for artists whose relevant works are still copyrighted. The external deployment and its database remain separate services. This portfolio screenshot does not replace the per-work attribution and license trail shown inside the application.

## Artifacts and provenance

- [Live museum](https://art-history-museum-nine.vercel.app)
- [Source code](https://github.com/appleweiping/art-history-museum)
- [Wikipedia contributor terms](https://en.wikipedia.org/wiki/Wikipedia:Copyrights)
- [Wikimedia Commons reuse guidance](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia)
- Screenshot captured from the live deployment; artwork rights remain governed by each work's recorded license.
