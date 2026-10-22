---
layout: page
permalink: /zh/repositories/
title: 代码仓库
lang: zh-CN
locale: zh
translation_key: repositories
description: GitHub 置顶仓库，以及合并进他人开源项目的 pull request。
nav: true
nav_order: 4
---

{% include site_i18n/repo_styles.liquid %}

## GitHub 置顶仓库

<div class="row row-cols-1 row-cols-md-2">
  {% for repo in site.data.repositories.github_repos %}
    {% include site_i18n/repo_pin.liquid repository=repo %}
  {% endfor %}
</div>

## 开源贡献

{% include site_i18n/contributions.liquid %}

## 其他仓库

全部 {{ site.data.repository_catalog.public_count }} 个公开仓库（包括派生仓库和公开课自学作业）列在
[仓库目录]({{ site.data.translation_routes['repository-catalog']['zh-CN'] | relative_url }})中，也可以直接在
[GitHub](https://github.com/appleweiping?tab=repositories) 上浏览。
