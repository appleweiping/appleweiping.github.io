---
layout: page
permalink: /repositories/
title: repositories
lang: en
locale: en
translation_key: repositories
description: Pinned GitHub repositories from Weiping Yan, with a provenance-aware catalog of every public repository.
nav: true
nav_order: 4
---

These are my current pinned repositories on GitHub. For the complete account, browse the
[provenance-aware repository catalog]({{ site.data.translation_routes['repository-catalog']['en'] | relative_url }}) or
[all public repositories on GitHub](https://github.com/appleweiping?tab=repositories).

{% if site.data.repositories.github_repos %}

  <div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center">
    {% for repo in site.data.repositories.github_repos %}
      {% include site_i18n/repository_cards.liquid repository=repo %}
    {% endfor %}
  </div>
{% endif %}
