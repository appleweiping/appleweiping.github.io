---
layout: page
locale: zh
lang: zh-CN
translation_key: libmtl
title: LibMTL — 审核中的上游贡献
description: 对 LibMTL 的一项命令行帮助修复，明确区分精确 fork、上游归属、项目功能与架构，以及尚未合并的贡献状态。
img: assets/img/repository-covers/libmtl.webp
importance: 8
category: research
related_publications: false
permalink: /zh/projects/libmtl/
---

## 贡献状态与范围

我的 [LibMTL 公开 fork](https://github.com/appleweiping/LibMTL) 的默认分支与 [Median Research Group 上游仓库](https://github.com/median-research-group/LibMTL) 完全一致。我的改动单独保存在另一个分支的 [commit `7261aaa`](https://github.com/appleweiping/LibMTL/commit/7261aaa53db6866d126d7f106f618c1bb0a1eb05)，并通过[上游 pull request #97](https://github.com/median-research-group/LibMTL/pull/97)提交。

补丁把 `LibMTL/config.py` 中只有空白字符的 `argparse` 帮助占位替换为简洁说明，并增加回归测试：禁止空白 help，同时确认 `-h` 能正常渲染。截至 2026-09-08，PR #97 为 open、非 draft、尚无 review，且未合并。因此这里把它表述为“已提交、审核中”的贡献，而不是已被上游接收的成果。

## 上游归属与指导边界

[固定 commit 的上游 README](https://github.com/median-research-group/LibMTL/blob/4336804847eaa5e0b924b743d76beec7ac3fdc97/README.md)将 Baijiong Lin 列为 LibMTL 的开发者与维护者，并记录上游作者和贡献者。此次修复回应由 `imanfs` 报告的 [issue #90](https://github.com/median-research-group/LibMTL/issues/90)；审计时 PR #97 尚无维护者 review 或 comment。这里不声称本人是上游作者、改动已接收、得到维护者指导或存在学术导师关系。

## LibMTL 的功能

LibMTL 是面向多任务学习的 PyTorch 库。它用统一接口组合共享／任务专属表示、损失或梯度加权策略、数据流水线、指标与实验设置，使多种方法可以在一致条件下训练和比较。仓库示例覆盖视觉、语言、办公域和分子数据基准。

<div class="row justify-content-sm-center">
  <div class="col-sm-9 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/repository-covers/libmtl.webp" title="LibMTL Overall Framework" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  仓库原生 Overall Framework 架构图，固定到已审计的上游 commit；未使用合成插图。
</div>

## 原理与架构

多任务学习通过共享模型联合优化相关目标，同时控制不同任务之间的竞争。LibMTL 把两类选择分开：**architecture** 决定哪些表示共享或为任务专属，**weighting strategy** 负责组合各任务的损失或梯度；`Trainer` 统一协调数据加载、前后向传播、优化器、调度器、验证、指标和 checkpoint。任务专属 encoder、decoder、loss 与 metric 接入这一编排层，配置文件与命令行参数则以可复现方式选择具体组合。

## 证据与归属

- [个人公开 fork](https://github.com/appleweiping/LibMTL)
- [Median Research Group 上游仓库](https://github.com/median-research-group/LibMTL)
- [审核中的上游 pull request #97](https://github.com/median-research-group/LibMTL/pull/97)
- [Issue #90](https://github.com/median-research-group/LibMTL/issues/90)
- [个人提交分支 commit](https://github.com/appleweiping/LibMTL/commit/7261aaa53db6866d126d7f106f618c1bb0a1eb05)
- [固定 commit 的上游 README](https://github.com/median-research-group/LibMTL/blob/4336804847eaa5e0b924b743d76beec7ac3fdc97/README.md)
- [固定 commit 的 Overall Framework 图片](https://github.com/median-research-group/LibMTL/blob/4336804847eaa5e0b924b743d76beec7ac3fdc97/docs/docs/images/framework.png)
- [固定 commit 的 MIT 许可证](https://github.com/median-research-group/LibMTL/blob/4336804847eaa5e0b924b743d76beec7ac3fdc97/LICENSE)
