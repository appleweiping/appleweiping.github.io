---
layout: page
locale: en
lang: en
translation_key: topo-flow-limits
title: Topo Flow Limits
description: Identifiability limits for latent higher-order network structure from edge-flow observations.
img: assets/img/projects/topo-flow-limits-real-cyclone.webp
importance: 1
category: research
related_publications: false
permalink: /projects/topo-flow-limits/
---

## Research question

Algorithms can estimate filled triangles from edge flows, but an estimate does not establish whether the latent higher-order structure is identifiable in the first place. This project studies that prerequisite: what can be recovered, under which excitation model, and with how many observations?

## Approach

The repository uses Hodge decomposition and covariance models to distinguish excitation regimes, develops finite-sample limits, implements a lifted-covariance estimator, and connects analytical claims to CPU Monte Carlo tests. A real-data study uses the same curl statistic to localize vortices in ERA5 data against independent references.

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/topo-flow-limits-real-cyclone.webp" title="ERA5 cyclone experiment" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/topo-flow-limits-phase-transition.webp" title="Exact-recovery phase transition" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Left: repository-reported ERA5 cyclone experiment. Right: a simulated exact-recovery phase transition compared with the theoretical contour and asymptotic floor.
</div>

## Evidence and boundaries

The public record includes theorem-linked tests, simulated recovery contours, and the ERA5 experiment. These are **repository-reported results from active research**, not an accepted or published paper. The real-data experiment is framed as vortex localization, not recovery of physical topology. Each identifiability result depends on the excitation assumptions stated in the manuscript and code.

## Artifacts and provenance

- [Source code](https://github.com/appleweiping/topo-flow-limits)
- [Repository manuscript](https://github.com/appleweiping/topo-flow-limits/blob/main/paper/main.pdf) — research manuscript; no publication claim
- [Cyclone figure source](https://github.com/appleweiping/topo-flow-limits/blob/main/paper/figures/real_cyclone.png)
- [Phase-transition figure source](https://github.com/appleweiping/topo-flow-limits/blob/main/paper/figures/phase_transition.png)
- Code and repository figures are distributed under the repository's MIT license.
