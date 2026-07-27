---
layout: page
locale: en
lang: en
translation_key: weiping-whale
title: WEIPING_WHALE
description: A compact terminal-native TypeScript coding agent based on CodeWhale's ideas.
img: assets/img/projects/weiping-whale-banner.webp
importance: 4
category: ai-systems
related_publications: false
permalink: /projects/weiping-whale/
---

## Purpose

WEIPING_WHALE is a terminal-native coding-agent CLI with side-git checkpoints, session branching and backtracking, model routing, skills, bounded sub-agents, diagnostics, cost tracking, MCP integration, and an optional local HTTP/SSE interface.

## Implementation

The TypeScript project focuses on a smaller, inspectable terminal workflow: file and shell tools operate behind approval rules, edits can be previewed as patches, turns receive separate snapshots, and runtime diagnostics make model/provider state visible.

<div class="row justify-content-sm-center">
  <div class="col-sm-8 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/weiping-whale-banner.webp" title="WEIPING_WHALE project banner" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Project banner from the public WEIPING_WHALE repository.
</div>

## Origin and boundaries

This is a **derivative implementation based on [CodeWhale](https://github.com/Hmbown/CodeWhale) (MIT)**. It independently re-implements CodeWhale's ideas in TypeScript at a smaller scale; it is not the upstream Rust implementation and does not claim its authorship. WEIPING_WHALE is also not affiliated with DeepSeek Inc. Its approval gates and snapshots reduce operational risk but do not constitute an operating-system sandbox or a guarantee that generated code is correct.

## Artifacts and provenance

- [WEIPING_WHALE source](https://github.com/appleweiping/WEIPING_WHALE)
- [Upstream inspiration: CodeWhale](https://github.com/Hmbown/CodeWhale)
- [Displayed banner source](https://github.com/appleweiping/WEIPING_WHALE/blob/master/assets/banner.png)
- WEIPING_WHALE is released under MIT; CodeWhale retains its own MIT copyright and attribution.
