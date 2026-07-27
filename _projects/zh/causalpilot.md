---
layout: page
locale: zh
lang: zh-CN
translation_key: causalpilot
title: CausalPilot
description: 通过确定性因果工具与选择性行动权限，开展以证据为门槛的实验。
img: assets/img/projects/causalpilot-control-room.webp
importance: 1
category: ai-systems
related_publications: false
permalink: /zh/projects/causalpilot/
---

## 研究问题

在实验预算与人工注意力均有限的情况下，智能体需要达到怎样的证据标准，才应获准采取行动？CausalPilot 将语言模型提出的建议，与负责诊断、探测、人工升级、部署、暂停、回滚和弃权权限的确定性门控机制分离。

## 方法

项目结合 FastAPI 状态机、确定性统计工具、显式的模型／因果／数据／环境风险信号，以及 Next.js 控制室。仓库内的基准测试将模拟器隐藏真值与策略隔离，并保存种子、原始决策、区间、测试夹具与配置指纹，以便审计所报告的运行结果。

<div class="row justify-content-sm-center">
  <div class="col-sm-11 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/causalpilot-control-room.webp" title="CausalPilot 控制室" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  仓库中的 3D 控制室。托管版本里的数值均明确标注为模拟数据，而非真实业务测量。
</div>

## 证据与边界

当前成果是一个**受控模拟的工程基准**，不是因果研究结论，也不声称实现了真实业务提升。其中名为“LLM”的基准策略是决策规则代理；规范运行并未调用模型 API。仓库内结果不能证明在匹配覆盖率下具有优势、风险概率经过校准、真实模型具备相应规划质量，或系统能够安全用于企业部署。

## 成果与来源

- [在线确定性回放](https://appleweiping.github.io/causalpilot/)
- [源代码](https://github.com/appleweiping/causalpilot)
- [技术报告](https://github.com/appleweiping/causalpilot/blob/main/paper/causalpilot.pdf)
- [不作出的主张](https://github.com/appleweiping/causalpilot/blob/main/docs/claims_we_do_not_make.md)
- [所展示截图的来源](https://github.com/appleweiping/causalpilot/blob/main/docs/assets/control-room-final.png)
- 代码、报告与生成的项目媒体依照该仓库的 MIT 许可证分发。
