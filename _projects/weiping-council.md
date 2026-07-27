---
layout: page
locale: en
lang: en
translation_key: weiping-council
title: WEIPING_COUNCIL
description: Inspectable multi-model deliberation across council, debate, red-team, and verification protocols.
img: assets/img/projects/weiping-council-banner.webp
importance: 3
category: ai-systems
related_publications: false
permalink: /projects/weiping-council/
---

## Purpose

WEIPING_COUNCIL asks multiple configured model roles to deliberate through one of six protocols: council, debate, red-team, consensus, specialist routing, or tournament selection. It preserves routing choices, model evidence, dissent, timings, warnings, and degraded runtime state so a result can be inspected rather than treated as a single opaque answer.

## System shape

A React interface and command-line client call a FastAPI orchestrator. The orchestrator can recall explicitly configured context, route roles to providers, collect session-scoped traces, and store a structured session handoff. Public health information is redacted: readiness and error classes are visible, while raw provider endpoints and credentials are not.

<div class="row justify-content-sm-center">
  <div class="col-sm-8 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/weiping-council-banner.webp" title="WEIPING_COUNCIL project banner" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Project banner from the public WEIPING_COUNCIL repository.
</div>

## Evidence and boundaries

Multi-model agreement is not a correctness guarantee. A session can be partial or degraded when providers or optional memory services are unavailable; the system exposes that state rather than silently presenting it as a complete council. Runtime session files, private provider logs, and `.env` configuration are not portfolio artifacts.

## Artifacts and provenance

- [Source code and documentation](https://github.com/appleweiping/WEIPING_COUNCIL)
- [Displayed banner source](https://github.com/appleweiping/WEIPING_COUNCIL/blob/master/banner.png)
- The project is released under the repository's MIT license. Its design-reference section credits the external systems studied during implementation.
