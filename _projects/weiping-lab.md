---
layout: page
locale: en
lang: en
translation_key: weiping-lab
title: WEIPING_LAB
description: An evidence-gated research workbench for discovery, falsification, experiment handoff, and audit.
img: assets/img/projects/weiping-lab-banner.webp
importance: 2
category: ai-systems
related_publications: false
permalink: /projects/weiping-lab/
---

## Purpose

WEIPING_LAB is an autonomous research workbench for phenomenon-driven discovery, kill-first ideation, experiment planning, evidence-gated writing, and cross-model audit. Its central design goal is to preserve the boundary between a plausible research plan and evidence produced by an actual experiment.

## Workflow

The repository organizes a gated path from phenomenon or project context through novelty review, adversarial falsification, experiment planning, a human/server experiment bridge, results loading, writing, citation review, and claim audit. Runtime status is observable through its CLI and API, while provider credentials and research workspace state remain local.

<div class="row justify-content-sm-center">
  <div class="col-sm-8 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/weiping-lab-banner.webp" title="WEIPING_LAB project banner" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Project banner from the public WEIPING_LAB repository.
</div>

## Evidence and boundaries

WEIPING_LAB is workflow software, not evidence that an experiment has run or a paper claim is true. The repository labels results as `paper_result`, `official`, `diagnostic`, or `pilot`; only evidence that passes the configured gates is eligible for main claims. The workflow deliberately pauses where real experiments or human decisions are required.

## Artifacts and provenance

- [Source code and documentation](https://github.com/appleweiping/WEIPING_LAB)
- [Displayed banner source](https://github.com/appleweiping/WEIPING_LAB/blob/master/banner.png)
- The project is released under the repository's MIT license. Open-source systems studied during its design remain credited in the repository documentation; they are not vendored or claimed as original work here.
