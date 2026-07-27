---
layout: page
permalink: /zh/repositories/
title: 代码仓库
lang: zh-CN
locale: zh
translation_key: repositories
description: 闫维平的 GitHub 置顶仓库，以及标注来源与归属的全部公开仓库目录。
nav: true
nav_order: 4
---

以下是我目前在 GitHub 置顶的仓库。如需查看完整账号内容，请浏览
[标注来源与归属的完整仓库目录]({{ site.data.translation_routes['repository-catalog']['zh-CN'] | relative_url }})，或前往
[GitHub 查看全部公开仓库](https://github.com/appleweiping?tab=repositories)。

{% if site.data.repositories.github_repos %}

  <div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center">
    {% for repo in site.data.repositories.github_repos %}
      {% include site_i18n/repository_cards.liquid repository=repo %}
    {% endfor %}
  </div>
{% endif %}
