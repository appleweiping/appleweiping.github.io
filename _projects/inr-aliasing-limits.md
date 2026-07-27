---
layout: page
locale: en
lang: en
translation_key: inr-aliasing-limits
title: INR Aliasing Limits
description: Identifiability and anti-aliasing sample design for fixed-Fourier-feature implicit representations.
img: assets/img/projects/inr-aliasing-limits-image2d-aliasing.webp
importance: 2
category: research
related_publications: false
permalink: /projects/inr-aliasing-limits/
---

## Research question

A model can fit every sample on a grid while an out-of-band Fourier component is exactly indistinguishable from an in-band atom. This project asks when that silent reconstruction failure is unavoidable and how sampling design can expose it.

## Approach

The work develops a visibility and aliasability analysis for fixed Fourier dictionaries, quantifies how off-grid jitter and randomized sampling break exact aliases, and constructs a sample design with a continuum certificate over a frequency band. CPU experiments cover synthetic signals, real signals, and two-dimensional folding.

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/inr-aliasing-limits-image2d-aliasing.webp" title="Two-dimensional aliasing experiment" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/inr-aliasing-limits-real-signals.webp" title="Real-signal sampling experiment" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Left: predicted alias replicas under lattice and randomized masks. Right: the repository's real-signal comparison of sampling choices.
</div>

## Evidence and boundaries

The repository links theoretical checks to synthetic and real-signal experiments. The claims concern a **fixed-feature, linear-coefficient model**; they do not cover every implicit neural representation. Learned frequency sets are outside scope, and the repository reports that its nonlinear extension does not hold for SIRENs. This is active research and the manuscript is not presented here as a publication.

## Artifacts and provenance

- [Source code](https://github.com/appleweiping/inr-aliasing-limits)
- [Repository manuscript](https://github.com/appleweiping/inr-aliasing-limits/blob/main/paper/main.pdf) — research manuscript; no publication claim
- [Two-dimensional figure source](https://github.com/appleweiping/inr-aliasing-limits/blob/main/paper/figures/image2d_aliasing.png)
- [Real-signal figure source](https://github.com/appleweiping/inr-aliasing-limits/blob/main/paper/figures/real_signals.png)
- Code and repository figures are distributed under the repository's MIT license; external signal provenance remains recorded in the source repository.
