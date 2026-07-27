---
layout: page
locale: ja
lang: ja
translation_key: cadenza
title: Cadenza
description: パブリックドメインの楽曲と Web Audio 合成を基盤とする、依存関係ゼロのブラウザ向けリズムゲーム。
img: assets/img/projects/cadenza-banner.svg
importance: 3
category: creative-computing
related_publications: false
permalink: /ja/projects/cadenza/
---

## 体験

Cadenza は、素の JavaScript で実装した 4 レーンのブラウザ向けリズムゲームです。各譜面には音高と長さが符号化されているため、タイルはゲーム要素であると同時に楽譜でもあります。タイルをタップすると、その音が Web Audio ですぐに合成されます。

<div class="row justify-content-sm-center">
  <div class="col-sm-10 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/cadenza-banner.svg" title="Cadenza プロジェクトバナー" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Cadenza の公開リポジトリに収録されたオリジナルバナーです。
</div>

## 実装

このゲームには実行時依存関係も、事前録音した音声もありません。コンパクトな譜面 DSL で、音符、休符、和音、長押し、2 レーンイベントを表現します。バリデーターと継続的インテグレーションのチェックによって譜面ライブラリを保護しています。決定論的なレーン割り当てにより、プレイ可能性の制約を適用しながら、譜面の再現性を確保しています。

## 楽曲、オマージュ、境界

リポジトリでは、作者が譜面形式に書き起こしたパブリックドメインの作品と伝承曲を採用しています。Cadenza は **Piano Tiles 2 に着想を得た非公式のオープンソース・オマージュ作品**であり、Cheetah Mobile とは関係ありません。原作ゲームの音声、アートワーク、コード、その他のアセットは含みません。パブリックドメインであるのは基礎となる楽曲であり、このプロジェクトの書き起こしとコードはリポジトリのライセンスに基づいて提供しています。

## 成果物と出典

- [オンラインでプレイ](https://appleweiping.github.io/cadenza/)
- [ソースコードと譜面の出典記録](https://github.com/appleweiping/cadenza)
- [掲載バナーの出典](https://github.com/appleweiping/cadenza/blob/main/assets/banner.svg)
- コードと譜面データは同リポジトリの MIT ライセンスで公開しています。楽曲のクレジットとパブリックドメインの確認情報は、曲ライブラリに付随して保持されます。
