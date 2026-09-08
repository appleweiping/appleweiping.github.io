---
layout: page
locale: en
lang: en
translation_key: pisa
title: PISA — accepted upstream contribution
description: A merged type-safety refactor in PISA, with the high-performance retrieval architecture, maintainer guidance, and contribution evidence documented.
img: assets/img/repository-covers/pisa.webp
importance: 9
category: research
related_publications: false
permalink: /projects/pisa/
---

## Accepted contribution and guidance

I contributed to the [PISA upstream search engine](https://github.com/pisa-engine/pisa) through [pull request #641](https://github.com/pisa-engine/pisa/pull/641). The patch replaced a boolean representing whether a query algorithm requires WAND data with the scoped enum `WandDataRequired::{Yes, No}`. It updated the command-line mapping, requirement checks, and tests without changing runtime behavior, making the interface harder to misuse and its call sites self-documenting.

The work implemented maintainer Michał Siedlaczek's [issue #634](https://github.com/pisa-engine/pisa/issues/634). He [confirmed the scoped `Yes`/`No` naming](https://github.com/pisa-engine/pisa/issues/634#issuecomment-5516885180), reviewed the [pre-merge verification record](https://github.com/pisa-engine/pisa/pull/641#issuecomment-5577916085), and merged the tested patch as [upstream commit `ae8cc33`](https://github.com/pisa-engine/pisa/commit/ae8cc33b7529664f57076b9f16ae30df18cbc9f5). This is maintainer-guided open-source work, not academic supervision.

## What PISA does

PISA is a high-performance C++ platform for indexing large text collections, executing search algorithms, and running information-retrieval experiments. It supports multiple compressed-index formats, document reordering and sharding, WAND statistics, several query-processing strategies, and research-oriented command-line tools.

<div class="row justify-content-sm-center">
  <div class="col-sm-9 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/repository-covers/pisa.webp" title="PISA repository cover" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  The official upstream indexing-pipeline diagram, pinned to an exact commit and Git blob and normalized locally; no synthetic project artwork is used.
</div>

## Principle and architecture

The indexing pipeline parses a raw collection into a forward index that preserves per-document token order, inverts it into term-to-document posting lists, and can reorder or shard document identifiers. A selected codec compresses the inverted index; an additional pass builds WAND statistics used for dynamic pruning. Query processors combine the index with a scorer and an algorithm such as exhaustive retrieval, WAND, or block-max WAND, then return stable top-k results. The contributed enum makes each algorithm's WAND-data requirement explicit at this architectural boundary.

## Evidence and attribution

- [My public fork](https://github.com/appleweiping/pisa)
- [Upstream PISA repository](https://github.com/pisa-engine/pisa)
- [Maintainer-filed issue #634](https://github.com/pisa-engine/pisa/issues/634)
- [Maintainer naming confirmation](https://github.com/pisa-engine/pisa/issues/634#issuecomment-5516885180)
- [Merged pull request #641](https://github.com/pisa-engine/pisa/pull/641)
- [Pre-merge verification record](https://github.com/pisa-engine/pisa/pull/641#issuecomment-5577916085)
- [Merged upstream commit](https://github.com/pisa-engine/pisa/commit/ae8cc33b7529664f57076b9f16ae30df18cbc9f5)
- [Commit-pinned project overview](https://github.com/pisa-engine/pisa/blob/ae8cc33b7529664f57076b9f16ae30df18cbc9f5/README.md)
- [Commit-pinned indexing-pipeline guide](https://github.com/pisa-engine/pisa/blob/ae8cc33b7529664f57076b9f16ae30df18cbc9f5/docs/src/guide/indexing-pipeline.md)
- [Commit-pinned cover source](https://github.com/pisa-engine/pisa/blob/ae8cc33b7529664f57076b9f16ae30df18cbc9f5/docs/src/pipeline.png)

My catalog entry remains a fork because its default branch contains no commits ahead of upstream. The accepted authorship evidence is the upstream PR and merged commit.
