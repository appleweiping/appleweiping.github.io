---
layout: page
locale: ja
lang: ja
translation_key: ecg-recoverability
title: ECG の回復可能性
description: 少数誘導 ECG 再構成における特徴レベルの回復可能性と不確実性校正。
img: assets/img/projects/ecg-recoverability-neural-perception.png
importance: 3
category: research
related_publications: false
permalink: /ja/projects/ecg-recoverability/
---

## 研究課題

少数誘導 ECG の再構成は不良設定の逆問題です。平均波形誤差が小さいというだけでは、特定の誘導において P 波、QRS 波群、ST 部分、T 波のどの特徴が信頼できるかを判断できません。このプロジェクトでは、再構成品質を単一のスカラーとして扱うのではなく、特徴レベルの回復可能性を研究します。

## アプローチ

研究コードは、ECG 双極子モデル、誘導構成の条件性指標、分布に依存しない校正を組み合わせています。モデルにより支持される成分、統計的に推定される成分、回復不可能な成分を分離し、公開 PTB-XL データ、合成チェック、条件付き拡散の例を用いて、その区別を評価します。

<div class="row justify-content-sm-center">
  <div class="col-sm-10 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/ecg-recoverability-neural-perception.png" title="知覚的再構成と回復可能性に関するリポジトリ実験" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  知覚的な再構成挙動と、ホールドアウトデータによる回復可能性分析を比較した、リポジトリ報告の実験です。
</div>

## エビデンスと境界

リポジトリには、定理に対応するテストと、公開研究データセット上の実験が含まれています。これは研究成果物であり、プレプリントは準備中です。**臨床検証済みの機器、診断システム、治療上の推奨、または公表済みの医学的成果ではありません**。双極子性は特徴と病態によって異なり、校正は明示されたデータとグループ化の仮定に依存します。このページの内容は医療助言ではありません。

## 成果物と出典

- [ソースコード](https://github.com/appleweiping/ecg-recoverability)
- [リポジトリ収録の原稿](https://github.com/appleweiping/ecg-recoverability/blob/main/paper/main.pdf) — 研究原稿であり、出版済みとは主張していません
- [掲載図の出典](https://github.com/appleweiping/ecg-recoverability/blob/main/results/neural_perception_distortion.png)
- [PTB-XL データセット記録](https://physionet.org/content/ptb-xl/)
- プロジェクトのコードと生成図は同リポジトリの MIT ライセンスを使用しています。PTB-XL には、独自のデータライセンスと引用要件が引き続き適用されます。
