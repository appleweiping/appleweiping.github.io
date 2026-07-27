---
layout: page
locale: ja
lang: ja
translation_key: blockverse
title: BlockVerse
description: プロシージャルな世界、ライティング、クラフト、クリーチャー、ローカル保存を備えたオリジナルのブラウザ向けボクセルサンドボックス。
img: assets/img/projects/blockverse-plains.jpg
importance: 2
category: creative-computing
related_publications: false
permalink: /ja/projects/blockverse/
---

## 体験

BlockVerse は、JavaScript と Three.js で構築したブラウザベースのボクセルサンドボックスです。決定論的なプロシージャル地形、チャンクのストリーミング、2 チャネルのボクセルライティング、採掘とクラフト、簡易的なクリーチャー、昼夜シミュレーション、ブラウザ内のローカルワールド保存を組み合わせています。

<div class="row justify-content-sm-center">
  <div class="col-sm-10 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/blockverse-plains.jpg" title="BlockVerse の平原バイオーム" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  プロシージャル生成された平原バイオームを写した、リポジトリ収録のスクリーンショットです。
</div>

## 実装

地形生成は Web Workers 上で実行し、決定論的なシードによってチャンク境界の再現性を維持しています。テクスチャとアイテム画像は実行時にプロシージャル描画し、効果音は Web Audio で合成します。そのため、別のゲームから複製した画像や音声アセットはリポジトリに含まれていません。

## 成り立ちと境界

BlockVerse は、**ボクセルサンドボックスというジャンルや Minecraft などのゲームに着想を得て、ゼロから制作したオリジナル実装**です。非公式のファンプロジェクトであり、Mojang、Microsoft、Minecraft との提携、承認、その他の関係はありません。Minecraft のコード、テクスチャ、音声、モデル、その他のアセットは一切含みません。

## 成果物と出典

- [オンラインでプレイ](https://appleweiping.github.io/blockverse/)
- [ソースコード](https://github.com/appleweiping/blockverse)
- [掲載スクリーンショットの出典](https://github.com/appleweiping/blockverse/blob/main/docs/screenshots/plains.jpg)
- オリジナルのコード、プロシージャルアセット、リポジトリのスクリーンショットは、同リポジトリの MIT ライセンスで公開しています。
