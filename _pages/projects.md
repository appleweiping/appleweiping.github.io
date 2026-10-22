---
layout: page
title: projects
permalink: /projects/
lang: en
locale: en
translation_key: projects
description: Things I have built, grouped by kind. Self-study course work is listed at the bottom.
nav: true
nav_order: 3
display_categories: [research, ai-systems, tools, eda, creative-computing, coursework]
horizontal: false
---

{% include site_i18n/projects_grid.liquid %}

## Self-study course work

Alongside my degree I work through public course materials from other universities. These repositories hold my own solutions to
those assignments; they are listed for completeness rather than as original projects. Everything else, including forks, is in the
[repository catalog]({{ site.data.translation_routes['repository-catalog']['en'] | relative_url }}).

{% include site_i18n/selfstudy_list.liquid %}
