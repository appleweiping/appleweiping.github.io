---
layout: page
locale: ja
lang: ja
translation_key: lkpy
title: LensKit — 上流に採用された貢献
description: LensKit にマージされた ItemKNN の正当性修正について、上流システム、メンテナの指針、実装、証拠を明確に区別します。
img: assets/img/repository-covers/lkpy.webp
importance: 7
category: research
related_publications: false
permalink: /ja/projects/lkpy/
---

## 採用された貢献

私は [pull request #1209](https://github.com/lenskit/lkpy/pull/1209) を通じ、[LensKit の上流 Python リポジトリ](https://github.com/lenskit/lkpy)へ回帰テスト付きの修正を提供しました。従来の `ItemKNNScorer` は、有効な `RecQuery` が history component を通って正しく空の履歴になった場合にも、未知ユーザーの警告を出していました。修正では、history component の欠落が疑われる非 `RecQuery` 入力にだけ警告を限定し、双方の経路をテストしています。

実装方針は、メンテナ Michael Ekstrand が [issue #804](https://github.com/lenskit/lkpy/issues/804) で示したものです。彼が pull request をマージし、私が提供した head commit は [`a1ae703`](https://github.com/lenskit/lkpy/commit/a1ae70327dbe157a37a1bc137243367ba21893e8)、GitHub が記録する merge commit は [`1a5c7e1`](https://github.com/lenskit/lkpy/commit/1a5c7e179d68f88e7b8679e321a703c19873a234)です。これはメンテナ issue による指針と採用であり、学術的な指導関係ではありません。

## LensKit の機能

LensKit は、再現可能な推薦システム研究のための Python ツールキットです。データセット基盤、従来型・学習型 scorer、推薦パイプライン、評価機能を提供します。標準的な top-N 処理では query を構成し、ユーザー履歴を取得し、候補 item を選び、スコアを計算してランキングまたは再ランキングへ渡します。

<div class="row justify-content-sm-center">
  <div class="col-sm-9 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/repository-covers/lkpy.webp" title="LensKit リポジトリカバー" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  ローカルに固定した GitHub リポジトリプレビューで、合成プロジェクト画像は使用していません。
</div>

## 原理と構成

LensKit は推薦処理を、明示的で型付きの有向非巡回グラフとしてモデル化します。入力と component が node、接続が edge となり、runtime は要求された出力に必要な依存関係だけを実行します。これによりデータ取得、候補生成、scoring、ranking を分離しながら実験を組み合わせられます。`ItemKNN` などの scorer は query に対応する候補 item を評価します。今回の貢献は、正常な空履歴と pipeline 構成不足の疑いとの判定境界を修正したものです。

## 証拠と帰属

- [私の公開フォーク](https://github.com/appleweiping/lkpy)
- [LensKit 上流リポジトリ](https://github.com/lenskit/lkpy)
- [マージ済み pull request #1209](https://github.com/lenskit/lkpy/pull/1209)
- [メンテナが起票した issue #804](https://github.com/lenskit/lkpy/issues/804)
- [提供した head commit](https://github.com/lenskit/lkpy/commit/a1ae70327dbe157a37a1bc137243367ba21893e8)
- [上流 merge commit](https://github.com/lenskit/lkpy/commit/1a5c7e179d68f88e7b8679e321a703c19873a234)
- [commit 固定の pipeline architecture guide](https://github.com/lenskit/lkpy/blob/396c743bc26ffc8792f7c1af9fbc422de18c26af/docs/guide/pipeline.rst)
- [commit 固定の scorer guide](https://github.com/lenskit/lkpy/blob/396c743bc26ffc8792f7c1af9fbc422de18c26af/docs/guide/scorers.rst)

カタログでは私のリポジトリを引き続き fork と表示します。監査時に default branch の上流に対する ahead は0でした。採用された著者性の根拠は、上記の上流 pull request と merge commit です。
