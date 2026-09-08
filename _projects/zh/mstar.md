---
layout: page
locale: zh
lang: zh-CN
translation_key: mstar
title: "M* — 已合并的上游贡献"
description: M* 多模态服务框架中一项已合并的媒体输入可靠性修复，同时记录系统架构与维护者评审链路。
img: assets/img/repository-covers/mstar.webp
importance: 8
category: research
related_publications: false
permalink: /zh/projects/mstar/
---

## 已接受的贡献与指导

我通过 [pull request #235](https://github.com/mstar-project/mstar/pull/235)，修复了 [M\* 上游服务框架](https://github.com/mstar-project/mstar)中的媒体输入问题。兼容 OpenAI 的 `input_audio.data` 可能包含未补齐的 base64 或空白字符，解码失败此前会表现为服务器内部错误。合并后的补丁兼容有效变体；根据维护者评审，把同一解码器扩展到 data URL；将畸形媒体映射为 HTTP 400；并在四个文件中加入回归测试。

工作源自 [Yuchao Zhang 提出的跟踪 issue #211](https://github.com/mstar-project/mstar/issues/211)。Naomi Sagan 先[确认我可以认领任务](https://github.com/mstar-project/mstar/issues/211#issuecomment-5504826992)，随后在[维护者技术评审中指导修改范围](https://github.com/mstar-project/mstar/pull/235#pullrequestreview-5123475214)，[批准补丁](https://github.com/mstar-project/mstar/pull/235#pullrequestreview-5135701379)，并将其合并为[上游 commit `7da29ea`](https://github.com/mstar-project/mstar/commit/7da29ea207fca1692f0a70a75f36a89ee6386448)。这是公开的维护者指导，不是学术导师关系。

## M\* 的功能

M\* 是一个面向任意输入／输出模态模型的高性能服务框架，提供 Python SDK、兼容 OpenAI 的 API、原生流式输出、多模型调度，以及逻辑模型节点到 GPU rank 的显式映射。

<div class="row justify-content-sm-center">
  <div class="col-sm-9 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/repository-covers/mstar.webp" title="M-star 仓库封面" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  上游 M* 的官方社交卡片，固定到精确 commit 与 Git blob 后在本地归一化；未使用合成项目插图。
</div>

## 原理与架构

API server 接收并解码请求；conductor 遍历模型定义的计算图，选择 worker 并路由任务。每张 GPU 运行一个带微调度器的 worker；engine 负责资源准入、规划和执行 forward step、提交状态，并支持 continuous batching 与 CUDA graph。Tensor route 在 worker 之间传递中间值，后处理再生成流式响应。模型声明计算图和资源需求，服务引擎负责执行，YAML `node_groups` 将逻辑节点映射到 GPU rank。本次贡献加固的正是进入这条分布式路径之前的输入边界。

## 证据与归属

- [个人公开 fork](https://github.com/appleweiping/mstar)
- [M\* 上游仓库](https://github.com/mstar-project/mstar)
- [跟踪 issue #211](https://github.com/mstar-project/mstar/issues/211)
- [维护者任务确认](https://github.com/mstar-project/mstar/issues/211#issuecomment-5504826992)
- [已合并 pull request #235](https://github.com/mstar-project/mstar/pull/235)
- [维护者技术评审](https://github.com/mstar-project/mstar/pull/235#pullrequestreview-5123475214)
- [批准记录](https://github.com/mstar-project/mstar/pull/235#pullrequestreview-5135701379)
- [合并后的上游 commit](https://github.com/mstar-project/mstar/commit/7da29ea207fca1692f0a70a75f36a89ee6386448)
- [固定版本的 M\* 架构文档](https://github.com/mstar-project/mstar/blob/7da29ea207fca1692f0a70a75f36a89ee6386448/docs/architecture.rst)
- [固定版本的封面来源](https://github.com/mstar-project/mstar/blob/7da29ea207fca1692f0a70a75f36a89ee6386448/assets/mstar-social-dark.png)

目录仍将我的仓库标注为 fork，因为默认分支没有领先上游的提交。个人贡献的接收证据是上面的上游 PR、评审、批准和 commit。
