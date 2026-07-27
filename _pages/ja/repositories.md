---
layout: page
permalink: /ja/repositories/
title: リポジトリ
lang: ja
locale: ja
translation_key: repositories
description: Weiping YanのGitHubピン留めリポジトリと、出典・帰属を明記した全公開リポジトリ一覧です。
nav: true
nav_order: 4
---

以下は、現在GitHubでピン留めしているリポジトリです。全体を確認するには、
[出典と帰属を明記した全リポジトリ一覧]({{ site.data.translation_routes['repository-catalog']['ja'] | relative_url }})、または
[GitHub上の全公開リポジトリ](https://github.com/appleweiping?tab=repositories)をご覧ください。

{% if site.data.repositories.github_repos %}

  <div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center">
    {% for repo in site.data.repositories.github_repos %}
      {% include site_i18n/repository_cards.liquid repository=repo %}
    {% endfor %}
  </div>
{% endif %}
