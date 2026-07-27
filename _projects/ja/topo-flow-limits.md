---
layout: page
locale: ja
lang: ja
translation_key: topo-flow-limits
title: トポロジカルフローの限界
description: エッジフロー観測から潜在的な高次ネットワーク構造を推定する際の識別可能性限界。
img: assets/img/projects/topo-flow-limits-real-cyclone.webp
importance: 1
category: research
related_publications: false
permalink: /ja/projects/topo-flow-limits/
---

## 研究課題

アルゴリズムはエッジフローから充填三角形を推定できますが、推定値が得られること自体は、潜在する高次構造がそもそも識別可能であることを意味しません。このプロジェクトでは、その前提条件、すなわち何を、どの励起モデルの下で、何回の観測により回復できるのかを研究します。

## アプローチ

リポジトリでは、Hodge 分解と共分散モデルによって励起レジームを区別し、有限標本限界を導出するとともに、リフト共分散推定量を実装しています。さらに、解析的主張を CPU による Monte Carlo テストへ接続しています。実データ研究では、同じカール統計量を用いて ERA5 データ中の渦を特定し、独立した参照情報と照合しています。

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/topo-flow-limits-real-cyclone.webp" title="ERA5 サイクロン実験" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/topo-flow-limits-phase-transition.webp" title="厳密回復の相転移" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  左：リポジトリで報告された ERA5 サイクロン実験。右：シミュレーションした厳密回復の相転移を、理論等高線および漸近的な下限と比較したものです。
</div>

## エビデンスと境界

公開記録には、定理に対応するテスト、シミュレーションによる回復等高線、ERA5 実験が含まれます。これらは**進行中の研究でリポジトリから報告された結果**であり、採択済みまたは出版済みの論文ではありません。実データ実験は渦の位置特定として位置付けられており、物理的トポロジーの回復ではありません。各識別可能性の結果は、原稿とコードに明記した励起仮定に依存します。

## 成果物と出典

- [ソースコード](https://github.com/appleweiping/topo-flow-limits)
- [リポジトリ収録の原稿](https://github.com/appleweiping/topo-flow-limits/blob/main/paper/main.pdf) — 研究原稿であり、出版済みとは主張していません
- [サイクロン図の出典](https://github.com/appleweiping/topo-flow-limits/blob/main/paper/figures/real_cyclone.png)
- [相転移図の出典](https://github.com/appleweiping/topo-flow-limits/blob/main/paper/figures/phase_transition.png)
- コードとリポジトリ収録図は、同リポジトリの MIT ライセンスで配布しています。
