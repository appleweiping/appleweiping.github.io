---
layout: page
locale: ja
lang: ja
translation_key: weiping-council
title: WEIPING_COUNCIL
description: 評議、討論、レッドチーム、検証の各プロトコルを通じた、検証可能な複数モデルの熟議。
img: assets/img/projects/weiping-council-banner.webp
importance: 3
category: ai-systems
related_publications: false
permalink: /ja/projects/weiping-council/
---

## 目的

WEIPING_COUNCIL は、設定された複数のモデル役割に、評議、討論、レッドチーム、合意形成、専門家ルーティング、トーナメント選択という 6 種類のプロトコルのいずれかで熟議させます。ルーティングの選択、モデルのエビデンス、異論、所要時間、警告、縮退した実行状態を保持することで、結果を単一の不透明な回答として扱うのではなく、後から検証できるようにします。

## システム構成

React インターフェースとコマンドラインクライアントが FastAPI オーケストレーターを呼び出します。オーケストレーターは、明示的に設定されたコンテキストの再呼び出し、各役割のプロバイダーへのルーティング、セッション単位のトレース収集、構造化されたセッション引き継ぎ情報の保存を行えます。公開するヘルス情報は秘匿化しており、準備状態とエラー種別は表示しますが、プロバイダーの生のエンドポイントや認証情報は公開しません。

<div class="row justify-content-sm-center">
  <div class="col-sm-8 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/weiping-council-banner.webp" title="WEIPING_COUNCIL プロジェクトバナー" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  WEIPING_COUNCIL の公開リポジトリに収録されたプロジェクトバナーです。
</div>

## エビデンスと境界

複数モデルの合意は、正しさを保証しません。プロバイダーや任意のメモリサービスが利用できない場合、セッションは部分的または縮退状態になることがあります。システムは、その状態を完全な評議として暗黙に提示せず、明示的に表示します。実行時セッションファイル、非公開のプロバイダーログ、`.env` 設定は、ポートフォリオの成果物ではありません。

## 成果物と出典

- [ソースコードと文書](https://github.com/appleweiping/WEIPING_COUNCIL)
- [掲載バナーの出典](https://github.com/appleweiping/WEIPING_COUNCIL/blob/master/banner.png)
- プロジェクトは同リポジトリの MIT ライセンスで公開しています。設計参考の節では、実装時に調査した外部システムを明記しています。
