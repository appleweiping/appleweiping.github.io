---
layout: page
locale: zh
lang: zh-CN
translation_key: topo-flow-limits
title: 拓扑流极限
description: 从边流观测中识别潜在高阶网络结构的可辨识性极限。
img: assets/img/projects/topo-flow-limits-real-cyclone.webp
importance: 1
category: research
related_publications: false
permalink: /zh/projects/topo-flow-limits/
---

## 研究问题

算法可以从边流估计填充三角形，但得到一个估计值并不能证明潜在高阶结构本身是可辨识的。本项目研究这一前提：在何种激励模型下，可以恢复什么，又需要多少次观测？

## 方法

仓库使用 Hodge 分解与协方差模型区分不同激励机制，推导有限样本极限，实现提升协方差估计器，并通过 CPU Monte Carlo 测试把分析主张与实验相连接。一项真实数据研究使用同一旋度统计量，在 ERA5 数据中定位涡旋，并以独立参考进行对照。

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/topo-flow-limits-real-cyclone.webp" title="ERA5 气旋实验" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/topo-flow-limits-phase-transition.webp" title="精确恢复相变" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  左：仓库报告的 ERA5 气旋实验。右：模拟的精确恢复相变，并与理论等值线和渐近下限进行比较。
</div>

## 证据与边界

公开记录包括与定理相联系的测试、模拟恢复等值线和 ERA5 实验。这些是**仍在进行的研究所报告的仓库结果**，并非已接收或已发表论文。真实数据实验被表述为涡旋定位，而不是物理拓扑恢复。每项可辨识性结果都依赖于手稿和代码中说明的激励假设。

## 成果与来源

- [源代码](https://github.com/appleweiping/topo-flow-limits)
- [仓库手稿](https://github.com/appleweiping/topo-flow-limits/blob/main/paper/main.pdf)——研究手稿；不声称已经发表
- [气旋图表来源](https://github.com/appleweiping/topo-flow-limits/blob/main/paper/figures/real_cyclone.png)
- [相变图表来源](https://github.com/appleweiping/topo-flow-limits/blob/main/paper/figures/phase_transition.png)
- 代码与仓库图表依照该仓库的 MIT 许可证分发。
