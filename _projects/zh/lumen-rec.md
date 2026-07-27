---
layout: page
locale: zh
lang: zh-CN
translation_key: lumen-rec
title: Lumen-Rec
description: 对逐点 LLM 相关性估计与不确定性感知重排序进行受控比较。
img: assets/img/projects/lumen-rec-main-heatmap.webp
importance: 4
category: research
related_publications: false
permalink: /zh/projects/lumen-rec/
---

## 研究问题

LLM 推荐系统的对比常常同时改变候选集、模型骨干、导入器和指标。Lumen-Rec 追问：当这些协议变量保持不变时，结论还剩下什么？

## 方法

仓库固定了一项共享的 101 个物品候选任务、Qwen3-8B 骨干、评分模式、评估器、来源记录及配对统计。在该协议下，项目将逐点相关性后验与官方代码级别的基线及不确定性调整变体进行比较。

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/lumen-rec-main-heatmap.webp" title="相同候选集上的 NDCG 对比" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/lumen-rec-observation.webp" title="受控重排序观察" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  来自相同候选集比较与受控重排序研究的仓库图表。
</div>

## 证据与边界

仓库报告其后验方法在八个评估领域中的六个排名第一，同时在 Beauty 与 Movies 上仍然落后；仓库还报告，新增的不确定性／风险分解并未改善这一相同候选集上的排名。这些数值是**仓库报告的证据**，并非本站进行的独立复现。结果仅限于相同候选集的重排序：它不是全目录推荐结果，不构成普适的最新最佳水平主张，也不提供校准保证。

## 成果与来源

- [源代码与研究记录](https://github.com/appleweiping/Lumen-Rec)
- [热力图来源](https://github.com/appleweiping/Lumen-Rec/blob/main/Paper/figures/fig_main_heatmap.png)
- [观察图来源](https://github.com/appleweiping/Lumen-Rec/blob/main/Paper/figures/fig_observation.png)
- 项目代码与生成图表依照该仓库的 MIT 许可证分发。基线与数据集来源保留在仓库中，而非在此重新撰写。
