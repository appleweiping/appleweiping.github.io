---
layout: page
locale: ja
lang: ja
translation_key: causalpilot
title: CausalPilot
description: 決定論的な因果ツールと選択的な行動権限による、エビデンスをゲートとした実験。
img: assets/img/projects/causalpilot-control-room.webp
importance: 1
category: ai-systems
related_publications: false
permalink: /ja/projects/causalpilot/
---

## 研究課題

実験予算と人間の注意力が限られているとき、エージェントが行動を許可されるには、どのようなエビデンスが必要でしょうか。CausalPilot は、言語モデルによる提案と、診断、プロービング、人間へのエスカレーション、デプロイ、一時停止、ロールバック、行動を見送る権限を担う決定論的ゲートを分離します。

## アプローチ

このプロジェクトは、FastAPI のステートマシン、決定論的な統計ツール、明示的なモデル／因果／データ／環境リスク信号、Next.js のコントロールルームを組み合わせています。リポジトリに収録されたベンチマークでは、シミュレーターの隠れた真値をポリシーから分離し、報告された実行を監査できるよう、シード、生の意思決定、区間、フィクスチャ、設定フィンガープリントを保存しています。

<div class="row justify-content-sm-center">
  <div class="col-sm-11 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/causalpilot-control-room.webp" title="CausalPilot コントロールルーム" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  リポジトリの 3D コントロールルームです。ホスト版の数値は、実際の事業計測値ではなくシミュレーションであると明記しています。
</div>

## エビデンスと境界

現在の成果物は、**制御されたシミュレーション上のエンジニアリング・ベンチマーク**であり、因果研究の結論でも、実事業での効果向上を主張するものでもありません。「LLM」と名付けたベンチマークポリシーは意思決定ルールの代理であり、標準実行ではモデル API を呼び出していません。収録結果は、カバレッジを揃えた条件での優位性、校正されたリスク確率、実モデルの計画品質、安全な企業導入のいずれも立証しません。

## 成果物と出典

- [決定論的リプレイ](https://appleweiping.github.io/causalpilot/)
- [ソースコード](https://github.com/appleweiping/causalpilot)
- [技術レポート](https://github.com/appleweiping/causalpilot/blob/main/paper/causalpilot.pdf)
- [主張しない事項](https://github.com/appleweiping/causalpilot/blob/main/docs/claims_we_do_not_make.md)
- [掲載スクリーンショットの出典](https://github.com/appleweiping/causalpilot/blob/main/docs/assets/control-room-final.png)
- コード、レポート、生成されたプロジェクトメディアは、同リポジトリの MIT ライセンスで配布しています。
