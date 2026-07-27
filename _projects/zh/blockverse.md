---
layout: page
locale: zh
lang: zh-CN
translation_key: blockverse
title: BlockVerse
description: 一款原创浏览器体素沙盒，包含程序化世界、光照、制作、生物与本地存档。
img: assets/img/projects/blockverse-plains.jpg
importance: 2
category: creative-computing
related_publications: false
permalink: /zh/projects/blockverse/
---

## 体验

BlockVerse 是一款使用 JavaScript 与 Three.js 构建的浏览器体素沙盒。它结合了确定性的程序化地形、区块流式加载、双通道体素光照、采矿与制作、简单生物、昼夜模拟，以及保存在浏览器本地的世界存档。

<div class="row justify-content-sm-center">
  <div class="col-sm-10 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/blockverse-plains.jpg" title="BlockVerse 平原生物群系" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  仓库中程序化生成的平原生物群系截图。
</div>

## 实现

地形生成在 Web Workers 中运行，确定性种子则保证区块边界可以复现。纹理与物品图像在运行时以程序方式绘制；音效通过 Web Audio 合成。因此，仓库不包含从其他游戏复制的图像或音频资产。

## 起源与边界

BlockVerse 是从零开始的原创实现，**灵感来自体素沙盒这一类型及 Minecraft 等游戏**。它是非官方爱好者项目，与 Mojang、Microsoft 或 Minecraft 均无隶属、认可或关联关系。项目不包含任何 Minecraft 代码、纹理、音频、模型或其他资产。

## 成果与来源

- [在线游玩](https://appleweiping.github.io/blockverse/)
- [源代码](https://github.com/appleweiping/blockverse)
- [所展示截图的来源](https://github.com/appleweiping/blockverse/blob/main/docs/screenshots/plains.jpg)
- 原创代码、程序化资产与仓库截图均依照该仓库的 MIT 许可证发布。
