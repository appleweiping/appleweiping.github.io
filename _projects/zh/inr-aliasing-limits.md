---
layout: page
locale: zh
lang: zh-CN
translation_key: inr-aliasing-limits
title: INR 混叠极限
description: 固定 Fourier 特征隐式表示中的可辨识性与抗混叠采样设计。
img: assets/img/projects/inr-aliasing-limits-image2d-aliasing.webp
importance: 2
category: research
related_publications: false
permalink: /zh/projects/inr-aliasing-limits/
---

## 研究问题

模型可以拟合网格上的每一个样本，但一个带外 Fourier 分量却可能与带内原子完全无法区分。本项目探究这种无声的重建失败何时不可避免，以及采样设计应如何将其暴露出来。

## 方法

本研究针对固定 Fourier 字典建立可见性与可混叠性分析，量化离网抖动和随机采样如何破除精确混叠，并构建在某一频带上具有连续域证书的采样设计。CPU 实验涵盖合成信号、真实信号与二维折叠。

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/inr-aliasing-limits-image2d-aliasing.webp" title="二维混叠实验" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/inr-aliasing-limits-real-signals.webp" title="真实信号采样实验" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  左：晶格掩码与随机掩码下预测的混叠副本。右：仓库中针对不同采样方案的真实信号对比。
</div>

## 证据与边界

仓库把理论检验与合成信号、真实信号实验相联系。相关主张针对的是**固定特征、线性系数模型**，并不覆盖所有隐式神经表示。学习得到的频率集合不在研究范围内；仓库还报告，其非线性扩展不适用于 SIREN。本研究仍在进行中，此处不将手稿表述为已发表成果。

## 成果与来源

- [源代码](https://github.com/appleweiping/inr-aliasing-limits)
- [仓库手稿](https://github.com/appleweiping/inr-aliasing-limits/blob/main/paper/main.pdf)——研究手稿；不声称已经发表
- [二维图表来源](https://github.com/appleweiping/inr-aliasing-limits/blob/main/paper/figures/image2d_aliasing.png)
- [真实信号图表来源](https://github.com/appleweiping/inr-aliasing-limits/blob/main/paper/figures/real_signals.png)
- 代码与仓库图表依照该仓库的 MIT 许可证分发；外部信号的来源记录保留在源代码仓库中。
