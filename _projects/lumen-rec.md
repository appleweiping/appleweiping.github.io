---
layout: page
locale: en
lang: en
translation_key: lumen-rec
title: Lumen-Rec
description: Controlled comparison of pointwise LLM relevance estimates and uncertainty-aware reranking.
img: assets/img/projects/lumen-rec-main-heatmap.webp
importance: 4
category: research
related_publications: false
permalink: /projects/lumen-rec/
---

## Research question

LLM recommender comparisons often change the candidate set, model backbone, importer, and metric at the same time. Lumen-Rec asks what remains when those protocol variables are held fixed.

## Approach

The repository fixes a shared 101-item candidate task, a Qwen3-8B backbone, a score schema, an evaluator, provenance records, and paired statistics. Within that protocol it compares a pointwise relevance posterior with official-code-level baselines and uncertainty-adjusted variants.

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/lumen-rec-main-heatmap.webp" title="Same-candidate NDCG comparison" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/lumen-rec-observation.webp" title="Controlled reranking observation" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Repository figures from the same-candidate comparison and controlled reranking study.
</div>

## Evidence and boundaries

The repository reports that its posterior ranks first in six of eight evaluated domains, while retaining losses on Beauty and Movies; it also reports that the added uncertainty/risk decomposition does not improve this same-candidate ranking. These numbers are **repository-reported evidence**, not an independent replication by this site. The result is limited to same-candidate reranking: it is not a full-catalog recommendation result, a universal state-of-the-art claim, or a calibration guarantee.

## Artifacts and provenance

- [Source code and research record](https://github.com/appleweiping/Lumen-Rec)
- [Heatmap figure source](https://github.com/appleweiping/Lumen-Rec/blob/main/Paper/figures/fig_main_heatmap.png)
- [Observation figure source](https://github.com/appleweiping/Lumen-Rec/blob/main/Paper/figures/fig_observation.png)
- Project code and generated figures are distributed under the repository's MIT license. Baseline and dataset provenance is retained in the repository rather than re-authored here.
