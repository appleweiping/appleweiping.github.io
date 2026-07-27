---
layout: page
locale: ja
lang: ja
translation_key: weiping-lab
title: WEIPING_LAB
description: 発見、反証、実験引き継ぎ、監査を支援する、エビデンスをゲートとした研究ワークベンチ。
img: assets/img/projects/weiping-lab-banner.webp
importance: 2
category: ai-systems
related_publications: false
permalink: /ja/projects/weiping-lab/
---

## 目的

WEIPING_LAB は、現象駆動の発見、早期棄却を重視した発想、実験計画、エビデンスをゲートとした執筆、複数モデルによる監査を支援する自律型研究ワークベンチです。もっとも重要な設計目標は、もっともらしい研究計画と、実際の実験によって得られたエビデンスとの境界を保つことです。

## ワークフロー

リポジトリは、現象またはプロジェクトのコンテキストを起点に、新規性レビュー、敵対的反証、実験計画、人間／サーバー間の実験ブリッジ、結果の読み込み、執筆、引用レビュー、主張監査へ進むゲート付きの経路を構成しています。実行状態は CLI と API から観測できますが、プロバイダー認証情報と研究ワークスペースの状態はローカルに留まります。

<div class="row justify-content-sm-center">
  <div class="col-sm-8 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/weiping-lab-banner.webp" title="WEIPING_LAB プロジェクトバナー" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  WEIPING_LAB の公開リポジトリに収録されたプロジェクトバナーです。
</div>

## エビデンスと境界

WEIPING_LAB はワークフローソフトウェアであり、それ自体は実験が実行済みであることも、論文の主張が真であることも示しません。リポジトリでは結果を `paper_result`、`official`、`diagnostic`、`pilot` のいずれかとして分類し、設定されたゲートを通過したエビデンスだけを主要な主張に利用できます。実際の実験や人間の判断が必要な箇所では、ワークフローが意図的に停止します。

## 成果物と出典

- [ソースコードと文書](https://github.com/appleweiping/WEIPING_LAB)
- [掲載バナーの出典](https://github.com/appleweiping/WEIPING_LAB/blob/master/banner.png)
- プロジェクトは同リポジトリの MIT ライセンスで公開しています。設計時に調査したオープンソースシステムは、引き続きリポジトリ文書でクレジットされています。ここでそれらを同梱したり、オリジナルの成果として主張したりはしていません。
