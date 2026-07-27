---
layout: page
locale: zh
lang: zh-CN
translation_key: weiping-lab
title: WEIPING_LAB
description: 一个以证据为门槛、覆盖发现、证伪、实验交接与审计的研究工作台。
img: assets/img/projects/weiping-lab-banner.webp
importance: 2
category: ai-systems
related_publications: false
permalink: /zh/projects/weiping-lab/
---

## 目标

WEIPING_LAB 是一个自主研究工作台，支持现象驱动的发现、优先淘汰式构思、实验规划、以证据为门槛的写作与跨模型审计。其核心设计目标，是保留“看似合理的研究计划”与“真实实验产生的证据”之间的界线。

## 工作流

仓库组织了一条带门控的路径：从现象或项目上下文出发，依次经过新颖性审查、对抗性证伪、实验规划、人工／服务器实验桥接、结果加载、写作、引用审查和主张审计。运行状态可通过 CLI 和 API 观察，而提供商凭据与研究工作区状态仍保存在本地。

<div class="row justify-content-sm-center">
  <div class="col-sm-8 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/weiping-lab-banner.webp" title="WEIPING_LAB 项目横幅" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  来自 WEIPING_LAB 公开仓库的项目横幅。
</div>

## 证据与边界

WEIPING_LAB 是工作流软件，本身不能证明实验已经运行，也不能证明论文主张为真。仓库将结果标记为 `paper_result`、`official`、`diagnostic` 或 `pilot`；只有通过已配置门控的证据才有资格支撑主要主张。在需要真实实验或人工决策的位置，工作流会有意暂停。

## 成果与来源

- [源代码与文档](https://github.com/appleweiping/WEIPING_LAB)
- [所展示横幅的来源](https://github.com/appleweiping/WEIPING_LAB/blob/master/banner.png)
- 项目依照仓库的 MIT 许可证发布。设计期间研究的开源系统仍在仓库文档中注明；此处既未将其打包进项目，也未声称其为原创成果。
