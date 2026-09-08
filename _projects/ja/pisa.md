---
layout: page
locale: ja
lang: ja
translation_key: pisa
title: PISA — 上流に採用された貢献
description: PISA にマージされた型安全性の refactor を、高性能検索アーキテクチャ、メンテナの指針、貢献証拠とともに示します。
img: assets/img/repository-covers/pisa.webp
importance: 9
category: research
related_publications: false
permalink: /ja/projects/pisa/
---

## 採用された貢献と指針

私は [pull request #641](https://github.com/pisa-engine/pisa/pull/641) を通じ、[PISA の上流検索エンジン](https://github.com/pisa-engine/pisa)へ貢献しました。query algorithm が WAND data を必要とするか表していた boolean を、scoped enum `WandDataRequired::{Yes, No}` に置き換え、command-line mapping、requirement check、test を更新しました。runtime behavior は変えず、誤用しにくく call site が自己説明的になる変更です。

この作業はメンテナ Michał Siedlaczek の [issue #634](https://github.com/pisa-engine/pisa/issues/634) を実装したものです。彼は scoped `Yes`／`No` の[命名を確認](https://github.com/pisa-engine/pisa/issues/634#issuecomment-5516885180)し、[merge 前の検証記録](https://github.com/pisa-engine/pisa/pull/641#issuecomment-5577916085)を確認して、テスト済みパッチを[上流 commit `ae8cc33`](https://github.com/pisa-engine/pisa/commit/ae8cc33b7529664f57076b9f16ae30df18cbc9f5)としてマージしました。これはメンテナ主導のオープンソース作業であり、学術的な指導関係ではありません。

## PISA の機能

PISA は、大規模テキスト集合の indexing、検索アルゴリズムの実行、情報検索実験のための高性能 C++ プラットフォームです。複数の compressed-index 形式、document reordering と sharding、WAND statistics、各種 query-processing strategy、研究向け command-line tools を備えます。

<div class="row justify-content-sm-center">
  <div class="col-sm-9 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/repository-covers/pisa.webp" title="PISA リポジトリカバー" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  上流の公式 indexing-pipeline 図を正確な commit と Git blob に固定し、ローカルで正規化したものです。合成プロジェクト画像は使用していません。
</div>

## 原理と構成

Indexing pipeline は raw collection を、文書ごとの token 順序を保持する forward index に変換し、term から document への posting list を持つ inverted index に反転します。document ID の reorder や shard 化も可能です。選択した codec が inverted index を圧縮し、追加工程で動的 pruning 用の WAND statistics を生成します。Query processor は index、scorer、exhaustive、WAND、block-max WAND などの algorithm を組み合わせ、安定した top-k を返します。貢献した enum は、この構成境界で各 algorithm の WAND-data 要件を明示します。

## 証拠と帰属

- [私の公開フォーク](https://github.com/appleweiping/pisa)
- [PISA 上流リポジトリ](https://github.com/pisa-engine/pisa)
- [メンテナが起票した issue #634](https://github.com/pisa-engine/pisa/issues/634)
- [メンテナによる命名確認](https://github.com/pisa-engine/pisa/issues/634#issuecomment-5516885180)
- [マージ済み pull request #641](https://github.com/pisa-engine/pisa/pull/641)
- [merge 前の検証記録](https://github.com/pisa-engine/pisa/pull/641#issuecomment-5577916085)
- [マージされた上流 commit](https://github.com/pisa-engine/pisa/commit/ae8cc33b7529664f57076b9f16ae30df18cbc9f5)
- [commit 固定の project overview](https://github.com/pisa-engine/pisa/blob/ae8cc33b7529664f57076b9f16ae30df18cbc9f5/README.md)
- [commit 固定の indexing pipeline guide](https://github.com/pisa-engine/pisa/blob/ae8cc33b7529664f57076b9f16ae30df18cbc9f5/docs/src/guide/indexing-pipeline.md)
- [commit 固定の cover source](https://github.com/pisa-engine/pisa/blob/ae8cc33b7529664f57076b9f16ae30df18cbc9f5/docs/src/pipeline.png)

カタログでは私のリポジトリを fork と表示します。default branch に上流より ahead の commit はありません。採用された著者性の根拠は、上記の上流 PR と merge commit です。
