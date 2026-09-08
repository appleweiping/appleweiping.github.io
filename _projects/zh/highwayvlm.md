---
layout: page
locale: zh
lang: zh-CN
translation_key: highwayvlm
title: HighwayVLM
description: 对高速公路相机安全系统的开源参与与来源审计；系统结合 CV 门控、视觉语言分析和运营看板。
img: assets/img/repository-covers/highwayvlm.webp
importance: 6
category: research
related_publications: false
permalink: /zh/projects/highwayvlm/
---

## 我的参与方式与贡献边界

我通过[个人公开 fork](https://github.com/appleweiping/HighwayVLM)参与并研读 HighwayVLM，所参与的开源上下文来自 [UMN Choi Lab 的上游项目](https://github.com/UMN-Choi-Lab/HighwayVLM)。项目记录将[Seongjin Choi 教授](https://choi-seongjin.github.io/)列为指导教师，并将 [Ismail Yusuf](https://github.com/90Ismail) 列为 2026 年春季 UROP 学生研究者。

这里有意把归属写清楚。截至 **2026 年 9 月 8 日**的来源审计，我的 fork 默认分支与上游完全一致——领先提交为零、落后提交也为零。另有一个[尚处于 draft 的 pull request #3](https://github.com/UMN-Choi-Lab/HighwayVLM/pull/3)，提议修改 CV 门控并增加纯 CPU 测试，使停车检测触发 VLM 复核、但不由 YOLO 单独判定事故；它目前仍未评审、未合并。因此，本页不把上游实现写成我的原创，也不声称已有上游接受的代码贡献。

## 项目功能

HighwayVLM 面向交通安全运营，监测公共高速公路相机快照。它载入相机配置，按固定节拍轮询并保存画面，先用本地计算机视觉判断是否需要升级分析，再按条件调用兼容 OpenAI 接口的视觉语言模型，生成结构化交通观察。结果用于实时看板，以及事故、小时和夜间归档页面。

<div class="row justify-content-sm-center">
  <div class="col-sm-10 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/repository-covers/highwayvlm.webp" title="HighwayVLM 走廊监测看板" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  上游 I-94 走廊看板的真实截图；本站只做本地规格归一化，没有使用合成图片生成。
</div>

## 工作原理与数据流

1. 相机定义来自 YAML 配置，全部共用一个系统轮询间隔。
2. 每个时钟周期并发处理已启用相机：获取最新快照、通过哈希排除未变化画面，并保存有效图像。
3. CV 优先门控以及冷却／配额保护共同决定是否值得调用视觉语言模型。
4. VLM 客户端打包相机上下文、时间戳和 base64 图像，再把响应归一化为经过 Pydantic 验证的严格结构。
5. SQLite 与 JSONL 保存轮询结果、交通状态、事故、置信度及模型原始输出。
6. 静态看板页面轮询 FastAPI 的 JSON 接口，渲染实时摘要与归档。

这种设计把成本较高的模型调用放在确定性的本地门控之后，同时保留“升级”和“未升级”事件的可审计记录。

## 系统架构

当前实现是一个带进程内后台 worker 的单进程 FastAPI 应用：

- **API 与呈现层：** `highwayvlm/api.py` 提供 JSON 与 HTML 路由，挂载已保存画面和静态资源，并启动 worker。
- **编排层：** `highwayvlm/pipeline.py` 管理每台相机的状态、并发轮询、去重、CV 门控、保护策略、模型调用和持久化。
- **采集层：** `highwayvlm/ingest/fetcher.py` 解析直接图片、JSON 载荷、查看器 HTML 与备用元数据端点。
- **模型边界：** `highwayvlm/vlm/client.py` 构造请求，调用兼容 OpenAI 的 chat-completions 端点，解析宽松输出并验证最终结构。
- **存储与界面：** `highwayvlm/storage.py` 管理 SQLite 表和日志；静态 HTML、CSS、JavaScript 查询 API。

API 与 worker 共处一个进程，降低了本地运行复杂度，但也使相机采集和模型分析与 API 在线状态耦合。

## 证据与上游归属

- [个人公开 fork](https://github.com/appleweiping/HighwayVLM)
- [UMN Choi Lab 上游仓库](https://github.com/UMN-Choi-Lab/HighwayVLM)
- [指导教师：Seongjin Choi 教授](https://choi-seongjin.github.io/)
- [原 UROP 学生研究者：Ismail Yusuf](https://github.com/90Ismail)
- [个人尚未合并的 draft pull request #3](https://github.com/UMN-Choi-Lab/HighwayVLM/pull/3)
- [记录指导教师与学生研究者的固定历史 README](https://github.com/UMN-Choi-Lab/HighwayVLM/blob/c3a7d30b8a2ed2dab2c4d0bb57aa1aac8e084279/README.md)
- [固定版本的架构文档](https://github.com/UMN-Choi-Lab/HighwayVLM/blob/d9f2571a940ba22a8b93fd475dd58a6add0613de/docs/ARCHITECTURE.md)
- [本页所用看板图片的固定版本](https://github.com/UMN-Choi-Lab/HighwayVLM/blob/d9f2571a940ba22a8b93fd475dd58a6add0613de/docs/screenshots/dashboard-corridor-watch.png)
- [上游 MIT 许可证](https://github.com/UMN-Choi-Lab/HighwayVLM/blob/d9f2571a940ba22a8b93fd475dd58a6add0613de/LICENSE)
