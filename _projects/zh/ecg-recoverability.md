---
layout: page
locale: zh
lang: zh-CN
translation_key: ecg-recoverability
title: ECG 可恢复性
description: 面向少导联 ECG 重建的特征级可恢复性与不确定性校准。
img: assets/img/projects/ecg-recoverability-neural-perception.png
importance: 3
category: research
related_publications: false
permalink: /zh/projects/ecg-recoverability/
---

## 研究问题

少导联 ECG 重建是一个不适定逆问题。较低的平均波形误差本身并不能说明某一导联上的哪些 P 波、QRS 波群、ST 段或 T 波特征仍然可信。本项目研究特征级可恢复性，而不是把重建质量简化为单一标量。

## 方法

研究代码结合 ECG 偶极子模型、导联配置的条件性度量，以及分布无关校准。它区分由模型支持的分量、通过统计估计的分量和不可恢复的分量，随后使用公开 PTB-XL 数据、合成检验及条件扩散示例评估这些区分。

<div class="row justify-content-sm-center">
  <div class="col-sm-10 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/ecg-recoverability-neural-perception.png" title="关于感知重建与可恢复性的仓库实验" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  仓库报告的实验，对比感知重建行为与留出数据上的可恢复性分析。
</div>

## 证据与边界

仓库包含与定理相联系的测试，以及基于公开研究数据集的实验。它是一项研究成果，预印本仍在准备中，**并非经过临床验证的设备、诊断系统、治疗建议或已发表的医学结果**。不同特征与病理的偶极性并不相同；校准依赖于所说明的数据与分组假设。本页任何内容均不构成医疗建议。

## 成果与来源

- [源代码](https://github.com/appleweiping/ecg-recoverability)
- [仓库手稿](https://github.com/appleweiping/ecg-recoverability/blob/main/paper/main.pdf)——研究手稿；不声称已经发表
- [所展示图表的来源](https://github.com/appleweiping/ecg-recoverability/blob/main/results/neural_perception_distortion.png)
- [PTB-XL 数据集记录](https://physionet.org/content/ptb-xl/)
- 项目代码与生成图表采用该仓库的 MIT 许可证；PTB-XL 仍受其自身数据许可与引用要求约束。
