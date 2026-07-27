---
layout: page
locale: zh
lang: zh-CN
translation_key: art-history-museum
title: 艺术史博物馆
description: 一条可缩放的艺术史时间轴，连接注明一手来源的第一人称 3D 展厅。
img: assets/img/projects/art-history-museum-live.webp
importance: 1
category: creative-computing
related_publications: false
permalink: /zh/projects/art-history-museum/
---

## 体验

这座浏览器端博物馆将艺术史转化为空间旅程。语义缩放时间轴把各时期与艺术家放在真实日期上；选择一位艺术家后，会打开一个由 React Three Fiber 构建的第一人称展厅，其中的作品均可单独查看。

<div class="row justify-content-sm-center">
  <div class="col-sm-11 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/art-history-museum-live.webp" title="在线艺术史时间轴" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  这是 2026 年 7 月 19 日经核验的已部署语义缩放时间轴真实浏览器截图，并非生成的效果图。
</div>

## 数据与署名

人物传记、日期、图像、故事及相关记录以英文 Wikipedia、Wikidata 和 Wikimedia Commons 为初始来源。导入器仅接受托管于 Commons、且具有受支持自由许可或属于公有领域的材料。已部署应用的作品详情视图会保留每件作品的许可、创作者署名和 Commons 来源页面。展厅墙面与地面纹理以及 HDRI 来自 [Poly Haven](https://polyhaven.com/)，采用 CC0 许可。

## 边界

自由许可是不可绕过的内容准入条件，因此对于相关作品仍受版权保护的艺术家，博物馆会有意不设置展厅。外部部署与其数据库仍是独立服务。本作品集中的截图不能替代应用内部为每件作品展示的署名与许可溯源记录。

## 成果与来源

- [在线博物馆](https://art-history-museum-nine.vercel.app)
- [源代码](https://github.com/appleweiping/art-history-museum)
- [Wikipedia 贡献者条款](https://en.wikipedia.org/wiki/Wikipedia:Copyrights)
- [Wikimedia Commons 复用指南](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia)
- 截图采集自在线部署；作品权利仍以每件作品记录的具体许可为准。
