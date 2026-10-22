---
layout: page
permalink: /repositories/
title: repositories
lang: en
locale: en
translation_key: repositories
description: Pinned repositories and pull requests merged into other people's open-source projects.
nav: true
nav_order: 4
---

{% include site_i18n/repo_styles.liquid %}

## Pinned on GitHub

<div class="row row-cols-1 row-cols-md-2">
  {% for repo in site.data.repositories.github_repos %}
    {% include site_i18n/repo_pin.liquid repository=repo %}
  {% endfor %}
</div>

## Open-source contributions

{% include site_i18n/contributions.liquid %}

## Everything else

All {{ site.data.repository_catalog.public_count }} public repositories, including forks and self-study course work, are listed in the
[repository catalog]({{ site.data.translation_routes['repository-catalog']['en'] | relative_url }}) and on
[GitHub](https://github.com/appleweiping?tab=repositories).
