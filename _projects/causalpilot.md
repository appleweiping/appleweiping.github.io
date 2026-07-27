---
layout: page
locale: en
lang: en
translation_key: causalpilot
title: CausalPilot
description: Evidence-gated experimentation with deterministic causal tools and selective action rights.
img: assets/img/projects/causalpilot-control-room.webp
importance: 1
category: ai-systems
related_publications: false
permalink: /projects/causalpilot/
---

## Research question

Under limited experiment and human-attention budgets, what evidence should an agent need before it is allowed to act? CausalPilot separates a language model's proposal from the deterministic gates that own diagnosis, probing, human escalation, deployment, pause, rollback, and abstention rights.

## Approach

The project combines a FastAPI state machine, deterministic statistical tools, explicit model/causal/data/environment risk signals, and a Next.js control room. Its checked-in benchmark isolates hidden simulator truth from policies and stores the seeds, raw decisions, intervals, fixtures, and configuration fingerprints needed to audit the reported run.

<div class="row justify-content-sm-center">
  <div class="col-sm-11 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/causalpilot-control-room.webp" title="CausalPilot control room" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  The repository's 3D control room. Hosted values are explicitly labeled as simulation rather than live business measurements.
</div>

## Evidence and boundaries

The current artifact is a **controlled-simulation engineering benchmark**, not a causal research conclusion or live business-lift claim. Its named “LLM” benchmark policies are decision-rule proxies; the canonical run did not call model APIs. The checked-in results do not establish matched-coverage superiority, calibrated risk probabilities, real-model planning quality, or safe enterprise deployment.

## Artifacts and provenance

- [Live deterministic replay](https://appleweiping.github.io/causalpilot/)
- [Source code](https://github.com/appleweiping/causalpilot)
- [Technical report](https://github.com/appleweiping/causalpilot/blob/main/paper/causalpilot.pdf)
- [Claim boundaries](https://github.com/appleweiping/causalpilot/blob/main/docs/claims_we_do_not_make.md)
- [Displayed screenshot source](https://github.com/appleweiping/causalpilot/blob/main/docs/assets/control-room-final.png)
- Code, report, and generated project media are distributed under the repository's MIT license.
