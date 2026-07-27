---
layout: page
locale: en
lang: en
translation_key: blockverse
title: BlockVerse
description: An original browser voxel sandbox with procedural worlds, lighting, crafting, creatures, and local saves.
img: assets/img/projects/blockverse-plains.jpg
importance: 2
category: creative-computing
related_publications: false
permalink: /projects/blockverse/
---

## Experience

BlockVerse is a browser-based voxel sandbox built with JavaScript and Three.js. It combines deterministic procedural terrain, chunk streaming, two-channel voxel lighting, mining and crafting, simple creatures, day/night simulation, and browser-local world saves.

<div class="row justify-content-sm-center">
  <div class="col-sm-10 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/blockverse-plains.jpg" title="BlockVerse plains biome" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Repository screenshot of a procedurally generated plains biome.
</div>

## Implementation

Terrain generation runs in Web Workers, while deterministic seeds keep chunk boundaries reproducible. Textures and item art are drawn procedurally at runtime; sound effects are synthesized through Web Audio. The repository therefore ships no copied image or audio assets from another game.

## Origin and boundaries

BlockVerse is an original, from-scratch implementation **inspired by the voxel-sandbox genre and games such as Minecraft**. It is an unofficial fan project and is not affiliated with, endorsed by, or connected to Mojang, Microsoft, or Minecraft. No Minecraft code, textures, audio, models, or other assets are included.

## Artifacts and provenance

- [Play online](https://appleweiping.github.io/blockverse/)
- [Source code](https://github.com/appleweiping/blockverse)
- [Displayed screenshot source](https://github.com/appleweiping/blockverse/blob/main/docs/screenshots/plains.jpg)
- Original code, procedural assets, and repository screenshots are released under the repository's MIT license.
