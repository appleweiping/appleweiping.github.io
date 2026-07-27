---
layout: page
locale: zh
lang: zh-CN
translation_key: weiping-whale
title: WEIPING_WHALE
description: 一个基于 CodeWhale 思路、紧凑且以终端为原生环境的 TypeScript 编程智能体。
img: assets/img/projects/weiping-whale-banner.webp
importance: 4
category: ai-systems
related_publications: false
permalink: /zh/projects/weiping-whale/
---

## 目标

WEIPING_WHALE 是一个终端原生的编程智能体 CLI，具备 side-git 检查点、会话分支与回溯、模型路由、技能、受限子智能体、诊断、成本追踪、MCP 集成，以及可选的本地 HTTP／SSE 接口。

## 实现

该 TypeScript 项目聚焦于更小、更易审查的终端工作流：文件和 shell 工具受审批规则约束，编辑可在应用前以补丁形式预览，每轮交互分别保存快照，运行时诊断则使模型与提供商状态可见。

<div class="row justify-content-sm-center">
  <div class="col-sm-8 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/weiping-whale-banner.webp" title="WEIPING_WHALE 项目横幅" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  来自 WEIPING_WHALE 公开仓库的项目横幅。
</div>

## 起源与边界

这是一个**基于 [CodeWhale](https://github.com/Hmbown/CodeWhale)（MIT）的衍生实现**。它以更小的规模，在 TypeScript 中独立重新实现 CodeWhale 的思路；它不是上游 Rust 实现，也不声称拥有其作者身份。WEIPING_WHALE 同样与 DeepSeek Inc. 无关联。审批门控与快照能够降低操作风险，但不构成操作系统级沙箱，也不保证生成代码正确。

## 成果与来源

- [WEIPING_WHALE 源代码](https://github.com/appleweiping/WEIPING_WHALE)
- [上游灵感来源：CodeWhale](https://github.com/Hmbown/CodeWhale)
- [所展示横幅的来源](https://github.com/appleweiping/WEIPING_WHALE/blob/master/assets/banner.png)
- WEIPING_WHALE 依照 MIT 发布；CodeWhale 保留其自身的 MIT 版权与署名。
