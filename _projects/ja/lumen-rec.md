---
layout: page
locale: ja
lang: ja
translation_key: lumen-rec
title: Lumen-Rec
description: 点ごとの LLM 関連度推定と、不確実性を考慮した再ランキングの統制比較。
img: assets/img/projects/lumen-rec-main-heatmap.webp
importance: 4
category: research
related_publications: false
permalink: /ja/projects/lumen-rec/
---

## 研究課題

LLM 推薦システムの比較では、候補集合、モデルのバックボーン、インポーター、評価指標を同時に変更することが少なくありません。Lumen-Rec は、これらのプロトコル変数を固定したときに何が残るのかを問います。

## アプローチ

リポジトリでは、共通の 101 アイテム候補タスク、Qwen3-8B バックボーン、スコアスキーマ、評価器、出典記録、対応のある統計を固定しています。そのプロトコルの中で、点ごとの関連度事後分布を、公式コード水準のベースラインおよび不確実性調整版と比較します。

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/lumen-rec-main-heatmap.webp" title="同一候補集合での NDCG 比較" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/lumen-rec-observation.webp" title="統制された再ランキングの観察" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  同一候補集合での比較と、統制された再ランキング研究から得られたリポジトリ収録図です。
</div>

## エビデンスと境界

リポジトリでは、提案する事後分布が評価対象 8 ドメイン中 6 ドメインで首位となる一方、Beauty と Movies では劣ると報告しています。また、追加した不確実性／リスク分解は、この同一候補集合でのランキングを改善しないとも報告しています。これらの数値は**リポジトリで報告されたエビデンス**であり、このサイトによる独立再現ではありません。結果は同一候補集合の再ランキングに限定されます。全カタログ推薦の結果でも、普遍的な最先端性能の主張でも、校正の保証でもありません。

## 成果物と出典

- [ソースコードと研究記録](https://github.com/appleweiping/Lumen-Rec)
- [ヒートマップ図の出典](https://github.com/appleweiping/Lumen-Rec/blob/main/Paper/figures/fig_main_heatmap.png)
- [観察図の出典](https://github.com/appleweiping/Lumen-Rec/blob/main/Paper/figures/fig_observation.png)
- プロジェクトのコードと生成図は、同リポジトリの MIT ライセンスで配布しています。ベースラインとデータセットの出典情報は、ここで書き直さず、リポジトリに保持しています。
