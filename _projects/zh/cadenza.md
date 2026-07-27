---
layout: page
locale: zh
lang: zh-CN
translation_key: cadenza
title: Cadenza
description: 一款以公有领域音乐与 Web Audio 合成为基础、零依赖的浏览器节奏游戏。
img: assets/img/projects/cadenza-banner.svg
importance: 3
category: creative-computing
related_publications: false
permalink: /zh/projects/cadenza/
---

## 体验

Cadenza 是一款使用原生 JavaScript 实现的四轨浏览器节奏游戏。每张谱面都编码音高与时值，因此方块既是玩法对象，也是乐谱本身：点击方块时，其音符会立即通过 Web Audio 合成。

<div class="row justify-content-sm-center">
  <div class="col-sm-10 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/cadenza-banner.svg" title="Cadenza 项目横幅" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  来自 Cadenza 公开仓库的原创横幅。
</div>

## 实现

游戏没有运行时依赖，也不使用预录音频。一套紧凑的谱面 DSL 表示音符、休止符、和弦、长按与双轨事件；验证器与持续集成检查共同保护谱面库。确定性的轨道分配在施加可玩性约束的同时，确保谱面可以复现。

## 音乐、致敬与边界

仓库收录由作者转写为其谱面格式的公有领域作品与传统旋律。Cadenza 是一款**受 Piano Tiles 2 启发的非官方开源致敬作品**，与 Cheetah Mobile 无关联。它不包含原游戏的音频、美术、代码或其他资产。公有领域状态针对的是底层音乐作品；本项目的转写与代码则依照仓库许可证提供。

## 成果与来源

- [在线游玩](https://appleweiping.github.io/cadenza/)
- [源代码与谱面来源记录](https://github.com/appleweiping/cadenza)
- [所展示横幅的来源](https://github.com/appleweiping/cadenza/blob/main/assets/banner.svg)
- 代码与谱面数据依照该仓库的 MIT 许可证发布；作品署名与公有领域核验记录始终附于曲库。
