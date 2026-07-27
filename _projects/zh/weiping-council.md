---
layout: page
locale: zh
lang: zh-CN
translation_key: weiping-council
title: WEIPING_COUNCIL
description: 通过评议、辩论、红队与验证协议，开展可审查的多模型协商。
img: assets/img/projects/weiping-council-banner.webp
importance: 3
category: ai-systems
related_publications: false
permalink: /zh/projects/weiping-council/
---

## 目标

WEIPING_COUNCIL 让多个已配置的模型角色通过六种协议之一进行协商：评议、辩论、红队、共识、专家路由或锦标赛选择。它保留路由选择、模型证据、异议、耗时、警告与降级运行状态，使结果可以接受审查，而不是被当作单一、不透明的答案。

## 系统结构

React 界面与命令行客户端调用 FastAPI 编排器。编排器可以召回显式配置的上下文，把角色路由至不同提供商，收集会话范围的追踪记录，并保存结构化会话交接信息。公开的健康信息经过脱敏：就绪状态和错误类别可见，而提供商原始端点与凭据不会暴露。

<div class="row justify-content-sm-center">
  <div class="col-sm-8 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/weiping-council-banner.webp" title="WEIPING_COUNCIL 项目横幅" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  来自 WEIPING_COUNCIL 公开仓库的项目横幅。
</div>

## 证据与边界

多个模型达成一致并不保证结论正确。当提供商或可选记忆服务不可用时，会话可能不完整或处于降级状态；系统会明确展示该状态，而不会静默地将其呈现为一次完整评议。运行时会话文件、私有提供商日志和 `.env` 配置均不是作品集成果。

## 成果与来源

- [源代码与文档](https://github.com/appleweiping/WEIPING_COUNCIL)
- [所展示横幅的来源](https://github.com/appleweiping/WEIPING_COUNCIL/blob/master/banner.png)
- 项目依照仓库的 MIT 许可证发布。其设计参考章节列明了实现期间研究的外部系统。
