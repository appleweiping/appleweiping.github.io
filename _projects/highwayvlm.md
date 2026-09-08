---
layout: page
locale: en
lang: en
translation_key: highwayvlm
title: HighwayVLM
description: Source-audited open-source participation in a freeway-camera safety system that combines CV gating, vision-language analysis, and an operator dashboard.
img: assets/img/repository-covers/highwayvlm.webp
importance: 6
category: research
related_publications: false
permalink: /projects/highwayvlm/
---

## My role and the contribution boundary

I participate in and study HighwayVLM through [my public fork](https://github.com/appleweiping/HighwayVLM), in the open-source context of the [UMN Choi Lab project](https://github.com/UMN-Choi-Lab/HighwayVLM). The project record names [Prof. Seongjin Choi](https://choi-seongjin.github.io/) as its advisor and [Ismail Yusuf](https://github.com/90Ismail) as the Spring 2026 UROP student researcher.

This attribution is intentionally precise. At the source audit on **September 8, 2026**, my fork's default branch was identical to upstream—zero commits ahead and zero behind. A separate [draft pull request #3](https://github.com/UMN-Choi-Lab/HighwayVLM/pull/3) proposes a CV-gating change and CPU-only tests so stopped-vehicle detections trigger VLM review without letting YOLO alone decide an incident; it remains open, unreviewed, and unmerged. The page therefore does not claim authorship of the upstream implementation or an accepted code contribution.

## What the project does

HighwayVLM monitors public freeway-camera snapshots for transportation-safety operations. It loads configured cameras, polls them on a fixed cadence, saves frames, uses local computer vision to decide whether a frame needs escalation, and then conditionally asks an OpenAI-compatible vision-language model for structured traffic observations. Results are stored for a live dashboard and incident, hourly, and overnight archive views.

<div class="row justify-content-sm-center">
  <div class="col-sm-10 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/repository-covers/highwayvlm.webp" title="HighwayVLM corridor dashboard" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  The upstream I-94 corridor dashboard screenshot, normalized locally as the site cover without synthetic image generation.
</div>

## Operating principle and data flow

1. Camera definitions come from a YAML configuration and share one system polling interval.
2. Each tick processes active cameras concurrently, fetches the newest snapshot, hashes it to reject unchanged frames, and saves the accepted image.
3. A CV-first gate and cooldown or quota safeguards decide whether vision-language inference is warranted.
4. The VLM client packages the camera context, timestamp, and base64 image, then normalizes the response into a strict Pydantic-validated schema.
5. SQLite and JSONL persistence retain polling outcomes, traffic state, incidents, confidence, and raw model output.
6. Static dashboard pages poll FastAPI JSON endpoints to render live summaries and archives.

This design keeps expensive model calls behind a deterministic local gate while retaining an auditable record of both escalated and non-escalated events.

## Architecture

The current implementation is a single-process FastAPI application with an in-process background worker:

- **API and presentation:** `highwayvlm/api.py` exposes JSON and HTML routes, mounts saved frames and static assets, and starts the worker.
- **Orchestration:** `highwayvlm/pipeline.py` owns per-camera state, concurrent polling, deduplication, CV gating, safeguards, model calls, and persistence.
- **Ingest:** `highwayvlm/ingest/fetcher.py` resolves direct images, JSON payloads, viewer HTML, and fallback metadata endpoints.
- **Model boundary:** `highwayvlm/vlm/client.py` constructs the request, calls an OpenAI-compatible chat-completions endpoint, parses loose model output, and validates the final structure.
- **Storage and UI:** `highwayvlm/storage.py` manages SQLite tables and logs; static HTML, CSS, and JavaScript query the API.

Keeping the API and worker in one process reduces local operating complexity, but couples camera ingestion and model analysis to API uptime.

## Evidence and upstream attribution

- [Public fork](https://github.com/appleweiping/HighwayVLM)
- [Upstream UMN Choi Lab repository](https://github.com/UMN-Choi-Lab/HighwayVLM)
- [Advisor profile: Prof. Seongjin Choi](https://choi-seongjin.github.io/)
- [Original UROP student researcher: Ismail Yusuf](https://github.com/90Ismail)
- [My open, unmerged draft pull request #3](https://github.com/UMN-Choi-Lab/HighwayVLM/pull/3)
- [Commit-pinned historical README recording the advisor and student researcher](https://github.com/UMN-Choi-Lab/HighwayVLM/blob/c3a7d30b8a2ed2dab2c4d0bb57aa1aac8e084279/README.md)
- [Commit-pinned architecture document](https://github.com/UMN-Choi-Lab/HighwayVLM/blob/d9f2571a940ba22a8b93fd475dd58a6add0613de/docs/ARCHITECTURE.md)
- [Commit-pinned dashboard image used for this page](https://github.com/UMN-Choi-Lab/HighwayVLM/blob/d9f2571a940ba22a8b93fd475dd58a6add0613de/docs/screenshots/dashboard-corridor-watch.png)
- [Upstream MIT license](https://github.com/UMN-Choi-Lab/HighwayVLM/blob/d9f2571a940ba22a8b93fd475dd58a6add0613de/LICENSE)
