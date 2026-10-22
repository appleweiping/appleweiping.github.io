---
layout: page
permalink: /ja/repositories/
title: リポジトリ
lang: ja
locale: ja
translation_key: repositories
description: GitHub でピン留めしているリポジトリと、他の方のオープンソースプロジェクトにマージされた pull request。
nav: true
nav_order: 4
---

{% include site_i18n/repo_styles.liquid %}

## GitHub のピン留め

<div class="row row-cols-1 row-cols-md-2">
  {% for repo in site.data.repositories.github_repos %}
    {% include site_i18n/repo_pin.liquid repository=repo %}
  {% endfor %}
</div>

## オープンソースへの貢献

{% include site_i18n/contributions.liquid %}

## その他のリポジトリ

フォークや公開講座の自習課題を含む全 {{ site.data.repository_catalog.public_count }} 件の公開リポジトリは
[リポジトリ一覧]({{ site.data.translation_routes['repository-catalog']['ja'] | relative_url }})と
[GitHub](https://github.com/appleweiping?tab=repositories) で確認できます。
