---
layout: page
locale: zh
lang: zh-CN
translation_key: pisa
title: PISA — 已合并的上游贡献
description: PISA 中一项已合并的类型安全重构，同时记录高性能检索架构、维护者指导与贡献证据。
img: assets/img/repository-covers/pisa.webp
importance: 9
category: research
related_publications: false
permalink: /zh/projects/pisa/
---

## 已接受的贡献与指导

我通过 [pull request #641](https://github.com/pisa-engine/pisa/pull/641)向 [PISA 上游搜索引擎](https://github.com/pisa-engine/pisa)贡献代码。补丁把“查询算法是否需要 WAND data”的布尔值改为作用域枚举 `WandDataRequired::{Yes, No}`，并同步更新命令行映射、需求检查和测试，同时保持运行行为不变，使接口更难被误用、调用点也能自解释。

这项工作实现了维护者 Michał Siedlaczek 提出的 [issue #634](https://github.com/pisa-engine/pisa/issues/634)。他[确认了作用域内 `Yes`／`No` 的命名](https://github.com/pisa-engine/pisa/issues/634#issuecomment-5516885180)，检查了[合并前验证记录](https://github.com/pisa-engine/pisa/pull/641#issuecomment-5577916085)，并将测试通过的补丁合并为[上游 commit `ae8cc33`](https://github.com/pisa-engine/pisa/commit/ae8cc33b7529664f57076b9f16ae30df18cbc9f5)。这是维护者指导的开源工作，不是学术导师关系。

## PISA 的功能

PISA 是一个用 C++ 构建的高性能平台，用于为大规模文本集合建立索引、执行搜索算法和开展信息检索实验。它支持多种压缩索引格式、文档重排与分片、WAND 统计、多种查询处理策略，以及面向研究的命令行工具。

<div class="row justify-content-sm-center">
  <div class="col-sm-9 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/repository-covers/pisa.webp" title="PISA 仓库封面" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  上游官方索引流水线图，固定到精确 commit 与 Git blob 后在本地归一化；未使用合成项目插图。
</div>

## 原理与架构

索引流水线先把原始文集解析为保留每篇文档 token 顺序的 forward index，再反转为 term 到 document 的 posting list，并可重排或分片 document ID。选定的 codec 压缩 inverted index；额外步骤生成动态剪枝所需的 WAND statistics。查询处理器把索引、scorer 和 exhaustive、WAND、block-max WAND 等算法组合起来，返回稳定的 top-k 结果。本次贡献的枚举使每种算法是否依赖 WAND data 在这一架构边界上成为显式信息。

## 证据与归属

- [个人公开 fork](https://github.com/appleweiping/pisa)
- [PISA 上游仓库](https://github.com/pisa-engine/pisa)
- [维护者提出的 issue #634](https://github.com/pisa-engine/pisa/issues/634)
- [维护者对命名的确认](https://github.com/pisa-engine/pisa/issues/634#issuecomment-5516885180)
- [已合并 pull request #641](https://github.com/pisa-engine/pisa/pull/641)
- [合并前验证记录](https://github.com/pisa-engine/pisa/pull/641#issuecomment-5577916085)
- [合并后的上游 commit](https://github.com/pisa-engine/pisa/commit/ae8cc33b7529664f57076b9f16ae30df18cbc9f5)
- [固定版本的项目概览](https://github.com/pisa-engine/pisa/blob/ae8cc33b7529664f57076b9f16ae30df18cbc9f5/README.md)
- [固定版本的索引流水线指南](https://github.com/pisa-engine/pisa/blob/ae8cc33b7529664f57076b9f16ae30df18cbc9f5/docs/src/guide/indexing-pipeline.md)
- [固定版本的封面来源](https://github.com/pisa-engine/pisa/blob/ae8cc33b7529664f57076b9f16ae30df18cbc9f5/docs/src/pipeline.png)

目录仍将我的仓库标注为 fork，因为默认分支没有领先上游的提交。个人贡献被上游接收的证据是上面的 PR 与合并 commit。
