---
layout: page
locale: en
lang: en
translation_key: venus-basestation
title: Venus Basestation
description: Coursework base-station software and live visualization for a multi-robot exploration system.
img: assets/img/projects/venus-basestation-dashboard.svg
importance: 1
category: coursework
related_publications: false
permalink: /projects/venus-basestation/
---

## Team project context

Venus Basestation is a **coursework and team-project record** for a multi-robot planetary-exploration system. This page focuses on the public base-station and user-interface module; it does not claim sole authorship of the complete robot system or the mirrored team codebase.

## Base-station module

The software validates MQTT telemetry, queues network events for the Tk event loop, maintains a live map state, and supports simulated input, JSONL replay, live broker connections, command uplink, and SVG/PNG export. The repository includes automated tests, headless smoke commands, and a replayable example mission.

<div class="row justify-content-sm-center">
  <div class="col-sm-11 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/venus-basestation-dashboard.svg" title="Venus Basestation mission dashboard" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Mission-control snapshot generated from the repository's bundled three-robot replay, showing terrain, robot state, detections, and the event log.
</div>

## Attribution and boundaries

The public GitHub repository is a portfolio mirror; the team GitLab remains the authoritative record for coursework collaboration. Module and contributor attribution must follow the repository documentation and its `team-project/PROVENANCE.md`. Original code in `user-interface-module/` is MIT licensed, while the mirrored team snapshot retains its original team licensing. The dashboard confirms that a command was sent; returning telemetry is the source of actual robot-state confirmation.

## Artifacts and provenance

- [Public portfolio mirror](https://github.com/appleweiping/venus-basestation)
- [Responsibility boundary](https://github.com/appleweiping/venus-basestation/blob/main/user-interface-module/docs/verification-and-responsibility-boundary.md)
- [Team snapshot provenance](https://github.com/appleweiping/venus-basestation/blob/main/team-project/PROVENANCE.md)
- [Displayed dashboard source](https://github.com/appleweiping/venus-basestation/blob/main/user-interface-module/docs/assets/mission-dashboard.svg)
