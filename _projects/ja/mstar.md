---
layout: page
locale: ja
lang: ja
translation_key: mstar
title: "M* — 上流に採用された貢献"
description: M* マルチモーダル serving framework にマージされた media input の信頼性修正を、構成とメンテナレビューの証跡とともに示します。
img: assets/img/repository-covers/mstar.webp
importance: 8
category: research
related_publications: false
permalink: /ja/projects/mstar/
---

## 採用された貢献と指針

私は [pull request #235](https://github.com/mstar-project/mstar/pull/235) を通じ、[M\* の上流 serving framework](https://github.com/mstar-project/mstar)にあった media input の不具合を修正しました。OpenAI 互換 `input_audio.data` が padding なしの base64 や空白を含む場合、decode 失敗が internal server error になっていました。マージ済みパッチは正当な変種を許容し、メンテナレビュー後に同じ decoder を data URL にも適用し、不正 media を HTTP 400 に対応付け、4ファイルに回帰テストを追加しました。

作業は [Yuchao Zhang の tracker issue #211](https://github.com/mstar-project/mstar/issues/211) から始まりました。Naomi Sagan が[担当可能であることを確認](https://github.com/mstar-project/mstar/issues/211#issuecomment-5504826992)し、[メンテナレビューで技術的な修正範囲を案内](https://github.com/mstar-project/mstar/pull/235#pullrequestreview-5123475214)し、[承認](https://github.com/mstar-project/mstar/pull/235#pullrequestreview-5135701379)した後、[上流 commit `7da29ea`](https://github.com/mstar-project/mstar/commit/7da29ea207fca1692f0a70a75f36a89ee6386448)としてマージしました。これは公開されたメンテナの指針であり、学術的な指導関係ではありません。

## M\* の機能

M\* は任意の入力・出力モダリティを持つモデル向けの高性能 serving framework です。Python SDK、OpenAI 互換 API、native streaming、multi-model scheduling、論理モデル node と GPU rank の明示的な対応を提供します。

<div class="row justify-content-sm-center">
  <div class="col-sm-9 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/repository-covers/mstar.webp" title="M-star リポジトリカバー" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  上流 M* の公式 social card を正確な commit と Git blob に固定し、ローカルで正規化したものです。合成プロジェクト画像は使用していません。
</div>

## 原理と構成

API server が request を受信・decode し、conductor が model-defined computation graph をたどって worker を選び、処理を route します。各 GPU では micro-scheduler 付き worker が動き、engine が resource admission、forward step の計画・実行、state commit、continuous batching、CUDA graph を担います。Tensor route が worker 間の中間値を運び、post-processing が streaming response を生成します。モデルは計算グラフと資源要件を宣言し、serving engine が実行を担い、YAML `node_groups` が論理 node を GPU rank に割り当てます。今回の貢献は、この分散経路へ入る前の入力境界を強化しました。

## 証拠と帰属

- [私の公開フォーク](https://github.com/appleweiping/mstar)
- [M\* 上流リポジトリ](https://github.com/mstar-project/mstar)
- [tracker issue #211](https://github.com/mstar-project/mstar/issues/211)
- [メンテナによる担当確認](https://github.com/mstar-project/mstar/issues/211#issuecomment-5504826992)
- [マージ済み pull request #235](https://github.com/mstar-project/mstar/pull/235)
- [技術メンテナレビュー](https://github.com/mstar-project/mstar/pull/235#pullrequestreview-5123475214)
- [承認記録](https://github.com/mstar-project/mstar/pull/235#pullrequestreview-5135701379)
- [マージされた上流 commit](https://github.com/mstar-project/mstar/commit/7da29ea207fca1692f0a70a75f36a89ee6386448)
- [commit 固定の M\* architecture](https://github.com/mstar-project/mstar/blob/7da29ea207fca1692f0a70a75f36a89ee6386448/docs/architecture.rst)
- [commit 固定の cover source](https://github.com/mstar-project/mstar/blob/7da29ea207fca1692f0a70a75f36a89ee6386448/assets/mstar-social-dark.png)

カタログでは私のリポジトリを fork と表示します。default branch に上流より ahead の commit はありません。採用された貢献の根拠は、上記の上流 PR、review、approval、commit です。
