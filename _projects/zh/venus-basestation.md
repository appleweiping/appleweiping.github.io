---
layout: page
locale: zh
lang: zh-CN
translation_key: venus-basestation
title: Venus 基站
description: 面向多机器人探索系统的课程项目基站软件与实时可视化。
img: assets/img/projects/venus-basestation-dashboard.svg
importance: 1
category: coursework
related_publications: false
permalink: /zh/projects/venus-basestation/
---

## 团队项目背景

Venus Basestation 是一个多机器人行星探索系统的**课程与团队项目记录**。本页聚焦公开的基站和用户界面模块；它不声称完整机器人系统或镜像团队代码库由本人独立完成。

## 基站模块

该软件验证 MQTT 遥测数据，为 Tk 事件循环排队网络事件，维护实时地图状态，并支持模拟输入、JSONL 回放、实时代理连接、指令上行链路，以及 SVG／PNG 导出。仓库包含自动化测试、无头冒烟测试命令和可回放的示例任务。

<div class="row justify-content-sm-center">
  <div class="col-sm-11 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/venus-basestation-dashboard.svg" title="Venus Basestation 任务仪表板" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  使用仓库附带的三机器人回放生成的任务控制快照，展示地形、机器人状态、探测结果与事件日志。
</div>

## 署名与边界

公开 GitHub 仓库是作品集镜像；团队 GitLab 仍是课程协作的权威记录。模块与贡献者署名必须遵循仓库文档及其 `team-project/PROVENANCE.md`。`user-interface-module/` 中的原创代码采用 MIT 许可证，而镜像的团队快照保留原团队许可。仪表板只能确认指令已发送；返回的遥测数据才是机器人实际状态的确认来源。

## 成果与来源

- [公开作品集镜像](https://github.com/appleweiping/venus-basestation)
- [责任边界](https://github.com/appleweiping/venus-basestation/blob/main/user-interface-module/docs/verification-and-responsibility-boundary.md)
- [团队快照来源](https://github.com/appleweiping/venus-basestation/blob/main/team-project/PROVENANCE.md)
- [所展示仪表板的来源](https://github.com/appleweiping/venus-basestation/blob/main/user-interface-module/docs/assets/mission-dashboard.svg)
