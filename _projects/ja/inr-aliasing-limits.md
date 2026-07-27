---
layout: page
locale: ja
lang: ja
translation_key: inr-aliasing-limits
title: INR のエイリアシング限界
description: 固定 Fourier 特徴による陰的表現の識別可能性とアンチエイリアシング標本設計。
img: assets/img/projects/inr-aliasing-limits-image2d-aliasing.webp
importance: 2
category: research
related_publications: false
permalink: /ja/projects/inr-aliasing-limits/
---

## 研究課題

モデルがグリッド上の全サンプルに適合していても、帯域外の Fourier 成分が帯域内のアトムと完全に区別不能な場合があります。このプロジェクトでは、そのような表面化しない再構成失敗がいつ不可避となるのか、またサンプリング設計によってどのように顕在化できるのかを問います。

## アプローチ

固定 Fourier 辞書に対する可視性とエイリアス可能性の解析を構築し、オフグリッドのジッターとランダムサンプリングが厳密なエイリアスをどのように破るかを定量化します。さらに、周波数帯域上で連続体の保証を持つ標本設計を構成します。CPU 実験では、合成信号、実信号、2 次元フォールディングを扱います。

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/inr-aliasing-limits-image2d-aliasing.webp" title="2 次元エイリアシング実験" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/inr-aliasing-limits-real-signals.webp" title="実信号サンプリング実験" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  左：格子マスクとランダムマスクに対して予測されたエイリアス複製。右：サンプリング手法を比較したリポジトリの実信号実験です。
</div>

## エビデンスと境界

リポジトリでは、理論的検証を合成信号と実信号の実験に結び付けています。主張の対象は**固定特徴・線形係数モデル**であり、あらゆる陰的ニューラル表現を包含するものではありません。学習された周波数集合は対象外であり、非線形拡張は SIREN には成立しないこともリポジトリで報告しています。これは進行中の研究であり、ここでは原稿を出版物として提示していません。

## 成果物と出典

- [ソースコード](https://github.com/appleweiping/inr-aliasing-limits)
- [リポジトリ収録の原稿](https://github.com/appleweiping/inr-aliasing-limits/blob/main/paper/main.pdf) — 研究原稿であり、出版済みとは主張していません
- [2 次元図の出典](https://github.com/appleweiping/inr-aliasing-limits/blob/main/paper/figures/image2d_aliasing.png)
- [実信号図の出典](https://github.com/appleweiping/inr-aliasing-limits/blob/main/paper/figures/real_signals.png)
- コードとリポジトリ収録図は、同リポジトリの MIT ライセンスで配布しています。外部信号の出典はソースリポジトリに記録されています。
