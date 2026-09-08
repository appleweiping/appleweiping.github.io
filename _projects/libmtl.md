---
layout: page
locale: en
lang: en
translation_key: libmtl
title: LibMTL — open upstream contribution
description: An open CLI-help contribution to LibMTL, with the exact-fork boundary, upstream ownership, project function, architecture, and evidence stated explicitly.
img: assets/img/repository-covers/libmtl.webp
importance: 8
category: research
related_publications: false
permalink: /projects/libmtl/
---

## Contribution status and scope

My [public LibMTL fork](https://github.com/appleweiping/LibMTL) preserves the default branch of the [Median Research Group upstream repository](https://github.com/median-research-group/LibMTL) exactly. My contribution is isolated on another branch as [commit `7261aaa`](https://github.com/appleweiping/LibMTL/commit/7261aaa53db6866d126d7f106f618c1bb0a1eb05) and submitted through [upstream pull request #97](https://github.com/median-research-group/LibMTL/pull/97).

The patch replaces whitespace-only `argparse` help placeholders in `LibMTL/config.py` with concise descriptions and adds regression tests that reject blank help text while confirming that `-h` renders successfully. At the 2026-09-08 audit, PR #97 was open, non-draft, unreviewed, and unmerged. It is therefore presented as a submitted contribution under review, not an accepted upstream result.

## Upstream ownership and guidance boundary

The [commit-pinned upstream README](https://github.com/median-research-group/LibMTL/blob/4336804847eaa5e0b924b743d76beec7ac3fdc97/README.md) identifies Baijiong Lin as LibMTL's developer and maintainer and credits the upstream authors and contributors. The change responds to [issue #90](https://github.com/median-research-group/LibMTL/issues/90), reported by `imanfs`; there was no maintainer review or comment on PR #97 at the audit. This record does not claim upstream authorship, acceptance, maintainer guidance, or academic supervision.

## What LibMTL does

LibMTL is a PyTorch library for multi-task learning. It provides a consistent way to combine shared and task-specific representations, loss or gradient weighting strategies, dataset pipelines, metrics, and experiment settings so methods can be trained and compared under a common interface. Its examples cover vision, language, office-domain, and molecular benchmarks.

<div class="row justify-content-sm-center">
  <div class="col-sm-9 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/repository-covers/libmtl.webp" title="LibMTL overall framework" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  The repository-native Overall Framework diagram, pinned to the audited upstream commit; no synthetic artwork is used.
</div>

## Principle and architecture

Multi-task learning jointly optimizes related objectives through a shared model while controlling competition between tasks. LibMTL separates two choices: an **architecture** determines which representations are shared or task-specific, and a **weighting strategy** combines task losses or gradients. A `Trainer` then coordinates data loading, forward and backward passes, optimization, scheduling, validation, metrics, and checkpoints. Task-specific encoders, decoders, losses, and metrics plug into that orchestration layer, while configuration and CLI arguments select combinations reproducibly.

## Evidence and attribution

- [My public fork](https://github.com/appleweiping/LibMTL)
- [Median Research Group upstream repository](https://github.com/median-research-group/LibMTL)
- [Open upstream pull request #97](https://github.com/median-research-group/LibMTL/pull/97)
- [Issue #90](https://github.com/median-research-group/LibMTL/issues/90)
- [My submitted branch commit](https://github.com/appleweiping/LibMTL/commit/7261aaa53db6866d126d7f106f618c1bb0a1eb05)
- [Commit-pinned upstream README](https://github.com/median-research-group/LibMTL/blob/4336804847eaa5e0b924b743d76beec7ac3fdc97/README.md)
- [Commit-pinned Overall Framework image](https://github.com/median-research-group/LibMTL/blob/4336804847eaa5e0b924b743d76beec7ac3fdc97/docs/docs/images/framework.png)
- [Commit-pinned MIT license](https://github.com/median-research-group/LibMTL/blob/4336804847eaa5e0b924b743d76beec7ac3fdc97/LICENSE)
